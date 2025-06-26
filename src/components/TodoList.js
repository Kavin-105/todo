import React, { useState, useEffect } from 'react';

function getMonthDays(year, month) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function TodoList({ user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingIdx, setEditingIdx] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[user.username]) {
      setTodos(users[user.username].todos || []);
    }
  }, [user.username]);

  const saveTodos = (updatedTodos) => {
    setTodos(updatedTodos);
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[user.username].todos = updatedTodos;
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim() || !dueDate) return;
    const updatedTodos = [...todos, { text: newTodo.trim(), date: dueDate }];
    saveTodos(updatedTodos);
    setNewTodo('');
    setDueDate('');
  };

  const handleRemoveTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    saveTodos(updatedTodos);
  };

  const handleEdit = (idx) => {
    setEditingIdx(idx);
    setEditText(todos[idx].text);
    setEditDate(todos[idx].date);
  };

  const handleEditSave = (idx) => {
    if (!editText.trim() || !editDate) return;
    const updatedTodos = todos.map((todo, i) =>
      i === idx ? { ...todo, text: editText.trim(), date: editDate } : todo
    );
    saveTodos(updatedTodos);
    setEditingIdx(null);
    setEditText('');
    setEditDate('');
  };

  const handleEditCancel = () => {
    setEditingIdx(null);
    setEditText('');
    setEditDate('');
  };

  // Calendar logic
  const daysInMonth = getMonthDays(calendarYear, calendarMonth);
  const taskDates = todos.map(t => t.date);

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(y => y - 1);
    } else {
      setCalendarMonth(m => m - 1);
    }
  };
  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(y => y + 1);
    } else {
      setCalendarMonth(m => m + 1);
    }
  };

  return (
    <div className="dashboard-flex">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>{user.username}'s Dashboard</h2>
          <button onClick={onLogout}>Logout</button>
        </div>
        <form className="add-task-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            placeholder="Add a new task"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
          />
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        <div className="tasks-list">
          {todos.length === 0 ? (
            <p className="no-tasks">No tasks yet.</p>
          ) : (
            todos.map((todo, idx) => (
              <div className="task-card" key={idx}>
                {editingIdx === idx ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                    />
                    <input
                      type="date"
                      value={editDate}
                      onChange={e => setEditDate(e.target.value)}
                    />
                    <button onClick={() => handleEditSave(idx)}>Save</button>
                    <button onClick={handleEditCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <div className="task-info">
                      <span className="task-text">{todo.text}</span>
                      <span className="task-date">Due: {todo.date}</span>
                    </div>
                    <div>
                      <button className="edit-btn" onClick={() => handleEdit(idx)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleRemoveTodo(idx)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="dashboard-calendar">
        <div className="calendar-header">
          <button onClick={prevMonth}>&lt;</button>
          <span>{new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          <button onClick={nextMonth}>&gt;</button>
        </div>
        <div className="calendar-grid">
          {[...Array(new Date(calendarYear, calendarMonth, 1).getDay()).keys()].map(i => (
            <div key={'empty-' + i} className="calendar-cell empty"></div>
          ))}
          {daysInMonth.map(day => {
            const dateStr = day.toISOString().slice(0, 10);
            const hasTask = taskDates.includes(dateStr);
            return (
              <div
                key={dateStr}
                className={`calendar-cell${hasTask ? ' has-task' : ''}`}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TodoList; 