import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col ml-64 transition-all duration-300">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
