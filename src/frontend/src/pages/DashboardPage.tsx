import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import { ShipmentStatusBadge } from "../components/StatusBadge";
import { useDrivers, useShipments, useVehicles } from "../hooks/useBackend";
import { ShipmentStatus, VehicleStatus } from "../types";

export default function DashboardPage() {
  const { data: shipments = [], isLoading: shipmentsLoading } = useShipments();
  const { data: drivers = [] } = useDrivers();
  const { data: vehicles = [] } = useVehicles();

  const stats = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter(
      (s) => s.currentStatus === ShipmentStatus.inTransit,
    ).length;
    const delivered = shipments.filter(
      (s) => s.currentStatus === ShipmentStatus.delivered,
    ).length;
    const pending = shipments.filter(
      (s) => s.currentStatus === ShipmentStatus.pending,
    ).length;
    const activeDrivers = drivers.filter((d) => d.isActive).length;
    const availableVehicles = vehicles.filter(
      (v) => v.status === VehicleStatus.available,
    ).length;
    return {
      total,
      inTransit,
      delivered,
      pending,
      activeDrivers,
      availableVehicles,
    };
  }, [shipments, drivers, vehicles]);

  const recentShipments = useMemo(
    () =>
      [...shipments]
        .sort((a, b) => Number(b.createdAt - a.createdAt))
        .slice(0, 6),
    [shipments],
  );

  if (shipmentsLoading) {
    return <LoadingSpinner fullPage label="Loading dashboard…" />;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Operations overview — live
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard
          label="Total Shipments"
          value={stats.total}
          icon={Package}
          variant="default"
        />
        <StatCard
          label="In Transit"
          value={stats.inTransit}
          icon={Truck}
          variant="primary"
        />
        <StatCard
          label="Delivered"
          value={stats.delivered}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={Clock}
          variant="accent"
        />
        <StatCard
          label="Active Drivers"
          value={stats.activeDrivers}
          icon={Users}
          variant="primary"
        />
        <StatCard
          label="Available Vehicles"
          value={stats.availableVehicles}
          icon={BarChart3}
          variant="success"
        />
      </div>

      {/* Recent shipments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Recent Shipments</h2>
          <Link
            to="/shipments"
            className="text-xs text-primary hover:underline"
            data-ocid="dashboard.view_all_link"
          >
            View all
          </Link>
        </div>

        {recentShipments.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No shipments yet"
            description="Create your first shipment to get started."
          />
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-2.5 text-label text-muted-foreground font-medium">
                    Tracking
                  </th>
                  <th className="text-left px-4 py-2.5 text-label text-muted-foreground font-medium hidden md:table-cell">
                    Customer
                  </th>
                  <th className="text-left px-4 py-2.5 text-label text-muted-foreground font-medium hidden lg:table-cell">
                    Destination
                  </th>
                  <th className="text-left px-4 py-2.5 text-label text-muted-foreground font-medium">
                    Status
                  </th>
                  <th className="text-right px-4 py-2.5 text-label text-muted-foreground font-medium">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map((shipment, idx) => (
                  <tr
                    key={shipment.id.toString()}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    data-ocid={`dashboard.shipment.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-foreground">
                      {shipment.trackingCode}
                    </td>
                    <td className="px-4 py-3 text-foreground hidden md:table-cell">
                      {shipment.customerName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground truncate max-w-[180px] hidden lg:table-cell">
                      {shipment.deliveryAddress}
                    </td>
                    <td className="px-4 py-3">
                      <ShipmentStatusBadge status={shipment.currentStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/shipments/$id"
                        params={{ id: shipment.id.toString() }}
                        className="text-xs text-primary hover:underline"
                        data-ocid={`dashboard.shipment.detail_link.${idx + 1}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
