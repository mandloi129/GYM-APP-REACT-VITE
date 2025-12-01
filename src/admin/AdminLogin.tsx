
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage.ts';
import { Lock, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [phrase, setPhrase] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'login' | 'phrase' | 'reset'>('login');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await StorageService.verifyPassword(password);
    if (isValid) {
      sessionStorage.setItem('admin_session', 'true');
      navigate('/admin');
    } else {
      setError('Invalid password.');
    }
  };

  const verifyRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await StorageService.verifySecurityPhrase(phrase);
    if (isValid) {
      setStep('reset');
      setError('');
    } else {
      setError('Invalid security phrase. If you haven\'t set one in Settings, recovery is not possible.');
    }
  };

  const handleReset = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword.length < 4) {
          setError('Password too short');
          return;
      }
      await StorageService.updatePassword(newPassword);
      alert('Password updated successfully!');
      setStep('login');
      setPassword('');
      setError('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="bg-secondary rounded-full p-3 inline-block mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
          <p className="text-gray-500 mt-2">Restricted Access Only</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex items-center text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        {step === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-secondary focus:border-secondary"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-black text-white py-2 rounded font-bold hover:bg-gray-800 mb-4">
              Login
            </button>
            <button type="button" onClick={() => { setStep('phrase'); setError(''); }} className="w-full text-gray-500 text-sm hover:underline">
              Forgot Password?
            </button>
          </form>
        )}

        {step === 'phrase' && (
             <form onSubmit={verifyRecovery}>
                <h3 className="font-bold mb-2">Security Verification</h3>
                <p className="text-xs text-gray-500 mb-4">Enter your 6-word security phrase to reset your password.</p>
                <div className="mb-6">
                    <input
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        value={phrase}
                        onChange={e => setPhrase(e.target.value)}
                        placeholder="Enter phrase..."
                    />
                </div>
                <button type="submit" className="w-full bg-secondary text-white py-2 rounded font-bold hover:bg-secondary-hover mb-3">
                    Verify Phrase
                </button>
                <button type="button" onClick={() => { setStep('login'); setError(''); }} className="w-full text-gray-500 text-sm hover:underline">
                    Back to Login
                </button>
             </form>
        )}

        {step === 'reset' && (
             <form onSubmit={handleReset}>
                <h3 className="font-bold mb-4">Create New Password</h3>
                <div className="mb-6">
                    <input
                        type="password"
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="New Password"
                    />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
                    Update Password
                </button>
             </form>
        )}
      </div>
    </div>
  );
};
