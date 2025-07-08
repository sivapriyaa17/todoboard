import React,{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch {
      alert('Register failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={submit}>
        <input placeholder="email" onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full p-2 border mb-2" />
        <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} required className="w-full p-2 border mb-2" />
        <button className="w-full p-2 bg-green-500 text-white">Register</button>
      </form>
    </div>
  );
}
