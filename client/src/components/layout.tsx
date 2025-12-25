import { Link, useLocation } from "wouter";
import { LayoutDashboard, Server, StickyNote, CheckSquare, Settings, LogOut, Shield, Menu } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const logout = useStore(state => state.logout);
  const user = useStore(state => state.user);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user) {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/devices", icon: Server, label: "Devices" },
    { href: "/notes", icon: StickyNote, label: "Lab Notes" },
    { href: "/checklists", icon: CheckSquare, label: "Checklists" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary animate-pulse">
          <Shield size={18} />
        </div>
        <div>
          <h1 className="font-mono font-bold text-lg tracking-tight text-sidebar-primary">HomeLab</h1>
          <p className="text-xs text-muted-foreground">Companion v1.0</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
              <a className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group ${
                isActive 
                  ? "bg-sidebar-accent text-sidebar-primary border-l-2 border-sidebar-primary" 
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}>
                <item.icon size={18} className={isActive ? "text-sidebar-primary" : "group-hover:text-sidebar-foreground"} />
                <span className="font-medium text-sm">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="bg-sidebar-accent/30 p-3 rounded-md mb-3">
          <p className="text-xs text-muted-foreground font-mono">Logged in as:</p>
          <p className="text-sm font-semibold text-sidebar-foreground truncate">{user.username}</p>
        </div>
        <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20" onClick={logout}>
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/95 backdrop-blur z-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
            <Shield size={18} />
          </div>
          <span className="font-mono font-bold text-lg">HomeLab</span>
        </div>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-sidebar border-r border-sidebar-border w-64">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col fixed h-full z-10 hidden md:flex">
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}