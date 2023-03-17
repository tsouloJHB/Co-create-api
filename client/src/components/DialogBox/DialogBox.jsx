import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {  useEffect ,useState} from "react";

export default function AlertDialog({updateTags,trigger, submitCreatePost}) {
  const [open, setOpen] = React.useState(false);
  const [tags,setTags] = useState([])

  const handleClickOpen = () => {

    setOpen(true);
  };

  const handleClose = () => {
    submitCreatePost(tags)
    setOpen(false);
  };
  const handleSetTags = () =>{
    const tags = ['science','technology'];
    setTags(tags)
    updateTags(tags)
  }

  useEffect(() => {
    if (trigger) {
      handleClickOpen()
    }
  }, [trigger]);

  const handleOnChange = (tag) =>{
    //  setNames(current => [...current, 'Carl']);
    setTags(tags.push(tag))
    console.log(tags)
  }
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
            <input type="Checkbox" name="blue" value="yes" Checked onChange={handleOnChange("Art")}/>Art
            <input type="Checkbox" name="red" value="yes" onChange={handleOnChange("technology")}/>technology
            <input type="Checkbox" name="science" value="yes"   onChange={handleOnChange("science")}/>science
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSetTags}>Set Tags</Button>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
 

// import useMediaQuery from '@mui/material/useMediaQuery';

// function MyComponent() {
//   const theme = useTheme();
//   const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

//   return <Dialog fullScreen={fullScreen} />;
// }
