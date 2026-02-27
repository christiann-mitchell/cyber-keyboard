"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInventory } from '../../hooks/useInventory';
export default function AdminDashboard() {
  const router = useRouter();
  const { inventory, updateInventory } = useInventory();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [newStock, setNewStock] = useState(inventory);
  
  // Fake orders for the vibe - we can make these real later!
  const [recentOrders] = useState([
    { id: '#8821', city: 'London', status: 'Shipped', amount: '$189.00' },
    { id: '#8820', city: 'San Francisco', status: 'Processing', amount: '$189.00' },
    { id: '#8819', city: 'Tokyo', status: 'Delivered', amount: '$378.00' },
  ]);

  const totalSales = 1245.50;
  const goal = 5000;
  const progressWidth = (totalSales / goal) * 100;

  // Update internal input state when global inventory changes
  useEffect(() => {
    setNewStock(inventory);
  }, [inventory]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'ghost123') {
      setIsAuthenticated(true);
    } else {
      alert("ACCESS DENIED");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8 text-center">
          <h1 className="text-xs font-bold tracking-[0.8em] uppercase text-gray-500">Security_Check</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="ENTER_ACCESS_KEY"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 py-4 text-center text-white focus:outline-none focus:border-zingy transition-colors font-mono tracking-widest"
            />
            <button type="submit" className="w-full btn-premium">Authorize</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-12 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end border-b border-white/10 pb-12 mb-12">
          <div>
            <h1 className="text-xs font-bold tracking-[0.5em] uppercase text-gray-500 mb-2">Internal Dashboard</h1>
            <p className="text-4xl font-light tracking-tighter">Performance_Overview</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition"
          >
            Logout_Session
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Stats Area */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-6">Net Revenue</p>
              <h2 className="text-7xl font-bold italic tracking-tighter">${totalSales.toLocaleString()}</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span>Monthly Progress</span>
                <span className="text-zingy">{progressWidth.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-white/5 h-[2px]">
                <div 
                  className="h-full bg-zingy transition-all duration-1000 shadow-[0_0_15px_#CCFF00]"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            </div>

            {/* Inventory Control Module */}
            <div className="pt-12 border-t border-white/5">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-6">Inventory_Management</h3>
              <div className="flex items-center gap-4">
              <input 
  type="number" 
  // The || 0 ensures it never sends "NaN" to the input
  value={newStock || 0} 
  onChange={(e) => {
    const val = parseInt(e.target.value);
    setNewStock(isNaN(val) ? 0 : val);
  }}
  className="bg-black border border-white/10 p-4 w-32 text-2xl font-bold focus:border-zingy outline-none transition-colors"
/>
                <button 
                  onClick={() => updateInventory(newStock)}
                  className="bg-white text-black px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-zingy transition-colors"
                >
                  Sync Stock Levels
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Area: Quick Stats & Orders */}
          <div className="space-y-12 border-l border-white/5 pl-12">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1">Live_Stock</p>
                <p className="text-2xl font-light text-zingy">{inventory}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1">Orders</p>
                <p className="text-2xl font-light">{recentOrders.length}</p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Recent_Activity</p>
              {recentOrders.map((order) => (
                <div key={order.id} className="border-b border-white/5 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold">{order.id}</span>
                    <span className="text-xs text-zingy">{order.amount}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest">
                    <span>{order.city}</span>
                    <span>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}