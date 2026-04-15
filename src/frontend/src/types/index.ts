export type {
  Shipment,
  Driver,
  Vehicle,
  GpsCoordinates,
  StatusEvent,
  StaffProfile,
  CreateShipmentRequest,
  UpdateStatusRequest,
  CreateDriverRequest,
  CreateVehicleRequest,
  ShipmentId,
  DriverId,
  VehicleId,
  TrackingCode,
  Timestamp,
} from "../backend";

export {
  ShipmentStatus,
  StaffRole,
  VehicleStatus,
  UserRole,
} from "../backend";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface FilterOption {
  label: string;
  value: string;
}
