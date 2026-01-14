
import React, { useState } from 'react';
import { LogIn, Lock, User, Heart, ArrowLeft, AlertCircle, Play } from 'lucide-react';

interface Props {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const LoginPage: React.FC<Props> = ({ onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');

    // Hardcoded credentials for demonstration
    // User: admin | Pass: nikahyuk2025
    setTimeout(() => {
      if (username === 'admin' && password === 'nikahyuk2025') {
        onLoginSuccess();
      } else {
        setError('Username atau password salah. Silakan coba lagi.');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleDemoLogin = () => {
    setUsername('admin');
    setPassword('nikahyuk2025');
    setIsLoading(true);
    setError('');
    
    // Trigger login logic with correct credentials
    setTimeout(() => {
      onLoginSuccess();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-stone-100 relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-stone-200 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-md w-full relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali
        </button>

        <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-12 border border-stone-50">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-900 text-white rounded-2xl mb-6 shadow-xl">
              <Heart className="w-8 h-8 fill-pink-400 text-pink-400" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Login Admin</h1>
            <p className="text-stone-500 text-sm font-light">Masuk untuk mengelola undangan digital Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs flex items-center gap-3 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest px-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                <input 
                  type="text"
                  required
                  placeholder="admin"
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 outline-none transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-stone-800 shadow-xl transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isLoading && !username ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" /> Masuk Sekarang
                  </>
                )}
              </button>

              <div className="flex items-center gap-4 my-4">
                <div className="h-px bg-stone-100 flex-1"></div>
                <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Atau</span>
                <div className="h-px bg-stone-100 flex-1"></div>
              </div>

              <button 
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full bg-indigo-50 text-indigo-700 py-4 rounded-2xl font-bold hover:bg-indigo-100 transition active:scale-[0.98] flex items-center justify-center gap-3 border border-indigo-100"
              >
                <Play className="w-4 h-4 fill-indigo-700" /> Demo Login (Auto-fill)
              </button>
            </div>
          </form>

          <div className="mt-10 pt-10 border-t border-stone-100 text-center">
            <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">NikahYuk Digital Wedding v1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
