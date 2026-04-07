import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingDown, AlertTriangle, Target, Clock, Dumbbell, UtensilsCrossed, Flame, Activity } from 'lucide-react';
import api from '../api';

export function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, w, c] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/weekly'),
          api.get('/analytics/category'),
        ]);
        setSummary(s.data);
        setWeekly(w.data.weekly);
        setCategories(c.data.categories);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const todayScore = summary?.todayScore ?? 0;
  const tasksCompleted = summary?.tasksCompleted ?? 0;
  const tasksPlanned = summary?.tasksPlanned ?? 0;
  const hoursPlanned = summary?.hoursPlanned ?? 0;
  const hoursActual = summary?.hoursActual ?? 0;
  const caloriesBurned = summary?.caloriesBurned ?? 0;
  const workoutsCompleted = summary?.workoutsCompleted ?? 0;
  const workoutsPlanned = summary?.workoutsPlanned ?? 0;
  const caloriesConsumed = summary?.caloriesConsumed ?? 0;
  const calorieLimit = 2000;
  const calorieTarget = 500;
  const exerciseStreak = summary?.exerciseStreak ?? 0;

  const getMessage = (score: number) => {
    if (score >= 80) return 'Acceptable performance';
    if (score >= 60) return 'You are underperforming today';
    return 'Failure. You need to do better.';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const weeklyAvg = weekly.length > 0
    ? Math.round(weekly.reduce((s, d) => s + d.score, 0) / weekly.length)
    : 0;

  if (loading) return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 flex items-center justify-center pt-16">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="pt-16 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground mb-8">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <Card className="mb-8 text-center bg-gradient-to-br from-card to-destructive/5 border-2 border-destructive/30">
              <div className="mb-2 text-muted-foreground uppercase tracking-wider text-sm">Today's Consistency Score</div>
              <div className={`text-7xl font-bold mb-2 ${getScoreColor(todayScore)}`}>{todayScore}%</div>
              <div className="text-xl text-muted-foreground mb-4">{getMessage(todayScore)}</div>
              {tasksPlanned === 0 && <div className="text-sm text-muted-foreground">No tasks planned for today yet.</div>}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-destructive/20 to-transparent rounded-full -mr-12 -mt-12" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-destructive/10 rounded-lg"><Target className="w-6 h-6 text-destructive" /></div>
                    {tasksPlanned > tasksCompleted && <AlertTriangle className="w-5 h-5 text-warning" />}
                  </div>
                  <div className="text-2xl font-bold mb-1">{tasksCompleted}/{tasksPlanned}</div>
                  <div className="text-sm text-muted-foreground mb-2">Tasks Completed</div>
                  <div className="text-xs text-destructive">{tasksPlanned - tasksCompleted} tasks incomplete</div>
                </div>
              </Card>

              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-warning/20 to-transparent rounded-full -mr-12 -mt-12" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-warning/10 rounded-lg"><Clock className="w-6 h-6 text-warning" /></div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{hoursActual}h / {hoursPlanned}h</div>
                  <div className="text-sm text-muted-foreground mb-2">Time Spent</div>
                  <div className="text-xs text-warning">{(hoursPlanned - hoursActual).toFixed(1)}h behind schedule</div>
                </div>
              </Card>

              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-success/20 to-transparent rounded-full -mr-12 -mt-12" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-success/10 rounded-lg"><Dumbbell className="w-6 h-6 text-success" /></div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{caloriesBurned}/{calorieTarget}</div>
                  <div className="text-sm text-muted-foreground mb-2">Calories Burned</div>
                  <div className="text-xs text-warning">{workoutsCompleted}/{workoutsPlanned} workouts done</div>
                </div>
              </Card>

              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full -mr-12 -mt-12" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg"><UtensilsCrossed className="w-6 h-6 text-blue-500" /></div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{caloriesConsumed}/{calorieLimit}</div>
                  <div className="text-sm text-muted-foreground mb-2">Calories Consumed</div>
                  <div className="text-xs text-success">{calorieLimit - caloriesConsumed} cal remaining</div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-success/10 to-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-success/20 rounded-lg"><Activity className="w-5 h-5 text-success" /></div>
                  <span className="text-xs px-2 py-1 bg-success/20 text-success rounded">STREAK</span>
                </div>
                <div className="text-2xl font-bold mb-1">{exerciseStreak} Days</div>
                <div className="text-sm text-muted-foreground">Exercise Streak</div>
              </Card>

              <Card className="bg-gradient-to-br from-warning/10 to-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-warning/20 rounded-lg"><Flame className="w-5 h-5 text-warning" /></div>
                  <span className="text-xs px-2 py-1 bg-warning/20 text-warning rounded">AVERAGE</span>
                </div>
                <div className="text-2xl font-bold mb-1">{weeklyAvg}%</div>
                <div className="text-sm text-muted-foreground">Weekly Average</div>
              </Card>

              <Card className="bg-gradient-to-br from-destructive/10 to-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-destructive/20 rounded-lg"><TrendingDown className="w-5 h-5 text-destructive" /></div>
                  <span className="text-xs px-2 py-1 bg-destructive/20 text-destructive rounded">TODAY</span>
                </div>
                <div className="text-2xl font-bold mb-1">{tasksPlanned - tasksCompleted}</div>
                <div className="text-sm text-muted-foreground">Tasks Remaining</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-6">Weekly Consistency</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weekly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="day" stroke="#888888" tick={{ fill: '#888888' }} />
                    <YAxis stroke="#888888" tick={{ fill: '#888888' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-6">Category Breakdown</h3>
                {categories.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={categories} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                        {categories.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                      <Legend wrapperStyle={{ color: '#ffffff' }} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">No task data yet</div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
