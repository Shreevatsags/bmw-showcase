import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import BMWHeader from "@/components/BMWHeader";
import BMWFooter from "@/components/BMWFooter";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getCar } from "@/data/cars";
import { toast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Booking {
  id: string;
  user_id: string;
  car_id: string;
  preferred_date: string;
  preferred_time: string;
  location: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth", { replace: true }); return; }
    if (!isAdmin) { navigate("/", { replace: true }); return; }
  }, [loading, user, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setFetching(true);
      const { data: b } = await supabase
        .from("test_drive_bookings")
        .select("*")
        .order("preferred_date", { ascending: true });
      const rows = (b ?? []) as Booking[];
      setBookings(rows);
      if (rows.length) {
        const ids = Array.from(new Set(rows.map((r) => r.user_id)));
        const { data: ps } = await supabase
          .from("profiles").select("id, email, display_name").in("id", ids);
        const map: Record<string, Profile> = {};
        (ps ?? []).forEach((p) => { map[p.id] = p as Profile; });
        setProfiles(map);
      }
      setFetching(false);
    })();
  }, [isAdmin]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("test_drive_bookings").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
    toast({ title: `Booking ${status}` });
  };

  if (loading || !isAdmin) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-bmw-blue" /></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BMWHeader />
      <main className="pt-28 pb-24">
        <div className="container">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-bmw-blue mb-3">Admin</p>
          <h1 className="font-heading text-4xl font-bold mb-2">Test Drive Bookings</h1>
          <p className="text-muted-foreground mb-10">Review and manage every booking across all users.</p>

          {fetching ? (
            <Loader2 className="animate-spin text-bmw-blue" />
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-card border-b border-border">
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const car = getCar(b.car_id);
                    const p = profiles[b.user_id];
                    return (
                      <tr key={b.id} className="border-b border-border last:border-0 hover:bg-card/50">
                        <td className="px-4 py-3">
                          <p className="font-medium">{p?.display_name ?? "—"}</p>
                          <p className="text-xs text-muted-foreground">{p?.email}</p>
                        </td>
                        <td className="px-4 py-3">{car?.name ?? b.car_id}</td>
                        <td className="px-4 py-3">
                          {new Date(b.preferred_date).toLocaleDateString()} · {b.preferred_time}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{b.location ?? "—"}</td>
                        <td className="px-4 py-3">
                          <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                            <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <BMWFooter />
    </div>
  );
};

export default Admin;
