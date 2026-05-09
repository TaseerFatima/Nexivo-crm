import { useEffect, useState } from 'react';
import axios from 'axios';
import CreateUserModal from '../../components/admin/CreateUserModal';

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const { data } = await axios.get('http://localhost:5000/api/leads', {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
      });
      setLeads(data);
    };
    fetchLeads();
  }, []);

  return (

   

    




    <div className="p-6">



              <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Control Center</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Add New Staff Member
        </button>
      </header>

      {/* Leads Table logic from previous step goes here */}

      <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />





      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Control Center</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Create New User</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
          <p className="text-gray-500">Total Leads</p>
          <h3 className="text-2xl font-bold">{leads.length}</h3>
        </div>
        {/* Add more stat cards for Hot Leads, etc. [cite: 22] */}
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Project</th>
              <th className="p-4">Status</th>
              <th className="p-4">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{lead.name}</td>
                <td className="p-4">{lead.project}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">{lead.status}</span>
                </td>
                <td className="p-4">{lead.assignedTo?.name || 'Unassigned'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;