import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/dashboard'; 
import Error from './components/error';
import Employee from './components/employeelist'
import AddEmployeeForm from './components/addemployee';
import EditEmployee from './components/editemployee';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/error" element={<Error />} />
        <Route path="/employeelist" element={<Employee />} />
        <Route path="/addemployee" element={<AddEmployeeForm />} />
        <Route path="/editemployee/:employeeId" element={<EditEmployee />} />
      </Routes>
    </Router>
  );
}

export default App;
