import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import ShipmentTypes "../types/shipments";

module {
  public type State = {
    shipments : Map.Map<Common.ShipmentId, ShipmentTypes.ShipmentInternal>;
    trackingIndex : Map.Map<Common.TrackingCode, Common.ShipmentId>;
    var nextId : Common.ShipmentId;
  };

  public func initState() : State {
    {
      shipments = Map.empty<Common.ShipmentId, ShipmentTypes.ShipmentInternal>();
      trackingIndex = Map.empty<Common.TrackingCode, Common.ShipmentId>();
      var nextId = 1;
    };
  };

  func makeTrackingCode(id : Common.ShipmentId, timestamp : Common.Timestamp) : Common.TrackingCode {
    // e.g. "TRK-3-98765" — id + last 5 digits of nanosecond timestamp
    let tsAbs = Int.abs(timestamp);
    let tsMod = tsAbs % 100000;
    "TRK-" # id.toText() # "-" # tsMod.toText();
  };

  public func toPublic(internal : ShipmentTypes.ShipmentInternal) : ShipmentTypes.Shipment {
    {
      id = internal.id;
      trackingCode = internal.trackingCode;
      customerName = internal.customerName;
      customerPhone = internal.customerPhone;
      pickupAddress = internal.pickupAddress;
      deliveryAddress = internal.deliveryAddress;
      itemDescription = internal.itemDescription;
      weightKg = internal.weightKg;
      currentStatus = internal.currentStatus;
      assignedDriverId = internal.assignedDriverId;
      assignedVehicleId = internal.assignedVehicleId;
      lastGps = internal.lastGps;
      statusHistory = internal.statusHistory.toArray();
      createdAt = internal.createdAt;
    };
  };

  func toPublicFiltered(internal : ShipmentTypes.ShipmentInternal) : ShipmentTypes.Shipment {
    let publicEvents = internal.statusHistory.filter(func(ev : ShipmentTypes.StatusEvent) : Bool {
      not ev.staffOnly
    });
    {
      id = internal.id;
      trackingCode = internal.trackingCode;
      customerName = internal.customerName;
      customerPhone = internal.customerPhone;
      pickupAddress = internal.pickupAddress;
      deliveryAddress = internal.deliveryAddress;
      itemDescription = internal.itemDescription;
      weightKg = internal.weightKg;
      currentStatus = internal.currentStatus;
      assignedDriverId = internal.assignedDriverId;
      assignedVehicleId = internal.assignedVehicleId;
      lastGps = internal.lastGps;
      statusHistory = publicEvents.toArray();
      createdAt = internal.createdAt;
    };
  };

  public func createShipment(
    state : State,
    req : ShipmentTypes.CreateShipmentRequest,
  ) : ShipmentTypes.Shipment {
    let id = state.nextId;
    state.nextId += 1;
    let now = Time.now();
    let code = makeTrackingCode(id, now);

    let history = List.empty<ShipmentTypes.StatusEvent>();
    history.add({
      status = #pending;
      timestamp = now;
      note = null;
      staffOnly = false;
    });

    let internal : ShipmentTypes.ShipmentInternal = {
      id;
      trackingCode = code;
      customerName = req.customerName;
      customerPhone = req.customerPhone;
      pickupAddress = req.pickupAddress;
      deliveryAddress = req.deliveryAddress;
      itemDescription = req.itemDescription;
      weightKg = req.weightKg;
      var currentStatus = #pending;
      var assignedDriverId = null;
      var assignedVehicleId = null;
      var lastGps = null;
      statusHistory = history;
      createdAt = now;
    };
    state.shipments.add(id, internal);
    state.trackingIndex.add(code, id);
    toPublic(internal);
  };

  public func getShipmentById(
    state : State,
    id : Common.ShipmentId,
  ) : ?ShipmentTypes.Shipment {
    switch (state.shipments.get(id)) {
      case (?internal) ?toPublic(internal);
      case null null;
    };
  };

  public func getShipmentByTrackingCode(
    state : State,
    code : Common.TrackingCode,
  ) : ?ShipmentTypes.Shipment {
    switch (state.trackingIndex.get(code)) {
      case (?id) {
        switch (state.shipments.get(id)) {
          case (?internal) ?toPublicFiltered(internal);
          case null null;
        };
      };
      case null null;
    };
  };

  public func listShipments(state : State) : [ShipmentTypes.Shipment] {
    let results = List.empty<ShipmentTypes.Shipment>();
    for ((_, internal) in state.shipments.entries()) {
      results.add(toPublic(internal));
    };
    results.toArray();
  };

  public func assignDriver(
    state : State,
    shipmentId : Common.ShipmentId,
    driverId : Common.DriverId,
    vehicleId : ?Common.VehicleId,
  ) : () {
    switch (state.shipments.get(shipmentId)) {
      case (?internal) {
        internal.assignedDriverId := ?driverId;
        internal.assignedVehicleId := vehicleId;
        if (internal.currentStatus == #pending) {
          internal.currentStatus := #assigned;
          internal.statusHistory.add({
            status = #assigned;
            timestamp = Time.now();
            note = null;
            staffOnly = true;
          });
        };
      };
      case null Runtime.trap("Shipment not found");
    };
  };

  public func updateStatus(
    state : State,
    req : ShipmentTypes.UpdateStatusRequest,
  ) : () {
    switch (state.shipments.get(req.shipmentId)) {
      case (?internal) {
        internal.currentStatus := req.status;
        switch (req.gps) {
          case (?coords) internal.lastGps := ?coords;
          case null {};
        };
        internal.statusHistory.add({
          status = req.status;
          timestamp = Time.now();
          note = req.note;
          staffOnly = req.staffOnly;
        });
      };
      case null Runtime.trap("Shipment not found");
    };
  };

  public func updateGps(
    state : State,
    shipmentId : Common.ShipmentId,
    coords : Common.GpsCoordinates,
  ) : () {
    switch (state.shipments.get(shipmentId)) {
      case (?internal) {
        internal.lastGps := ?coords;
      };
      case null Runtime.trap("Shipment not found");
    };
  };

  public func addNote(
    state : State,
    shipmentId : Common.ShipmentId,
    note : Text,
    staffOnly : Bool,
  ) : () {
    switch (state.shipments.get(shipmentId)) {
      case (?internal) {
        internal.statusHistory.add({
          status = internal.currentStatus;
          timestamp = Time.now();
          note = ?note;
          staffOnly;
        });
      };
      case null Runtime.trap("Shipment not found");
    };
  };
};
