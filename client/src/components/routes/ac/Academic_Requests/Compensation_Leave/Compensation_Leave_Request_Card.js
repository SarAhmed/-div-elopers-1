import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import {
    DatePicker,


    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import axios from 'axios';
import React from 'react';

export default function RequestForm(props) {
    const [msg, setMsg] = React.useState(" ");
    const [selectedAbsenceDate, handleAbsenceDateChange] = React.useState(null);
    const [selectedCompensationDate, handleCompensationDate] = React.useState(null);

    const handleClose = () => {
        setMsg(" ");
        handleAbsenceDateChange(null);
        handleCompensationDate(null);
        props.handleCloseForm();
    };

    const handleSubmitRequest = async () => {
        try {
            console.log(msg);
            handleClose();
            const res = await axios.post("ac/sendCompensationLeaveRequest",
                {
                    "absenceDate": (new Date(selectedAbsenceDate)).getTime(),
                    "requestedDate": (new Date(selectedCompensationDate)).getTime(),
                    "msg": msg,
                });
            await props.setComponentInMain("ac_compensationLeaveRequest");
            props.openAlert("The Request has been submitted Successfully!", "success");
        } catch (err) {
            props.openAlert(err.response.data);
        }
    }

    function disablePast(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const currMonth = (new Date(Date.now())).getMonth();
        const currYear = (new Date(Date.now())).getFullYear()
        if (year < currYear - 1 || year > currYear + 1)
            return true;

        if (currMonth == month && day <= 10)
            return true;
        if (month == (currMonth + 1) % 12 && day >= 11)
            return true;
        for (const missing of props.missingDays) {
            const m_year = (new Date(missing)).getFullYear();
            const m_month = (new Date(missing)).getMonth();
            const m_day = (new Date(missing)).getDate();


            if (year == m_year &&
                month == m_month &&
                day == m_day) return false;
        }
        return true;
    }

    function disablePastCompensation(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        var weekday = new Array(7);
        weekday[0] = "sunday";
        weekday[1] = "monday";
        weekday[2] = "tuesday";
        weekday[3] = "wednesday";
        weekday[4] = "thursday";
        weekday[5] = "friday";
        weekday[6] = "saturday";
        const currMonth = (new Date(Date.now())).getMonth();
        const currYear = (new Date(Date.now())).getFullYear();
        const currDay = (new Date(Date.now())).getDate();
        if(weekday[date.getDay()]=="friday")return true;
        if(date<new Date())return true;
        console.log(props.senderObj.dayOff, date.getDay(), currDay, currMonth, month)
        if (year < currYear - 1 || year > currYear + 1)
            return true;
        if (
            (
                (month == (currMonth + 1) % 12 && day <= 10) ||
                (currMonth == month && day >= 11)
            ) &&
            weekday[date.getDay()] == props.senderObj.dayOff
        )
            return false;
        return true;
    }
    console.log("missing days", props.missingDays);
    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Compensation Leave Request </DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="requestFormMessage"
                        label="Write a message"
                        type="text"
                        fullWidth
                        onChange={(event) => { setMsg(event.target.value + " ") }}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <br /><br /><label> <div style={{ fontSize: "18px" }}>Absence Date:</div> </label>
                        <DatePicker
                            value={selectedAbsenceDate}
                            shouldDisableDate={disablePast}
                            onChange={handleAbsenceDateChange}
                        />
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <br /><br /><label> <div style={{ fontSize: "18px" }}>Compensation Date:</div> </label>
                        <DatePicker
                            value={selectedCompensationDate}
                            shouldDisableDate={disablePastCompensation}
                            onChange={handleCompensationDate}
                        />
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Back
          </Button>
                    <Button
                        disabled={msg == "" ||
                            msg == " " ||
                            selectedAbsenceDate == null ||
                            selectedCompensationDate == null}
                        onClick={handleSubmitRequest} color="primary">
                        Submit request
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}