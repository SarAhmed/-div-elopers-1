import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import React from 'react';
import Change_Day_Off_Request_Card from "./Change_Day_Off_Request_Card";

const useStyles = makeStyles((theme) => ({
    title: {
        flex: '1 1 100%',
        paddingBottom: '20px'
    },
    mainFeaturedPost: {
        position: 'relative',
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        marginBottom: theme.spacing(4),
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    mainFeaturedPostContent: {
        position: 'relative',
        padding: theme.spacing(3),
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(1),
            paddingTop: theme.spacing(3),
            paddingRight: 0,
        },
    },
    card: {
        display: 'flex',
    },
    cardDetails: {
        flex: 1,
        textAlign: 'left',

    },
    cardMedia: {
        width: 160,
    },
    root: {
        flexGrow: 1,
    },
}));

export default function ChangeDayOffRequest(props) {
    const [showForm, setShowForm] = React.useState(false);
    const [selection, setSelection] = React.useState("all");
    const handleCloseForm = () => {
        setShowForm(false);
    }
    const handleOpenForm = (event) => {
        setShowForm(true);
    }
    const handleAcceptRequest = async (event) => {
        const requestID = event.currentTarget.id.split('_')[1];
        try {
            const req = {
                response: 1
            };
            props.updateRequests("change day off requests", requestID, "accepted");
            const res = await axios.put(`/hod/respondToChangeDayOffRequest/${requestID}`, req);
            props.setComponentInMain("changeDayOffRequest");
        } catch (err) {
            props.updateRequests("change day off requests", requestID, "pending");
            alert(err.response.data);
        }
    }

    const handleRejectRequest = async (requestID, msg) => {
        try {
            const req = {
                response: 0,
                msg: msg
            };
            props.updateRequests("change day off requests", requestID, "rejected");
            const res = await axios.put(`/hod/respondToChangeDayOffRequest/${requestID}`, req);
            props.setComponentInMain("changeDayOffRequest");
        } catch (err) {
            props.updateRequests("change day off requests", requestID, "pending");

            alert(err.response.data);

        }

    }

    const handleOpenAddReplacementRequest = async () => {
        setShowForm(true);
    }

    const classes = useStyles();
    console.log("I am here")
    return (
        <div>
            <Container maxWidth="lg">

                <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(https://i.pinimg.com/originals/94/f6/41/94f641161d1d124c6bfa2463c7feb8d4.jpg)` }}>
                    <div className={classes.overlay} />

                </Paper>

                <Typography className={classes.title} variant="h5" component="div">
                    <b>Change Day Off Requests</b>
                    <IconButton
                        aria-label="account of current user"
                        aria-haspopup="true"
                        color='primary'
                        onClick={handleOpenAddReplacementRequest}
                    >
                        <AddCircleIcon style={{ fontSize: 25, opacity: 0.8 }}
                        />
                    </IconButton>
                </Typography>

                <Grid
                    container
                    className={classes.root}
                    spacing={2}
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item>
                        <Autocomplete
                            id="filterChangeDayOff"
                            options={["all", "accepted", "rejected", "pending"]}

                            getOptionLabel={(option) => option}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Filter by request status" variant="outlined" />}

                            onChange={(event, newValue) => {
                                if (newValue) {
                                    setSelection(newValue);
                                }
                            }}
                        />
                    </Grid>
                </Grid>
                <br />
                <Grid container spacing={4}
                    direction="column"
                    alignItems="stretch"
                >
                    {

                        props.requests.map(req =>
                            <Grid item xs style={(req.status != selection && selection != "all") ? { display: 'none' } : {}} >
                                <Card className={classes.card}>
                                    <div className={classes.cardDetails}>
                                        <CardContent >
                                            <Box display="flex" direction="row" justifyContent="space-between">
                                                <Box>
                                                    <Typography variant="subtitle1" paragraph>
                                                        <b>Sender Name:</b> {req.senderObj.name}<br />
                                                        <b>Email:</b> <a href={"mailto:" + req.senderObj.email}>{req.senderObj.email} </a><br />
                                                        <b>Message:</b> {req.msg}<br />
                                                        <b>Requested day off :</b> {req.targetDayOff}<br />
                                                        <b>Current day off:</b> {req.senderObj.dayOff}<br />
                                                        <b>Submission date:</b> {req.submissionDate}<br />
                                                        <b>Status:</b> {req.status}<br />
                                                    </Typography>
                                                </Box>

                                                <Box  >

                                                    <Tooltip title="Submit the request">
                                                        <IconButton
                                                            aria-label="account of current user"
                                                            aria-haspopup="true"
                                                            id={"REJECTDAYOFFREQUEST_" + req.ID}
                                                            color='primary'
                                                            style={(req.status != "pending") ? { display: 'none' } : {}}
                                                            onClick={handleOpenForm}
                                                        >
                                                            <CloseIcon style={{ color: "#cc0000", fontSize: 25, opacity: 1 }}
                                                            />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>

                                            </Box>
                                        </CardContent>
                                        <Change_Day_Off_Request_Card
                                            open={showForm}
                                            dayOff={req.senderObj.dayOff}
                                            handleCloseForm={handleCloseForm}
                                            addRecievedRequests={props.addRecievedRequests}
                                        />
                                    </div>
                                </Card>
                            </Grid>

                        )
                    }
                </Grid>
            </Container>



        </div >
    );
}
