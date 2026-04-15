import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import ShipmentLib "lib/shipments";
import DriverLib "lib/drivers";
import StaffLib "lib/staff";
import ShipmentsMixin "mixins/shipments-api";
import DriversMixin "mixins/drivers-api";
import StaffMixin "mixins/staff-api";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let shipmentState = ShipmentLib.initState();
  let driverState = DriverLib.initState();
  let staffState = StaffLib.initState();

  include ShipmentsMixin(accessControlState, shipmentState);
  include DriversMixin(accessControlState, driverState);
  include StaffMixin(accessControlState, staffState);
};
