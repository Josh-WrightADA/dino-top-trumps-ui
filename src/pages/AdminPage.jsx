import { useState } from 'react';
import UsersTab from '../components/admin/UsersTab';
import GamesTab from '../components/admin/GamesTab';
import ReportsTab from '../components/admin/ReportsTab';
import '../components/shared/Shared.css';
import './Admin.css';

const TABS = ['Users', 'Games', 'Reports'];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Users');

  return (
    <div className="page">
      <h1 className="page-heading admin-page__title">Admin Panel</h1>
      <div className="admin-page__tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`admin-page__tab${activeTab === tab ? ' admin-page__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Users' && <UsersTab />}
      {activeTab === 'Games' && <GamesTab />}
      {activeTab === 'Reports' && <ReportsTab />}
    </div>
  );
}
