import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Navigate,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import StaffLayout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import DriversPage from "./pages/DriversPage";
import LandingPage from "./pages/LandingPage";
import OrderPage from "./pages/OrderPage";
import ShipmentDetailPage from "./pages/ShipmentDetailPage";
import ShipmentsPage from "./pages/ShipmentsPage";
import TrackPage from "./pages/TrackPage";
import VehiclesPage from "./pages/VehiclesPage";

function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useInternetIdentity();
  if (isInitializing) return null;
  if (!isAuthenticated) return <Navigate to="/" />;
  return <>{children}</>;
}

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order",
  component: OrderPage,
});

const trackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track/$code",
  component: TrackPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <AuthGuard>
      <StaffLayout>
        <DashboardPage />
      </StaffLayout>
    </AuthGuard>
  ),
});

const shipmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shipments",
  component: () => (
    <AuthGuard>
      <StaffLayout>
        <ShipmentsPage />
      </StaffLayout>
    </AuthGuard>
  ),
});

const shipmentDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shipments/$id",
  component: () => (
    <AuthGuard>
      <StaffLayout>
        <ShipmentDetailPage />
      </StaffLayout>
    </AuthGuard>
  ),
});

const driversRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/drivers",
  component: () => (
    <AuthGuard>
      <StaffLayout>
        <DriversPage />
      </StaffLayout>
    </AuthGuard>
  ),
});

const vehiclesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vehicles",
  component: () => (
    <AuthGuard>
      <StaffLayout>
        <VehiclesPage />
      </StaffLayout>
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  orderRoute,
  trackRoute,
  dashboardRoute,
  shipmentsRoute,
  shipmentDetailRoute,
  driversRoute,
  vehiclesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
