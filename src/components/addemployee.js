import React, { useState } from 'react';
import { Box, Button, TextField, Typography, FormControlLabel, Radio, RadioGroup, FormLabel, Checkbox, FormControl, FormGroup, InputLabel, Select, MenuItem, IconButton, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CustomAppBar from './appbar'; // Ensure CustomAppBar is correctly imported
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';

export default function AddEmployeeForm({ username }) {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        name: '',
        email: '',
        mobileNo: '',
        designation: '',
        gender: '',
        courses: {
            MCA: false,
            BCA: false,
            BSC: false,
        },
        image: null,
    });
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handleCourseChange = (event) => {
        const { name, checked } = event.target;
        setEmployee({ ...employee, courses: { ...employee.courses, [name]: checked } });
    };

    const handleFileChange = (event) => {
        setEmployee({ ...employee, image: event.target.files[0] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Perform client-side validation here

        // Example: Validate email format
        const checkEmailDuplicate = async (email) => {
            try {
                const response = await fetch('https://circular-kizzie-vamsimunagala.koyeb.app/check-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'credentials': 'include',
                    },
                    body: JSON.stringify({ email }),
                });
                const data = await response.json();
                return data.isDuplicate;
            } catch (error) {
                console.error('Failed to check email:', error);
                return false; // Assume not a duplicate in case of error
            }
        };
        
        // In your handleSubmit function, before the other logic
        const isDuplicateEmail = await checkEmailDuplicate(employee.email);
        console.log(isDuplicateEmail)
        if (isDuplicateEmail) {
            setError('Email already exists. Please use a different email.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(employee.email)) {
            setError('Please enter a valid email address');
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
        formData.append('courses', JSON.stringify(employee.courses));
        formData.append('image', employee.image);

        try {
            const response = await fetch('https://circular-kizzie-vamsimunagala.koyeb.app/addemployees', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to add employee');
            setOpenSnackbar(true);

            // Optionally, delay the navigation to allow the user to see the message
            setTimeout(() => {
              navigate('/employeelist');
            }, 2000); // Adjust the delay as needed
          } catch (error) {
            console.error('Failed to add employee:', error);
            setError('Failed to add employee. Please try again.');
          }
    };

    return (
        <>
            <CustomAppBar username={username} />
            <Box sx={{ mt: 12, display: 'flex', justifyContent: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
                    <Typography variant="h4" gutterBottom component="div" sx={{ textAlign: 'center' }}>
                        Create Employee
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <TextField
                            required
                            label="Name"
                            name="name"
                            value={employee.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            required
                            label="Email"
                            name="email"
                            value={employee.email}
                            onChange={handleInputChange}
                        />
                        <TextField
                            required
                            label="Mobile No"
                            name="mobileNo"
                            value={employee.mobileNo}
                            onChange={handleInputChange}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="designation-label">Designation</InputLabel>
                            <Select
                                labelId="designation-label"
                                required
                                name="designation"
                                value={employee.designation}
                                onChange={handleInputChange}
                                label="Designation" // Ensure this matches the InputLabel's text
                            >
                                <MenuItem value="HR">HR</MenuItem>
                                <MenuItem value="Manager">Manager</MenuItem>
                                <MenuItem value="Sales">Sales</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Gender</FormLabel>
                            <RadioGroup row name="gender" value={employee.gender} onChange={handleInputChange}>
                                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl component="fieldset" margin="normal">
                            <FormLabel component="legend">Course</FormLabel>
                            <FormGroup row>
                                {["MCA", "BCA", "BSC"].map((course) => (
                                    <FormControlLabel
                                        key={course}
                                        control={
                                            <Checkbox
                                                checked={employee.courses[course]}
                                                onChange={handleCourseChange}
                                                name={course}
                                            />
                                        }
                                        label={course}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <Typography variant="button" display="block" gutterBottom>
                                Image Upload
                            </Typography>
                            <input
                                accept="image/jpeg,image/png"
                                style={{ display: 'none' }}
                                id="image-upload"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="image-upload">
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera />
                                </IconButton>
                            </label>
                            {employee.image && <Typography>{employee.image.name}</Typography>}
                        </FormControl>
                        {error && <Typography color="error">{error}</Typography>}
                        <Button type="submit" variant="contained">
                            Submit
                        </Button>
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
    Employee successfully added!
  </Alert>
</Snackbar>
        </>
    );
}
