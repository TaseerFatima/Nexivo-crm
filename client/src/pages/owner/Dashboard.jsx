import { useEffect, useState } from 'react';
import axios from 'axios';
// Optional: Use a library like 'recharts' or 'chart.js' for the charts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({ total: 0, statusCounts: [] });
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchOwnerData = async () => {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Fetching the reports you built in reports.js [cite: 29]
      const summary = await axios.get('http://localhost:5000/api/reports/summary', config);
      const operators = await axios.get('http://localhost:5000/api/reports/operators', config);
      
      setStats(summary.data);
      setLeaderboard(operators.data);
    };
    fetchOwnerData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Business Performance (Owner View)</h1>

      {/* High Level Stats [cite: 21, 22] */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium uppercase">Total Leads</p>
          <h2 className="text-3xl font-bold text-blue-600">{stats.total}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium uppercase">Leads Today</p>
          <h2 className="text-3xl font-bold text-green-600">{stats.todayLeads}</h2>
        </div>
        {/* Note: Conversion rate calculation [cite: 23, 26] */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leaderboard Section  */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Operator Performance</h2>
          <div className="space-y-4">
            {leaderboard.map((op, index) => (
              <div key={op.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{index + 1}. {op.name}</span>
                <div className="text-right">
                  <p className="text-sm font-bold">{op.closed} Closed</p>
                  <p className="text-xs text-gray-500">{op.total} Total Leads</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Chart Placeholder [cite: 20] */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.statusCounts}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;