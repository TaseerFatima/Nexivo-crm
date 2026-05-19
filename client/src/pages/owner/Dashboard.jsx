import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Shield, TrendingUp, Users, Award, LogOut, CheckSquare } from 'lucide-react';
 
const OwnerDashboard = () => {
  const [stats, setStats] = useState({ total: 0, todayLeads: 0, statusCounts: [] });
  const [leaderboard, setLeaderboard] = useState([]);
 
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const summary = await api.get('/reports/summary');
        const operators = await api.get('/reports/operators');
        setStats(summary.data);
        setLeaderboard(operators.data);
      } catch (err) { console.error("Error compiling metrics", err); }
    };
    fetchPerformanceData();
  }, []);
 
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };
 
  const closedDeals = stats.statusCounts?.find(s => s._id === 'Closed')?.count || 0;
  const conversionRate = stats.total > 0 ? ((closedDeals / stats.total) * 100).toFixed(1) : 0;
 
  const CHART_COLORS = ['#d4a760', '#a78bfa', '#34d399', '#fb7185', '#60a5fa', '#fbbf24', '#f472b6'];
 
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '0.6rem 0.9rem', fontSize: '0.8rem',
        }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</p>
          <p style={{ margin: '2px 0 0', color: 'var(--accent)', fontWeight: 700 }}>{payload[0].value} leads</p>
        </div>
      );
    }
    return null;
  };
 
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)', padding: '2rem 1.5rem' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: 0, right: 0, width: '50vw', height: '50vh',
        background: 'radial-gradient(ellipse at top right, rgba(212,167,96,0.06) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
 
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
 
        {/* Header */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '2.5rem', paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent) 0%, #b8860b 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(212,167,96,0.3)',
            }}>
              <Shield size={20} color="#0d0e14" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                Nexivo Holdings
              </h1>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>Executive Performance View</p>
            </div>
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
 
        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: <Users size={20} />, label: 'Total Leads', value: stats.total, accent: 'var(--accent)' },
            { icon: <TrendingUp size={20} />, label: 'Conversion Rate', value: `${conversionRate}%`, accent: '#34d399' },
            { icon: <CheckSquare size={20} />, label: "Today's Inbound", value: stats.todayLeads, accent: '#a78bfa' },
          ].map((card, i) => (
            <div key={i}
              style={{
                background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--border)', borderRadius: 18,
                padding: '1.5rem 1.75rem',
                display: 'flex', alignItems: 'center', gap: '1.1rem',
                transition: 'all 160ms ease-out',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = card.accent; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: `${card.accent}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: card.accent,
              }}>{card.icon}</div>
              <div>
                <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{card.label}</p>
                <h3 style={{ margin: '0.25rem 0 0', fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {card.value}
                </h3>
              </div>
            </div>
          ))}
        </div>
 
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.25rem' }}>
          {/* Leaderboard */}
          <div style={{
            background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border)', borderRadius: 20, padding: '1.5rem',
          }}>
            <h2 style={{
              margin: '0 0 1.25rem', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Award size={14} color="#fbbf24" /> Operator Leaderboard
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: 320, overflowY: 'auto' }}>
              {leaderboard.length === 0 ? (
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No operations logged yet.</p>
              ) : leaderboard.map((op, index) => (
                <div key={op.name}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.85rem 1rem', borderRadius: 12,
                    background: index === 0 ? 'rgba(212,167,96,0.08)' : 'var(--surface-1)',
                    border: `1px solid ${index === 0 ? 'rgba(212,167,96,0.3)' : 'var(--border)'}`,
                    transition: 'all 160ms ease-out',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                      background: index === 0 ? 'var(--accent)' : 'var(--surface-2)',
                      color: index === 0 ? '#0d0e14' : 'var(--text-muted)',
                      fontSize: '0.7rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{index + 1}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{op.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: '#34d399' }}>{op.closed} closed</p>
                    <p style={{ margin: '1px 0 0', fontSize: '0.68rem', color: 'var(--text-muted)' }}>{op.total} total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
 
          {/* Chart */}
          <div style={{
            background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border)', borderRadius: 20, padding: '1.5rem',
          }}>
            <h2 style={{
              margin: '0 0 1.5rem', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase',
            }}>Status Distribution</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.statusCounts} barSize={28}>
                <XAxis dataKey="_id" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.statusCounts?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default OwnerDashboard;








// import { useEffect, useState } from 'react';
// import api from '../../api/axios';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { Shield, TrendingUp, Users, Award, LogOut, CheckSquare } from 'lucide-react';

// const OwnerDashboard = () => {
//   const [stats, setStats] = useState({ total: 0, todayLeads: 0, statusCounts: [] });
//   const [leaderboard, setLeaderboard] = useState([]);

//   useEffect(() => {
//     const fetchPerformanceData = async () => {
//       try {
//         const summary = await api.get('/reports/summary');
//         const operators = await api.get('/reports/operators');
//         setStats(summary.data);
//         setLeaderboard(operators.data);
//       } catch (err) { console.error("Error compiling metrics", err); }
//     };
//     fetchPerformanceData();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     window.location.reload();
//   };

//   // Safe parsing to prevent structural division errors
//   const closedDeals = stats.statusCounts?.find(s => s._id === 'Closed')?.count || 0;
//   const conversionRate = stats.total > 0 ? ((closedDeals / stats.total) * 100).toFixed(1) : 0;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Block */}
//         <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Shield className="text-indigo-600" size={24}/> Nexivo Holdings</h1>
//             <p className="text-xs text-gray-400">Read-Only Administrative Performance System</p>
//           </div>
//           <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 transition">
//             <LogOut size={16} /> Logout
//           </button>
//         </div>

//         {/* Analytic Cards Metric Matrix */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
//             <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><Users size={24}/></div>
//             <div>
//               <p className="text-xs font-bold text-gray-400 uppercase">Gross Database Entries</p>
//               <h2 className="text-2xl font-black text-gray-800 mt-1">{stats.total}</h2>
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
//             <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600"><TrendingUp size={24}/></div>
//             <div>
//               <p className="text-xs font-bold text-gray-400 uppercase">System Conversion Rate</p>
//               <h2 className="text-2xl font-black text-gray-800 mt-1">{conversionRate}%</h2>
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
//             <div className="bg-purple-50 p-3 rounded-lg text-purple-600"><CheckSquare size={24}/></div>
//             <div>
//               <p className="text-xs font-bold text-gray-400 uppercase">Inbound Pipeline Traffic Today</p>
//               <h2 className="text-2xl font-black text-gray-800 mt-1">{stats.todayLeads}</h2>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Operator Performance Leaderboard Card */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <h2 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-4 flex items-center gap-2">
//               <Award size={18} className="text-amber-500" /> Operator Leaderboard
//             </h2>
//             <div className="space-y-3 max-h-[300px] overflow-y-auto">
//               {leaderboard.length === 0 ? (
//                 <p className="text-sm text-gray-400 italic">Metrics unavailable: No operations logged yet.</p>
//               ) : (
//                 leaderboard.map((op, index) => (
//                   <div key={op.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
//                     <span className="font-semibold text-sm text-gray-700">{index + 1}. {op.name}</span>
//                     <div className="text-right">
//                       <p className="text-xs font-bold text-emerald-600">{op.closed} Deals Closed</p>
//                       <p className="text-[10px] text-gray-400">{op.total} Allocated Leads</p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Graphical Metrics Bar Chart Display */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[350px]">
//             <h2 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-6">Status Pipeline Proportions</h2>
//             <ResponsiveContainer width="100%" height={260}>
//               <BarChart data={stats.statusCounts}>
//                 <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
//                 <YAxis tick={{ fontSize: 11 }} />
//                 <Tooltip />
//                 <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OwnerDashboard;