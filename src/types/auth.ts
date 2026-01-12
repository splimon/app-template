import { User } from "./db";

export type SessionType = 'admin' | 'user';
export interface AuthUser extends Omit<User, 'password_hash'> {
    type: SessionType
}


// Admin can manage multiple orgs
// export interface Admin extends User {
//     orgs: Organization[]; // list of orgs the admin manages
// }

// // Regular user tied to a specific organization (member or a guest)
// export interface Member extends Omit<Users, 'password_hash' | 'system_role' | 'created_at'> {
//     org_id: string;
//     role: UserRole;
// }

// // Organization with its members
// export interface Organization extends Omit<Orgs, 'created_at'> {
//     members: Member[];
// };
