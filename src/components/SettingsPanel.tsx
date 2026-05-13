import React, { useState } from 'react';
import { Eye, EyeOff, Save, CheckCircle, XCircle, Loader2, Key, UserCog, User, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { testTmdbConnection } from '../services/tmdbService';
import { updateUsername, updatePassword, getCredentials } from '../services/authService';

function AccountCard({ layoutStyle }: { layoutStyle: 'swiss' | 'brutalist' | 'neo' }) {
  const [usernamePwd, setUsernamePwd] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const cardClasses = {
    swiss: "bg-white border border-cinema-ink/10 shadow-sm",
    brutalist: "bg-white border-2 border-cinema-ink shadow-[6px_6px_0_#1a1a1a]",
    neo: "bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20"
  };

  const handleUpdateUsername = () => {
    const result = updateUsername(usernamePwd, newUsername);
    if (result.success) {
      setUsernameMsg({ type: 'success', text: '用户名已更新' });
      setUsernamePwd('');
      setNewUsername('');
      setTimeout(() => setUsernameMsg(null), 2000);
    } else {
      setUsernameMsg({ type: 'error', text: result.error! });
    }
  };

  const handleUpdatePassword = () => {
    if (pwdNew !== pwdConfirm) {
      setPasswordMsg({ type: 'error', text: '两次输入的新密码不一致' });
      return;
    }
    const result = updatePassword(pwdCurrent, pwdNew);
    if (result.success) {
      setPasswordMsg({ type: 'success', text: '密码已更新' });
      setPwdCurrent('');
      setPwdNew('');
      setPwdConfirm('');
      setTimeout(() => setPasswordMsg(null), 2000);
    } else {
      setPasswordMsg({ type: 'error', text: result.error! });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className={`p-6 md:p-10 mt-8 ${cardClasses[layoutStyle]}`}
    >
      <h2 className="text-xl font-black uppercase tracking-wider mb-8 flex items-center space-x-2">
        <span className="w-2 h-6 bg-lavender block" />
        <span>账号管理</span>
        <UserCog size={20} className="text-cinema-ink/30 ml-2" />
      </h2>

      <div className="text-[10px] font-mono text-cinema-ink/40 mb-6">
        当前账号：<span className="font-bold text-cinema-ink">{getCredentials().username}</span>
      </div>

      <div className="space-y-8">
        {/* Change Username */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-cinema-ink/50">修改用户名</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cinema-ink/20" size={16} />
              <input
                type="password"
                value={usernamePwd}
                onChange={e => { setUsernamePwd(e.target.value); setUsernameMsg(null); }}
                placeholder="当前密码"
                className={`w-full border border-cinema-ink/20 focus:border-cinema-ink outline-none py-3 pl-10 pr-4 text-sm transition-colors ${
                  layoutStyle === 'neo' ? 'rounded-xl' : ''
                }`}
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-cinema-ink/20" size={16} />
              <input
                type="text"
                value={newUsername}
                onChange={e => { setNewUsername(e.target.value); setUsernameMsg(null); }}
                placeholder="新用户名"
                className={`w-full border border-cinema-ink/20 focus:border-cinema-ink outline-none py-3 pl-10 pr-4 text-sm transition-colors ${
                  layoutStyle === 'neo' ? 'rounded-xl' : ''
                }`}
              />
            </div>
          </div>
          {usernameMsg && (
            <p className={`text-[10px] font-bold uppercase tracking-tighter ${
              usernameMsg.type === 'success' ? 'text-green-600' : 'text-red-500'
            }`}>{usernameMsg.text}</p>
          )}
          <button
            onClick={handleUpdateUsername}
            disabled={!usernamePwd || !newUsername.trim()}
            className={`flex items-center justify-center space-x-2 py-3 px-6 font-black uppercase tracking-widest text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
              layoutStyle === 'neo' ? 'bg-cinema-ink text-white rounded-full hover:bg-lavender hover:text-cinema-ink' :
              'bg-cinema-ink text-white hover:bg-lavender hover:text-cinema-ink'
            }`}
          >
            <Save size={14} />
            <span>更新用户名</span>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-cinema-ink/5" />

        {/* Change Password */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-cinema-ink/50">修改密码</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cinema-ink/20" size={16} />
              <input
                type="password"
                value={pwdCurrent}
                onChange={e => { setPwdCurrent(e.target.value); setPasswordMsg(null); }}
                placeholder="当前密码"
                className={`w-full border border-cinema-ink/20 focus:border-cinema-ink outline-none py-3 pl-10 pr-4 text-sm transition-colors ${
                  layoutStyle === 'neo' ? 'rounded-xl' : ''
                }`}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cinema-ink/20" size={16} />
              <input
                type="password"
                value={pwdNew}
                onChange={e => { setPwdNew(e.target.value); setPasswordMsg(null); }}
                placeholder="新密码"
                className={`w-full border border-cinema-ink/20 focus:border-cinema-ink outline-none py-3 pl-10 pr-4 text-sm transition-colors ${
                  layoutStyle === 'neo' ? 'rounded-xl' : ''
                }`}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cinema-ink/20" size={16} />
              <input
                type="password"
                value={pwdConfirm}
                onChange={e => { setPwdConfirm(e.target.value); setPasswordMsg(null); }}
                placeholder="确认新密码"
                className={`w-full border border-cinema-ink/20 focus:border-cinema-ink outline-none py-3 pl-10 pr-4 text-sm transition-colors ${
                  layoutStyle === 'neo' ? 'rounded-xl' : ''
                }`}
              />
            </div>
          </div>
          {passwordMsg && (
            <p className={`text-[10px] font-bold uppercase tracking-tighter ${
              passwordMsg.type === 'success' ? 'text-green-600' : 'text-red-500'
            }`}>{passwordMsg.text}</p>
          )}
          <button
            onClick={handleUpdatePassword}
            disabled={!pwdCurrent || !pwdNew || !pwdConfirm}
            className={`flex items-center justify-center space-x-2 py-3 px-6 font-black uppercase tracking-widest text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
              layoutStyle === 'neo' ? 'bg-cinema-ink text-white rounded-full hover:bg-lavender hover:text-cinema-ink' :
              'bg-cinema-ink text-white hover:bg-lavender hover:text-cinema-ink'
            }`}
          >
            <Save size={14} />
            <span>更新密码</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface SettingsPanelProps {
  layoutStyle: 'swiss' | 'brutalist' | 'neo';
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ layoutStyle }) => {
  const [token, setToken] = useState(() => localStorage.getItem('cinema_tmdb_token') || '');
  const [showToken, setShowToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [saved, setSaved] = useState(false);

  const heroClasses = {
    swiss: "bg-cinema-ink text-white",
    brutalist: "bg-cinema-ink text-white border-b-8 border-lavender",
    neo: "bg-gradient-to-br from-cinema-ink to-lavender-dark text-white rounded-b-[3rem]"
  };

  const cardClasses = {
    swiss: "bg-white border border-cinema-ink/10 shadow-sm",
    brutalist: "bg-white border-2 border-cinema-ink shadow-[6px_6px_0_#1a1a1a]",
    neo: "bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20"
  };

  const handleSave = () => {
    if (token.trim()) {
      localStorage.setItem('cinema_tmdb_token', token.trim());
    } else {
      localStorage.removeItem('cinema_tmdb_token');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    setConnectionStatus('testing');
    const ok = await testTmdbConnection(token.trim());
    setConnectionStatus(ok ? 'success' : 'error');
    setTesting(false);
  };

  return (
    <div className="pt-20 pb-24 min-h-screen">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`px-6 md:px-12 py-16 md:py-24 ${heroClasses[layoutStyle]}`}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-12 h-12 flex items-center justify-center ${
              layoutStyle === 'neo' ? 'bg-white/20 rounded-full' : 'bg-lavender'
            }`}>
              <Key size={24} className={layoutStyle === 'neo' ? 'text-white' : 'text-cinema-ink'} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Admin Panel</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">设置</h1>
          <p className={`text-lg md:text-xl opacity-70 max-w-xl ${layoutStyle === 'brutalist' ? 'font-mono' : 'font-serif italic'}`}>
            管理 TMDB API 连接、账号与系统配置
          </p>
        </div>
      </motion.div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 md:p-10 ${cardClasses[layoutStyle]}`}
        >
          <h2 className="text-xl font-black uppercase tracking-wider mb-8 flex items-center space-x-2">
            <span className="w-2 h-6 bg-lavender block" />
            <span>TMDB API 配置</span>
          </h2>

          <div className="space-y-6">
            {/* Token Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-cinema-ink/60">
                API Read Access Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={e => {
                    setToken(e.target.value);
                    setConnectionStatus('idle');
                  }}
                  placeholder="eyJhbGciOiJIUzI1NiJ9..."
                  className={`w-full border border-cinema-ink/20 focus:border-cinema-ink outline-none p-4 pr-12 text-sm font-mono transition-colors ${
                    layoutStyle === 'neo' ? 'rounded-xl' : ''
                  }`}
                />
                <button
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cinema-ink/40 hover:text-cinema-ink transition-colors"
                  type="button"
                >
                  {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-[10px] text-cinema-ink/40 leading-relaxed">
                在 <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="underline hover:text-cinema-ink">themoviedb.org/settings/api</a> 获取你的 API Read Access Token。Token 将安全存储在浏览器本地。
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSave}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 font-black uppercase tracking-widest text-sm transition-all ${
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-cinema-ink text-white hover:bg-lavender hover:text-cinema-ink'
                } ${layoutStyle === 'neo' ? 'rounded-full' : ''}`}
              >
                {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                <span>{saved ? '已保存' : '保存配置'}</span>
              </button>

              <button
                onClick={handleTest}
                disabled={!token.trim() || testing}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 font-black uppercase tracking-widest text-sm border-2 border-cinema-ink transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                  connectionStatus === 'success'
                    ? 'bg-green-50 text-green-700 border-green-500'
                    : connectionStatus === 'error'
                    ? 'bg-red-50 text-red-700 border-red-500'
                    : 'hover:bg-zinc-50 text-cinema-ink'
                } ${layoutStyle === 'neo' ? 'rounded-full' : ''}`}
              >
                {connectionStatus === 'testing' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : connectionStatus === 'success' ? (
                  <CheckCircle size={18} />
                ) : connectionStatus === 'error' ? (
                  <XCircle size={18} />
                ) : (
                  <span className="text-lg">⚡</span>
                )}
                <span>
                  {connectionStatus === 'testing' ? '测试中...' :
                   connectionStatus === 'success' ? '连接成功' :
                   connectionStatus === 'error' ? '连接失败' : '测试连接'}
                </span>
              </button>
            </div>

            {/* Status Info */}
            <div className={`p-4 text-xs font-mono space-y-2 ${
              layoutStyle === 'neo' ? 'bg-zinc-50 rounded-2xl' : 'bg-zinc-50'
            }`}>
              <div className="flex justify-between">
                <span className="opacity-50">Token 状态:</span>
                <span className={token.trim() ? 'text-green-600 font-bold' : 'text-red-500'}>
                  {token.trim() ? '已配置' : '未配置'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">环境变量 (VITE_TMDB_READ_ACCESS_TOKEN):</span>
                <span className={import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN ? 'text-green-600 font-bold' : 'text-red-500'}>
                  {import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN ? '已设置' : '未设置'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">读取优先级:</span>
                <span className="font-bold">本地配置 → 环境变量</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Management Card */}
        <AccountCard layoutStyle={layoutStyle} />

        {/* Attributions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-cinema-ink/30">
            Powered by TMDB · Data provided by The Movie Database
          </p>
        </motion.div>
      </div>
    </div>
  );
};
