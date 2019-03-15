export interface UserSecurity {
  securityQuestion: string;
  linkedInLogin: boolean;
  enabled: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
}
