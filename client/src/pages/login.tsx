import { useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useStore(state => state.login);
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length > 0 && password.length > 0) {
      // Mock auth - accept any password for prototype
      login(username);
      toast({
        title: "Access Granted",
        description: `Welcome back, ${username}. System ready.`,
        variant: "default",
        className: "border-primary text-primary bg-background"
      });
      setLocation("/");
    } else {
      toast({
        title: "Access Denied",
        description: "Please provide credentials.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,23,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,23,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm z-10 shadow-2xl relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-primary/20 rounded-full blur-3xl"></div>
        
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(0,255,157,0.1)]">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-mono tracking-tight text-foreground">HOME LAB COMPANION</CardTitle>
            <CardDescription className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
              Secure Login // Authorization Required
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 font-mono bg-background/50 border-input focus:border-primary focus:ring-primary/20 transition-all"
                  data-testid="input-username"
                />
                <Shield className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 font-mono bg-background/50 border-input focus:border-primary focus:ring-primary/20 transition-all"
                  data-testid="input-password"
                />
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-wide" data-testid="button-login">
              AUTHENTICATE
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-muted-foreground font-mono">
            <p>System Status: <span className="text-primary">ONLINE</span></p>
            <p>Encryption: <span className="text-primary">ACTIVE</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}