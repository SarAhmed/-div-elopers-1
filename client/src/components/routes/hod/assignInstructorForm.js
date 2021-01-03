import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import React from 'react';

export default function AssignInstructorForm(props) {
    const [newType, setNewType] = React.useState(-1);
    const [chosenInstructor, setChosenInstructor] = React.useState();

    const handleClose = () => {
        props.handleClose();
    };
    const handleAdd = async () => {
        const instructorID = chosenInstructor.ID;
        const courseID = parseInt(JSON.stringify(props.course.ID));
        try {
            const req = {
                courseID: courseID,
                instructorID: parseInt(instructorID)
            };
            const res = await axios.put('/hod/assignCourseInstructor', req);
            props.setComponentInMain("manageCourseInstructors");
        } catch (err) {
            alert(err.response.data);
        }
        handleClose();
    }
    return (
<div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Course Instructor </DialogTitle>
                <DialogContent>
                <Autocomplete
                    id="AddCourseInstructorComboBox"
                    options={(props.academicMembers).filter((mem)=>{
                        if(!props.course)return true;
                        return !props.course.instructor.map(x=>x.ID).includes(mem.ID)})}
                  //  options={(props.academicMembers)}
                   
                    getOptionLabel={(option) => option.name}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Academic Members" variant="outlined" />}
                    onChange={(event, newValue) => {
                        setChosenInstructor(newValue);
                    }}

                />
                   
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={handleAdd} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}