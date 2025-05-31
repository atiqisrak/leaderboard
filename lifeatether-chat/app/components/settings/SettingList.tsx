import React from 'react';

const settings = [
  { label: 'Enable Notifications', type: 'toggle', key: 'notifications' },
  { label: 'Dark Mode', type: 'toggle', key: 'darkmode' },
  { label: 'Account', type: 'link', href: '/settings/account' },
  { label: 'Privacy Policy', type: 'link', href: '/settings/privacy' },
];

export default function SettingList() {
  return (
    <div className="space-y-4">
      {settings.map(setting => (
        <div key={setting.key || setting.href} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
          <span className="text-gray-900 dark:text-gray-100">{setting.label}</span>
          {setting.type === 'toggle' ? (
            <input type="checkbox" className="form-checkbox h-5 w-5 text-primary" />
          ) : (
            <a href={setting.href} className="text-primary font-medium hover:underline">&gt;</a>
          )}
        </div>
      ))}
    </div>
  );
}
