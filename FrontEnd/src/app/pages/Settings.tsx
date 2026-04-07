import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Dumbbell, UtensilsCrossed, Bell, Lock, User } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { user, updateUser } = useAuth();
  const [fitnessEnabled, setFitnessEnabled] = useState(true);
  const [dietEnabled, setDietEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/settings').then((r) => {
      setFitnessEnabled(r.data.settings.fitnessEnabled);
      setDietEnabled(r.data.settings.dietEnabled);
      setNotifications(r.data.settings.notifications);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await api.put('/settings', { fitnessEnabled, dietEnabled, notifications });
    if (name !== user?.name || password) {
      await updateUser({ name: name || undefined, password: password || undefined });
    }
    setSaved(true);
    setPassword('');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="pt-16 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground mb-8">Customize your tracking preferences</p>

            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-6">Tracking Modules</h2>
              <div className="space-y-4">
                {[
                  { label: 'Fitness Tracker', desc: 'Track workouts, exercises, and physical activity', icon: Dumbbell, color: 'success', value: fitnessEnabled, set: setFitnessEnabled },
                  { label: 'Diet Tracker', desc: 'Log meals, track calories and nutrition', icon: UtensilsCrossed, color: 'warning', value: dietEnabled, set: setDietEnabled },
                ].map(({ label, desc, icon: Icon, color, value, set }) => (
                  <div key={label} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-${color}/20 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${color}`} />
                      </div>
                      <div>
                        <div className="font-medium mb-1">{label}</div>
                        <div className="text-sm text-muted-foreground">{desc}</div>
                      </div>
                    </div>
                    <button onClick={() => set(!value)} className={`relative w-14 h-8 rounded-full transition-colors ${value ? 'bg-success' : 'bg-muted'}`}>
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                <strong>Note:</strong> Disabled modules will be hidden from your dashboard and navigation.
              </div>
            </Card>

            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-6">Account</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <Input label="New Password" type="password" placeholder="Leave blank to keep current" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-6">Notifications</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium mb-1">Daily Reminders</div>
                    <div className="text-sm text-muted-foreground">Get notified about incomplete tasks</div>
                  </div>
                </div>
                <button onClick={() => setNotifications(!notifications)} className={`relative w-14 h-8 rounded-full transition-colors ${notifications ? 'bg-success' : 'bg-muted'}`}>
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${notifications ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => { setName(user?.name || ''); setPassword(''); }}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>
                {saved ? 'Saved!' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
