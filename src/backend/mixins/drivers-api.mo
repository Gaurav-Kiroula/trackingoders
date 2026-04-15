import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import DriverTypes "../types/drivers";
import DriverLib "../lib/drivers";

mixin (
  accessControlState : AccessControl.AccessControlState,
  driverState : DriverLib.State,
) {
  /// Admin: create a new driver profile (requires admin role)
  public shared ({ caller }) func createDriver(req : DriverTypes.CreateDriverRequest) : async DriverTypes.Driver {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    DriverLib.createDriver(driverState, req);
  };

  /// Admin/Dispatcher: list all drivers (requires user role)
  public query ({ caller }) func listDrivers() : async [DriverTypes.Driver] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    DriverLib.listDrivers(driverState);
  };

  /// Admin/Dispatcher: get a specific driver (requires user role)
  public query ({ caller }) func getDriver(id : Common.DriverId) : async ?DriverTypes.Driver {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    DriverLib.getDriver(driverState, id);
  };

  /// Admin: update a driver profile (requires admin role)
  public shared ({ caller }) func updateDriver(
    id : Common.DriverId,
    req : DriverTypes.CreateDriverRequest,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    DriverLib.updateDriver(driverState, id, req);
  };

  /// Admin: deactivate a driver (requires admin role)
  public shared ({ caller }) func deactivateDriver(id : Common.DriverId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    DriverLib.deactivateDriver(driverState, id);
  };

  /// Admin: create a new vehicle record (requires admin role)
  public shared ({ caller }) func createVehicle(req : DriverTypes.CreateVehicleRequest) : async DriverTypes.Vehicle {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    DriverLib.createVehicle(driverState, req);
  };

  /// Admin/Dispatcher: list all vehicles (requires user role)
  public query ({ caller }) func listVehicles() : async [DriverTypes.Vehicle] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    DriverLib.listVehicles(driverState);
  };

  /// Admin: update vehicle availability status (requires admin role)
  public shared ({ caller }) func updateVehicleStatus(
    id : Common.VehicleId,
    status : DriverTypes.VehicleStatus,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    DriverLib.updateVehicleStatus(driverState, id, status);
  };
};
