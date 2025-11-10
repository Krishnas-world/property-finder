import { ReactNode } from 'react';

export default function RoutesLayout({ children }: { children: ReactNode }) {
  return (
    <main className="">
      {children}
    </main>
  );
}



