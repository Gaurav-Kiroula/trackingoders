import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import StaffTypes "../types/staff";
import StaffLib "../lib/staff";

mixin (
  accessControlState : AccessControl.AccessControlState,
  staffState : StaffLib.State,
) {
  /// Staff: get own profile (requires user role)
  public query ({ caller }) func getCallerUserProfile() : async ?StaffTypes.StaffProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    StaffLib.getProfile(staffState, caller);
  };

  /// Staff: save / update own profile (requires user role)
  public shared ({ caller }) func saveCallerUserProfile(profile : StaffTypes.StaffProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    // Ensure staff can only save their own profile (admins can save any)
    if (caller != profile.principalId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update your own profile");
    };
    StaffLib.saveProfile(staffState, profile);
  };

  /// Admin/Dispatcher: get another staff member's profile (requires user role)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?StaffTypes.StaffProfile {
    if (caller != user and not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Staff login required");
    };
    StaffLib.getProfile(staffState, user);
  };

  /// Admin: list all staff profiles (requires admin role)
  public query ({ caller }) func listStaffProfiles() : async [StaffTypes.StaffProfile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    StaffLib.listProfiles(staffState);
  };
};
