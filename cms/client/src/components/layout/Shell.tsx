import { ReactNode } from 'react';

interface ShellProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function Shell({ title, actions, children }: ShellProps) {
  return (
    <>
      <header className="cms-header">
        <h1>{title}</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>{actions}</div>
      </header>
      <div className="cms-content">{children}</div>
    </>
  );
}
