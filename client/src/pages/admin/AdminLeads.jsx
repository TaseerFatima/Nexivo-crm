import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { Filter, UserPlus, Search } from 'lucide-react';

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
      fetchData(); // Refresh list
      alert("Lead assigned successfully!");
    } catch (err) { alert("Assignment failed"); }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage All Leads</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              className="pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Search name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters Bar (Requirement #10) */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center border border-gray-200">
        <Filter size={20} className="text-gray-400" />
        <select className="border p-2 rounded" onChange={(e) => setFilters({...filters, status: e.target.value})}>
          <option value="">All Statuses</option>
          {['New','Contacted','Follow-up','Interested','Hot Mature','Closed','Not Interested'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input className="border p-2 rounded" placeholder="Filter by City" onChange={(e) => setFilters({...filters, city: e.target.value})} />
        <input className="border p-2 rounded" placeholder="Filter by Project" onChange={(e) => setFilters({...filters, project: e.target.value})} />
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4">Lead Info</th>
              <th className="p-4">Project/City</th>
              <th className="p-4">Status</th>
              <th className="p-4">Current Assignee</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.map(lead => (
              <tr key={lead._id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <Link to={`/lead/${lead._id}`} className="font-bold text-blue-600 hover:underline">{lead.name}</Link>
                  <p className="text-xs text-gray-500">{lead.phone}</p>
                </td>
                <td className="p-4 text-sm">
                  <p>{lead.project || 'N/A'}</p>
                  <p className="text-xs text-gray-400">{lead.city || 'Unknown'}</p>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-sm font-medium">
                  {lead.assignedTo ? lead.assignedTo.name : <span className="text-red-400 italic font-normal">Not Assigned</span>}
                </td>
                <td className="p-4">
                  <select 
                    className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white"
                    onChange={(e) => handleAssign(lead._id, e.target.value)}
                    value={lead.assignedTo?._id || ''}
                  >
                    <option value="">Reassign Lead...</option>
                    {operators.map(op => (
                      <option key={op._id} value={op._id}>{op.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeads;