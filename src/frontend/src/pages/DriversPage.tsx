import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { DriverStatusBadge } from "../components/StatusBadge";
import { useCreateDriver, useDrivers } from "../hooks/useBackend";

export default function DriversPage() {
  const { data: drivers = [], isLoading } = useDrivers();
  const createDriver = useCreateDriver();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  const handleCreate = async () => {
    if (!form.name || !form.phone) return;
    try {
      await createDriver.mutateAsync({ name: form.name, phone: form.phone });
      toast.success("Driver created");
      setForm({ name: "", phone: "" });
      setOpen(false);
    } catch {
      toast.error("Failed to create driver");
    }
  };

  if (isLoading) return <LoadingSpinner fullPage label="Loading drivers…" />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Drivers
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {drivers.filter((d) => d.isActive).length} active · {drivers.length}{" "}
            total
          </p>
        </div>
        <Button
          className="gap-1.5"
          onClick={() => setOpen(true)}
          data-ocid="drivers.create_button"
        >
          <Plus className="w-4 h-4" />
          Add Driver
        </Button>
      </div>

      {/* List */}
      {drivers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No drivers yet"
          description="Add your first driver to start assigning shipments."
          action={{ label: "Add Driver", onClick: () => setOpen(true) }}
        />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-label text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-label text-muted-foreground hidden sm:table-cell">
                  Phone
                </th>
                <th className="text-left px-4 py-3 text-label text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-label text-muted-foreground hidden md:table-cell">
                  Vehicle
                </th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver, idx) => (
                <tr
                  key={driver.id.toString()}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  data-ocid={`drivers.item.${idx + 1}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {driver.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">
                        {driver.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {driver.phone}
                  </td>
                  <td className="px-4 py-3">
                    <DriverStatusBadge isActive={driver.isActive} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden md:table-cell">
                    {driver.assignedVehicleId
                      ? `#${driver.assignedVehicleId.toString()}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="drivers.dialog">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="driver-name">Full Name</Label>
              <Input
                id="driver-name"
                placeholder="e.g. Carlos Mendez"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="drivers.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="driver-phone">Phone</Label>
              <Input
                id="driver-phone"
                placeholder="+1 555 000 0000"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                data-ocid="drivers.phone_input"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="drivers.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!form.name || !form.phone || createDriver.isPending}
                data-ocid="drivers.submit_button"
              >
                {createDriver.isPending ? "Creating…" : "Add Driver"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
