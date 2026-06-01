import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  ArrowLeft, 
  MessageSquare, 
  History, 
  CheckCircle, 
  MapPin, 
  Building, 
  Wallet, 
  Radio, 
  ChevronDown, 
  Tag, 
  Clock, 
  Edit2, 
  X, 
  Save 
} from 'lucide-react';

const STATUS_LIST = ['New', 'Contacted', 'Follow-up', 'Interested', 'Hot', 'Mature', 'Closed', 'Not Interested'];

const statusStyle = (s) => {
  if (s === 'Closed') return { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.25)' };
  if (s === 'Hot') return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.25)' };
  if (s === 'Mature') return { bg: 'rgba(99,102,241,0.12)', color: '#6366f1', border: 'rgba(99,102,241,0.25)' };
  return { bg: 'rgba(212,167,96,0.1)', color: 'var(--accent)', border: 'rgba(212,167,96,0.25)' };
};

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [note, setNote] = useState('');
  
  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    city: '',
    project: '',
    budget: '',
    source: 'Manual'
  });

  const fetchDetails = async () => {
    try {
      const { data } = await api.get(`/leads/${id}`);
      setLead(data);
      setEditFormData({
        name: data.name || '',
        phone: data.phone || '',
        city: data.city || '',
        project: data.project || '',
        budget: data.budget || '',
        source: data.source || 'Manual'
      });
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchDetails(); }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.patch(`/leads/${id}`, { status: newStatus });
      fetchDetails();
    } catch (err) { alert("Update failed"); }
  };

  const handleDateUpdate = async (date) => {
    try {
      await api.patch(`/leads/${id}`, { followUpDate: date });
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/leads/${id}`, editFormData);
      setIsEditModalOpen(false);
      fetchDetails();
      alert("Lead updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update lead");
    }
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

        {/* Back and Edit Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', color: 'var(--accent)',
              fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              padding: 0, transition: 'opacity 160ms',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <ArrowLeft size={15} /> Back to List
          </button>

          <button onClick={() => setIsEditModalOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', borderRadius: 10,
              padding: '0.55rem 1.1rem', fontSize: '0.8rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 160ms ease-out',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          >
            <Edit2 size={13} /> Edit Lead Info
          </button>
        </div>

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

      {/* Edit Information Modal */}
      {isEditModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(13,14,20,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 24, padding: '2rem', width: '100%', maxWidth: 500,
            boxShadow: 'var(--shadow-lg)', animation: 'fadeSlideUp 180ms ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
                Edit Lead Information
              </h2>
              <button onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Prospect Name
                </label>
                <input style={inputStyle} type="text" required
                  value={editFormData.name}
                  onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Phone Number
                </label>
                <input style={inputStyle} type="text" required
                  value={editFormData.phone}
                  onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                    City
                  </label>
                  <input style={inputStyle} type="text"
                    value={editFormData.city}
                    onChange={e => setEditFormData({ ...editFormData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Project
                  </label>
                  <input style={inputStyle} type="text"
                    value={editFormData.project}
                    onChange={e => setEditFormData({ ...editFormData, project: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Budget
                  </label>
                  <input style={inputStyle} type="text"
                    value={editFormData.budget}
                    onChange={e => setEditFormData({ ...editFormData, budget: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Source
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select style={{ ...inputStyle, appearance: 'none', paddingRight: '2rem' }}
                      value={editFormData.source}
                      onChange={e => setEditFormData({ ...editFormData, source: e.target.value })}
                    >
                      <option value="Manual">Manual Entry</option>
                      <option value="Facebook">Facebook Campaign</option>
                      <option value="WhatsApp">WhatsApp Inbound</option>
                      <option value="Website">Website Form</option>
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)}
                  style={{
                    background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)',
                    borderRadius: 10, padding: '0.65rem 1.25rem', fontSize: '0.82rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-body)'
                  }}
                >
                  Cancel
                </button>
                <button type="submit"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent) 0%, #b8860b 100%)',
                    color: '#0d0e14', border: 'none', borderRadius: 10,
                    padding: '0.65rem 1.5rem', fontSize: '0.82rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                    boxShadow: '0 4px 16px rgba(212,167,96,0.25)',
                    display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetails;