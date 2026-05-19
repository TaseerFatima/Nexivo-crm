import { useEffect, useState } from 'react';
import axios from 'axios';
import CreateUserModal from '../../components/admin/CreateUserModal';
import { Users, TrendingUp, Star, LogOut, UserPlus, Tag, Filter, MapPin, Building, RefreshCw, UserCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [operators, setOperators] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Requirement #10: Filter State Management
  const [filters, setFilters] = useState({ status: '', project: '', city: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      // Fetch matching leads with active filter parameters
      const leadRes = await axios.get('http://localhost:5000/api/leads', {
        ...authConfig,
        params: { ...filters, search: searchTerm }
      });
      setLeads(leadRes.data);

      // Fetch users to populate the operator fields and tracking cards
      const userRes = await axios.get('http://localhost:5000/api/users', authConfig);
      setOperators(userRes.data.filter(u => u.role === 'operator'));
    } catch (err) {
      console.error("Error synchronizing admin workspace panel:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, searchTerm]);

  // Requirement #4: Manual Route Assignment Handler
  const handleAssign = async (leadId, operatorId) => {
    try {
      await axios.patch(`http://localhost:5000/api/leads/${leadId}/assign`, 
        { assignedTo: operatorId }, 
        authConfig
      );
      fetchData(); // Refresh metrics instantly
    } catch (err) {
      alert("Lead migration routing failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  const hotLeads = leads.filter(l => l.status === 'Hot Mature').length;
  const closedLeads = leads.filter(l => l.status === 'Closed').length;

  const statusColor = (status) => {
    if (status === 'Closed') return { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.25)' };
    if (status === 'Hot Mature') return { bg: 'rgba(251,113,133,0.12)', color: '#fb7185', border: 'rgba(251,113,133,0.25)' };
    return { bg: 'rgba(212,167,96,0.12)', color: 'var(--accent)', border: 'rgba(212,167,96,0.25)' };
  };

  // Custom Inline CSS Input Style to preserve theme alignment
  const inputStyle = {
    background: 'var(--surface-1)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: 8,
    padding: '0.5rem 0.75rem',
    fontSize: '0.82rem',
    outline: 'none',
    fontFamily: 'var(--font-body)'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '2.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}>Admin Control</p>
            <h1 style={{
              margin: 0, fontFamily: 'var(--font-heading)',
              fontSize: '1.75rem', fontWeight: 700,
              color: 'var(--text-primary)', letterSpacing: '-0.03em',
            }}>Pipeline Overview</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'linear-gradient(135deg, var(--accent) 0%, #b8860b 100%)',
                color: '#0d0e14', border: 'none', borderRadius: 10,
                padding: '0.65rem 1.1rem', fontSize: '0.82rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 160ms ease-out',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 4px 16px rgba(212,167,96,0.28)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <UserPlus size={14} /> Add Staff
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'var(--surface-1)', border: '1px solid var(--border)',
                color: 'var(--text-muted)', borderRadius: 10,
                padding: '0.65rem 1rem', fontSize: '0.82rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 160ms ease-out',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fb7185'; e.currentTarget.style.borderColor = 'rgba(251,113,133,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        {/* Stat Cards Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { icon: <Users size={20} />, label: 'Total Leads', value: leads.length, accent: 'var(--accent)' },
            { icon: <Star size={20} />, label: 'Hot Prospects', value: hotLeads, accent: '#fb7185' },
            { icon: <TrendingUp size={20} />, label: 'Closed Deals', value: closedLeads, accent: '#34d399' },
          ].map((card, i) => (
            <div key={i} style={{
              background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--border)', borderRadius: 16,
              padding: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              transition: 'all 160ms ease-out',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = card.accent; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `${card.accent}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: card.accent,
              }}>{card.icon}</div>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{card.label}</p>
                <h3 style={{ margin: '0.2rem 0 0', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>{card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Requirement #8: Active Field Operator Allocation Tracker */}
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border)', borderRadius: 20,
          padding: '1.5rem', marginBottom: '2.5rem'
        }}>
          <h2 style={{ margin: '0 0 1.25rem 0', fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserCheck size={16} style={{ color: 'var(--accent)' }} /> Operator Workloads
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {operators.map(op => {
              const count = leads.filter(l => l.assignedTo?._id === op._id).length;
              return (
                <div key={op._id} style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 12 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{op.name}</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Handled: <strong style={{ color: 'var(--accent)' }}>{count} Leads</strong></p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Requirement #10: Interactive Structure Filtering Panel */}
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border)', borderRadius: 16,
          padding: '1rem 1.5rem', marginBottom: '1.5rem',
          display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            <Filter size={14} /> FILTERS:
          </div>
          
          <input 
            style={inputStyle}
            placeholder="Search name or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select 
            style={inputStyle}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            {['New', 'Contacted', 'Follow-up', 'Interested', 'Hot Mature', 'Closed', 'Not Interested'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <MapPin size={12} style={{ position: 'absolute', left: 10, color: 'var(--text-muted)' }} />
            <input 
              style={{ ...inputStyle, paddingLeft: '1.85rem' }}
              placeholder="City location..."
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Building size={12} style={{ position: 'absolute', left: 10, color: 'var(--text-muted)' }} />
            <input 
              style={{ ...inputStyle, paddingLeft: '1.85rem' }}
              placeholder="Project..."
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value })}
            />
          </div>

          {(filters.status || filters.project || filters.city || searchTerm) && (
            <button 
              onClick={() => { setFilters({ status: '', project: '', city: '' }); setSearchTerm(''); }}
              style={{ background: 'none', border: 'none', color: '#fb7185', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginLeft: 'auto' }}
            >
              <RefreshCw size={12} /> Clear
            </button>
          )}
        </div>

        {/* Leads Table */}
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border)', borderRadius: 20,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Lead Registry</h2>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
              background: 'var(--accent-subtle)', color: 'var(--accent)',
              padding: '0.25rem 0.65rem', borderRadius: 6,
              border: '1px solid rgba(212,167,96,0.3)',
            }}>{leads.length} RECORDS</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  {['Name', 'Project / City', 'Status', 'Assigned Operator Allocations'].map(h => (
                    <th key={h} style={{
                      padding: '0.85rem 1.5rem', textAlign: 'left',
                      fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
                      color: 'var(--text-muted)', textTransform: 'uppercase',
                      background: 'var(--surface-1)', borderBottom: '1px solid var(--border)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '2rem', textCenter: 'center', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>No leads match current tracking constraints.</td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const sc = statusColor(lead.status);
                    return (
                      <tr key={lead._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 120ms ease-out' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                          <div>{lead.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: 2 }}>{lead.phone}</div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                          <div>{lead.project || '—'}</div>
                          {lead.city && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lead.city}</div>}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '0.25rem 0.65rem', borderRadius: 6,
                            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em',
                            background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                          }}>
                            <Tag size={10} />
                            {lead.status}
                          </span>
                        </td>
                        {/* Requirement #4 & #13: Manual Dropdown Routing Action Column */}
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <select
                            style={{
                              ...inputStyle,
                              background: 'var(--surface-0)',
                              padding: '0.4rem 0.5rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                            value={lead.assignedTo?._id || ''}
                            onChange={(e) => handleAssign(lead._id, e.target.value)}
                          >
                            <option value="" style={{ color: 'var(--text-muted)' }}>Unassigned / Round Robin</option>
                            {operators.map(op => (
                              <option key={op._id} value={op._id}>{op.name}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateUserModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchData(); }} />
    </div>
  );
};

export default AdminDashboard;







// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import CreateUserModal from '../../components/admin/CreateUserModal';
// import { Users, TrendingUp, Star, LogOut, UserPlus, Tag } from 'lucide-react';
 
// const AdminDashboard = () => {
//   const [leads, setLeads] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
 
//   useEffect(() => {
//     const fetchLeads = async () => {
//       const { data } = await axios.get('http://localhost:5000/api/leads', {
//         headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
//       });
//       setLeads(data);
//     };
//     fetchLeads();
//   }, []);
 
//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     window.location.reload();
//   };
 
//   const hotLeads = leads.filter(l => l.status === 'Hot Mature').length;
//   const closedLeads = leads.filter(l => l.status === 'Closed').length;
 
//   const statusColor = (status) => {
//     if (status === 'Closed') return { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.25)' };
//     if (status === 'Hot Mature') return { bg: 'rgba(251,113,133,0.12)', color: '#fb7185', border: 'rgba(251,113,133,0.25)' };
//     return { bg: 'rgba(212,167,96,0.12)', color: 'var(--accent)', border: 'rgba(212,167,96,0.25)' };
//   };
 
//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--surface-0)', padding: '2rem 1.5rem' }}>
//       <div style={{ maxWidth: 1100, margin: '0 auto' }}>
 
//         {/* Header */}
//         <header style={{
//           display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//           marginBottom: '2.5rem',
//           paddingBottom: '1.5rem',
//           borderBottom: '1px solid var(--border)',
//         }}>
//           <div>
//             <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 4 }}>Admin Control</p>
//             <h1 style={{
//               margin: 0, fontFamily: 'var(--font-heading)',
//               fontSize: '1.75rem', fontWeight: 700,
//               color: 'var(--text-primary)', letterSpacing: '-0.03em',
//             }}>Pipeline Overview</h1>
//           </div>
//           <div style={{ display: 'flex', gap: '0.6rem' }}>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 7,
//                 background: 'linear-gradient(135deg, var(--accent) 0%, #b8860b 100%)',
//                 color: '#0d0e14', border: 'none', borderRadius: 10,
//                 padding: '0.65rem 1.1rem', fontSize: '0.82rem', fontWeight: 700,
//                 cursor: 'pointer', transition: 'all 160ms ease-out',
//                 fontFamily: 'var(--font-body)',
//                 boxShadow: '0 4px 16px rgba(212,167,96,0.28)',
//               }}
//               onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
//               onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//             >
//               <UserPlus size={14} /> Add Staff
//             </button>
//             <button
//               onClick={handleLogout}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 7,
//                 background: 'var(--surface-1)', border: '1px solid var(--border)',
//                 color: 'var(--text-muted)', borderRadius: 10,
//                 padding: '0.65rem 1rem', fontSize: '0.82rem', fontWeight: 600,
//                 cursor: 'pointer', transition: 'all 160ms ease-out',
//                 fontFamily: 'var(--font-body)',
//               }}
//               onMouseEnter={e => { e.currentTarget.style.color = '#fb7185'; e.currentTarget.style.borderColor = 'rgba(251,113,133,0.4)'; }}
//               onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
//             >
//               <LogOut size={14} /> Logout
//             </button>
//           </div>
//         </header>
 
//         {/* Stat Cards */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
//           {[
//             { icon: <Users size={20} />, label: 'Total Leads', value: leads.length, accent: 'var(--accent)' },
//             { icon: <Star size={20} />, label: 'Hot Prospects', value: hotLeads, accent: '#fb7185' },
//             { icon: <TrendingUp size={20} />, label: 'Closed Deals', value: closedLeads, accent: '#34d399' },
//           ].map((card, i) => (
//             <div key={i} style={{
//               background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
//               WebkitBackdropFilter: 'blur(20px)',
//               border: '1px solid var(--border)', borderRadius: 16,
//               padding: '1.5rem',
//               display: 'flex', alignItems: 'center', gap: '1rem',
//               transition: 'all 160ms ease-out',
//             }}
//               onMouseEnter={e => { e.currentTarget.style.borderColor = card.accent; e.currentTarget.style.transform = 'translateY(-2px)'; }}
//               onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
//             >
//               <div style={{
//                 width: 44, height: 44, borderRadius: 12, flexShrink: 0,
//                 background: `${card.accent}18`,
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 color: card.accent,
//               }}>{card.icon}</div>
//               <div>
//                 <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{card.label}</p>
//                 <h3 style={{ margin: '0.2rem 0 0', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>{card.value}</h3>
//               </div>
//             </div>
//           ))}
//         </div>
 
//         {/* Leads Table */}
//         <div style={{
//           background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
//           WebkitBackdropFilter: 'blur(20px)',
//           border: '1px solid var(--border)', borderRadius: 20,
//           overflow: 'hidden',
//         }}>
//           <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Lead Registry</h2>
//             <span style={{
//               fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
//               background: 'var(--accent-subtle)', color: 'var(--accent)',
//               padding: '0.25rem 0.65rem', borderRadius: 6,
//               border: '1px solid rgba(212,167,96,0.3)',
//             }}>{leads.length} RECORDS</span>
//           </div>
//           <div style={{ overflowX: 'auto' }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
//               <thead>
//                 <tr>
//                   {['Name', 'Project', 'Status', 'Assigned To'].map(h => (
//                     <th key={h} style={{
//                       padding: '0.85rem 1.5rem', textAlign: 'left',
//                       fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
//                       color: 'var(--text-muted)', textTransform: 'uppercase',
//                       background: 'var(--surface-1)', borderBottom: '1px solid var(--border)',
//                     }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {leads.map((lead, i) => {
//                   const sc = statusColor(lead.status);
//                   return (
//                     <tr key={lead._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 120ms ease-out' }}
//                       onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-1)'}
//                       onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//                     >
//                       <td style={{ padding: '1rem 1.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>{lead.name}</td>
//                       <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{lead.project || '—'}</td>
//                       <td style={{ padding: '1rem 1.5rem' }}>
//                         <span style={{
//                           display: 'inline-flex', alignItems: 'center', gap: 5,
//                           padding: '0.25rem 0.65rem', borderRadius: 6,
//                           fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em',
//                           background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
//                         }}>
//                           <Tag size={10} />
//                           {lead.status}
//                         </span>
//                       </td>
//                       <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
//                         {lead.assignedTo?.name || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
 
//       <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </div>
//   );
// };
 
// export default AdminDashboard;






// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import CreateUserModal from '../../components/admin/CreateUserModal';

// const AdminDashboard = () => {
//   const [leads, setLeads] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchLeads = async () => {
//       const { data } = await axios.get('http://localhost:5000/api/leads', {
//         headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
//       });
//       setLeads(data);
//     };
//     fetchLeads();
//   }, []);

//   // Add this helper function inside the AdminDashboard component:
// const handleLogout = () => {
//   localStorage.removeItem('user');
//   window.location.reload();
// };

// // Paste this button inside the <header> block right next to your "+ Add New Staff Member" button:


//   return (

   

    




//     <div className="p-6">



//               <header className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">Admin Control Center</h1>
//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
//         >
//           + Add New Staff Member
//         </button>
//       </header>

//       {/* Leads Table logic from previous step goes here */}

//       <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />





//       <header className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Admin Control Center</h1>
//         <button className="bg-green-600 text-white px-4 py-2 rounded">Create New User</button>
//       </header>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
//           <p className="text-gray-500">Total Leads</p>
//           <h3 className="text-2xl font-bold">{leads.length}</h3>
//         </div>
//         {/* Add more stat cards for Hot Leads, etc. [cite: 22] */}
//       </div>

//       <div className="bg-white rounded shadow overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="p-4">Name</th>
//               <th className="p-4">Project</th>
//               <th className="p-4">Status</th>
//               <th className="p-4">Assigned To</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leads.map(lead => (
//               <tr key={lead._id} className="border-b hover:bg-gray-50">
//                 <td className="p-4">{lead.name}</td>
//                 <td className="p-4">{lead.project}</td>
//                 <td className="p-4">
//                   <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">{lead.status}</span>
//                 </td>
//                 <td className="p-4">{lead.assignedTo?.name || 'Unassigned'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <button 
//   onClick={handleLogout} 
//   className="ml-3 border border-red-200 text-red-500 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition"
// >
//   Logout
// </button>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;