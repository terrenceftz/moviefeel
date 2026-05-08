import React, { useState } from 'react';
import { X, Lock, User } from 'lucide-react';

interface LoginFormProps {
  onLogin: () => void;
  onClose: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Terrence' && password === 'admin123') {
      onLogin();
    } else {
      setError('凭据不正确。身份验证失败。');
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-cinema-ink/40 backdrop-blur-md">
      <div className="bg-white border-2 border-cinema-ink w-full max-w-sm p-10 relative shadow-[20px_20px_0_var(--color-lavender)]">
        <button onClick={onClose} className="absolute top-4 right-4 hover:rotate-90 transition-transform">
          <X size={20} />
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-cinema-ink text-white flex items-center justify-center mx-auto mb-4">
             <Lock size={24} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Admin Access</h2>
          <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest mt-2">身份验证以开启编辑权限</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Username</label>
            <div className="relative">
              <User className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20" size={16} />
              <input 
                className="w-full border-b border-cinema-ink/20 focus:border-cinema-ink outline-none py-2 pl-7 font-sans"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Password</label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20" size={16} />
              <input 
                type="password"
                className="w-full border-b border-cinema-ink/20 focus:border-cinema-ink outline-none py-2 pl-7 font-sans"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-cinema-ink text-white py-4 font-black uppercase tracking-widest hover:bg-lavender hover:text-cinema-ink transition-all"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};
