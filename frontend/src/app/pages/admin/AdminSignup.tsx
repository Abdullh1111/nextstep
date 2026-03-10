import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { useSignupMutation } from '../../services/nextstepApi';

export function AdminSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [signup] = useSignupMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      await signup({ email, password, name }).unwrap();
      toast.success('Admin account created successfully! You can now login.');
      setTimeout(() => {
        navigate('/admin/login');
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D69EA] to-[#0952ba] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <UserPlus className="h-8 w-8 text-[#0D69EA]" />
          </div>
          <h1 className="text-3xl mb-2">Create Admin Account</h1>
          <p className="text-gray-600">NextStep.xyz - First Time Setup</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent disabled:opacity-50"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin Name"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent disabled:opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nextstep.xyz"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                disabled={loading}
                minLength={6}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent disabled:opacity-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block mb-2 text-sm">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                disabled={loading}
                minLength={6}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent disabled:opacity-50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0D69EA] text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/admin/login" className="text-[#0D69EA] hover:underline">
              Login here
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
          <p className="mb-2">⚠️ Important Security Notes:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>This creates your main admin account</li>
            <li>Use a strong, unique password</li>
            <li>Keep your credentials secure</li>
            <li>You can only signup once per email</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
