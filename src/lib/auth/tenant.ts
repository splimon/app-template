import { db } from "@/db/kysely/client";
import { Errors } from "@/lib/errors";
import type { Member } from "@/types/db";

export async function assertTenantAccess(userId: string, tenantId: string): Promise<Member> {
  const membership = await db
    .selectFrom("members")
    .selectAll()
    .where("user_id", "=", userId)
    .where("tenant_id", "=", tenantId)
    .executeTakeFirst();

  if (!membership) {
    throw Errors.TENANT_ACCESS_DENIED;
  }

  return membership as Member;
}

export async function getTenantBySlug(slug: string) {
  return db
    .selectFrom("tenants")
    .selectAll()
    .where("slug", "=", slug)
    .executeTakeFirst();
}
