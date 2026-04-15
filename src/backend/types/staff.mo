import Common "common";

module {
  public type StaffProfile = {
    principalId : Principal;
    name : Text;
    role : Common.StaffRole;
  };
};
