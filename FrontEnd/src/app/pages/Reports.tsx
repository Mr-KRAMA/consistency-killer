import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { AlertTriangle, XCircle, TrendingDown, Target, Clock, Zap } from 'lucide-react';
import api from '../api';

export function Reports() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/weekly').then((r) => setReport(r.data)).finally(() => setLoading(false));
  }, []);

  const getSeverityBg = (priority: string) => {
    if (priority === 'CRITICAL') return 'bg-destructive/10 border-destructive/20';
    if (priority === 'URGENT') return 'bg-warning/10 border-warning/20';
    return 'bg-muted/10 border-muted/20';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'CRITICAL') return 'bg-destructive text-white';
    if (priority === 'URGENT') return 'bg-warning text-black';
    return 'bg-muted text-white';
  };

  if (loading) return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 flex items-center justify-center pt-16">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    </div>
  );

  const grade = report?.grade ?? 'N/A';
  const completionRate = report?.completionRate ?? 0;
  const failures = report?.failures ?? [];
  const improvements = report?.improvements ?? [];
  const weekendRate = report?.weekendRate ?? 0;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="pt-16 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-destructive/20 rounded-lg"><AlertTriangle className="w-6 h-6 text-destructive" /></div>
                <div>
                  <h1 className="text-3xl font-bold">Weekly Report Card</h1>
                  <p className="text-muted-foreground">Last 7 days</p>
                </div>
              </div>

              <Card className="bg-destructive/10 border-destructive/30">
                <div className="text-center">
                  <div className="text-6xl font-bold text-destructive mb-2">{grade}</div>
                  <div className="text-xl mb-4">Completion Rate: <span className="font-bold text-destructive">{completionRate}%</span></div>
                  <div className="text-muted-foreground">
                    {completionRate >= 80 ? 'Good performance this week. Keep it up.' : 'Your performance this week was below acceptable standards. Take immediate corrective action.'}
                  </div>
                </div>
              </Card>
            </div>

            <Card className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <XCircle className="w-6 h-6 text-destructive" />
                <h2 className="text-2xl font-bold">Where You Failed</h2>
              </div>
              {failures.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {failures.map((failure: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium mb-1">{failure.task}</div>
                        <div className="text-sm text-muted-foreground">{failure.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">Planned: {failure.planned}</div>
                        <div className="font-medium text-destructive">Actual: {failure.actual}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-success">No failures this week. Excellent work!</div>
              )}
            </Card>

            <Card className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <TrendingDown className="w-6 h-6 text-warning" />
                <h2 className="text-2xl font-bold">Your Weak Patterns</h2>
              </div>
              <div className="space-y-3">
                <div className={`p-4 border rounded-lg ${weekendRate < 50 ? 'bg-destructive/10 border-destructive/20' : 'bg-warning/10 border-warning/20'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-bold text-lg">Weekend Performance</div>
                    <div className={`text-xs uppercase px-2 py-1 rounded ${weekendRate < 50 ? 'text-destructive' : 'text-warning'}`}>
                      {weekendRate < 50 ? 'critical' : 'medium'}
                    </div>
                  </div>
                  <div className="text-sm">Weekend task completion: {weekendRate}%. {weekendRate < 50 ? 'Unacceptable. Set minimum work blocks each weekend day.' : 'Room for improvement on weekends.'}</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-muted/10 rounded-lg">
                <div className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div className="text-sm"><span className="font-medium">Reality Check:</span> The data doesn't lie. Change your patterns or accept mediocrity.</div>
                </div>
              </div>
            </Card>

            <Card className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold">What to Improve</h2>
              </div>
              <div className="space-y-4">
                {improvements.map((item: any, index: number) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold">{item.area}</div>
                      <div className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(item.priority)}`}>{item.priority}</div>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Current</span>
                          <span className="font-medium text-destructive">{item.current}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-destructive" style={{ width: item.current }} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Target</span>
                          <span className="font-medium text-success">{item.target}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-success" style={{ width: item.target }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-secondary border-border">
              <div className="text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-xl font-bold mb-2">Time is Running Out</div>
                <div className="text-muted-foreground max-w-2xl mx-auto">
                  The data doesn't lie—your behavior patterns are clear. You can either make real changes starting tomorrow, or accept that you're not serious about your goals.
                  <div className="mt-4 font-medium text-foreground">The choice is yours. Make it count.</div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
