export interface ClerkEventUserCreated {
  data: {
    backup_code_enabled: boolean;
    banned: boolean;
    create_organization_enabled: boolean;
    create_organizations_limit: number | null;
    created_at: number;
    delete_self_enabled: boolean;
    email_addresses: {
      created_at: number;
      email_address: string;
      id?: string;
      linked_to: any[];
      matches_sso_connection?: boolean;
      object: string;
      reserved: boolean;
      updated_at: number;
      verification?: any; // You can define a more specific type for verification if needed
    }[];
    enterprise_accounts: any[];
    external_accounts: any[];
    external_id: string | null;
    first_name: string | null;
    has_image: boolean;
    id: string;
    image_url: string;
    last_active_at: number | null;
    last_name: string | null;
    last_sign_in_at: number | null;
    legal_accepted_at: number | null;
    locked: boolean;
    lockout_expires_in_seconds: number | null;
    mfa_disabled_at: number | null;
    mfa_enabled_at: number | null;
    object: string;
    passkeys: any[];
    password_enabled: boolean;
    phone_numbers: any[];
    primary_email_address_id: string | null;
    primary_phone_number_id: string | null;
    primary_web3_wallet_id: string | null;
    private_metadata: any;
    profile_image_url: string;
    public_metadata: Record<string, any>;
    saml_accounts: any[];
    totp_enabled: boolean;
    two_factor_enabled: boolean;
    unsafe_metadata: Record<string, any>;
    updated_at: number;
    username: string | null;
    verification_attempts_remaining: number | null;
    web3_wallets: any[];
  };
  event_attributes: {
    http_request: {
      client_ip: string;
      user_agent: string;
    };
  };
  instance_id: string;
  object: string;
  timestamp: number;
  type: string;
}
