import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { UserInfoPage } from './components/UserInfoPage';

type PageType = 'login' | 'dashboard' | 'userInfo';

interface User {
  name: string;
  email: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (email: string, name: string) => {
    setUser({ name, email });
    setCurrentPage('dashboard');
  };

  const handleSignOutClick = () => {
    setCurrentPage('userInfo');
  };

  const handleConfirmSignOut = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const handleCancelSignOut = () => {
    setCurrentPage('dashboard');
  };

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}
      {currentPage === 'dashboard' && user && (
        <Dashboard user={user} onSignOut={handleSignOutClick} />
      )}
      {currentPage === 'userInfo' && user && (
        <UserInfoPage 
          user={user} 
          onConfirmSignOut={handleConfirmSignOut}
          onCancel={handleCancelSignOut}
        />
      )}
    </>
  );
}
