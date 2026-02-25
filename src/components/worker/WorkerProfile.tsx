interface WorkerProfileProps {
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  email: string;
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-[#6b7280] text-xs uppercase tracking-widest px-4 mb-1">{title}</p>
      <div className="rounded-2xl bg-[#252525] overflow-hidden">{children}</div>
    </div>
  );
}

function SettingsRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#333333] last:border-0">
      <span className="text-white text-sm">{label}</span>
      {value && <span className="text-[#9ca3af] text-sm">{value}</span>}
      <span className="text-[#6b7280] text-lg">›</span>
    </div>
  );
}

export default function WorkerProfile({
  username,
  displayName,
  avatarUrl,
  email,
}: WorkerProfileProps) {
  const name = displayName ?? username;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#1a1a1a] pt-12 px-4">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            className="w-20 h-20 rounded-full object-cover mb-3"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#C4622D] flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
        )}
        <h2 className="text-xl font-bold text-white">{name}</h2>
        <p className="text-[#9ca3af] text-sm">@{username}</p>
      </div>

      {/* Stats card */}
      <div className="rounded-2xl bg-[#252525] grid grid-cols-2 divide-x divide-[#333333] mb-6">
        <div className="p-4 text-center">
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-[#9ca3af] text-xs mt-1">Total Entries</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-[#9ca3af] text-xs mt-1">Hours Logged</p>
        </div>
      </div>

      {/* Settings */}
      <SettingsSection title="Account">
        <SettingsRow label="Email" value={email} />
        <SettingsRow label="Username" value={`@${username}`} />
      </SettingsSection>

      <SettingsSection title="Preferences">
        <SettingsRow label="Notifications" />
        <SettingsRow label="Language" value="English" />
      </SettingsSection>

      <SettingsSection title="Privacy & Consent">
        <SettingsRow label="Data Sharing" />
        <SettingsRow label="Privacy Policy" />
      </SettingsSection>

      <SettingsSection title="About">
        <SettingsRow label="ʻĀina Kilo" value="v0.1.0" />
        <SettingsRow label="Terms of Service" />
      </SettingsSection>

      <p className="text-center text-[#4b5563] text-xs py-6">ʻĀina Kilo · v0.1.0</p>
    </div>
  );
}
