export class UserSecurity {
  constructor(
    public linkedInLogin: boolean,
    public enabled: boolean,
    public accountNonExpired: boolean,
    public accountNonLocked: boolean,
    public credentialsNonExpired: boolean,
    public rawSecurityAnswer?: string,
    public securityQuestion?: string
  ) {
  }

  public static from(security: Partial<UserSecurity>): UserSecurity {
    return new UserSecurity(
      security.linkedInLogin as typeof UserSecurity.prototype.linkedInLogin,
      security.enabled as typeof UserSecurity.prototype.enabled,
      security.accountNonExpired as typeof UserSecurity.prototype.accountNonExpired,
      security.accountNonLocked as typeof UserSecurity.prototype.accountNonLocked,
      security.credentialsNonExpired as typeof UserSecurity.prototype.credentialsNonExpired,
      security.rawSecurityAnswer as typeof UserSecurity.prototype.rawSecurityAnswer,
      security.securityQuestion as typeof UserSecurity.prototype.securityQuestion
    );
  }
}
