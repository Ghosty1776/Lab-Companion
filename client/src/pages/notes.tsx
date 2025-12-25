import { useState } from "react";
import { useStore, Note } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Tag, Trash2, Calendar, Edit2, Save, StickyNote } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Edit State
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingId("new");
    setEditTitle("");
    setEditContent("");
    setEditTags("");
    setIsCreating(true);
  };

  const saveNote = () => {
    const tags = editTags.split(',').map(t => t.trim()).filter(Boolean);
    
    if (isCreating) {
      addNote({
        title: editTitle || "Untitled Note",
        content: editContent,
        tags
      });
      toast({ title: "Note Created" });
    } else if (editingId) {
      updateNote(editingId, {
        title: editTitle,
        content: editContent,
        tags
      });
      toast({ title: "Note Updated" });
    }
    setEditingId(null);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-mono tracking-tight">Lab Notes</h2>
          <p className="text-muted-foreground text-sm">Documentation & Experiments</p>
        </div>
        {!editingId && (
          <Button onClick={startCreate} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Plus className="mr-2 h-4 w-4" /> New Note
          </Button>
        )}
      </div>

      {editingId ? (
        <Card className="flex-1 flex flex-col border-primary/50 shadow-2xl">
          <CardHeader>
            <Input 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)} 
              placeholder="Note Title" 
              className="text-xl font-bold font-mono border-none focus-visible:ring-0 px-0 h-auto"
            />
            <Input 
              value={editTags}
              onChange={e => setEditTags(e.target.value)}
              placeholder="Tags (comma separated)..."
              className="text-sm font-mono text-muted-foreground border-none focus-visible:ring-0 px-0 h-auto"
            />
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <Textarea 
              value={editContent} 
              onChange={e => setEditContent(e.target.value)} 
              placeholder="Write your note here using Markdown..." 
              className="w-full h-[60vh] resize-none border-none focus-visible:ring-0 p-6 font-mono text-sm leading-relaxed"
            />
          </CardContent>
          <CardFooter className="justify-end gap-2 border-t border-border p-4 bg-muted/20">
            <Button variant="ghost" onClick={cancelEdit}>Cancel</Button>
            <Button onClick={saveNote} className="bg-primary text-primary-foreground">
              <Save className="mr-2 h-4 w-4" /> Save Note
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
              className="pl-9 bg-card/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map(note => (
              <Card key={note.id} className="group hover:border-secondary/50 transition-all cursor-pointer flex flex-col" onClick={() => startEdit(note)}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight group-hover:text-secondary transition-colors">{note.title}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1"
                      onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(note.updatedAt), 'MMM dd, yyyy')}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-4 font-mono leading-relaxed opacity-80">
                    {note.content}
                  </p>
                </CardContent>
                <CardFooter className="pt-2 pb-4">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredNotes.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-card/20">
              <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground">No notes found</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}