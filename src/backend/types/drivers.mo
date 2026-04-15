import Common "common";

module {
  public type DriverInternal = {
    id : Common.DriverId;
    name : Text;
    phone : Text;
    var assignedVehicleId : ?Common.VehicleId;
    var isActive : Bool;
    principalId : ?Principal;
  };

  public type Driver = {
    id : Common.DriverId;
    name : Text;
    phone : Text;
    assignedVehicleId : ?Common.VehicleId;
    isActive : Bool;
    principalId : ?Principal;
  };

  public type CreateDriverRequest = {
    name : Text;
    phone : Text;
    assignedVehicleId : ?Common.VehicleId;
    principalId : ?Principal;
  };

  public type VehicleStatus = {
    #available;
    #inUse;
    #maintenance;
  };

  public type VehicleInternal = {
    id : Common.VehicleId;
    licensePlate : Text;
    capacityKg : Float;
    var status : VehicleStatus;
  };

  public type Vehicle = {
    id : Common.VehicleId;
    licensePlate : Text;
    capacityKg : Float;
    status : VehicleStatus;
  };

  public type CreateVehicleRequest = {
    licensePlate : Text;
    capacityKg : Float;
  };
};
