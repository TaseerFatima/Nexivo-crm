import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { User, PlusCircle, Clock, CheckCircle } from 'lucide-react';

const OperatorDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [formData, setFormData] = useState({
    name: '', phone: '', city: '', project: '', budget: '', source: 'Manual'
  });

  const fetchMyLeads = async () => {
    try {
      const { data } = await api.get('/leads');
      setLeads(data);
    } catch (err) { console.error("Error fetching leads", err); }
  };

  useEffect(() => { fetchMyLeads(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leads', { ...formData, assignedTo: JSON.parse(localStorage.getItem('user'))._id });
      alert("Lead captured successfully!");
      setFormData({ name: '', phone: '', city: '', project: '', budget: '', source: 'Manual' });
      fetchMyLeads();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving lead");
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User className="text-blue-600" /> Operator Panel
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Entry Form (Requirement #2, #4) */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2"><PlusCircle size={20}/> New Lead</h2>
              <input border className="w-full p-2 border rounded" placeholder="Lead Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input border className="w-full p-2 border rounded" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <input border className="w-full p-2 border rounded" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              <input border className="w-full p-2 border rounded" placeholder="Project" value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} />
              <input border className="w-full p-2 border rounded" placeholder="Budget" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
              <select className="w-full p-2 border rounded" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                <option value="Manual">Manual</option>
                <option value="Facebook">Facebook</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Website">Website</option>
              </select>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">Save Lead</button>
            </form>
          </div>

          {/* My Pipeline (Requirement #3) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="font-bold">My Active Leads</h2>
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">{leads.length} Total</span>
              </div>
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {leads.map(lead => (
                  <Link to={`/lead/${lead._id}`} key={lead._id} className="p-4 flex justify-between items-center hover:bg-blue-50 transition">
                    <div>
                      <p className="font-bold text-gray-800">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.project} | {lead.phone}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${lead.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {lead.status}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;