import type { Tenant, Member } from './db';

export interface TenantContext {
  tenant: Tenant;
  membership: Member;
}
