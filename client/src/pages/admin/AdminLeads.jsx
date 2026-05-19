
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { Filter, Search, Building, MapPin, RefreshCw, ChevronDown, Tag } from 'lucide-react';
 
const STATUS_LIST = ['New', 'Contacted', 'Follow-up', 'Interested', 'Hot Mature', 'Closed', 'Not Interested'];
 
const statusStyle = (status) => {
  if (status === 'Closed') return { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.25)' };
  if (status === 'Hot Mature') return { bg: 'rgba(251,113,133,0.12)', color: '#fb7185', border: 'rgba(251,113,133,0.25)' };
  return { bg: 'rgba(212,167,96,0.1)', color: 'var(--accent)', border: 'rgba(212,167,96,0.25)' };
};
 
const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [operators, setOperators] = useState([]);
  const [filters, setFilters] = useState({ status: '', project: '', city: '' });
  const [searchTerm, setSearchTerm] = useState('');
 
  const fetchData = async () => {
    try {
      const leadRes = await api.get('/leads', { params: { ...filters, search: searchTerm } });
      const userRes = await api.get('/users');
      setLeads(leadRes.data);
      setOperators(userRes.data.filter(u => u.role === 'operator'));
    } catch (err) { console.error(err); }
  };
 
  useEffect(() => { fetchData(); }, [filters, searchTerm]);
 
  const handleAssign = async (leadId, operatorId) => {
    try {
      await api.patch(`/leads/${leadId}/assign`, { assignedTo: operatorId });
      fetchData();
      alert("Lead distribution updated!");
    } catch (err) { alert("Assignment failed"); }
  };
 
  const hasFilters = filters.status || filters.city || filters.project;
 
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
 
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ margin: '0 0 4px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase' }}>Admin</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                Master Pipeline
              </h1>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.83rem' }}>Distribute and monitor all inbound sales traffic</p>
            </div>
            {/* Search */}
            <div style={{ position: 'relative', width: 280 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                placeholder="Search name or phone…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'var(--surface-1)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '0.65rem 1rem 0.65rem 2.5rem',
                  color: 'var(--text-primary)', fontSize: '0.83rem',
                  outline: 'none', transition: 'border-color 160ms ease-out',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>
        </div>
 
        {/* Filters Panel */}
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border)', borderRadius: 14,
          padding: '1rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 4 }}>
            <Filter size={13} color="var(--text-muted)" />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filters</span>
          </div>
 
          {/* Status Select */}
          <div style={{ position: 'relative' }}>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              style={{
                appearance: 'none', background: 'var(--surface-1)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '0.5rem 2rem 0.5rem 0.75rem', fontSize: '0.8rem',
                color: filters.status ? 'var(--text-primary)' : 'var(--text-muted)',
                outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'border-color 160ms ease-out',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            >
              <option value="">All Statuses</option>
              {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          </div>
 
          {/* City */}
          <div style={{ position: 'relative' }}>
            <MapPin size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              placeholder="City"
              value={filters.city}
              onChange={(e) => setFilters({...filters, city: e.target.value})}
              style={{
                background: 'var(--surface-1)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '0.5rem 0.75rem 0.5rem 1.75rem', fontSize: '0.8rem',
                color: 'var(--text-primary)', outline: 'none',
                fontFamily: 'var(--font-body)', width: 140,
                transition: 'border-color 160ms ease-out',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
 
          {/* Project */}
          <div style={{ position: 'relative' }}>
            <Building size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              placeholder="Project"
              value={filters.project}
              onChange={(e) => setFilters({...filters, project: e.target.value})}
              style={{
                background: 'var(--surface-1)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '0.5rem 0.75rem 0.5rem 1.75rem', fontSize: '0.8rem',
                color: 'var(--text-primary)', outline: 'none',
                fontFamily: 'var(--font-body)', width: 160,
                transition: 'border-color 160ms ease-out',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
 
          {hasFilters && (
            <button
              onClick={() => setFilters({ status: '', project: '', city: '' })}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                marginLeft: 'auto', background: 'none', border: 'none',
                color: '#fb7185', fontSize: '0.75rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}
            >
              <RefreshCw size={11} /> Clear
            </button>
          )}
        </div>
 
        {/* Table */}
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border)', borderRadius: 20,
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  {['Prospect', 'Allocation', 'Pipeline Status', 'Assigned Agent', 'Route'].map(h => (
                    <th key={h} style={{
                      padding: '0.9rem 1.25rem', textAlign: 'left',
                      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                      color: 'var(--text-muted)', textTransform: 'uppercase',
                      background: 'var(--surface-1)', borderBottom: '1px solid var(--border)',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
                      No leads match the active search constraints
                    </td>
                  </tr>
                ) : leads.map(lead => {
                  const sc = statusStyle(lead.status);
                  return (
                    <tr key={lead._id}
                      style={{ borderBottom: '1px solid var(--border)', transition: 'background 120ms ease-out' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <Link to={`/lead/${lead._id}`} style={{ fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', fontSize: '0.875rem' }}
                          onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                          onMouseLeave={e => e.target.style.textDecoration = 'none'}
                        >{lead.name}</Link>
                        <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lead.phone}</p>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.83rem' }}>{lead.project || 'Unspecified'}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lead.city || '—'}</p>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '0.25rem 0.65rem', borderRadius: 6,
                          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em',
                          background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                          whiteSpace: 'nowrap',
                        }}>
                          <Tag size={9} />{lead.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        {lead.assignedTo ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'var(--surface-2)', border: '1px solid var(--border)',
                            padding: '0.25rem 0.65rem', borderRadius: 6,
                            fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)',
                          }}>{lead.assignedTo.name}</span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent)', background: 'var(--accent-subtle)', border: '1px solid rgba(212,167,96,0.25)', padding: '0.2rem 0.55rem', borderRadius: 6 }}>
                            Awaiting Agent
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ position: 'relative' }}>
                          <select
                            onChange={(e) => handleAssign(lead._id, e.target.value)}
                            value={lead.assignedTo?._id || ''}
                            style={{
                              appearance: 'none', background: 'var(--surface-1)',
                              border: '1px solid var(--border)', borderRadius: 8,
                              padding: '0.45rem 2rem 0.45rem 0.75rem', fontSize: '0.78rem',
                              color: 'var(--text-secondary)', outline: 'none', cursor: 'pointer',
                              fontFamily: 'var(--font-body)', width: 170,
                              transition: 'border-color 160ms ease-out',
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border)'}
                          >
                            <option value="">Choose Operator…</option>
                            {operators.map(op => <option key={op._id} value={op._id}>{op.name}</option>)}
                          </select>
                          <ChevronDown size={11} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default AdminLeads;








// import { useEffect, useState } from 'react';
// import api from '../../api/axios';
// import { Link } from 'react-router-dom';
// import { Filter, UserPlus, Search, Building, MapPin, RefreshCw } from 'lucide-react';

// const AdminLeads = () => {
//   const [leads, setLeads] = useState([]);
//   const [operators, setOperators] = useState([]);
//   const [filters, setFilters] = useState({ status: '', project: '', city: '' });
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchData = async () => {
//     try {
//       const leadRes = await api.get('/leads', { params: { ...filters, search: searchTerm } });
//       const userRes = await api.get('/users');
//       setLeads(leadRes.data);
//       setOperators(userRes.data.filter(u => u.role === 'operator'));
//     } catch (err) { console.error(err); }
//   };

//   useEffect(() => { 
//     fetchData(); 
//   }, [filters, searchTerm]);

//   const handleAssign = async (leadId, operatorId) => {
//     try {
//       await api.patch(`/leads/${leadId}/assign`, { assignedTo: operatorId });
//       fetchData();
//       alert("Lead distribution updated!");
//     } catch (err) { alert("Assignment failed"); }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Master Pipeline Management</h1>
//             <p className="text-sm text-gray-500">Distribute and monitor all inbound sales traffic</p>
//           </div>
          
//           <div className="relative w-full md:w-72">
//             <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//             <input 
//               className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500 transition" 
//               placeholder="Search name or phone..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Structural Filters Panel */}
//         <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center border border-gray-100">
//           <div className="flex items-center gap-2 text-sm font-bold text-gray-600 uppercase mr-2">
//             <Filter size={16} /> Filters
//           </div>
          
//           <select 
//             className="border p-2 rounded-lg text-sm bg-gray-50 focus:bg-white"
//             value={filters.status}
//             onChange={(e) => setFilters({...filters, status: e.target.value})}
//           >
//             <option value="">All Pipelines Statuses</option>
//             {['New','Contacted','Follow-up','Interested','Hot Mature','Closed','Not Interested'].map(s => (
//               <option key={s} value={s}>{s}</option>
//             ))}
//           </select>

//           <div className="relative flex items-center">
//             <MapPin size={16} className="absolute left-3 text-gray-400" />
//             <input 
//               className="pl-8 pr-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white" 
//               placeholder="City (e.g. Faisalabad)" 
//               value={filters.city}
//               onChange={(e) => setFilters({...filters, city: e.target.value})}
//             />
//           </div>

//           <div className="relative flex items-center">
//             <Building size={16} className="absolute left-3 text-gray-400" />
//             <input 
//               className="pl-8 pr-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white" 
//               placeholder="Project Name" 
//               value={filters.project}
//               onChange={(e) => setFilters({...filters, project: e.target.value})}
//             />
//           </div>

//           {(filters.status || filters.city || filters.project) && (
//             <button 
//               onClick={() => setFilters({ status: '', project: '', city: '' })}
//               className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline ml-auto"
//             >
//               <RefreshCw size={12} /> Clear Filters
//             </button>
//           )}
//         </div>

//         {/* Database Lead Output Grid */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-gray-50 border-b text-gray-600 text-xs font-bold uppercase tracking-wider">
//               <tr>
//                 <th className="p-4">Prospect</th>
//                 <th className="p-4">Allocation Mapping</th>
//                 <th className="p-4">Pipeline Position</th>
//                 <th className="p-4">Assigned Agent</th>
//                 <th className="p-4 text-right">Route Assignment</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y text-sm text-gray-700">
//               {leads.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="p-8 text-center text-gray-400 italic">No leads match the active search constraints</td>
//                 </tr>
//               ) : (
//                 leads.map(lead => (
//                   <tr key={lead._id} className="hover:bg-gray-50/70 transition">
//                     <td className="p-4">
//                       <Link to={`/lead/${lead._id}`} className="font-semibold text-blue-600 hover:underline">{lead.name}</Link>
//                       <p className="text-xs text-gray-400 mt-0.5">{lead.phone}</p>
//                     </td>
//                     <td className="p-4">
//                       <p className="font-medium text-gray-800">{lead.project || 'Unspecified Asset'}</p>
//                       <p className="text-xs text-gray-400">{lead.city || 'Regional Office'}</p>
//                     </td>
//                     <td className="p-4">
//                       <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
//                         lead.status === 'Closed' ? 'bg-green-50 text-green-700 border border-green-200' :
//                         lead.status === 'Hot Mature' ? 'bg-red-50 text-red-700 border border-red-200' :
//                         'bg-blue-50 text-blue-700 border border-blue-100'
//                       }`}>
//                         {lead.status}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       {lead.assignedTo ? (
//                         <span className="inline-flex items-center gap-1.5 text-gray-700 font-medium bg-gray-100 px-2.5 py-1 rounded-md">
//                           {lead.assignedTo.name}
//                         </span>
//                       ) : (
//                         <span className="text-amber-500 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-xs">Awaiting Agent</span>
//                       )}
//                     </td>
//                     <td className="p-4 text-right">
//                       <select 
//                         className="p-2 border rounded-xl text-xs bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500 w-48 text-gray-600"
//                         onChange={(e) => handleAssign(lead._id, e.target.value)}
//                         value={lead.assignedTo?._id || ''}
//                       >
//                         <option value="">Choose Operator...</option>
//                         {operators.map(op => (
//                           <option key={op._id} value={op._id}>{op.name}</option>
//                         ))}
//                       </select>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLeads;