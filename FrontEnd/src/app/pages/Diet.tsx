import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { UtensilsCrossed, Plus, Flame, Check, X, Coffee, Apple } from 'lucide-react';
import api from '../api';

interface Meal {
  _id: string;
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
  logged: boolean;
}

export function Diet() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [weeklyCalories, setWeeklyCalories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: '', type: 'Breakfast', calories: 300, protein: 20, carbs: 30, fats: 10 });
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    Promise.all([
      api.get(`/diet?date=${today}`),
      api.get('/diet/weekly'),
    ]).then(([m, wk]) => {
      setMeals(m.data.meals);
      setWeeklyCalories(wk.data.weekly);
    }).finally(() => setLoading(false));
  }, []);

  const toggleMeal = async (meal: Meal) => {
    const res = await api.put(`/diet/${meal._id}`, { logged: !meal.logged });
    setMeals(meals.map((m) => (m._id === meal._id ? res.data.meal : m)));
  };

  const addMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/diet', { ...newMeal, date: today });
    setMeals([...meals, res.data.meal]);
    setNewMeal({ name: '', type: 'Breakfast', calories: 300, protein: 20, carbs: 30, fats: 10 });
    setShowAddForm(false);
  };

  const deleteMeal = async (id: string) => {
    await api.delete(`/diet/${id}`);
    setMeals(meals.filter((m) => m._id !== id));
  };

  const loggedMeals = meals.filter((m) => m.logged);
  const totalCalories = loggedMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = loggedMeals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = loggedMeals.reduce((s, m) => s + m.carbs, 0);
  const totalFats = loggedMeals.reduce((s, m) => s + m.fats, 0);
  const calorieTarget = 2000;
  const caloriePercentage = Math.round((totalCalories / calorieTarget) * 100);

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'Breakfast': return Coffee;
      case 'Snack': return Apple;
      default: return UtensilsCrossed;
    }
  };

  const macroData = [
    { name: 'Protein', value: totalProtein, color: '#22c55e' },
    { name: 'Carbs', value: totalCarbs, color: '#3b82f6' },
    { name: 'Fats', value: totalFats, color: '#eab308' },
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
                <h1 className="text-3xl font-bold mb-2">Diet Tracker</h1>
                <p className="text-muted-foreground">Monitor your nutrition and calorie intake</p>
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)}><Plus className="w-5 h-5 mr-2" />Log Meal</Button>
            </div>

            <Card className="mb-8 bg-gradient-to-br from-card to-warning/5 border-2 border-warning/30">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Daily Calorie Intake</div>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className={`text-6xl font-bold ${caloriePercentage > 110 ? 'text-destructive' : caloriePercentage > 90 ? 'text-success' : 'text-warning'}`}>{totalCalories}</div>
                  <div className="text-left">
                    <div className="text-2xl text-muted-foreground">/ {calorieTarget}</div>
                    <div className="text-sm text-muted-foreground">calories</div>
                  </div>
                </div>
                <div className="max-w-md mx-auto">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${caloriePercentage > 110 ? 'bg-destructive' : caloriePercentage > 90 ? 'bg-success' : 'bg-warning'}`} style={{ width: `${Math.min(caloriePercentage, 100)}%` }} />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {caloriePercentage}% of daily target
                    {caloriePercentage > 100 && <span className="text-destructive ml-2">({totalCalories - calorieTarget} cal over)</span>}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Protein', value: totalProtein, target: 150, color: 'success' },
                { label: 'Carbs', value: totalCarbs, target: 200, color: 'blue-500' },
                { label: 'Fats', value: totalFats, target: 70, color: 'warning' },
              ].map(({ label, value, target, color }) => (
                <Card key={label} className="relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${color}/20 to-transparent rounded-full -mr-16 -mt-16`} />
                  <div className="relative">
                    <div className="text-sm text-muted-foreground mb-2">{label}</div>
                    <div className={`text-3xl font-bold mb-1 text-${color}`}>{value}g</div>
                    <div className="text-sm text-muted-foreground">Target: {target}g</div>
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full bg-${color}`} style={{ width: `${Math.min((value / target) * 100, 100)}%` }} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {showAddForm && (
              <Card className="mb-6 bg-gradient-to-br from-card to-secondary/20 border-2 border-warning/30">
                <h3 className="text-lg font-semibold mb-4">Log New Meal</h3>
                <form onSubmit={addMeal} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Meal Name" value={newMeal.name} onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })} placeholder="e.g., Grilled Chicken" required />
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1.5">Meal Type</label>
                      <select value={newMeal.type} onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })} className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Snack">Snack</option>
                        <option value="Dinner">Dinner</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <Input label="Calories" type="number" min="10" value={newMeal.calories} onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) })} required />
                    <Input label="Protein (g)" type="number" min="0" value={newMeal.protein} onChange={(e) => setNewMeal({ ...newMeal, protein: parseInt(e.target.value) })} required />
                    <Input label="Carbs (g)" type="number" min="0" value={newMeal.carbs} onChange={(e) => setNewMeal({ ...newMeal, carbs: parseInt(e.target.value) })} required />
                    <Input label="Fats (g)" type="number" min="0" value={newMeal.fats} onChange={(e) => setNewMeal({ ...newMeal, fats: parseInt(e.target.value) })} required />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" variant="success"><Check className="w-4 h-4 mr-2" />Log Meal</Button>
                    <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <h3 className="text-lg font-semibold mb-6">Weekly Calorie Intake</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyCalories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="day" stroke="#888888" tick={{ fill: '#888888' }} />
                    <YAxis stroke="#888888" tick={{ fill: '#888888' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                    <Bar dataKey="consumed" fill="#eab308" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="#444444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-6">Macro Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={macroData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                      {macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ color: '#ffffff' }} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <h3 className="text-lg font-semibold mb-6">Today's Meals</h3>
              {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> : (
                <div className="space-y-3">
                  {meals.map((meal) => {
                    const Icon = getMealIcon(meal.type);
                    return (
                      <div key={meal._id} className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${meal.logged ? 'border-success/30 bg-success/5' : 'border-muted/30 bg-muted/5'}`}>
                        <button onClick={() => toggleMeal(meal)} className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${meal.logged ? 'bg-success border-success' : 'border-muted-foreground hover:border-foreground'}`}>
                          {meal.logged && <Check className="w-4 h-4 text-white" />}
                        </button>
                        <div className="p-2 bg-secondary rounded-lg"><Icon className="w-5 h-5" /></div>
                        <div className="flex-1">
                          <div className={`font-medium mb-1 ${meal.logged ? '' : 'text-muted-foreground'}`}>{meal.name}</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="px-2 py-0.5 bg-secondary rounded text-xs">{meal.type}</span>
                            <span>{meal.time}</span>
                            <span className="flex items-center gap-1"><Flame className="w-4 h-4" />{meal.calories} cal</span>
                            <span>P: {meal.protein}g</span>
                            <span>C: {meal.carbs}g</span>
                            <span>F: {meal.fats}g</span>
                          </div>
                        </div>
                        <button onClick={() => deleteMeal(meal._id)} className="p-2 hover:bg-destructive/20 rounded-lg transition-colors">
                          <X className="w-5 h-5 text-destructive" />
                        </button>
                      </div>
                    );
                  })}
                  {meals.length === 0 && <div className="text-center py-12 text-muted-foreground">No meals logged yet. Start tracking your nutrition!</div>}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
