import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, TextField, Typography, CircularProgress, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomAppBar from './appbar'; // Ensure CustomAppBar is correctly imported from its file
import LoadingIndicator from './loading';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://circular-kizzie-vamsimunagala.koyeb.app/employeelist', {
          method: 'GET',
          credentials: 'include', // Important for sending cookies
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setUserDetails(data.user);
        setEmployees(data.employees.map((item, index) => ({
          ...item,
          id: item._id, // Assuming MongoDB's _id is used as the unique key
          sno: index + 1,
        })));
      } catch (error) {
        console.error("Error fetching employees:", error);
        navigate('/');
      } finally {
        setIsLoading(false); 
      }
    };
    fetchEmployees();
  }, [lastUpdate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        console.log(id);
        const response = await axios.get(`https://circular-kizzie-vamsimunagala.koyeb.app/deleteemployee/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to delete');
  
        // Refresh the employees list after deletion
        const updatedEmployees = employees.filter((employee) => employee._id !== id);
        setEmployees(updatedEmployees);
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const columns = [
    { field: '_id', headerName: 'Unique Id', width: 200 },
    {
      field: 'f_Image',
      headerName: 'Image',
      width: 130,
      renderCell: (params) => (
        <img src={`${params.value}?${Date.now()}`} alt="Employee" style={{ width: 50, height: 50, borderRadius: '50%' }} />
      ),
    },
    { field: 'f_Name', headerName: 'Name', width: 150 },
    { field: 'f_Email', headerName: 'Email', width: 200 },
    { field: 'f_Mobile', headerName: 'Mobile No', width: 100 },
    { field: 'f_Designation', headerName: 'Designation', width: 130 },
    { field: 'f_Gender', headerName: 'Gender', width: 100 },
    { field: 'f_Course', headerName: 'Course', width: 130 },
    { field: 'f_CreateDate', headerName: 'Create Date', width: 130 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 130,
      renderCell: (params) => (
        <>
          <IconButton 
          color="primary" 
          aria-label="edit"
          onClick={() => navigate(`/editemployee/${params.id}`)}
        >
          <EditIcon />
        </IconButton>
          <IconButton color="secondary" aria-label="delete" onClick={() => handleDelete(params.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
      sortable: false,
    },
  ];

  useEffect(() => {
    console.log(userDetails);
  }, [userDetails]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = searchTerm
    ? employees.filter((employee) =>
        employee.f_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.f_Email.toLowerCase().includes(searchTerm.toLowerCase())  ||
        employee.f_Mobile.toLowerCase().includes(searchTerm.toLowerCase())  ||
        employee.f_Designation.toLowerCase().includes(searchTerm.toLowerCase())  ||
        employee.f_Gender.toLowerCase().includes(searchTerm.toLowerCase())  ||
        employee.f_Course.some(course => course.toLowerCase().includes(searchTerm.toLowerCase())) ||
        employee.f_CreateDate.toLowerCase().includes(searchTerm.toLowerCase()) 
      )
    : employees;

    if (isLoading) {
      return <LoadingIndicator />;
    }
  
  return (
    <Box sx={{ pt: 12, px: 2 }}>
      <CustomAppBar username={userDetails.f_userName} />
      <Typography variant="h4" gutterBottom>Employee List</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField label="Search Employees" variant="outlined" onChange={handleSearch} />
        <Typography variant="subtitle1">
    Total Employees: {employees.length}
  </Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/addemployee')}>Add Employee</Button>
      </Box>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredEmployees}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </div>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Total Employees: {employees.length}
      </Typography>
    </Box>
  );
}
