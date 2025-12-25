import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Activity, StickyNote, CheckCircle2, Cpu, Wifi } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { devices, notes, checklists, user } = useStore();
  
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  const completedTasks = checklists.flatMap(c => c.tasks).filter(t => t.completed).length;
  const totalTasks = checklists.flatMap(c => c.tasks).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Welcome back, {user?.username}. System metrics nominal.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/devices">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Server className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Total Devices</CardTitle>
            <Server className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{devices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-medium">{onlineDevices} Online</span> • <span className="text-red-500 font-medium">{offlineDevices} Offline</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Lab Notes</CardTitle>
            <StickyNote className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{notes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Knowledge base entries
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Tasks Pending</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalTasks - completedTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((completedTasks / (totalTasks || 1)) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-muted-foreground">System Status</CardTitle>
            <Cpu className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">HEALTHY</div>
            <p className="text-xs text-muted-foreground mt-1">
              Environment stable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Devices */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card/40">
          <CardHeader>
            <CardTitle className="font-mono text-lg">Infrastructure Overview</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {devices.slice(0, 5).map(device => (
                  <div key={device.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${device.status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {device.type === 'router' ? <Wifi size={16} /> : <Server size={16} />}
                      </div>
                      <div>
                        <p className="font-medium text-sm group-hover:text-primary transition-colors">{device.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{device.ip}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                        device.status === 'online' 
                        ? 'bg-green-500/5 text-green-500 border-green-500/20' 
                        : 'bg-red-500/5 text-red-500 border-red-500/20'
                      }`}>
                        {device.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
                {devices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No devices registered. Start by adding your hardware.
                  </div>
                )}
             </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-card/40">
          <CardHeader>
            <CardTitle className="font-mono text-lg">Recent Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notes.slice(0, 5).map(note => (
                <div key={note.id} className="p-3 border border-border/50 rounded-lg hover:border-secondary/50 transition-all cursor-pointer">
                  <h4 className="font-medium text-sm truncate">{note.title}</h4>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {note.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-secondary/10 text-secondary rounded border border-secondary/20 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
               {notes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No notes found. Document your experiments.
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}