import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SettingsPage() {
  const { exportData, importData, devices, notes, checklists } = useStore();
  const [importJson, setImportJson] = useState("");
  
  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homelab-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Backup Downloaded", description: "Your data has been exported successfully." });
  };

  const handleImport = () => {
    if (!importJson) return;
    const success = importData(importJson);
    if (success) {
      toast({ title: "Import Successful", description: "Your data has been restored." });
      setImportJson("");
    } else {
      toast({ title: "Import Failed", description: "Invalid JSON format.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold font-mono tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm">System configuration and data management</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download a backup of your devices, notes, and checklists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md font-mono text-xs mb-4">
              <p>Current Stats:</p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground">
                <li>{devices.length} Devices</li>
                <li>{notes.length} Notes</li>
                <li>{checklists.length} Checklists</li>
              </ul>
            </div>
            <Button onClick={handleExport} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Download JSON Backup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-orange-500" />
              Import Data
            </CardTitle>
            <CardDescription>
              Restore from a previous backup. 
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Importing data will overwrite your current library. This action cannot be undone.
              </AlertDescription>
            </Alert>
            
            <Textarea 
              placeholder="Paste JSON backup here..." 
              className="font-mono text-xs h-32"
              value={importJson}
              onChange={e => setImportJson(e.target.value)}
            />
            
            <Button onClick={handleImport} variant="outline" className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 hover:text-orange-500">
              Restore Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}