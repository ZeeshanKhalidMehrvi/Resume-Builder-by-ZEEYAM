import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">AI Resume Builder</h1>
        <p className="text-slate-600 mb-8">Enter your email to sign in or create an account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Email Address"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-6">
          Your resume data is stored locally in your browser, linked to your email address.
        </p>
      </div>
    </div>
  );
};

export default Login;