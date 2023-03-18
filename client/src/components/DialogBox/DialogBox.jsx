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

  const submitForm = () =>{
    console.log(tags)
    submitCreatePost(tags)
    setOpen(false);
  }
  const handleClose = () => {
    console.log(tags)
    // submitCreatePost(tags)
    setOpen(false);
  };
  const handleSetTags = () =>{
    // const tags = ['science','technology'];
    // setTags(tags)
    updateTags(tags)
  }

  useEffect(() => {
    if (trigger) {
      handleClickOpen()
    }
  }, [trigger]);

  const handleOnChange = (tag) =>{
    //setTags(current => [...current, tag]);
    if(!tags.includes(tag)){
      setTags([...tags, tag]);
    }else{
     const newTag = tags.filter((t) => t !== tag)
     setTags(newTag)
    }
    
    // console.log(tags)
  }
  return (
    <div>
  
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Project Categories"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please select the catagories of your project<br/>
            {trigger ? <>
            <input type="Checkbox" name="blue"  onChange={(e) =>handleOnChange("Art")}/>Art<br/>
            <input type="Checkbox" name="red"  onChange={(e) =>handleOnChange("technology")}/>technology<br/>
            <input type="Checkbox" name="science"   onChange={(e) =>handleOnChange("science")}/>science</>
              :""
          }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
       
          {/* <Button onClick={handleClose}>Disagree</Button> */}
          <Button onClick={submitForm} autoFocus>
            Create Post
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
