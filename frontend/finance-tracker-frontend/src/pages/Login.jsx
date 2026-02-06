import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login() {
  //Local state to store the user's email and password
  const[form, setForm] = useState({
    email: '',
    password: ''
  });

  //For redirecting the user after login
  const navigate = useNavigate();

  //For showing error messages to the user
  const[error, setError] = useState('');

  //Runs every time the user types in an input field
  const handleChange = (e) => {
    setForm({
      ...form,  //keep previous values
      [e.target.name]: e.target.value //update the changed field
    });
  };
  
//Runs when the user submits the login form
const handleSubmit = async (e) => {
  e.preventDefault();

  try{
    //Send login request to backend
    const res = await API.post('/auth/login', form);

    //Backend should return a JWT token
    const token = res.data.token;

    //Save token so ProtectedRoute can check it later
    localStorage.setItem('token', token);

    //Redirect user to dashboard
    navigate('/dashboard');


  } catch (err) {
    //If login fails, show an error message
    setError('Invalid email or password');
  }
};

return (
  <div>
    <h2>Login</h2>

    {/* show error message if login fails */}
    {error && <p style={{ color: 'red '}}>{error}</p>}

    {/* Login form */}
    <form
     onSubmit={handleSubmit}
     style={{
       display: 'flex',
       msFlexDirection: 'column',
       gap: '1rem',
       maxWidth: '300px'
     }}

    >
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

      <button type="submit">Login</button>

      </form> 
  </div>
)

}