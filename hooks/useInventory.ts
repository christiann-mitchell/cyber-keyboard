"use client";
import { useState, useEffect } from 'react';

export function useInventory() {
  const [inventory, setInventory] = useState<number>(8);

  // Load from memory on start
  useEffect(() => {
    const saved = localStorage.getItem('ghost_keys_stock');
    if (saved !== null) {
      setInventory(parseInt(saved));
    }
  }, []);

  // Update memory whenever stock changes
  const updateInventory = (newValue: number) => {
    setInventory(newValue);
    localStorage.setItem('ghost_keys_stock', newValue.toString());
  };

  return { inventory, updateInventory };
}