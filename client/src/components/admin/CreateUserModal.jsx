import { useState } from 'react';
import api from '../../api/axios';
import { X, UserPlus, ChevronDown } from 'lucide-react';
 
const CreateUserModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'operator' });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/create', formData);
      alert('User created successfully!');
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating user');
    }
  };
 
  if (!isOpen) return null;
 
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(8,9,14,0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
      animation: 'fadeIn 160ms ease-out',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        .modal-input { 
          width: 100%; box-sizing: border-box;
          background: var(--surface-1); border: 1px solid var(--border);
          border-radius: 10px; padding: 0.8rem 1rem;
          color: var(--text-primary); font-size: 0.875rem;
          outline: none; transition: border-color 160ms ease-out;
          font-family: var(--font-body);
        }
        .modal-input:focus { border-color: var(--accent); }
        .modal-input::placeholder { color: var(--text-muted); }
      `}</style>
 
      <div style={{
        background: 'var(--surface-0)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '2rem',
        width: '100%', maxWidth: 420,
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--accent-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <UserPlus size={16} color="var(--accent)" />
            </div>
            <div>
              <h2 style={{
                margin: 0, fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem', fontWeight: 700,
                color: 'var(--text-primary)', letterSpacing: '-0.02em',
              }}>Register Staff</h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Add a new team member</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 160ms ease-out', color: 'var(--text-muted)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-1)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <X size={14} />
          </button>
        </div>
 
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <input className="modal-input" placeholder="Full Name"
            onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input className="modal-input" type="email" placeholder="Email Address"
            onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input className="modal-input" type="password" placeholder="Password"
            onChange={(e) => setFormData({...formData, password: e.target.value})} required />
 
          <div style={{ position: 'relative' }}>
            <select
              className="modal-input"
              style={{ appearance: 'none', paddingRight: '2.5rem' }}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="operator">Operator</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
            <ChevronDown size={14} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
            }} />
          </div>
 
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem' }}>
            <button
              type="button" onClick={onClose}
              style={{
                flex: 1, padding: '0.8rem', borderRadius: 10,
                background: 'var(--surface-1)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 160ms ease-out',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-1)'}
            >Cancel</button>
            <button
              type="submit"
              style={{
                flex: 1, padding: '0.8rem', borderRadius: 10,
                background: 'linear-gradient(135deg, var(--accent) 0%, #b8860b 100%)',
                border: 'none',
                color: '#0d0e14', fontSize: '0.875rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 160ms ease-out',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 4px 16px rgba(212,167,96,0.28)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >Create Account</button>
          </div>
        </form>
      </div>
    </div>
  );
};
 
export default CreateUserModal;





// import { useState } from 'react';
// import api from '../../api/axios';

// const CreateUserModal = ({ isOpen, onClose }) => {
//   const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'operator' });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/users/create', formData);
//       alert('User created successfully!');
//       onClose();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Error creating user');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">Register New Staff</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input className="w-full border p-2 rounded" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
//           <input className="w-full border p-2 rounded" type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
//           <input className="w-full border p-2 rounded" type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
//           <select className="w-full border p-2 rounded" onChange={(e) => setFormData({...formData, role: e.target.value})}>
//             <option value="operator">Operator</option>
//             <option value="admin">Admin</option>
//             <option value="owner">Owner</option>
//           </select>
//           <div className="flex gap-2">
//             <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded">Create Account</button>
//             <button type="button" onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateUserModal;