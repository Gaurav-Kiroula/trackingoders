import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import StaffTypes "../types/staff";

module {
  public type State = {
    profiles : Map.Map<Principal, StaffTypes.StaffProfile>;
  };

  public func initState() : State {
    {
      profiles = Map.empty<Principal, StaffTypes.StaffProfile>();
    };
  };

  public func getProfile(
    state : State,
    principalId : Principal,
  ) : ?StaffTypes.StaffProfile {
    state.profiles.get(principalId);
  };

  public func saveProfile(
    state : State,
    profile : StaffTypes.StaffProfile,
  ) : () {
    state.profiles.add(profile.principalId, profile);
  };

  public func listProfiles(state : State) : [StaffTypes.StaffProfile] {
    let results = List.empty<StaffTypes.StaffProfile>();
    for ((_, profile) in state.profiles.entries()) {
      results.add(profile);
    };
    results.toArray();
  };
};
