import type { ReactNode } from 'react';

/** Re-mounts on every navigation, giving a subtle fade between routes */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}
