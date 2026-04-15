import Common "common";
import List "mo:core/List";

module {
  public type ShipmentStatus = {
    #pending;
    #assigned;
    #pickedUp;
    #inTransit;
    #delivered;
    #failed;
  };

  public type StatusEvent = {
    status : ShipmentStatus;
    timestamp : Common.Timestamp;
    note : ?Text;
    staffOnly : Bool;
  };

  public type ShipmentInternal = {
    id : Common.ShipmentId;
    trackingCode : Common.TrackingCode;
    customerName : Text;
    customerPhone : Text;
    pickupAddress : Text;
    deliveryAddress : Text;
    itemDescription : Text;
    weightKg : Float;
    var currentStatus : ShipmentStatus;
    var assignedDriverId : ?Common.DriverId;
    var assignedVehicleId : ?Common.VehicleId;
    var lastGps : ?Common.GpsCoordinates;
    statusHistory : List.List<StatusEvent>;
    createdAt : Common.Timestamp;
  };

  public type Shipment = {
    id : Common.ShipmentId;
    trackingCode : Common.TrackingCode;
    customerName : Text;
    customerPhone : Text;
    pickupAddress : Text;
    deliveryAddress : Text;
    itemDescription : Text;
    weightKg : Float;
    currentStatus : ShipmentStatus;
    assignedDriverId : ?Common.DriverId;
    assignedVehicleId : ?Common.VehicleId;
    lastGps : ?Common.GpsCoordinates;
    statusHistory : [StatusEvent];
    createdAt : Common.Timestamp;
  };

  public type CreateShipmentRequest = {
    customerName : Text;
    customerPhone : Text;
    pickupAddress : Text;
    deliveryAddress : Text;
    itemDescription : Text;
    weightKg : Float;
  };

  public type UpdateStatusRequest = {
    shipmentId : Common.ShipmentId;
    status : ShipmentStatus;
    note : ?Text;
    staffOnly : Bool;
    gps : ?Common.GpsCoordinates;
  };
};
