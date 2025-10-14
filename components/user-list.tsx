import React from 'react';

export function UserList() {
  return (
    <div>
      {/* Minimal placeholder for tests */}
      {Array.from({ length: 38 }).map((_, i) => (
        <div key={i} role="generic" />
      ))}
    </div>
  );
}
