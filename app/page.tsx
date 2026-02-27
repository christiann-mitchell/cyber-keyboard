"use client";
import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useInventory } from '../hooks/useInventory';

const mockSales = [
  { city: "Tokyo", country: "JP", time: "2m ago" },
  { city: "Berlin", country: "DE", time: "5m ago" },
  { city: "New York", country: "US", time: "1m ago" },
];

export default function Home() {
  const { inventory, updateInventory } = useInventory();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const images = [
    "/hero-main.jpg", 
    "/hero-side.jpg", 
    "/hero-glow.jpg"  
  ];
  
  const [showToast, setShowToast] = useState(false);
  const [currentSale, setCurrentSale] = useState(mockSales[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomSale = mockSales[Math.floor(Math.random() * mockSales.length)];
      setCurrentSale(randomSale);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = () => {
    if (inventory > 0) {
      setCartCount(1);
      setIsCartOpen(true);
    }
  };

  return (
    <>
      {/* 1. Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[200] bg-white flex items-center justify-center animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-8 p-12">
            <div className="w-20 h-20 bg-zingy rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_#CCFF00]">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-light tracking-tighter uppercase">Order_Confirmed</h2>
              <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Your Ghost Series 01 is being prepared for stealth shipping.</p>
            </div>
            <button 
              onClick={() => setShowSuccess(false)}
              className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-black pb-2 hover:text-zingy hover:border-zingy transition-all"
            >
              Return_to_Store
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Site Structure */}
      <div className="min-h-screen bg-white text-black overflow-x-hidden font-sans">
        <nav className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <span className="text-lg md:text-xl font-bold tracking-[0.2em] uppercase text-black">Ghost_Keys</span>
          <div className="flex items-center gap-6 md:gap-12">
            <div className="hidden md:flex space-x-12 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
              <a href="#" className="hover:text-black transition underline underline-offset-8">Series_01</a>
              <a href="/admin" className="hover:text-black transition text-zingy">HQ</a>
            </div>
            <button onClick={() => setIsCartOpen(true)} className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-4 py-2 rounded-sm active:scale-95 transition-transform">
              Cart ({cartCount})
            </button>
          </div>
        </nav>

        <main className={`max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-32 transition-all duration-700 ${isCartOpen ? 'blur-md scale-[0.98]' : ''}`}>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            
            {/* Gallery */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="aspect-square bg-gray-50 border border-gray-100 relative overflow-hidden group">
                <img 
                  src={images[activeImage]} 
                  alt="Keyboard View" 
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                />
              </div>
              <div className="flex gap-2 md:gap-4">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 md:w-20 md:h-20 border-2 overflow-hidden transition-all ${activeImage === idx ? 'border-black scale-105 shadow-md' : 'border-gray-100 opacity-40 hover:opacity-100'}`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-left">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tighter leading-tight text-black uppercase">
                  Stark <span className="font-black italic">Transparency</span>
                </h1>
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${inventory < 5 && inventory > 0 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                  {inventory > 0 ? `Limited Drop: Only ${inventory} Units Remaining` : "Sold Out"}
                </p>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                Custom-tooled polycarbonate chassis with lubed stabilizers and hot-swappable PCB. 
                Drop 001 features our signature clear-cap set.
              </p>

              <div className="pt-4">
                <button 
                  onClick={addToCart}
                  disabled={inventory === 0}
                  className={`w-full md:w-auto btn-premium flex items-center justify-center md:justify-start gap-4 group ${inventory === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {inventory > 0 ? 'Add to Collection' : 'Out of Stock'}
                  <span className="text-zingy">— $189</span>
                </button>
              </div>

              {/* Responsive Specs Grid */}
              <div className="mt-16 md:mt-24 pt-12 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
                <div>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Chassis</p>
                  <p className="text-[11px] md:text-xs font-medium uppercase">Frosted Poly</p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Switches</p>
                  <p className="text-[11px] md:text-xs font-medium uppercase">Ghost Linear</p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Polling</p>
                  <p className="text-[11px] md:text-xs font-medium uppercase">1000hz / 1ms</p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Keycaps</p>
                  <p className="text-[11px] md:text-xs font-medium uppercase">Acrylic DS</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* 3. Sales Toast */}
        <div className={`fixed bottom-8 left-8 z-[100] transition-all duration-700 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="bg-black text-white p-4 flex items-center gap-4 shadow-2xl border border-white/10 min-w-[280px]">
            <div className="w-2 h-2 bg-zingy animate-pulse rounded-full" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Verified_Purchase</span>
              <span className="text-[11px] font-mono tracking-tighter uppercase leading-none mt-1">
                {currentSale.city}, {currentSale.country} — {currentSale.time}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Cart Sidebar & Overlay */}
        <div className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCartOpen(false)} />

        <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl p-8 md:p-12 transform transition-transform duration-500 ease-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full text-left">
            <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-6">
              <h2 className="text-xs font-bold tracking-[0.5em] uppercase text-gray-400">Your_Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-[10px] font-bold uppercase hover:text-red-500 transition tracking-widest">Close_</button>
            </div>

            {cartCount > 0 ? (
              <div className="flex-1 flex flex-col">
                <div className="flex gap-6 border-b border-gray-100 pb-8 text-left">
                  {/* FIXED: Added product image here */}
                  <div className="w-24 h-24 bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                    <img src={images[0]} alt="Product" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold uppercase tracking-tighter text-black">Ghost Series 01</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Drop_001 / Edition</p>
                    <p className="text-sm font-bold pt-2 text-zingy bg-black inline-block px-2 mt-2">$189.00</p>
                  </div>
                </div>

                <div className="mt-auto pt-12 space-y-6">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-[0.2em]">
                    <span>Subtotal</span>
                    <span>$189.00</span>
                  </div>
                  
                  <div className="relative z-0">
                    <PayPalScriptProvider options={{ clientId: "test" }}>
                      <PayPalButtons 
                        style={{ layout: "vertical", color: "black", shape: "rect", label: "checkout" }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [{ 
                              amount: { 
                                currency_code: "USD", // This is the missing piece
                                value: "189.00" 
                              } 
                            }],                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order!.capture().then((details) => {
                            setIsCartOpen(false);
                            setCartCount(0);
                            updateInventory(inventory - 1);
                            setShowSuccess(true);
                          });
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300 text-[10px] uppercase tracking-[0.4em] font-bold">
                <p>Empty_Cart</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}