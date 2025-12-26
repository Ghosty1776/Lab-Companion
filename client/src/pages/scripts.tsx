import { useState } from "react";
import { useStore, Script, ScriptType } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Terminal, Trash2, Calendar, Edit2, Save, Copy, Check } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function ScriptsPage() {
  const { scripts, addScript, updateScript, deleteScript } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Edit State
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editLang, setEditLang] = useState<ScriptType>("bash");
  const [editTags, setEditTags] = useState("");

  const filteredScripts = scripts.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const startEdit = (script: Script) => {
    setEditingId(script.id);
    setEditName(script.name);
    setEditDesc(script.description);
    setEditContent(script.content);
    setEditLang(script.language);
    setEditTags(script.tags.join(', '));
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingId("new");
    setEditName("");
    setEditDesc("");
    setEditContent("#!/bin/bash\n\n# Your script here");
    setEditLang("bash");
    setEditTags("");
    setIsCreating(true);
  };

  const saveScript = () => {
    const tags = editTags.split(',').map(t => t.trim()).filter(Boolean);
    
    if (isCreating) {
      addScript({
        name: editName || "Untitled Script",
        description: editDesc,
        language: editLang,
        content: editContent,
        tags
      });
      toast({ title: "Script Created" });
    } else if (editingId) {
      updateScript(editingId, {
        name: editName,
        description: editDesc,
        language: editLang,
        content: editContent,
        tags
      });
      toast({ title: "Script Updated" });
    }
    setEditingId(null);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied to Clipboard" });
  };

  const getLangColor = (lang: string) => {
    switch(lang) {
      case 'bash': return 'text-green-500';
      case 'python': return 'text-yellow-500';
      case 'powershell': return 'text-blue-500';
      case 'javascript': return 'text-yellow-300';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-mono tracking-tight">Scripts</h2>
          <p className="text-muted-foreground text-sm">Automation & Snippets</p>
        </div>
        {!editingId && (
          <Button onClick={startCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> New Script
          </Button>
        )}
      </div>

      {editingId ? (
        <Card className="flex-1 flex flex-col border-primary/50 shadow-2xl">
          <CardHeader className="space-y-4">
            <div className="flex gap-4">
              <Input 
                value={editName} 
                onChange={e => setEditName(e.target.value)} 
                placeholder="Script Name" 
                className="text-xl font-bold font-mono flex-1"
              />
              <Select value={editLang} onValueChange={(v) => setEditLang(v as ScriptType)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bash">Bash</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="powershell">PowerShell</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input 
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              placeholder="Description..."
              className="text-sm text-muted-foreground"
            />
            <Input 
              value={editTags}
              onChange={e => setEditTags(e.target.value)}
              placeholder="Tags (comma separated)..."
              className="text-sm font-mono text-muted-foreground"
            />
          </CardHeader>
          <CardContent className="flex-1 p-0 relative group">
            <div className="absolute top-2 right-2 opacity-50 text-xs font-mono bg-background/50 px-2 py-1 rounded pointer-events-none">
              EDITOR MODE
            </div>
            <Textarea 
              value={editContent} 
              onChange={e => setEditContent(e.target.value)} 
              placeholder="# Script content here..." 
              className="w-full h-full min-h-[50vh] resize-none border-none focus-visible:ring-0 p-6 font-mono text-sm leading-relaxed bg-black/20 text-green-400"
              spellCheck={false}
            />
          </CardContent>
          <CardFooter className="justify-end gap-2 border-t border-border p-4 bg-muted/20">
            <Button variant="ghost" onClick={cancelEdit}>Cancel</Button>
            <Button onClick={saveScript} className="bg-primary text-primary-foreground">
              <Save className="mr-2 h-4 w-4" /> Save Script
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search scripts..." 
              className="pl-9 bg-card/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredScripts.map(script => (
              <Card key={script.id} className="group hover:border-primary/50 transition-all cursor-pointer flex flex-col" onClick={() => startEdit(script)}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <Terminal className={`h-5 w-5 ${getLangColor(script.language)}`} />
                      <div>
                        <CardTitle className="text-base font-mono">{script.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{script.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(script.content); }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); deleteScript(script.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-2">
                  <div className="bg-black/40 rounded-md p-3 font-mono text-xs text-muted-foreground overflow-hidden h-24 relative">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 pointer-events-none" />
                     <pre className="whitespace-pre-wrap break-words">{script.content}</pre>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-4 flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {script.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                        #{tag}
                      </span>
                    ))}
                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-muted-foreground/20 text-muted-foreground font-mono uppercase">
                      {script.language}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(script.updatedAt), 'MMM dd')}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredScripts.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-card/20">
              <Terminal className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground">No scripts found</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}