import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Car } from "@/data/cars";

interface Props {
  car: Car;
  trigger: React.ReactNode;
}

const TestDriveDialog = ({ car, trigger }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (next && !user) {
      navigate("/auth");
      return;
    }
    setOpen(next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("test_drive_bookings").insert({
      user_id: user.id,
      car_id: car.id,
      preferred_date: date,
      preferred_time: time,
      location: location || null,
      notes: notes || null,
    });
    setBusy(false);
    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Test drive requested", description: `We'll confirm your ${car.name} drive shortly.` });
    setOpen(false);
    setDate(""); setLocation(""); setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Schedule a Test Drive</DialogTitle>
          <DialogDescription>
            {car.name} · Choose your preferred day, time and dealership.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required min={new Date().toISOString().split("T")[0]} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" required value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">Preferred dealership / city</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. BMW of Manhattan" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything we should know?" rows={3} />
          </div>
          <Button type="submit" className="w-full bg-bmw-blue hover:bg-bmw-blue/90 text-primary-foreground" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" size={16} /> : "Request Test Drive"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TestDriveDialog;
