import { useState } from "react";
import { useStore, Checklist, Task } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, CheckSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ChecklistsPage() {
  const { checklists, addChecklist, updateChecklist, deleteChecklist } = useStore();
  const [newChecklistOpen, setNewChecklistOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const toggleTask = (checklistId: string, taskId: string, current: boolean) => {
    const checklist = checklists.find(c => c.id === checklistId);
    if (!checklist) return;

    const newTasks = checklist.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !current } : t
    );
    
    updateChecklist(checklistId, { tasks: newTasks });
  };

  const addTask = (checklistId: string) => {
    const text = prompt("Enter task description:");
    if (!text) return;

    const checklist = checklists.find(c => c.id === checklistId);
    if (!checklist) return;

    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      text,
      completed: false
    };

    updateChecklist(checklistId, { tasks: [...checklist.tasks, newTask] });
  };

  const deleteTask = (checklistId: string, taskId: string) => {
    const checklist = checklists.find(c => c.id === checklistId);
    if (!checklist) return;
    updateChecklist(checklistId, { tasks: checklist.tasks.filter(t => t.id !== taskId) });
  };

  const createChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    addChecklist({
      title: newTitle,
      description: newDesc,
      category: 'General',
      tasks: []
    });
    setNewTitle("");
    setNewDesc("");
    setNewChecklistOpen(false);
    toast({ title: "Checklist Created" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-mono tracking-tight">Checklists</h2>
          <p className="text-muted-foreground text-sm">Standard Operating Procedures</p>
        </div>
        
        <Dialog open={newChecklistOpen} onOpenChange={setNewChecklistOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> New List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Checklist</DialogTitle>
            </DialogHeader>
            <form onSubmit={createChecklist} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="e.g. Router Hardening" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Short description..." />
              </div>
              <Button type="submit" className="w-full">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {checklists.map(list => {
          const completedCount = list.tasks.filter(t => t.completed).length;
          const totalCount = list.tasks.length;
          const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
          
          return (
            <Card key={list.id} className="flex flex-col border-border/50 bg-card/50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{list.title}</CardTitle>
                    <CardDescription className="font-mono text-xs mt-1">{list.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => deleteChecklist(list.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={progress} className="h-2" />
                  <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">{completedCount} / {totalCount}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {list.tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 group">
                    <Checkbox 
                      id={task.id} 
                      checked={task.completed} 
                      onCheckedChange={() => toggleTask(list.id, task.id, task.completed)}
                      className="border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label 
                      htmlFor={task.id} 
                      className={`text-sm flex-1 cursor-pointer transition-colors ${task.completed ? 'text-muted-foreground line-through decoration-muted-foreground/50' : 'text-foreground'}`}
                    >
                      {task.text}
                    </label>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                      onClick={() => deleteTask(list.id, task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" className="w-full mt-2 text-muted-foreground hover:text-primary text-xs border border-dashed border-border hover:border-primary/50 h-8" onClick={() => addTask(list.id)}>
                  <Plus className="mr-2 h-3 w-3" /> Add Task
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {checklists.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-card/20">
          <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-muted-foreground">No checklists created</h3>
        </div>
      )}
    </div>
  );
}