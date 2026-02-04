import { useState } from "react";
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [from, setForm] = useState({ name: '', email:'', password: ''});
  const navigate = useNavigate();

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post('/auth/register', form);
    navigate('/login');

  };

  return (
    <form onSubmit = {handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type= "submit">Register</button>
    </form>
  );
  
}
