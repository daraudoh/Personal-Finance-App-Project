import { useEffect, useState } from "react";
import API from '../api';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ amount: '', category: '', date: '', note: ''});

  const loadExpenses = async () => {
    const res = await API.get('/expenses');
    setExpenses(res.data);
  };

  useEffect(() => {
    loadExpenses(); 
  }, []);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post('/expenses', form);
    setForm({ amount: '', category: '', date: '', note: ''});
    loadExpenses();
  };

  const handleDelete = async (id) => {
    await API.delete('/expenses/${id}');
    loadExpenses();
  };

  return(
    <div>
      <h2>Expenses</h2>
      <form onSubmit={handleSubmit}>
        <input name ="amount" placeholder="Amount" value={form.amount} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <input name="note" placeholder="Note" value={form.note} onChange={handleChange} />
        <button type="submit">Add</button>
      </form>

      <ul>
        {expenses.map(e => (
          <li key={e.id}>
            {e.date} - {e.category} - ${e.amount} - {e.note}
            <button onClick={() => handleDelete(e.id)}>Delete</button>

            
          </li>
        ))}
      </ul>
    </div>
  );
}