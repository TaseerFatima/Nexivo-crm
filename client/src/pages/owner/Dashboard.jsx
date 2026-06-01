import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Shield, TrendingUp, Users, Award, LogOut, Calendar, Globe } from 'lucide-react';
 
const OwnerDashboard = () => {
  const [stats, setStats] = useState({ total: 0, todayLeads: 0, weeklyLeads: 0, monthlyLeads: 0, statusCounts: [], sourceCounts: [] });
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
 
  const CHART_COLORS = ['#d4a760', '#a78bfa', '#34d399', '#fb7185', '#60a5fa', '#fbbf24', '#f472b6', '#2dd4bf'];
 
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
 
  // Complete operator leaderboard sorting with conversion rate calculation
  const completedLeaderboard = leaderboard.map(op => {
    const rate = op.total > 0 ? ((op.closed / op.total) * 100).toFixed(1) : '0.0';
    return { ...op, rate: parseFloat(rate) };
  }).sort((a, b) => b.closed - a.closed || b.rate - a.rate);

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
 
        {/* Metric Cards Matrix - Gross Daily, Weekly, Monthly & Conversion Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { icon: <Users size={20} />, label: 'Total Leads', value: stats.total, accent: 'var(--accent)', sub: `Today: +${stats.todayLeads}` },
            { icon: <TrendingUp size={20} />, label: 'Conversion Rate', value: `${conversionRate}%`, accent: '#34d399', sub: `Deals: ${closedDeals}` },
            { icon: <Calendar size={20} />, label: '7-Day Inbound', value: stats.weeklyLeads, accent: '#a78bfa', sub: 'Last 7 days gross' },
            { icon: <Globe size={20} />, label: '30-Day Inbound', value: stats.monthlyLeads, accent: '#60a5fa', sub: 'Last 30 days gross' },
          ].map((card, i) => (
            <div key={i}
              style={{
                background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--border)', borderRadius: 18,
                padding: '1.25rem 1.5rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
                transition: 'all 160ms ease-out',
                position: 'relative', overflow: 'hidden',
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
                <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{card.label}</p>
                <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {card.value}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.68rem', color: 'var(--text-muted)' }}>{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
 
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.25rem', marginBottom: '2rem' }}>
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
              <Award size={14} color="#fbbf24" /> Operator Performance
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: 320, overflowY: 'auto' }}>
              {completedLeaderboard.length === 0 ? (
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No operations logged yet.</p>
              ) : completedLeaderboard.map((op, index) => (
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
                    <p style={{ margin: '1px 0 0', fontSize: '0.68rem', color: 'var(--text-muted)' }}>{op.rate}% rate · {op.total} leads</p>
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

        {/* Source breakdown chart row */}
        <div style={{
          background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border)', borderRadius: 20, padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            margin: '0 0 1.5rem', fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase',
          }}>Lead Sources Breakdown</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.sourceCounts} layout="vertical" barSize={16}>
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="_id" type="category" tick={{ fontSize: 10, fill: 'var(--text-primary)', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {stats.sourceCounts?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 3) % CHART_COLORS.length]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
 
export default OwnerDashboard;