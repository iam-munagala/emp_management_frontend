import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, FormControlLabel, Radio, RadioGroup, FormLabel, Checkbox, FormControl, FormGroup, InputLabel, Select, MenuItem, IconButton, Paper } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CustomAppBar from './appbar';
import LoadingIndicator from './loading';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';

export default function EditEmployee() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    mobileNo: '',
    designation: '',
    gender: '',
    image: null,
  });
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fetch employee details for editing
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`https://circular-kizzie-vamsimunagala.koyeb.app/getinfo/${employeeId}`, { withCredentials: true });
        const { data } = response;
        // Convert courses array back to checkboxes state
        setEmployee({
          name: data.f_Name,
          email: data.f_Email,
          mobileNo: data.f_Mobile,
          designation: data.f_Designation,
          gender: data.f_Gender,
          image: data.f_Image, // This will be the path to the existing image. Adjust as necessary.
        });
      } catch (error) {
        console.error('Error fetching employee details:', error);
        setError('Failed to load employee details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEmployee({ ...employee, [name]: value });
  };
  const handleCourseChange = (event) => {
    const { name, checked } = event.target;
    setCourses(prevCourses => {
      if (checked && !prevCourses.includes(name)) {
        // Add the course if it's checked and not already in the array
        return [...prevCourses, name];
      } else if (!checked && prevCourses.includes(name)) {
        // Remove the course if it's unchecked and currently in the array
        return prevCourses.filter(course => course !== name);
      }
      return prevCourses;
    });
  };

  const handleFileChange = (event) => {
    setEmployee({ ...employee, image: event.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!/\S+@\S+\.\S+/.test(employee.email)) {
      setError('Please enter a valid email address');
      return;
    }

    const checkEmailDuplicate = async (email) => {
      try {
        const response = await axios.post(`https://circular-kizzie-vamsimunagala.koyeb.app/edit-check-email/${employeeId}`, { email }, { withCredentials: true });
        const data = response.data;
        return data.isDuplicate;
      } catch (error) {
        console.error('Failed to check email:', error);
        return false; // Assume not a duplicate in case of error
      }
    };

    const isDuplicateEmail = await checkEmailDuplicate(employee.email);
    if (isDuplicateEmail) {
      setError('Email already exists. Please use a different email.');
      return;
    }

    if (!/^\d{10}$/.test(employee.mobileNo)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('mobileNo', employee.mobileNo);
    formData.append('designation', employee.designation);
    formData.append('gender', employee.gender);
    // Only append 'courses' if there were changes
    if (courses.length > 0) {
      formData.append('courses', JSON.stringify(courses));
    }
    if (employee.image instanceof File) {
      formData.append('image', employee.image);
    }

    try {
      await axios.put(`https://circular-kizzie-vamsimunagala.koyeb.app/employeedata/${employeeId}`, formData, { withCredentials: true });
      setOpenSnackbar(true);

      // Optionally, delay the navigation to allow the user to see the message
      setTimeout(() => {
        navigate('/employeelist');
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      console.error('Failed to update employee:', error);
      setError('Failed to update employee. Please try again.');
    }
  };

  if (isLoading) return <LoadingIndicator />;
  // Form similar to AddEmployeeForm but populated with existing employee data
  return (
    <>
      <CustomAppBar username="YourUsername" /> {/* Adjust as necessary */}
      <Box sx={{ mt: 12, display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
          <Typography variant="h4" gutterBottom component="div" sx={{ textAlign: 'center' }}>
            Edit Employee
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Form fields go here */}
          </form>
        </Paper>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Employee successfully updated!
        </Alert>
      </Snackbar>
    </>
  );
}
