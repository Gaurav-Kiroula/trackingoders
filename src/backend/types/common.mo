module {
  public type Timestamp = Int;
  public type ShipmentId = Nat;
  public type DriverId = Nat;
  public type VehicleId = Nat;
  public type TrackingCode = Text;

  public type GpsCoordinates = {
    lat : Float;
    lng : Float;
    capturedAt : Timestamp;
  };

  public type StaffRole = {
    #admin;
    #dispatcher;
    #driver;
  };
};
