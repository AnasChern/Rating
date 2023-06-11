import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function SuccessMesage({visible, text, handleClose}) {
  
  return <Snackbar open={visible} onClose={handleClose} autoHideDuration={6000}>
  <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
    {text}
  </Alert>
</Snackbar>
}
