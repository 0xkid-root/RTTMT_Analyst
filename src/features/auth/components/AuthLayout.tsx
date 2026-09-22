import { AuthLogo } from './AuthLogo';
import { AuthSecurityNote } from './AuthSecurityNote';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Branding / Security Panel (Left on Desktop, Top on Mobile) */}
      <div className="w-full md:w-[45%] lg:w-[40%] bg-sidebar border-b md:border-b-0 md:border-r border-border p-6 md:p-12 flex flex-col justify-between">
        <div>
          <AuthLogo className="mb-8" />
          <div className="hidden md:block max-w-sm space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Real-Time Monitoring & Threat Intelligence
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Enterprise-grade financial risk monitoring, fraud detection, and alerting for analysts and security teams.
            </p>
          </div>
        </div>
        
        <div className="hidden md:block">
          <AuthSecurityNote />
        </div>
      </div>

      {/* Form Area (Right on Desktop, Bottom on Mobile) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-y-auto">
        <div className="w-full max-w-[440px] space-y-8">
          {children}
        </div>
        <div className="mt-8 md:hidden w-full max-w-[440px]">
           <AuthSecurityNote />
        </div>
      </div>
    </div>
  );
}
