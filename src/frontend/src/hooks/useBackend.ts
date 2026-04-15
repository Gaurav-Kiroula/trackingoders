import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  CreateDriverRequest,
  CreateShipmentRequest,
  CreateVehicleRequest,
  DriverId,
  GpsCoordinates,
  ShipmentId,
  TrackingCode,
  UpdateStatusRequest,
  VehicleId,
  VehicleStatus,
} from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function useShipments() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["shipments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllShipments();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useShipment(id: ShipmentId | undefined) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["shipment", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getShipment(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
    refetchInterval: 15_000,
  });
}

export function useTrackShipment(trackingCode: TrackingCode | undefined) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["track", trackingCode],
    queryFn: async () => {
      if (!actor || !trackingCode) return null;
      return actor.trackShipment(trackingCode);
    },
    enabled: !!actor && !isFetching && !!trackingCode,
    refetchInterval: 20_000,
  });
}

export function useDrivers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDrivers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVehicles() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVehicles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStaffProfile() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["staffProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateShipment() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateShipmentRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitOrder(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
    onError: (error: Error) => {
      console.error("useCreateShipment error:", error);
    },
  });
}

export function useUpdateStatus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: UpdateStatusRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateShipmentStatus(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["shipment"] });
    },
  });
}

export function useUpdateGps() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      shipmentId,
      coords,
    }: {
      shipmentId: ShipmentId;
      coords: GpsCoordinates;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.pushGpsUpdate(shipmentId, coords);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipment"] });
    },
  });
}

export function useCreateDriver() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateDriverRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.createDriver(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
}

export function useCreateVehicle() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateVehicleRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.createVehicle(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useAssignDriver() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      shipmentId,
      driverId,
      vehicleId,
    }: {
      shipmentId: ShipmentId;
      driverId: DriverId;
      vehicleId: VehicleId | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignDriverToShipment(shipmentId, driverId, vehicleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["shipment"] });
    },
  });
}

export function useUpdateVehicleStatus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: VehicleId;
      status: VehicleStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateVehicleStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}
