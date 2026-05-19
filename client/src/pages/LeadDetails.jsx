
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, MessageSquare, History, CheckCircle, MapPin, Building, Wallet, Radio, ChevronDown, Tag, Clock } from 'lucide-react';
 
const STATUS_LIST = ['New', 'Contacted', 'Follow-up', 'Interested', 'Hot Mature', 'Closed', 'Not Interested'];
 
const statusStyle = (s) => {
  if (s === 'Closed') return { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.25)' };
  if (s === 'Hot Mature') return { bg: 'rgba(251,113,133,0.12)', color: '#fb7185', border: 'rgba(251,113,133,0.25)' };
  return { bg: 'rgba(212,167,96,0.1)', color: 'var(--accent)', border: 'rgba(212,167,96,0.25)' };
};
 
const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [note, setNote] = useState('');
 
  const fetchDetails = async () => {
    try {
      const { data } = await api.get(`/leads/${id}`);
      setLead(data);
    } catch (err) { console.error(err); }
  };
 
  useEffect(() => { fetchDetails(); }, [id]);
 
  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.patch(`/leads/${id}/status`, { status: newStatus });
      fetchDetails();
    } catch (err) { alert("Update failed"); }
  };
 
  const handleDateUpdate = async (date) => {
    try {
      await api.patch(`/leads/${id}/status`, { followUpDate: date });
      fetchDetails();
      alert("Follow-up date set!");
    } catch (err) { alert("Failed to set date"); }
  };
 
  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/leads/${id}/notes`, { text: note });
      setNote('');
      fetchDetails();
    } catch (err) { alert("Failed to add note"); }
  };
 
  if (!lead) return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      Loading…
    </div>
  );
 
  const sc = statusStyle(lead.status);
 
  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'var(--surface-1)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '0.75rem 0.9rem',
    color: 'var(--text-primary)', fontSize: '0.85rem',
    outline: 'none', transition: 'border-color 160ms ease-out',
    fontFamily: 'var(--font-body)',
  };
 
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)', padding: '1.75rem 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
 
        {/* Back button */}
        <button onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', color: 'var(--accent)',
            fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer',
            marginBottom: '1.5rem', fontFamily: 'var(--font-body)',
            padding: 0, transition: 'opacity 160ms',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <ArrowLeft size={15} /> Back to List
        </button>
 
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
 
          {/* Profile Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--border)', borderRadius: 20, padding: '1.75rem',
            }}>
              {/* Avatar + Name */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--accent) 0%, #b8860b 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', fontWeight: 800, color: '#0d0e14',
                  marginBottom: '0.85rem',
                  fontFamily: 'var(--font-heading)',
                }}>
                  {lead.name?.charAt(0).toUpperCase()}
                </div>
                <h1 style={{ margin: '0 0 2px', fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {lead.name}
                </h1>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.83rem' }}>{lead.phone}</p>
              </div>
 
              {/* Status badge */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '0.3rem 0.75rem', borderRadius: 8, marginBottom: '1.5rem',
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em',
                background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
              }}>
                <Tag size={10} />{lead.status}
              </span>
 
              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { icon: <Building size={13} />, label: 'Project', val: lead.project },
                  { icon: <MapPin size={13} />, label: 'City', val: lead.city },
                  { icon: <Radio size={13} />, label: 'Source', val: lead.source },
                  { icon: <Wallet size={13} />, label: 'Budget', val: lead.budget },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: 'var(--text-muted)', marginTop: 2 }}>{icon}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</p>
                      <p style={{ margin: '1px 0 0', fontSize: '0.83rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{val || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
 
              {/* Status Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Update Status
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    style={{
                      ...inputStyle, appearance: 'none', paddingRight: '2rem', cursor: 'pointer',
                      fontWeight: 700, color: sc.color,
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  >
                    {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>
 
            {/* Follow-up date */}
            <div style={{
              background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                <Clock size={12} color="var(--accent)" /> Follow-up Date
              </label>
              <input
                type="date"
                onChange={(e) => handleDateUpdate(e.target.value)}
                value={lead.followUpDate?.split('T')[0] || ''}
                style={{...inputStyle, colorScheme: 'dark'}}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>
 
          {/* Notes Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
 
            {/* Add Note */}
            <div style={{
              background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--border)', borderRadius: 20, padding: '1.5rem',
            }}>
              <h2 style={{ margin: '0 0 1.1rem', fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageSquare size={16} color="var(--accent)" /> Log Interaction
              </h2>
              <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <textarea
                  rows="3"
                  placeholder="What was the outcome of the call or meeting?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                  style={{
                    ...inputStyle, resize: 'vertical', lineHeight: '1.5',
                    padding: '0.85rem 1rem',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button type="submit"
                  style={{
                    alignSelf: 'flex-start',
                    background: 'linear-gradient(135deg, var(--accent) 0%, #b8860b 100%)',
                    color: '#0d0e14', border: 'none', borderRadius: 10,
                    padding: '0.7rem 1.5rem', fontSize: '0.83rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'all 160ms ease-out',
                    fontFamily: 'var(--font-body)',
                    boxShadow: '0 4px 16px rgba(212,167,96,0.25)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Save Note
                </button>
              </form>
            </div>
 
            {/* Timeline */}
            <div style={{
              background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--border)', borderRadius: 20, padding: '1.5rem',
            }}>
              <h2 style={{ margin: '0 0 1.25rem', fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <History size={16} color="var(--accent)" /> Interaction Timeline
              </h2>
 
              {lead.notes.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.83rem' }}>No interactions logged yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[...lead.notes].reverse().map((n, i) => (
                    <div key={i}
                      style={{
                        display: 'flex', gap: '0.9rem',
                        padding: '1rem 1.1rem', borderRadius: 12,
                        background: 'var(--surface-1)', border: '1px solid var(--border)',
                        transition: 'border-color 160ms ease-out',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,167,96,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        background: 'var(--accent-subtle)', border: '1px solid rgba(212,167,96,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <CheckCircle size={14} color="var(--accent)" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{n.text}</p>
                        <p style={{ margin: '5px 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {new Date(n.createdAt).toLocaleString()} · {n.createdBy?.name || 'System'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default LeadDetails;








// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api/axios';
// import { ArrowLeft, MessageSquare, History, CheckCircle } from 'lucide-react';

// const LeadDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [lead, setLead] = useState(null);
//   const [note, setNote] = useState('');

//   const fetchDetails = async () => {
//     try {
//       const { data } = await api.get(`/leads/${id}`);
//       setLead(data);
//     } catch (err) { console.error(err); }
//   };

//   useEffect(() => { fetchDetails(); }, [id]);

//   const handleStatusUpdate = async (newStatus) => {
//     try {
//       await api.patch(`/leads/${id}/status`, { status: newStatus });
//       fetchDetails();
//     } catch (err) { alert("Update failed"); }
//   };

//   const handleDateUpdate = async (date) => {
//   try {
//     // You'll need to add a quick route/controller for this or use a general update route
//     await api.patch(`/leads/${id}/status`, { followUpDate: date }); 
//     setFollowUpDate(date);
//     alert("Follow-up date set!");
//   } catch (err) { alert("Failed to set date"); }
// };

//   const handleAddNote = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post(`/leads/${id}/notes`, { text: note });
//       setNote('');
//       fetchDetails();
//     } catch (err) { alert("Failed to add note"); }
//   };

//   if (!lead) return <div className="p-10 text-center">Loading...</div>;

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">
//       <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-blue-600 font-medium">
//         <ArrowLeft size={18}/> Back to List
//       </button>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Profile Card */}
//         <div className="lg:col-span-1 space-y-6">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <h1 className="text-2xl font-bold text-gray-800">{lead.name}</h1>
//             <p className="text-gray-500 mb-4">{lead.phone}</p>
//             <div className="space-y-2 text-sm">
//               <p><strong>Project:</strong> {lead.project}</p>
//               <p><strong>City:</strong> {lead.city}</p>
//               <p><strong>Source:</strong> {lead.source}</p>
//               <p><strong>Budget:</strong> {lead.budget}</p>
//             </div>

//             <div className="mt-6 pt-6 border-t">
//               <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Update Status</label>
//               <select 
//                 className="w-full p-2 border rounded bg-blue-50 text-blue-800 font-bold"
//                 value={lead.status}
//                 onChange={(e) => handleStatusUpdate(e.target.value)}
//               >
//                 {['New','Contacted','Follow-up','Interested','Hot Mature','Closed','Not Interested'].map(s => (
//                   <option key={s} value={s}>{s}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Notes & Interaction History (Requirement #6) */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MessageSquare size={20}/> Add Note</h2>
//             <form onSubmit={handleAddNote} className="space-y-3">
//               <textarea 
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
//                 rows="3" 
//                 placeholder="What was the outcome of the call?"
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 required
//               ></textarea>
//               <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Save Interaction</button>
//             </form>
//           </div>

//           <div className="mt-4 pt-4 border-t">
//             <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Set Follow-up Date</label>
//              <input 
//               type="date" 
//               className="w-full p-2 border rounded text-sm"
//               onChange={(e) => handleDateUpdate(e.target.value)}
//               value={lead.followUpDate?.split('T')[0] || ''}
//               />
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><History size={20}/> Interaction Timeline</h2>
//             <div className="space-y-4">
//               {lead.notes.map((n, i) => (
//                 <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
//                   <div className="bg-blue-100 p-2 rounded-full h-fit text-blue-600"><CheckCircle size={16}/></div>
//                   <div>
//                     <p className="text-sm text-gray-800">{n.text}</p>
//                     <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()} by {n.createdBy?.name || 'System'}</p>
//                   </div>
//                 </div>
//               )).reverse()}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadDetails;