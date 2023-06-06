import './App.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
  });
  const [editUser, setEditUser] = useState(null);
  const [error, setError] = useState(null);

  // Fetch initial user data
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch user data
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Function to handle form input change
  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/users', newUser);
      const createdUser = response.data;
      setUsers([...users, createdUser]);
      setNewUser({ name: '', email: '' });
      setError(null);
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Error creating user');
    }
  };

  // Function to handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      setError(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error deleting user');
    }
  };

  // Function to handle user update
  const handleUpdateUser = async (userId, updatedUserData) => {
    try {
      const response = await axios.put(`http://localhost:5000/users/${userId}`, updatedUserData);
      const updatedUser = response.data;
      setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
      setEditUser(null);
      setError(null);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error updating user');
    }
  };

  // Function to handle edit user
  const handleEditUser = (user) => {
    setEditUser(user);
  };

  // Function to handle cancel edit
  const handleCancelEdit = () => {
    setEditUser(null);
  };

   // Function to render user list
   const renderUserList = () => {
    return users.map((user) => (
      <div className="user-item" key={user._id}>
        <p className="user-info">Name: {user.name}</p>
        <p className="user-info">Email: {user.email}</p>
        {editUser && editUser._id === user._id ? (
          <div className="user-edit">
            <input
              className="edit-input"
              type="text"
              name="name"
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            />
            <input
              className="edit-input"
              type="email"
              name="email"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            />
            <button className="edit-button" onClick={() => handleUpdateUser(editUser._id, editUser)}>Save</button>
            <button className="edit-button" onClick={handleCancelEdit}>Cancel</button>
          </div>
        ) : (
          <div className="user-actions">
            <button className="action-button" onClick={() => handleEditUser(user)}>Edit</button>
            <button className="action-button" onClick={() => handleDeleteUser(user._id)}>Delete</button>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="app">
      <h1 className="heading">User List</h1>
      {error && <p className="error">{error}</p>}
      <form className="user-form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleInputChange}
          required
        />
        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleInputChange}
          required
        />
        <button className="form-button" type="submit">Add User</button>
      </form>
      <div className="user-list">{renderUserList()}</div>
    </div>
  );
}

export default App;
