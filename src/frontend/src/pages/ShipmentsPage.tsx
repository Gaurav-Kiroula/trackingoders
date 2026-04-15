import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { Package, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { ShipmentStatusBadge } from "../components/StatusBadge";
import { useShipments } from "../hooks/useBackend";
import { ShipmentStatus } from "../types";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: ShipmentStatus.pending },
  { label: "In Transit", value: ShipmentStatus.inTransit },
  { label: "Delivered", value: ShipmentStatus.delivered },
  { label: "Failed", value: ShipmentStatus.failed },
];

export default function ShipmentsPage() {
  const { data: shipments = [], isLoading } = useShipments();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    return shipments
      .filter((s) => {
        const q = search.toLowerCase();
        if (
          q &&
          !s.trackingCode.toLowerCase().includes(q) &&
          !s.customerName.toLowerCase().includes(q) &&
          !s.deliveryAddress.toLowerCase().includes(q)
        ) {
          return false;
        }
        if (statusFilter && s.currentStatus !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => Number(b.createdAt - a.createdAt));
  }, [shipments, search, statusFilter]);

  if (isLoading) return <LoadingSpinner fullPage label="Loading shipments…" />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Shipments
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {shipments.length} total shipments
          </p>
        </div>
        <Button
          className="gap-1.5"
          onClick={() => navigate({ to: "/order" })}
          data-ocid="shipments.create_button"
        >
          <Plus className="w-4 h-4" />
          New Shipment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search tracking, customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
            data-ocid="shipments.search_input"
          />
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {STATUS_FILTERS.map((f) => (
            <button
              type="button"
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`shipments.filter.${f.label.toLowerCase().replace(" ", "_")}_tab`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No shipments found"
          description={
            search || statusFilter
              ? "Try adjusting your search or filters."
              : "Create your first shipment to get started."
          }
          action={
            !search && !statusFilter
              ? {
                  label: "Create Shipment",
                  onClick: () => navigate({ to: "/order" }),
                }
              : undefined
          }
        />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-label text-muted-foreground">
                    Tracking Code
                  </th>
                  <th className="text-left px-4 py-3 text-label text-muted-foreground hidden sm:table-cell">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-label text-muted-foreground hidden lg:table-cell">
                    Pickup
                  </th>
                  <th className="text-left px-4 py-3 text-label text-muted-foreground hidden lg:table-cell">
                    Delivery
                  </th>
                  <th className="text-left px-4 py-3 text-label text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-label text-muted-foreground">
                    Weight
                  </th>
                  <th className="text-right px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((shipment, idx) => (
                  <tr
                    key={shipment.id.toString()}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() =>
                      navigate({
                        to: "/shipments/$id",
                        params: { id: shipment.id.toString() },
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        navigate({
                          to: "/shipments/$id",
                          params: { id: shipment.id.toString() },
                        });
                    }}
                    tabIndex={0}
                    data-ocid={`shipments.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">
                      {shipment.trackingCode}
                    </td>
                    <td className="px-4 py-3 text-foreground hidden sm:table-cell">
                      <div className="truncate max-w-[140px]">
                        {shipment.customerName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {shipment.customerPhone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                      <div className="truncate max-w-[150px]">
                        {shipment.pickupAddress}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                      <div className="truncate max-w-[150px]">
                        {shipment.deliveryAddress}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ShipmentStatusBadge status={shipment.currentStatus} />
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground font-mono text-xs">
                      {shipment.weightKg} kg
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/shipments/$id"
                        params={{ id: shipment.id.toString() }}
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                        data-ocid={`shipments.detail_link.${idx + 1}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
