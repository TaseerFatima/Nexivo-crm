import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, MessageSquare, History, CheckCircle } from 'lucide-react';

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
    // You'll need to add a quick route/controller for this or use a general update route
    await api.patch(`/leads/${id}/status`, { followUpDate: date }); 
    setFollowUpDate(date);
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

  if (!lead) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-blue-600 font-medium">
        <ArrowLeft size={18}/> Back to List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">{lead.name}</h1>
            <p className="text-gray-500 mb-4">{lead.phone}</p>
            <div className="space-y-2 text-sm">
              <p><strong>Project:</strong> {lead.project}</p>
              <p><strong>City:</strong> {lead.city}</p>
              <p><strong>Source:</strong> {lead.source}</p>
              <p><strong>Budget:</strong> {lead.budget}</p>
            </div>

            <div className="mt-6 pt-6 border-t">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Update Status</label>
              <select 
                className="w-full p-2 border rounded bg-blue-50 text-blue-800 font-bold"
                value={lead.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
              >
                {['New','Contacted','Follow-up','Interested','Hot Mature','Closed','Not Interested'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notes & Interaction History (Requirement #6) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MessageSquare size={20}/> Add Note</h2>
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                rows="3" 
                placeholder="What was the outcome of the call?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
              ></textarea>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Save Interaction</button>
            </form>
          </div>

          <div className="mt-4 pt-4 border-t">
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Set Follow-up Date</label>
             <input 
              type="date" 
              className="w-full p-2 border rounded text-sm"
              onChange={(e) => handleDateUpdate(e.target.value)}
              value={lead.followUpDate?.split('T')[0] || ''}
              />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><History size={20}/> Interaction Timeline</h2>
            <div className="space-y-4">
              {lead.notes.map((n, i) => (
                <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full h-fit text-blue-600"><CheckCircle size={16}/></div>
                  <div>
                    <p className="text-sm text-gray-800">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()} by {n.createdBy?.name || 'System'}</p>
                  </div>
                </div>
              )).reverse()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;