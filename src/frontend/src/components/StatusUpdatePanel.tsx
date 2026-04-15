import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateStatus } from "../hooks/useBackend";
import { ShipmentStatus } from "../types";
import type { ShipmentId } from "../types";
import { ShipmentStatusBadge } from "./StatusBadge";

interface StatusUpdatePanelProps {
  shipmentId: ShipmentId;
  currentStatus: ShipmentStatus;
}

const STATUS_OPTIONS: { value: ShipmentStatus; label: string }[] = [
  { value: ShipmentStatus.pending, label: "Pending" },
  { value: ShipmentStatus.assigned, label: "Driver Assigned" },
  { value: ShipmentStatus.pickedUp, label: "Picked Up" },
  { value: ShipmentStatus.inTransit, label: "In Transit" },
  { value: ShipmentStatus.delivered, label: "Delivered" },
  { value: ShipmentStatus.failed, label: "Failed" },
];

export default function StatusUpdatePanel({
  shipmentId,
  currentStatus,
}: StatusUpdatePanelProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<ShipmentStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const updateStatus = useUpdateStatus();

  const isDirty = selectedStatus !== currentStatus;

  function handleConfirm() {
    updateStatus.mutate(
      {
        shipmentId,
        status: selectedStatus,
        note: note.trim() || undefined,
        staffOnly: false,
      },
      {
        onSuccess: () => {
          toast.success(
            `Status updated to "${STATUS_OPTIONS.find((o) => o.value === selectedStatus)?.label}"`,
            {
              duration: 4000,
            },
          );
          setNote("");
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to update status. Please try again.", {
            duration: 5000,
          });
          setOpen(false);
        },
      },
    );
  }

  return (
    <div
      className="bg-card border border-border rounded-xl p-4 space-y-3"
      data-ocid="status_update.panel"
    >
      <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
        <CheckCircle2 className="w-4 h-4 text-primary" />
        Update Status
      </h2>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Current Status</Label>
        <ShipmentStatusBadge status={currentStatus} />
      </div>

      <div className="space-y-1.5">
        <Label
          className="text-xs text-muted-foreground"
          htmlFor="status-select"
        >
          New Status
        </Label>
        <div className="relative">
          <select
            id="status-select"
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as ShipmentStatus)
            }
            className="w-full appearance-none bg-background border border-input rounded-lg px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            data-ocid="status_update.select"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground" htmlFor="status-note">
          Note <span className="font-normal opacity-60">(optional)</span>
        </Label>
        <Textarea
          id="status-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a status note visible to the customer…"
          rows={2}
          className="text-sm resize-none"
          data-ocid="status_update.textarea"
        />
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            className="w-full"
            disabled={!isDirty || updateStatus.isPending}
            data-ocid="status_update.open_modal_button"
          >
            {updateStatus.isPending ? "Updating…" : "Update Status"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent data-ocid="status_update.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
            <AlertDialogDescription className="space-y-1">
              <span className="block">
                Change shipment status from{" "}
                <strong className="text-foreground capitalize">
                  {currentStatus}
                </strong>{" "}
                to{" "}
                <strong className="text-foreground capitalize">
                  {selectedStatus}
                </strong>
                ?
              </span>
              {note.trim() && (
                <span className="block mt-1 italic text-muted-foreground">
                  Note: "{note.trim()}"
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="status_update.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              data-ocid="status_update.confirm_button"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
