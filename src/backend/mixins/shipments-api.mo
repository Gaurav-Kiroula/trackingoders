import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import ShipmentTypes "../types/shipments";
import ShipmentLib "../lib/shipments";

mixin (
  accessControlState : AccessControl.AccessControlState,
  shipmentState : ShipmentLib.State,
) {
  /// Public: anonymous customers submit a new order and receive a tracking code
  public shared func submitOrder(req : ShipmentTypes.CreateShipmentRequest) : async ShipmentTypes.Shipment {
    ShipmentLib.createShipment(shipmentState, req);
  };

  /// Public: anonymous customers look up shipment status by tracking code (staff-only events hidden)
  public query func trackShipment(trackingCode : Common.TrackingCode) : async ?ShipmentTypes.Shipment {
    ShipmentLib.getShipmentByTrackingCode(shipmentState, trackingCode);
  };

  /// Staff: list all shipments (requires user role)
  public query ({ caller }) func listAllShipments() : async [ShipmentTypes.Shipment] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    ShipmentLib.listShipments(shipmentState);
  };

  /// Staff: get a specific shipment by ID (requires user role)
  public query ({ caller }) func getShipment(id : Common.ShipmentId) : async ?ShipmentTypes.Shipment {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    ShipmentLib.getShipmentById(shipmentState, id);
  };

  /// Dispatcher/Admin: assign a driver and vehicle to a shipment (requires user role)
  public shared ({ caller }) func assignDriverToShipment(
    shipmentId : Common.ShipmentId,
    driverId : Common.DriverId,
    vehicleId : ?Common.VehicleId,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    ShipmentLib.assignDriver(shipmentState, shipmentId, driverId, vehicleId);
  };

  /// Staff/Driver: update shipment status with optional note and GPS (requires user role)
  public shared ({ caller }) func updateShipmentStatus(req : ShipmentTypes.UpdateStatusRequest) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    ShipmentLib.updateStatus(shipmentState, req);
  };

  /// Driver: push a GPS location update for an in-transit shipment (requires user role)
  public shared ({ caller }) func pushGpsUpdate(
    shipmentId : Common.ShipmentId,
    coords : Common.GpsCoordinates,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    ShipmentLib.updateGps(shipmentState, shipmentId, coords);
  };

  /// Dispatcher/Admin: add a staff note to a shipment (requires user role)
  public shared ({ caller }) func addShipmentNote(
    shipmentId : Common.ShipmentId,
    note : Text,
    staffOnly : Bool,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    ShipmentLib.addNote(shipmentState, shipmentId, note, staffOnly);
  };
};
