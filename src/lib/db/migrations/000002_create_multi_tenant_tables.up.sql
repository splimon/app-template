

CREATE TABLE IF NOT EXISTS orgs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles within an organization, can be expanded to include more roles as needed
CREATE TYPE role AS ENUM (
    'org_admin', -- can manage org settings and members
    'member',    -- regular member with standard permissions
    'guest'      -- limited access, read-only
);
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,
    member_role role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

