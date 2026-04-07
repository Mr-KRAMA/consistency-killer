import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import api from '../api';

export function Analytics() {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/weekly'),
      api.get('/analytics/monthly'),
    ]).then(([w, m]) => {
      setWeeklyData(w.data.weekly);
      setMonthlyData(m.data.monthly);
    }).finally(() => setLoading(false));
  }, []);

  const chartData = timeframe === 'week' ? weeklyData : monthlyData;
  const dataKey = timeframe === 'week' ? 'day' : 'week';

  const avgScore = chartData.length > 0
    ? Math.round(chartData.reduce((s, d) => s + d.score, 0) / chartData.length)
    : 0;
  const totalTasks = chartData.reduce((s, d) => s + (d.tasks || 0), 0);
  const totalHours = chartData.reduce((s, d) => s + (d.hours || 0), 0);

  const timeOfDayData = [
    { time: '6am-9am', productivity: 85 },
    { time: '9am-12pm', productivity: 92 },
    { time: '12pm-3pm', productivity: 65 },
    { time: '3pm-6pm', productivity: 78 },
    { time: '6pm-9pm', productivity: 45 },
    { time: '9pm-12am', productivity: 30 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="pt-16 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Analytics</h1>
                <p className="text-muted-foreground">Deep dive into your performance patterns</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setTimeframe('week')} className={`px-4 py-2 rounded-lg transition-colors ${timeframe === 'week' ? 'bg-white text-black' : 'bg-secondary text-white'}`}>Weekly</button>
                <button onClick={() => setTimeframe('month')} className={`px-4 py-2 rounded-lg transition-colors ${timeframe === 'month' ? 'bg-white text-black' : 'bg-secondary text-white'}`}>Monthly</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <div className="text-sm text-muted-foreground mb-2">Average Score</div>
                <div className="text-3xl font-bold mb-2">{avgScore}%</div>
                <div className={`flex items-center gap-1 ${avgScore >= 70 ? 'text-success' : 'text-destructive'}`}>
                  {avgScore >= 70 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm">{timeframe === 'week' ? 'This week' : 'This month'}</span>
                </div>
              </Card>
              <Card>
                <div className="text-sm text-muted-foreground mb-2">Tasks Completed</div>
                <div className="text-3xl font-bold mb-2">{totalTasks}</div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="text-sm">{timeframe === 'week' ? 'This week' : 'This month'}</span>
                </div>
              </Card>
              <Card>
                <div className="text-sm text-muted-foreground mb-2">Hours Logged</div>
                <div className="text-3xl font-bold mb-2">{totalHours.toFixed(1)}h</div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="text-sm">{timeframe === 'week' ? 'This week' : 'This month'}</span>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <h3 className="text-lg font-semibold mb-6">{timeframe === 'week' ? 'Weekly' : 'Monthly'} Trends</h3>
                {loading ? <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div> : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis dataKey={dataKey} stroke="#888888" tick={{ fill: '#888888' }} />
                      <YAxis stroke="#888888" tick={{ fill: '#888888' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-6">Performance by Time of Day</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeOfDayData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="time" stroke="#888888" tick={{ fill: '#888888', fontSize: 12 }} />
                    <YAxis stroke="#888888" tick={{ fill: '#888888' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                    <Bar dataKey="productivity" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-destructive mb-1">Track Your Progress</div>
                    <div className="text-sm text-muted-foreground">Keep adding tasks daily to see your consistency score improve over time.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-success mb-1">Peak Performance Window</div>
                    <div className="text-sm text-muted-foreground">You perform best between 9am-12pm. Schedule your most important tasks during this time.</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
