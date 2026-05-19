import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Bell, AlertCircle, Calendar, LogOut, Tag, ChevronRight } from 'lucide-react';
 
const OperatorDashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [formData, setFormData] = useState({
    name: '', phone: '', city: '', project: '', budget: '', source: 'Manual'
  });
 
  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/leads');
      setLeads(data);
      const todayStr = new Date().setHours(0, 0, 0, 0);
      const activeReminders = data.filter(lead => {
        if (!lead.followUpDate) return false;
        const followDate = new Date(lead.followUpDate).setHours(0, 0, 0, 0);
        return followDate <= todayStr && lead.status !== 'Closed';
      });
      setReminders(activeReminders);
    } catch (err) { console.error("Error loading dashboard data", err); }
  };
 
  useEffect(() => { fetchDashboardData(); }, []);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leads', { ...formData, assignedTo: JSON.parse(localStorage.getItem('user'))._id });
      alert("Lead captured successfully!");
      setFormData({ name: '', phone: '', city: '', project: '', budget: '', source: 'Manual' });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving lead");
    }
  };
 
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };
 
  const statusStyle = (s) => {
    if (s === 'Closed') return { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.25)' };
    if (s === 'Hot Mature') return { bg: 'rgba(251,113,133,0.12)', color: '#fb7185', border: 'rgba(251,113,133,0.25)' };
    return { bg: 'rgba(212,167,96,0.1)', color: 'var(--accent)', border: 'rgba(212,167,96,0.25)' };
  };
 
  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'var(--surface-1)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '0.75rem 0.9rem',
    color: 'var(--text-primary)', fontSize: '0.83rem',
    outline: 'none', transition: 'border-color 160ms ease-out',
    fontFamily: 'var(--font-body)',
  };
 
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)', padding: '1.75rem 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
 
        {/* Header */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '1.75rem', paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase' }}>Operator</p>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              My Pipeline
            </h1>
          </div>
          <button onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              color: 'var(--text-muted)', borderRadius: 10,
              padding: '0.6rem 1rem', fontSize: '0.8rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 160ms ease-out',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fb7185'; e.currentTarget.style.borderColor = 'rgba(251,113,133,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <LogOut size={13} /> Logout
          </button>
        </header>
 
        {/* Reminders */}
        {reminders.length > 0 && (
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.65rem' }}>
              <Bell size={13} color="#f97316" />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', color: '#f97316', textTransform: 'uppercase' }}>Urgent Alerts — {reminders.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.65rem' }}>
              {reminders.map(lead => {
                const isOverdue = new Date(lead.followUpDate) < new Date().setHours(0, 0, 0, 0);
                return (
                  <Link to={`/lead/${lead._id}`} key={lead._id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.85rem 1rem', borderRadius: 12, textDecoration: 'none',
                      background: isOverdue ? 'rgba(251,113,133,0.07)' : 'rgba(251,191,36,0.07)',
                      border: `1px solid ${isOverdue ? 'rgba(251,113,133,0.3)' : 'rgba(251,191,36,0.3)'}`,
                      transition: 'all 160ms ease-out',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {isOverdue
                        ? <AlertCircle size={16} color="#fb7185" />
                        : <Calendar size={16} color="#fbbf24" />
                      }
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.8rem', color: isOverdue ? '#fb7185' : '#fbbf24' }}>
                          {isOverdue ? 'Overdue' : 'Due Today'}: {lead.name}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{lead.project || 'No project'} · {lead.phone}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
 
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          {/* Capture Form */}
          <div>
            <div style={{
              background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--border)', borderRadius: 20,
              padding: '1.5rem',
            }}>
              <h2 style={{
                margin: '0 0 1.25rem', fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <PlusCircle size={16} color="var(--accent)" /> Capture Lead
              </h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <input style={inputStyle} placeholder="Prospect Name" required value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <input style={inputStyle} placeholder="Phone Number" required value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <input style={inputStyle} placeholder="City" value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <input style={inputStyle} placeholder="Real Estate Project" value={formData.project}
                  onChange={e => setFormData({...formData, project: e.target.value})}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <input style={inputStyle} placeholder="Estimated Budget" value={formData.budget}
                  onChange={e => setFormData({...formData, budget: e.target.value})}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <select style={{...inputStyle, appearance: 'none', cursor: 'pointer'}}
                  value={formData.source}
                  onChange={e => setFormData({...formData, source: e.target.value})}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                >
                  <option value="Manual">Manual Entry</option>
                  <option value="Facebook">Facebook Campaign</option>
                  <option value="WhatsApp">WhatsApp Inbound</option>
                  <option value="Website">Website Form</option>
                </select>
                <button type="submit"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent) 0%, #b8860b 100%)',
                    color: '#0d0e14', border: 'none', borderRadius: 10,
                    padding: '0.8rem 1rem', fontSize: '0.83rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'all 160ms ease-out',
                    fontFamily: 'var(--font-body)', marginTop: '0.25rem',
                    boxShadow: '0 4px 16px rgba(212,167,96,0.28)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >Save & Register Prospect</button>
              </form>
            </div>
          </div>
 
          {/* Leads List */}
          <div>
            <div style={{
              background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--border)', borderRadius: 20,
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '1.1rem 1.5rem', borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'var(--surface-1)',
              }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>My Allocations</h2>
                <span style={{
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em',
                  background: 'var(--accent-subtle)', color: 'var(--accent)',
                  padding: '0.2rem 0.6rem', borderRadius: 6,
                  border: '1px solid rgba(212,167,96,0.3)',
                }}>{leads.length} RECORDS</span>
              </div>
              <div style={{ maxHeight: 530, overflowY: 'auto' }}>
                {leads.length === 0 ? (
                  <p style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
                    No prospects routed to your desk.
                  </p>
                ) : leads.map(lead => {
                  const sc = statusStyle(lead.status);
                  return (
                    <Link to={`/lead/${lead._id}`} key={lead._id}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.9rem 1.5rem', textDecoration: 'none',
                        borderBottom: '1px solid var(--border)',
                        transition: 'background 120ms ease-out',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{lead.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {lead.project || 'General Inquiry'} · {lead.phone}
                        </p>
                      </div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '0.2rem 0.55rem', borderRadius: 6,
                        fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
                        background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                        whiteSpace: 'nowrap',
                      }}>
                        <Tag size={9} />{lead.status}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default OperatorDashboard;






// import { useState, useEffect } from 'react';
// import api from '../../api/axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { User, PlusCircle, Bell, AlertCircle, Calendar, LogOut, CheckCircle } from 'lucide-react';

// const OperatorDashboard = () => {
//   const navigate = useNavigate();
//   const [leads, setLeads] = useState([]);
//   const [reminders, setReminders] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '', phone: '', city: '', project: '', budget: '', source: 'Manual'
//   });

//   const fetchDashboardData = async () => {
//     try {
//       const { data } = await api.get('/leads');
//       setLeads(data);

//       // Filter today's and overdue reminders (Requirement #5)
//       const todayStr = new Date().setHours(0,0,0,0);
//       const activeReminders = data.filter(lead => {
//         if (!lead.followUpDate) return false;
//         const followDate = new Date(lead.followUpDate).setHours(0,0,0,0);
//         return followDate <= todayStr && lead.status !== 'Closed';
//       });
//       setReminders(activeReminders);
//     } catch (err) { console.error("Error loading dashboard data", err); }
//   };

//   useEffect(() => { fetchDashboardData(); }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/leads', { ...formData, assignedTo: JSON.parse(localStorage.getItem('user'))._id });
//       alert("Lead captured successfully!");
//       setFormData({ name: '', phone: '', city: '', project: '', budget: '', source: 'Manual' });
//       fetchDashboardData();
//     } catch (err) {
//       alert(err.response?.data?.message || "Error saving lead");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     window.location.reload();
//   };

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         {/* Header Layout */}
//         <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//           <h1 className="text-xl font-bold flex items-center gap-2 text-gray-800">
//             <User className="text-blue-600" /> Operator Panel
//           </h1>
//           <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 transition">
//             <LogOut size={16} /> Logout
//           </button>
//         </div>

//         {/* Reminders & Alerts Section (Requirement #5) */}
//         {reminders.length > 0 && (
//           <div className="mb-6 space-y-2">
//             <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
//               <Bell size={14} className="text-orange-500 animate-pulse" /> Urgent Alerts
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {reminders.map(lead => {
//                 const isOverdue = new Date(lead.followUpDate) < new Date().setHours(0,0,0,0);
//                 return (
//                   <Link to={`/lead/${lead._id}`} key={lead._id} className={`flex items-center justify-between p-3 rounded-xl border shadow-sm transition hover:scale-[1.01] ${isOverdue ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
//                     <div className="flex items-center gap-3">
//                       {isOverdue ? <AlertCircle className="text-red-500" size={18} /> : <Calendar className="text-amber-500" size={18} />}
//                       <div>
//                         <p className={`font-bold text-xs ${isOverdue ? 'text-red-800' : 'text-amber-800'}`}>
//                           {isOverdue ? 'Overdue Action Needed' : 'Follow-up Due Today'}: {lead.name}
//                         </p>
//                         <p className="text-[11px] text-gray-500">{lead.project || 'No project listed'} | {lead.phone}</p>
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Lead Input Form */}
//           <div className="lg:col-span-1">
//             <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
//               <h2 className="text-base font-bold flex items-center gap-2 text-gray-700"><PlusCircle size={18}/> Capture Lead</h2>
//               <input className="w-full p-2.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Prospect Name"规则 required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
//               <input className="w-full p-2.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
//               <input className="w-full p-2.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="City Location" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
//               <input className="w-full p-2.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Real Estate Project" value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} />
//               <input className="w-full p-2.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Estimated Budget" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
//               <select className="w-full p-2.5 text-sm border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-600" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
//                 <option value="Manual">Manual Entry</option>
//                 <option value="Facebook">Facebook Campaign</option>
//                 <option value="WhatsApp">WhatsApp Inbound</option>
//                 <option value="Website">Website Form</option>
//               </select>
//               <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm">Save & Register Prospect</button>
//             </form>
//           </div>

//           {/* Assigned Pipeline Output List */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
//                 <h2 className="font-bold text-gray-700 text-sm">My Active Allocations</h2>
//                 <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100">{leads.length} Records</span>
//               </div>
//               <div className="divide-y max-h-[530px] overflow-y-auto">
//                 {leads.length === 0 ? (
//                   <p className="p-8 text-center text-sm text-gray-400 italic">No prospects currently routed to your desk.</p>
//                 ) : (
//                   leads.map(lead => (
//                     <Link to={`/lead/${lead._id}`} key={lead._id} className="p-4 flex justify-between items-center hover:bg-gray-50/80 transition">
//                       <div>
//                         <p className="font-bold text-sm text-gray-800">{lead.name}</p>
//                         <p className="text-xs text-gray-400 mt-0.5">{lead.project || 'General Inquiry'} • {lead.phone}</p>
//                       </div>
//                       <div className="text-right">
//                         <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
//                           lead.status === 'Closed' ? 'bg-green-50 text-green-700 border border-green-100' :
//                           lead.status === 'Hot Mature' ? 'bg-red-50 text-red-700 border border-red-100' :
//                           'bg-amber-50 text-amber-700 border border-amber-100'
//                         }`}>
//                           {lead.status}
//                         </span>
//                       </div>
//                     </Link>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OperatorDashboard;