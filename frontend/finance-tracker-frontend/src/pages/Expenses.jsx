import { useEffect, useState } from 'react';
import API from '../api';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);

  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    date: '',
    note: ''
  });

  // Load all expenses on mount
  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    try {
      const res = await API.get('/api/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.log("Error loading expenses:", err);
    }
  }

  // Add new expense
  async function addExpense() {
    try {
      await API.post('/api/expenses', newExpense);

      // Clear form
      setNewExpense({
        amount: '',
        category: '',
        date: '',
        note: ''
      });

      loadExpenses();
    } catch (err) {
      console.log("Error adding expense:", err);
    }
  }

  // Delete an expense
  async function deleteExpense(id) {
    try {
      await API.delete(`/api/expenses/${id}`);
      loadExpenses();
    } catch (err) {
      console.log("Error deleting:", err);
    }
  }

  // Save edited expense
  async function saveEdit() {
    try {
      await API.put(`/api/expenses/${editing.id}`, editing);
      setEditing(null);
      loadExpenses();
    } catch (err) {
      console.log("Error updating:", err);
    }
  }

  return (
    <div>
      <h2>Expenses</h2>

      {/* Add Expense Form */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          border: '2px solid #28a745',
          borderRadius: '6px'
        }}
      >
        <h3>Add Expense</h3>

        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
        />
        <br />

        <input
          type="text"
          placeholder="Category"
          value={newExpense.category}
          onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
        />
        <br />

        <input
          type="date"
          value={newExpense.date}
          onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
        />
        <br />

        <input
          type="text"
          placeholder="Note"
          value={newExpense.note}
          onChange={e => setNewExpense({ ...newExpense, note: e.target.value })}
        />
        <br />

        <button onClick={addExpense}>Add Expense</button>
      </div>

      {/* List of expenses */}
      {expenses.length === 0 && <p>No expenses yet.</p>}

      {expenses.map(exp => (
        <div
          key={exp.id}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '6px'
          }}
        >
          <strong>${exp.amount}</strong> — {exp.category} — {exp.date}
          <br />
          <small>{exp.note}</small>

          <div style={{ marginTop: '0.5rem' }}>
            <button onClick={() => setEditing(exp)}>Edit</button>
            <button
              onClick={() => deleteExpense(exp.id)}
              style={{ marginLeft: '0.5rem', color: 'red' }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Edit form */}
      {editing && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            border: '2px solid #007bff',
            borderRadius: '6px'
          }}
        >
          <h3>Edit Expense</h3>

          <input
            type="number"
            placeholder="Amount"
            value={editing.amount}
            onChange={e => setEditing({ ...editing, amount: e.target.value })}
          />
          <br />

          <input
            type="text"
            placeholder="Category"
            value={editing.category}
            onChange={e => setEditing({ ...editing, category: e.target.value })}
          />
          <br />

          <input
            type="date"
            value={editing.date}
            onChange={e => setEditing({ ...editing, date: e.target.value })}
          />
          <br />

          <input
            type="text"
            placeholder="Note"
            value={editing.note}
            onChange={e => setEditing({ ...editing, note: e.target.value })}
          />
          <br />

          <button onClick={saveEdit}>Save</button>
          <button
            onClick={() => setEditing(null)}
            style={{ marginLeft: '0.5rem' }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
