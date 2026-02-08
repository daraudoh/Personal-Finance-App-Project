/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App*/


import { Link, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        {!localStorage.getItem('token') && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {localStorage.getItem('token') && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/expenses">Expenses</Link>

            <button onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
        }}>
          Logout
        </button> 
          </>
        )}
      </nav>

      <h1>Finance Tracker</h1>
      <Outlet/>
    </div>
  );
}
