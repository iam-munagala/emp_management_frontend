import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingIndicator = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Taking the full viewport height
      }}
    >
      <CircularProgress /> {/* Default loading indicator */}
      <Typography sx={{ mt: 2 }}>Loading, please wait...</Typography>
    </Box>
  );
};

export default LoadingIndicator;
