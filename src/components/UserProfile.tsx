import React, { useState } from 'react';
import { userStore } from '../store/userStore';
import './UserProfile.css';

interface UserProfileProps {
  onUserChange: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onUserChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const activeUser = userStore.getActiveUser();
  const allUsers = userStore.getAllUsers();

  const handleCreateUser = () => {
    if (newUserName.trim()) {
      userStore.createUser(newUserName.trim());
      setNewUserName('');
      setShowCreateForm(false);
      setShowDropdown(false);
      onUserChange();
    }
  };

  const handleSwitchUser = (userId: string) => {
    userStore.switchUser(userId);
    setShowDropdown(false);
    onUserChange();
  };

  const handleDeleteUser = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus user ini?')) {
      userStore.deleteUser(userId);
      onUserChange();
    }
  };

  return (
    <div className="user-profile">
      <button
        className="user-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="user-icon">👤</span>
        <span className="user-name">{activeUser?.name || 'Pilih User'}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {showDropdown && (
        <div className="user-dropdown">
          {allUsers.map((user) => (
            <div
              key={user.id}
              className={`user-item ${user.id === activeUser?.id ? 'active' : ''}`}
              onClick={() => handleSwitchUser(user.id)}
            >
              <span>{user.name}</span>
              {allUsers.length > 1 && (
                <button
                  className="delete-user-btn"
                  onClick={(e) => handleDeleteUser(user.id, e)}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {showCreateForm ? (
            <div className="create-user-form">
              <input
                type="text"
                placeholder="Nama user..."
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateUser()}
              />
              <button onClick={handleCreateUser}>Buat</button>
              <button onClick={() => setShowCreateForm(false)}>Batal</button>
            </div>
          ) : (
            <button
              className="create-user-btn"
              onClick={() => setShowCreateForm(true)}
            >
              + User Baru
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
