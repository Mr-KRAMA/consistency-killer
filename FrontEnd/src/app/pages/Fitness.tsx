import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dumbbell, Flame, TrendingUp, Plus, Target, Clock, Check, X } from 'lucide-react';
import api from '../api';

interface Workout {
  _id: string;
  exercise: string;
  category: string;
  duration: number;
  calories: number;
  completed: boolean;
}

export function Fitness() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [weeklyCalories, setWeeklyCalories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ exercise: '', category: 'Cardio', duration: 30, calories: 200 });
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    Promise.all([
      api.get(`/fitness?date=${today}`),
      api.get('/fitness/weekly'),
    ]).then(([w, wk]) => {
      setWorkouts(w.data.workouts);
      setWeeklyCalories(wk.data.weekly);
    }).finally(() => setLoading(false));
  }, []);

  const toggleWorkout = async (workout: Workout) => {
    const res = await api.put(`/fitness/${workout._id}`, { completed: !workout.completed });
    setWorkouts(workouts.map((w) => (w._id === workout._id ? res.data.workout : w)));
  };

  const addWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/fitness', { ...newWorkout, date: today });
    setWorkouts([res.data.workout, ...workouts]);
    setNewWorkout({ exercise: '', category: 'Cardio', duration: 30, calories: 200 });
    setShowAddForm(false);
  };

  const deleteWorkout = async (id: string) => {
    await api.delete(`/fitness/${id}`);
    setWorkouts(workouts.filter((w) => w._id !== id));
  };

  const totalCalories = workouts.filter((w) => w.completed).reduce((s, w) => s + w.calories, 0);
  const totalDuration = workouts.filter((w) => w.completed).reduce((s, w) => s + w.duration, 0);
  const targetCalories = 500;
  const completionRate = workouts.length > 0 ? Math.round((workouts.filter((w) => w.completed).length / workouts.length) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="pt-16 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Fitness Tracker</h1>
                <p className="text-muted-foreground">Monitor your physical activity and performance</p>
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)}><Plus className="w-5 h-5 mr-2" />Log Workout</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success/20 to-transparent rounded-full -mr-16 -mt-16" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-success/20 rounded-lg"><Flame className="w-5 h-5 text-success" /></div>
                    <span className="text-sm text-muted-foreground">Calories Burned</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{totalCalories}</div>
                  <div className="text-sm text-muted-foreground">Target: {targetCalories} cal</div>
                  {totalCalories >= targetCalories
                    ? <div className="mt-2 text-xs text-success flex items-center gap-1"><TrendingUp className="w-3 h-3" />Target achieved</div>
                    : <div className="mt-2 text-xs text-warning">{targetCalories - totalCalories} cal remaining</div>}
                </div>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full -mr-16 -mt-16" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg"><Clock className="w-5 h-5 text-blue-500" /></div>
                    <span className="text-sm text-muted-foreground">Active Time</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{totalDuration}m</div>
                  <div className="text-sm text-muted-foreground">Today's activity</div>
                </div>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-warning/20 to-transparent rounded-full -mr-16 -mt-16" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-warning/20 rounded-lg"><Target className="w-5 h-5 text-warning" /></div>
                    <span className="text-sm text-muted-foreground">Completion</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{completionRate}%</div>
                  <div className="text-sm text-muted-foreground">{workouts.filter((w) => w.completed).length}/{workouts.length} workouts</div>
                </div>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full -mr-16 -mt-16" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg"><Dumbbell className="w-5 h-5 text-purple-500" /></div>
                    <span className="text-sm text-muted-foreground">Today's Workouts</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{workouts.length}</div>
                  <div className="text-sm text-muted-foreground">Logged today</div>
                </div>
              </Card>
            </div>

            {showAddForm && (
              <Card className="mb-6 bg-gradient-to-br from-card to-secondary/20 border-2 border-success/30">
                <h3 className="text-lg font-semibold mb-4">Log New Workout</h3>
                <form onSubmit={addWorkout} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Exercise Name" value={newWorkout.exercise} onChange={(e) => setNewWorkout({ ...newWorkout, exercise: e.target.value })} placeholder="e.g., Morning Run" required />
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1.5">Category</label>
                      <select value={newWorkout.category} onChange={(e) => setNewWorkout({ ...newWorkout, category: e.target.value })} className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="Cardio">Cardio</option>
                        <option value="Weights">Weights</option>
                        <option value="Flexibility">Flexibility</option>
                        <option value="Sports">Sports</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Duration (minutes)" type="number" min="5" value={newWorkout.duration} onChange={(e) => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) })} required />
                    <Input label="Calories Burned" type="number" min="10" value={newWorkout.calories} onChange={(e) => setNewWorkout({ ...newWorkout, calories: parseInt(e.target.value) })} required />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" variant="success"><Check className="w-4 h-4 mr-2" />Log Workout</Button>
                    <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <h3 className="text-lg font-semibold mb-6">Weekly Calorie Burn</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyCalories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="day" stroke="#888888" tick={{ fill: '#888888' }} />
                    <YAxis stroke="#888888" tick={{ fill: '#888888' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                    <Bar dataKey="burned" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="#444444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-6">Activity Progress</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyCalories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="day" stroke="#888888" tick={{ fill: '#888888' }} />
                    <YAxis stroke="#888888" tick={{ fill: '#888888' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="burned" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <h3 className="text-lg font-semibold mb-6">Today's Workouts</h3>
              {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
                <div className="space-y-3">
                  {workouts.map((workout) => (
                    <div key={workout._id} className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${workout.completed ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}>
                      <button onClick={() => toggleWorkout(workout)} className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${workout.completed ? 'bg-success border-success' : 'border-muted-foreground hover:border-foreground'}`}>
                        {workout.completed && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <div className="flex-1">
                        <div className={`font-medium mb-1 ${workout.completed ? 'line-through text-muted-foreground' : ''}`}>{workout.exercise}</div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="px-2 py-0.5 bg-secondary rounded text-xs">{workout.category}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{workout.duration}m</span>
                          <span className="flex items-center gap-1"><Flame className="w-4 h-4" />{workout.calories} cal</span>
                        </div>
                      </div>
                      <button onClick={() => deleteWorkout(workout._id)} className="p-2 hover:bg-destructive/20 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-destructive" />
                      </button>
                    </div>
                  ))}
                  {workouts.length === 0 && <div className="text-center py-12 text-muted-foreground">No workouts logged yet. Start tracking your fitness journey!</div>}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
