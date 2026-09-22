export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-lg shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign in to RTMT</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access the platform</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input type="email" className="w-full h-10 px-3 rounded-md border border-input bg-background" placeholder="analyst@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input type="password" className="w-full h-10 px-3 rounded-md border border-input bg-background" placeholder="••••••••" />
          </div>
          <button className="w-full h-10 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
