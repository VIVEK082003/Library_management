import React from 'react';
import LoginPage from '..//../..//Common-lib/src/lib/LoginPage';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SideNavAdmin from '../Componenets/Admin/SideNavAdmin/SideNavAdmin';
import ListBooks from '../Componenets/Admin/ListBooks/ListBooks';
import AddBooks from '../Componenets/Admin/AddBooks/AddBooks';
import DashboardPage from '../Componenets/Admin/Dashboard/Dashboard';
import ListUser from '../Componenets/Admin/ListUser/ListUser';
import AddGenres from '../Componenets/Admin/AddGenre/AddGenre';
import Requests from '../Componenets/Admin/Requests/Requests';
import SideNavUser from '../Componenets/User/SideNavUser/SideNavUser';
import ListBooksUser from '../Componenets/User/ListBooksUser/ListBooksUser';
import IssueBook from '../Componenets/User/IssueBooks/IssueBooks';

const App: React.FC = () => {
  const isAuthenticated = () => {
    return sessionStorage.getItem('MyToken') !== null;
  };

  const isAdmin = () => {
    const userData = sessionStorage.getItem('UserData');
    if (userData) {
      const user = JSON.parse(userData);
      return user.isAdmin === true; // Check the isAdmin property
    }
    return false;
  };

  interface PrivateRouteProps {
    element: React.ReactElement;
  }

  const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }

    return isAdmin() ? <SideNavAdmin>{element}</SideNavAdmin> : <SideNavUser>{element}</SideNavUser>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute element={<DashboardPage />} />} />
        <Route path="/listbooks" element={<PrivateRoute element={<ListBooks />} />} />
        <Route path="/listuser" element={<PrivateRoute element={<ListUser />} />} />
        <Route path="/request" element={<PrivateRoute element={<Requests />} />} />
        <Route path="/issuebook" element={<PrivateRoute element={<IssueBook />} />} />
        <Route path="/addgenres" element={<PrivateRoute element={<AddGenres />} />} />
        <Route path="/addbooks" element={<PrivateRoute element={<AddBooks />} />} />
        <Route path="/listbooksuser" element={<PrivateRoute element={<ListBooksUser />} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
