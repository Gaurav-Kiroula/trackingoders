import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { VehicleStatusBadge } from "../components/StatusBadge";
import { useCreateVehicle, useVehicles } from "../hooks/useBackend";

export default function VehiclesPage() {
  const { data: vehicles = [], isLoading } = useVehicles();
  const createVehicle = useCreateVehicle();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ licensePlate: "", capacityKg: "" });

  const handleCreate = async () => {
    const capacity = Number.parseFloat(form.capacityKg);
    if (!form.licensePlate || Number.isNaN(capacity)) return;
    try {
      await createVehicle.mutateAsync({
        licensePlate: form.licensePlate.toUpperCase(),
        capacityKg: capacity,
      });
      toast.success("Vehicle added");
      setForm({ licensePlate: "", capacityKg: "" });
      setOpen(false);
    } catch {
      toast.error("Failed to add vehicle");
    }
  };

  if (isLoading) return <LoadingSpinner fullPage label="Loading vehicles…" />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Vehicles
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {vehicles.length} vehicles in fleet
          </p>
        </div>
        <Button
          className="gap-1.5"
          onClick={() => setOpen(true)}
          data-ocid="vehicles.create_button"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Grid */}
      {vehicles.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No vehicles yet"
          description="Add your first vehicle to the fleet."
          action={{ label: "Add Vehicle", onClick: () => setOpen(true) }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {vehicles.map((vehicle, idx) => (
            <div
              key={vehicle.id.toString()}
              className="bg-card border border-border rounded-xl p-4 space-y-3 hover:border-primary/30 transition-smooth"
              data-ocid={`vehicles.item.${idx + 1}`}
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-primary" />
                </div>
                <VehicleStatusBadge status={vehicle.status} size="sm" />
              </div>
              <div>
                <p className="font-bold font-mono text-foreground">
                  {vehicle.licensePlate}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {vehicle.capacityKg} kg capacity
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="vehicles.dialog">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="vehicle-plate">License Plate</Label>
              <Input
                id="vehicle-plate"
                placeholder="e.g. ABC-1234"
                value={form.licensePlate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, licensePlate: e.target.value }))
                }
                data-ocid="vehicles.plate_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vehicle-capacity">Capacity (kg)</Label>
              <Input
                id="vehicle-capacity"
                type="number"
                placeholder="e.g. 1500"
                value={form.capacityKg}
                onChange={(e) =>
                  setForm((f) => ({ ...f, capacityKg: e.target.value }))
                }
                data-ocid="vehicles.capacity_input"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="vehicles.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={
                  !form.licensePlate ||
                  !form.capacityKg ||
                  createVehicle.isPending
                }
                data-ocid="vehicles.submit_button"
              >
                {createVehicle.isPending ? "Adding…" : "Add Vehicle"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
