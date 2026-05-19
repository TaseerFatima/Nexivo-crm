
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Zap } from 'lucide-react';
 
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface-0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Atmospheric background blobs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: '40vw', height: '40vw', maxWidth: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,167,96,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', right: '-5%',
        width: '35vw', height: '35vw', maxWidth: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
 
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Brand mark */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--accent) 0%, #b8860b 100%)',
            marginBottom: '1.25rem',
            boxShadow: '0 8px 32px rgba(212,167,96,0.35)',
          }}>
            <Zap size={24} color="#0d0e14" strokeWidth={2.5} />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem', fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0, letterSpacing: '-0.03em',
          }}>Nexivo CRM</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.875rem' }}>
            Sales intelligence platform
          </p>
        </div>
 
        {/* Card */}
        <div style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          padding: '2.25rem',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border)',
                  borderRadius: 12, padding: '0.85rem 1rem 0.85rem 2.75rem',
                  color: 'var(--text-primary)', fontSize: '0.9rem',
                  outline: 'none', transition: 'border-color 160ms ease-out',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
 
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border)',
                  borderRadius: 12, padding: '0.85rem 1rem 0.85rem 2.75rem',
                  color: 'var(--text-primary)', fontSize: '0.9rem',
                  outline: 'none', transition: 'border-color 160ms ease-out',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
 
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: loading ? 'var(--surface-2)' : 'linear-gradient(135deg, var(--accent) 0%, #b8860b 100%)',
                color: loading ? 'var(--text-muted)' : '#0d0e14',
                border: 'none', borderRadius: 12,
                padding: '0.9rem 1.5rem', fontSize: '0.9rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 160ms ease-out',
                fontFamily: 'var(--font-body)',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(212,167,96,0.3)',
                letterSpacing: '0.02em',
                marginTop: '0.25rem',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ArrowRight size={16} strokeWidth={2.5} />}
            </button>
          </form>
        </div>
 
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          Nexivo Holdings · Internal Platform
        </p>
      </div>
    </div>
  );
};
 
export default Login;




// import { useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { login } = useContext(AuthContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
//       login(res.data);
//     } catch (err) {
//       alert(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Nexivo CRM Login</h2>
//         <div className="space-y-4">
//           <input 
//             type="email" 
//             placeholder="Email Address" 
//             className="w-full p-3 border rounded focus:outline-blue-500"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input 
//             type="password" 
//             placeholder="Password" 
//             className="w-full p-3 border rounded focus:outline-blue-500"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition">
//             Login
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;