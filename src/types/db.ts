import type { Selectable, Insertable, Updateable } from 'kysely';
import type { DB, Sysrole } from '../db/types';
import type { Role } from '../db/types';

// Custom Enums
export type UserRole = Role;
export type SystemRole = Sysrole;

// Activity Categories
export type ActivityCategory = Selectable<DB['activity_categories']>;
export type NewActivityCategory = Insertable<DB['activity_categories']>;
export type ActivityCategoryUpdate = Updateable<DB['activity_categories']>;

// Login Attempts
export type LoginAttempt = Selectable<DB['login_attempts']>;
export type NewLoginAttempt = Insertable<DB['login_attempts']>;
export type LoginAttemptUpdate = Updateable<DB['login_attempts']>;

// Members
export type Member = Selectable<DB['members']>;
export type NewMember = Insertable<DB['members']>;
export type MemberUpdate = Updateable<DB['members']>;

// Tenants
export type Tenant = Selectable<DB['tenants']>;
export type NewTenant = Insertable<DB['tenants']>;
export type TenantUpdate = Updateable<DB['tenants']>;

// Sessions
export type Session = Selectable<DB['sessions']>;
export type NewSession = Insertable<DB['sessions']>;
export type SessionUpdate = Updateable<DB['sessions']>;

// Users
export type User = Selectable<DB['users']>;
export type NewUser = Insertable<DB['users']>;
export type UserUpdate = Updateable<DB['users']>;
