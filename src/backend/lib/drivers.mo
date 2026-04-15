import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import DriverTypes "../types/drivers";

module {
  public type State = {
    drivers : Map.Map<Common.DriverId, DriverTypes.DriverInternal>;
    vehicles : Map.Map<Common.VehicleId, DriverTypes.VehicleInternal>;
    var nextDriverId : Common.DriverId;
    var nextVehicleId : Common.VehicleId;
  };

  public func initState() : State {
    {
      drivers = Map.empty<Common.DriverId, DriverTypes.DriverInternal>();
      vehicles = Map.empty<Common.VehicleId, DriverTypes.VehicleInternal>();
      var nextDriverId = 1;
      var nextVehicleId = 1;
    };
  };

  public func driverToPublic(internal : DriverTypes.DriverInternal) : DriverTypes.Driver {
    {
      id = internal.id;
      name = internal.name;
      phone = internal.phone;
      assignedVehicleId = internal.assignedVehicleId;
      isActive = internal.isActive;
      principalId = internal.principalId;
    };
  };

  public func vehicleToPublic(internal : DriverTypes.VehicleInternal) : DriverTypes.Vehicle {
    {
      id = internal.id;
      licensePlate = internal.licensePlate;
      capacityKg = internal.capacityKg;
      status = internal.status;
    };
  };

  public func createDriver(
    state : State,
    req : DriverTypes.CreateDriverRequest,
  ) : DriverTypes.Driver {
    let id = state.nextDriverId;
    state.nextDriverId += 1;
    let internal : DriverTypes.DriverInternal = {
      id;
      name = req.name;
      phone = req.phone;
      var assignedVehicleId = req.assignedVehicleId;
      var isActive = true;
      principalId = req.principalId;
    };
    state.drivers.add(id, internal);
    driverToPublic(internal);
  };

  public func getDriver(
    state : State,
    id : Common.DriverId,
  ) : ?DriverTypes.Driver {
    switch (state.drivers.get(id)) {
      case (?internal) ?driverToPublic(internal);
      case null null;
    };
  };

  public func listDrivers(state : State) : [DriverTypes.Driver] {
    let results = List.empty<DriverTypes.Driver>();
    for ((_, internal) in state.drivers.entries()) {
      results.add(driverToPublic(internal));
    };
    results.toArray();
  };

  public func updateDriver(
    state : State,
    id : Common.DriverId,
    req : DriverTypes.CreateDriverRequest,
  ) : () {
    switch (state.drivers.get(id)) {
      case (?internal) {
        // Update mutable fields — name and phone are immutable in the type
        // so we replace the entry entirely
        let updated : DriverTypes.DriverInternal = {
          id = internal.id;
          name = req.name;
          phone = req.phone;
          var assignedVehicleId = req.assignedVehicleId;
          var isActive = internal.isActive;
          principalId = req.principalId;
        };
        state.drivers.add(id, updated);
      };
      case null Runtime.trap("Driver not found");
    };
  };

  public func deactivateDriver(
    state : State,
    id : Common.DriverId,
  ) : () {
    switch (state.drivers.get(id)) {
      case (?internal) {
        internal.isActive := false;
      };
      case null Runtime.trap("Driver not found");
    };
  };

  public func createVehicle(
    state : State,
    req : DriverTypes.CreateVehicleRequest,
  ) : DriverTypes.Vehicle {
    let id = state.nextVehicleId;
    state.nextVehicleId += 1;
    let internal : DriverTypes.VehicleInternal = {
      id;
      licensePlate = req.licensePlate;
      capacityKg = req.capacityKg;
      var status = #available;
    };
    state.vehicles.add(id, internal);
    vehicleToPublic(internal);
  };

  public func getVehicle(
    state : State,
    id : Common.VehicleId,
  ) : ?DriverTypes.Vehicle {
    switch (state.vehicles.get(id)) {
      case (?internal) ?vehicleToPublic(internal);
      case null null;
    };
  };

  public func listVehicles(state : State) : [DriverTypes.Vehicle] {
    let results = List.empty<DriverTypes.Vehicle>();
    for ((_, internal) in state.vehicles.entries()) {
      results.add(vehicleToPublic(internal));
    };
    results.toArray();
  };

  public func updateVehicleStatus(
    state : State,
    id : Common.VehicleId,
    status : DriverTypes.VehicleStatus,
  ) : () {
    switch (state.vehicles.get(id)) {
      case (?internal) {
        internal.status := status;
      };
      case null Runtime.trap("Vehicle not found");
    };
  };
};
