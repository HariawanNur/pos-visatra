'use client';

import { useEffect } from 'react';

interface ShortcutHandlers {
  onFocusSearch?: () => void;
  onOpenPayment?: () => void;
  onOpenTables?: () => void;
  onOpenCustomers?: () => void;
  onEscape?: () => void;
}

export function useCashierShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing inside an input and pressing non-F-keys
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.key === 'F1') {
        e.preventDefault();
        const searchInput = document.getElementById('pos-search-input') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        handlers.onFocusSearch?.();
      } else if (e.key === 'F2') {
        e.preventDefault();
        handlers.onOpenPayment?.();
      } else if (e.key === 'F4') {
        e.preventDefault();
        handlers.onOpenTables?.();
      } else if (e.key === 'F8') {
        e.preventDefault();
        handlers.onOpenCustomers?.();
      } else if (e.key === 'Escape') {
        handlers.onEscape?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
