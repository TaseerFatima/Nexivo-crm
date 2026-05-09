import { useState } from 'react';
import api from '../../api/axios';

const CreateUserModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'operator' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/create', formData);
      alert('User created successfully!');
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating user');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Register New Staff</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input className="w-full border p-2 rounded" type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input className="w-full border p-2 rounded" type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <select className="w-full border p-2 rounded" onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="operator">Operator</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded">Create Account</button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;