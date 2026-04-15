import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreateShipmentRequest {
    customerName: string;
    deliveryAddress: string;
    itemDescription: string;
    customerPhone: string;
    pickupAddress: string;
    weightKg: number;
}
export type Timestamp = bigint;
export type VehicleId = bigint;
export interface UpdateStatusRequest {
    gps?: GpsCoordinates;
    status: ShipmentStatus;
    staffOnly: boolean;
    note?: string;
    shipmentId: ShipmentId;
}
export interface Shipment {
    id: ShipmentId;
    customerName: string;
    trackingCode: TrackingCode;
    deliveryAddress: string;
    itemDescription: string;
    customerPhone: string;
    createdAt: Timestamp;
    statusHistory: Array<StatusEvent>;
    assignedDriverId?: DriverId;
    pickupAddress: string;
    weightKg: number;
    assignedVehicleId?: VehicleId;
    lastGps?: GpsCoordinates;
    currentStatus: ShipmentStatus;
}
export interface Driver {
    id: DriverId;
    name: string;
    isActive: boolean;
    assignedVehicleId?: VehicleId;
    phone: string;
    principalId?: Principal;
}
export interface StaffProfile {
    name: string;
    role: StaffRole;
    principalId: Principal;
}
export interface Vehicle {
    id: VehicleId;
    status: VehicleStatus;
    licensePlate: string;
    capacityKg: number;
}
export type TrackingCode = string;
export type ShipmentId = bigint;
export interface GpsCoordinates {
    lat: number;
    lng: number;
    capturedAt: Timestamp;
}
export type DriverId = bigint;
export interface CreateDriverRequest {
    name: string;
    assignedVehicleId?: VehicleId;
    phone: string;
    principalId?: Principal;
}
export interface StatusEvent {
    status: ShipmentStatus;
    staffOnly: boolean;
    note?: string;
    timestamp: Timestamp;
}
export interface CreateVehicleRequest {
    licensePlate: string;
    capacityKg: number;
}
export enum ShipmentStatus {
    assigned = "assigned",
    pending = "pending",
    inTransit = "inTransit",
    pickedUp = "pickedUp",
    delivered = "delivered",
    failed = "failed"
}
export enum StaffRole {
    admin = "admin",
    dispatcher = "dispatcher",
    driver = "driver"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VehicleStatus {
    available = "available",
    maintenance = "maintenance",
    inUse = "inUse"
}
export interface backendInterface {
    addShipmentNote(shipmentId: ShipmentId, note: string, staffOnly: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignDriverToShipment(shipmentId: ShipmentId, driverId: DriverId, vehicleId: VehicleId | null): Promise<void>;
    createDriver(req: CreateDriverRequest): Promise<Driver>;
    createVehicle(req: CreateVehicleRequest): Promise<Vehicle>;
    deactivateDriver(id: DriverId): Promise<void>;
    getCallerUserProfile(): Promise<StaffProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDriver(id: DriverId): Promise<Driver | null>;
    getShipment(id: ShipmentId): Promise<Shipment | null>;
    getUserProfile(user: Principal): Promise<StaffProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllShipments(): Promise<Array<Shipment>>;
    listDrivers(): Promise<Array<Driver>>;
    listStaffProfiles(): Promise<Array<StaffProfile>>;
    listVehicles(): Promise<Array<Vehicle>>;
    pushGpsUpdate(shipmentId: ShipmentId, coords: GpsCoordinates): Promise<void>;
    saveCallerUserProfile(profile: StaffProfile): Promise<void>;
    submitOrder(req: CreateShipmentRequest): Promise<Shipment>;
    trackShipment(trackingCode: TrackingCode): Promise<Shipment | null>;
    updateDriver(id: DriverId, req: CreateDriverRequest): Promise<void>;
    updateShipmentStatus(req: UpdateStatusRequest): Promise<void>;
    updateVehicleStatus(id: VehicleId, status: VehicleStatus): Promise<void>;
}
