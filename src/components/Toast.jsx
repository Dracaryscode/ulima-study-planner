import { useEffect } from 'react';

export function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
        {message}
      </div>
    </div>
  );
}

export default Toast;
