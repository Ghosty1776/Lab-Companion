import { useState } from "react";
import { useStore, Device, DeviceType } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Server, Laptop, Router, Cpu, Globe, Monitor, MoreVertical, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

const DeviceIcon = ({ type }: { type: DeviceType }) => {
  switch (type) {
    case 'server': return <Server className="h-5 w-5" />;
    case 'desktop': return <Monitor className="h-5 w-5" />;
    case 'laptop': return <Laptop className="h-5 w-5" />;
    case 'router': return <Router className="h-5 w-5" />;
    case 'switch': return <Activity className="h-5 w-5" />;
    case 'iot': return <Cpu className="h-5 w-5" />;
    default: return <Globe className="h-5 w-5" />;
  }
};

import { Activity } from "lucide-react";

export default function DevicesPage() {
  const { devices, addDevice, deleteDevice, updateDevice } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.ip.includes(searchTerm) || 
                          d.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || d.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const { register, handleSubmit, reset } = useForm<Omit<Device, 'id' | 'lastSeen'>>();

  const onSubmit = (data: any) => {
    addDevice({
      ...data,
      tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [],
      status: 'offline' // Default
    });
    toast({ title: "Device Added", description: `${data.name} has been registered.` });
    setIsAddOpen(false);
    reset();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this device?")) {
      deleteDevice(id);
      toast({ title: "Device Deleted", variant: "destructive" });
    }
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'online' ? 'offline' : 'online';
    updateDevice(id, { status: newStatus as any });
    toast({ title: "Status Updated", description: `Device marked as ${newStatus}` });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-mono tracking-tight">Devices</h2>
          <p className="text-muted-foreground text-sm">Manage your homelab infrastructure</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add Device
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hostname</Label>
                  <Input id="name" {...register("name", { required: true })} className="font-mono" placeholder="pve-01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select {...register("type")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                    <option value="server">Server</option>
                    <option value="router">Router</option>
                    <option value="switch">Switch</option>
                    <option value="desktop">Desktop</option>
                    <option value="laptop">Laptop</option>
                    <option value="iot">IoT</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ip">IP Address</Label>
                  <Input id="ip" {...register("ip")} className="font-mono" placeholder="192.168.1.X" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mac">MAC Address</Label>
                  <Input id="mac" {...register("mac")} className="font-mono" placeholder="00:00:00..." />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="os">OS / Firmware</Label>
                <Input id="os" {...register("os")} placeholder="Ubuntu 22.04 LTS" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Physical Location</Label>
                <Input id="location" {...register("location")} placeholder="Rack U1 / Living Room" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" {...register("tags")} placeholder="prod, vlan10, dns" />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Register Device</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card/30 p-4 rounded-lg border border-border/50">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, IP, or tag..." 
            className="pl-9 bg-background/50 border-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="server">Server</SelectItem>
            <SelectItem value="router">Router</SelectItem>
            <SelectItem value="switch">Switch</SelectItem>
            <SelectItem value="iot">IoT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredDevices.map((device) => (
          <Card key={device.id} className="group border-border/50 bg-card hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
            {/* Status indicator strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'} transition-colors`}></div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${device.status === 'online' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                  <DeviceIcon type={device.type} />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">{device.name}</CardTitle>
                  <CardDescription className="text-xs font-mono">{device.type.toUpperCase()}</CardDescription>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toggleStatus(device.id, device.status)}>
                    Toggle Status ({device.status === 'online' ? 'Go Offline' : 'Go Online'})
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(device.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="pl-6 pt-2">
              <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider opacity-70">IP Address</span>
                  <span className="font-mono text-foreground">{device.ip}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider opacity-70">OS</span>
                  <span className="truncate">{device.os}</span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-[10px] uppercase tracking-wider opacity-70">Location</span>
                  <span>{device.location}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mt-2">
                {device.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="font-mono text-[10px] px-1.5 py-0 h-5 font-normal border-secondary/20 bg-secondary/10 text-secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredDevices.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-card/20">
          <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-muted-foreground">No devices found</h3>
          <p className="text-sm text-muted-foreground/60 mt-1">Adjust your filters or add a new device.</p>
        </div>
      )}
    </div>
  );
}