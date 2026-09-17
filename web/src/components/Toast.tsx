'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: type === 'success' ? '#10B981' : '#EF4444',
      color: 'white',
      padding: '12px 24px',
      borderRadius: 'var(--radius)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.3s ease-in-out',
      zIndex: 9999
    }}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span>{message}</span>
    </div>
  );
}
