import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  // This creates the "form" state variable
  // If this line is missing, you get "form is not defined"
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // Runs when the user types in any input
  const handleChange = (e) => {
    // "form" MUST exist for this to work
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Runs when the user clicks Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit clicked");

    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      console.log("Registration failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <button type="submit">Register</button>
    </form>
  );
}

