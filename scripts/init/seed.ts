import { db } from "@/src/lib/db/kysely/client";
import { randomUUID } from "crypto";
import type { Insertable } from "kysely";
import type { Orgs, Users, Members, Role } from "@/src/lib/db/types";

const orgID = randomUUID() as string;
const guestID = randomUUID() as string;
const memberID = randomUUID() as string;
const orgAdminID = randomUUID() as string;

const TEST_ACCOUNTS: Insertable<Users>[] = [
    {
        id: guestID,
        username: "John Doe",
        email: "john.doe@example.com",
        password_hash: "password123",
    },
    {
        id: memberID,
        username: "Jane Smith",
        email: "jane.smith@example.com",
        password_hash: "password123",
    },
    {
        id: orgAdminID,
        username: "Alice Johnson",
        email: "alice.johnson@example.com",
        password_hash: "password123",
    }
];

const TEST_ORG: Insertable<Orgs> = {
    id: orgID,
    name: "Test Organization",
    slug: "test",
};

const MEMBERS: Insertable<Members>[] = [
    {
        id: randomUUID() as string,
        user_id: memberID,
        org_id: orgID,
        member_role: "member" as Role,
    },
    {
        id: randomUUID() as string,
        user_id: orgAdminID,
        org_id: orgID,
        member_role: "org_admin" as Role,
    }
];

async function seed() {
    const introspector = db.introspection;
    const tables = await introspector.getTables();
    const tableNames = tables.map(table => table.name);

    // Check if database has users table
    if (!tableNames.includes("users")) {
        console.error("Database does not have 'users' table. Please run migrations before seeding data.");
        return;
    } else {
        // Insert test accounts
        await db.insertInto("users").values(TEST_ACCOUNTS).execute();
    }
    
    // Check if database has org & members table (dev can say no need)
    if (!tableNames.includes("orgs") || !tableNames.includes("members")) {
        console.warn("Database does not have 'orgs' or 'members' table. Skipping seeding this data.");
    } else {
        console.log("Seeding test organization and members...");
        
        // Insert test organization
        await db.insertInto("orgs").values(TEST_ORG).execute();

        // Insert members
        await db.insertInto("members").values(MEMBERS).execute();
    }

    console.log("Test data seeded...");
}

seed().catch((error) => {
    console.error("Error seeding test data:", error);
}).finally(async () => {
    await db.destroy();
});
