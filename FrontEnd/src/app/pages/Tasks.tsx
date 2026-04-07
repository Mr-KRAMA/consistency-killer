import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, Clock, AlertCircle, Check, X, RefreshCw, Repeat } from 'lucide-react';
import api from '../api';

interface Task {
  _id: string;
  title: string;
  category: string;
  plannedTime: number;
  actualTime: number;
  completed: boolean;
  isRecurring: boolean;
  recurringId?: string;
}

interface RecurringTask {
  _id: string;
  title: string;
  category: string;
  plannedTime: number;
}

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recurring, setRecurring] = useState<RecurringTask[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'Work', plannedTime: 1, isRecurring: false });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'recurring'>('today');

  const today = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    const [t, r] = await Promise.all([
      api.get(`/tasks?date=${today}`),
      api.get('/tasks/recurring'),
    ]);
    setTasks(t.data.tasks);
    setRecurring(r.data.recurring);
  };

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, []);

  const toggleTask = async (task: Task) => {
    const res = await api.put(`/tasks/${task._id}`, { completed: !task.completed });
    setTasks(tasks.map((t) => (t._id === task._id ? res.data.task : t)));
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/tasks', { ...newTask, date: today });
    setTasks([res.data.task, ...tasks]);
    if (newTask.isRecurring) {
      // Refresh recurring list
      const r = await api.get('/tasks/recurring');
      setRecurring(r.data.recurring);
    }
    setNewTask({ title: '', category: 'Work', plannedTime: 1, isRecurring: false });
    setShowAddForm(false);
  };

  // Delete task — if recurring, also removes the template (stops future daily seeding)
  const deleteTask = async (task: Task) => {
    await api.delete(`/tasks/${task._id}`);
    setTasks(tasks.filter((t) => t._id !== task._id));
    if (task.recurringId) {
      setRecurring(recurring.filter((r) => r._id !== task.recurringId));
    }
  };

  // Delete only the recurring template — keeps today's task, stops future seeding
  const deleteRecurringTemplate = async (id: string) => {
    await api.delete(`/tasks/recurring/${id}`);
    setRecurring(recurring.filter((r) => r._id !== id));
    // Update tasks to reflect they're no longer recurring
    setTasks(tasks.map((t) => t.recurringId === id ? { ...t, isRecurring: false, recurringId: undefined } : t));
  };

  const dailyTasks = tasks.filter((t) => !t.isRecurring);
  const recurringTasks = tasks.filter((t) => t.isRecurring);
  const completedCount = tasks.filter((t) => t.completed).length;
  const incompleteCount = tasks.length - completedCount;

  const TaskRow = ({ task }: { task: Task }) => (
    <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${task.completed ? 'border-success/20 bg-success/5' : 'border-destructive/50 bg-destructive/5'}`}>
      <button
        onClick={() => toggleTask(task)}
        className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${task.completed ? 'bg-success border-success' : 'border-muted-foreground hover:border-foreground'}`}
      >
        {task.completed && <Check className="w-4 h-4 text-white" />}
      </button>

      <div className="flex-1">
        <div className={`font-medium mb-1 flex items-center gap-2 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
          {task.title}
          {task.isRecurring && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
              <Repeat className="w-3 h-3" /> Daily
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="px-2 py-0.5 bg-secondary rounded text-xs">{task.category}</span>
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{task.actualTime}h / {task.plannedTime}h</span></div>
          {!task.completed && <div className="flex items-center gap-1 text-destructive"><AlertCircle className="w-4 h-4" /><span>Incomplete</span></div>}
        </div>
      </div>

      <button onClick={() => deleteTask(task)} className="p-2 hover:bg-destructive/20 rounded-lg transition-colors" title={task.isRecurring ? 'Delete task & stop daily repeat' : 'Delete task'}>
        <X className="w-5 h-5 text-destructive" />
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="pt-16 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Task Management</h1>
                <p className="text-muted-foreground">{completedCount} completed, {incompleteCount} incomplete</p>
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="w-5 h-5 mr-2" />Add Task
              </Button>
            </div>

            {showAddForm && (
              <Card className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
                <form onSubmit={addTask} className="space-y-4">
                  <Input label="Task Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Enter task title" required />
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1.5">Category</label>
                    <select value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })} className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="Work">Work</option>
                      <option value="Learning">Learning</option>
                      <option value="Health">Health</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                  <Input label="Planned Time (hours)" type="number" step="0.5" min="0.5" value={newTask.plannedTime} onChange={(e) => setNewTask({ ...newTask, plannedTime: parseFloat(e.target.value) })} required />

                  {/* Recurring toggle */}
                  <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Repeat className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="font-medium text-sm">Repeat Daily</div>
                        <div className="text-xs text-muted-foreground">This task will appear every day automatically</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewTask({ ...newTask, isRecurring: !newTask.isRecurring })}
                      className={`relative w-14 h-8 rounded-full transition-colors ${newTask.isRecurring ? 'bg-blue-500' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${newTask.isRecurring ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit">Add Task</Button>
                    <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('today')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${activeTab === 'today' ? 'bg-white text-black' : 'bg-secondary text-white'}`}
              >
                Today's Tasks ({tasks.length})
              </button>
              <button
                onClick={() => setActiveTab('recurring')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${activeTab === 'recurring' ? 'bg-blue-500 text-white' : 'bg-secondary text-white'}`}
              >
                <Repeat className="w-4 h-4" /> Daily Tasks ({recurring.length})
              </button>
            </div>

            {activeTab === 'today' && (
              <Card>
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading...</div>
                ) : (
                  <div className="space-y-3">
                    {/* Recurring tasks section */}
                    {recurringTasks.length > 0 && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-blue-400 mb-2">
                          <RefreshCw className="w-4 h-4" />
                          <span>Daily recurring tasks</span>
                        </div>
                        {recurringTasks.map((task) => <TaskRow key={task._id} task={task} />)}
                        {dailyTasks.length > 0 && <div className="border-t border-border my-4" />}
                      </>
                    )}

                    {/* One-off tasks */}
                    {dailyTasks.map((task) => <TaskRow key={task._id} task={task} />)}

                    {tasks.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        No tasks yet. Add your first task to start tracking.
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'recurring' && (
              <Card>
                <div className="flex items-center gap-2 mb-6">
                  <Repeat className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold">Daily Task Templates</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  These tasks automatically appear every day. Delete a template to stop it from repeating.
                </p>
                {recurring.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No daily tasks set. Add a task and toggle "Repeat Daily" to create one.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recurring.map((rt) => (
                      <div key={rt._id} className="flex items-center gap-4 p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Repeat className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium mb-1">{rt.title}</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="px-2 py-0.5 bg-secondary rounded text-xs">{rt.category}</span>
                            <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{rt.plannedTime}h planned</span></div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteRecurringTemplate(rt._id)}
                          className="p-2 hover:bg-destructive/20 rounded-lg transition-colors"
                          title="Stop daily repeat"
                        >
                          <X className="w-5 h-5 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
