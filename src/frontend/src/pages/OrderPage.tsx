import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCreateShipment } from "../hooks/useBackend";

export default function OrderPage() {
  const navigate = useNavigate();
  const createShipment = useCreateShipment();
  const { actor } = useActor(createActor);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    pickupAddress: "",
    deliveryAddress: "",
    itemDescription: "",
    weightKg: "",
  });

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const isValid =
    form.customerName &&
    form.customerPhone &&
    form.pickupAddress &&
    form.deliveryAddress &&
    form.itemDescription &&
    form.weightKg &&
    !Number.isNaN(Number.parseFloat(form.weightKg)) &&
    Number.parseFloat(form.weightKg) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    if (!actor) {
      toast.error(
        "Service unavailable. Please refresh the page and try again.",
      );
      return;
    }
    try {
      const shipment = await createShipment.mutateAsync({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        pickupAddress: form.pickupAddress,
        deliveryAddress: form.deliveryAddress,
        itemDescription: form.itemDescription,
        weightKg: Number.parseFloat(form.weightKg),
      });
      toast.success(
        `Order placed! Your tracking code is ${shipment.trackingCode}`,
      );
      navigate({
        to: "/track/$code",
        params: { code: shipment.trackingCode },
      });
    } catch (error) {
      console.error("Order placement failed:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to place order. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-subtle">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            data-ocid="order.home_link"
          >
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">
              LogiTrack Pro
            </span>
          </button>
          <span className="text-sm text-muted-foreground">Place an Order</span>
        </div>
      </header>

      <main className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold font-display text-foreground">
              Schedule a Shipment
            </h1>
            <p className="text-muted-foreground mt-1">
              Fill in the details below and we'll arrange pickup and delivery.
              You'll receive a tracking code instantly.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-6 space-y-5"
            data-ocid="order.form"
          >
            {/* Customer info */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Your Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Maria Torres"
                    value={form.customerName}
                    onChange={set("customerName")}
                    required
                    data-ocid="order.name_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 555 000 0000"
                    value={form.customerPhone}
                    onChange={set("customerPhone")}
                    required
                    data-ocid="order.phone_input"
                  />
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Addresses
              </h2>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pickup">Pickup Address</Label>
                  <Input
                    id="pickup"
                    placeholder="e.g. 123 Main St, New York, NY 10001"
                    value={form.pickupAddress}
                    onChange={set("pickupAddress")}
                    required
                    data-ocid="order.pickup_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="delivery">Delivery Address</Label>
                  <Input
                    id="delivery"
                    placeholder="e.g. 456 Oak Ave, Brooklyn, NY 11201"
                    value={form.deliveryAddress}
                    onChange={set("deliveryAddress")}
                    required
                    data-ocid="order.delivery_input"
                  />
                </div>
              </div>
            </div>

            {/* Item info */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Package Details
              </h2>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="description">Item Description</Label>
                  <Textarea
                    id="description"
                    placeholder="e.g. 3 boxes of electronic equipment, fragile"
                    value={form.itemDescription}
                    onChange={set("itemDescription")}
                    rows={2}
                    required
                    data-ocid="order.description_input"
                  />
                </div>
                <div className="space-y-1.5 max-w-[180px]">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="e.g. 12.5"
                    value={form.weightKg}
                    onChange={set("weightKg")}
                    required
                    data-ocid="order.weight_input"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              {createShipment.isPending ? (
                <LoadingSpinner label="Placing your order…" />
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={!isValid}
                  data-ocid="order.submit_button"
                >
                  Place Order
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {createShipment.isError && (
                <p
                  className="text-sm text-destructive mt-2 text-center"
                  data-ocid="order.error_state"
                >
                  {createShipment.error instanceof Error
                    ? createShipment.error.message
                    : "Something went wrong. Please try again."}
                </p>
              )}
            </div>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            After placing your order, you'll receive a tracking code to monitor
            your shipment in real time.
          </p>
        </div>
      </main>

      <footer className="bg-muted/40 border-t border-border py-4">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href="https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
