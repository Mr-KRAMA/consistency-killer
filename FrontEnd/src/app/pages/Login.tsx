import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Zap, TrendingUp, Target, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-destructive to-destructive/70 rounded-xl flex items-center justify-center shadow-2xl">
                <Zap className="w-9 h-9 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Consistency Killer
            </h1>
            <p className="text-muted-foreground text-lg">Track your behavior. Face the truth.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 shadow-xl">
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => { setIsSignup(false); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg transition-all ${!isSignup ? 'bg-gradient-to-r from-white to-gray-200 text-black shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setIsSignup(true); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg transition-all ${isSignup ? 'bg-gradient-to-r from-white to-gray-200 text-black shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <Input label="Name" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
              )}
              <Input label="Email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />

              {error && <div className="text-sm text-destructive text-center">{error}</div>}

              <Button type="submit" className="w-full mt-6 shadow-lg hover:shadow-xl" disabled={loading}>
                {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              No excuses. No mercy. Just results.
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-destructive/20 via-warning/10 to-success/10 items-center justify-center p-12">
        <div className="max-w-lg">
          <h2 className="text-4xl font-bold mb-6">Transform Your Productivity</h2>
          <p className="text-lg text-muted-foreground mb-8">
            A brutally honest system that tracks your tasks, fitness, and diet—exposing patterns and driving real change.
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-background/50 backdrop-blur rounded-lg border border-border">
              <div className="p-3 bg-destructive/20 rounded-lg"><Target className="w-6 h-6 text-destructive" /></div>
              <div>
                <div className="font-semibold mb-1">Task Tracking</div>
                <div className="text-sm text-muted-foreground">Plan vs actual time tracking with harsh accountability</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-background/50 backdrop-blur rounded-lg border border-border">
              <div className="p-3 bg-success/20 rounded-lg"><Activity className="w-6 h-6 text-success" /></div>
              <div>
                <div className="font-semibold mb-1">Fitness & Diet Tracking</div>
                <div className="text-sm text-muted-foreground">Optional modules to track workouts, meals, and nutrition</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-background/50 backdrop-blur rounded-lg border border-border">
              <div className="p-3 bg-warning/20 rounded-lg"><TrendingUp className="w-6 h-6 text-warning" /></div>
              <div>
                <div className="font-semibold mb-1">Analytics & Reports</div>
                <div className="text-sm text-muted-foreground">Deep insights into your patterns with weekly report cards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
