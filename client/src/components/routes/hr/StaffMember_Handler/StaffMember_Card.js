import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import React from 'react';
import { Collapse } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
import TodayIcon from '@material-ui/icons/Today';
import { deepPurple } from '@material-ui/core/colors';
import AddStaffMemberForm from './Add_StaffMember_Form';
import EditStaffMemberForm from './Edit_StaffMember_Form';
import AttendanceRecordForm from './AttendanceRecord_Form';
import AddMissingSignInOutForm from './Add_Missing_SignIn_Out_Form';


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
    Avatar: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        marginBottom : "20px",
        margin : "auto",
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
      },
}));

export default function Location_Card(props) {
    const [openEdit, setOpenEdit] = React.useState(false);

    const [openUpdate, setOpenUpdate] = React.useState(false);
    const [updatedStaffMember, setUpdatedStaffMember] = React.useState({});
    const [openAdd, setOpenAdd] = React.useState(false);


    const handleOpenEdit = (event) => {
        setOpenUpdate(true);
    }
    const handleCloseEdit = () => {
        setOpenUpdate(false);
    }

    const handleOpenAdd = () => {
        setOpenAdd(true);
    }

    const handleCloseAdd = () => {
        setOpenAdd(false);
    }


    const handleDelete = async (event) => {
        const res = await axios.delete(`/hr/deleteStaffMember/${event.currentTarget.id.split('_')[1]}`);
        props.setComponentInMain("staffMember");
    }

    const handleUpdate = async (event) => {
        const locationID = event.currentTarget.id.split('_')[1];
        const location = props.locations.filter(l => l.ID == locationID);
        setUpdatedStaffMember(location[0]);
        setOpenUpdate(true);
    }

    const getOfficeName = (ID) =>{
        console.log(props.offices)
        const office = props.offices.filter(elm => elm.ID == ID);
        return office.length > 0 ? office[0].name : undefined;
    }

    const getDepartmentName = (ID) =>{
        const dep = props.departments.filter(elm => elm.ID == ID);
        return dep.length > 0 ? dep[0].name : undefined;
    }

    const classes = useStyles();
    return (
        <div>
            <Container maxWidth="lg">

                <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(https://i.pinimg.com/originals/94/f6/41/94f641161d1d124c6bfa2463c7feb8d4.jpg)` }}>
                    <div className={classes.overlay} />

                </Paper>

                <Typography className={classes.title} variant="h5" component="div">
                    <b>Staff Members</b>
                    <IconButton
                        aria-label="account of current user"
                        aria-haspopup="true"
                        color='primary'
                        onClick={handleOpenAdd}
                    >
                        <AddCircleIcon style={{ fontSize: 25, opacity: 0.8 }}
                        />
                    </IconButton>
                </Typography>

                <Grid container spacing={4} >
                    {
                        props.staffMembers.map(staffMember =>
                            <Grid item xs={12} md={6}>
                                <CardActionArea component="a" href="#" disabled={false}>
                                    <Card className={classes.card}>
                                        <div className={classes.cardDetails}>
                                            <CardContent style={{paddingBottom:"0px",paddingLeft:"0px"}}>
                                                <Typography variant="subtitle1" paragraph style={{marginBottom:"0px"}}>
                                                    <Box display="flex" flexDirection="row">
                                                        <Box width="30%" style={{margin:"auto",textAlign:"center"}}>
                                                            <Avatar src="/broken-image.jpg" className={classes.Avatar}>{staffMember.name.substring(0, 2)}</Avatar>
                                                            <b> {staffMember.name}</b><br />
                                                        </Box>
                                                        <Box width="35%">
                                                            <b>Email: </b><a href={"mailto:"+staffMember.email}>{staffMember.email}</a> <br />
                                                            <b>Day Off: </b> {staffMember.dayOff}<br />
                                                            <b>Gender: </b> {staffMember.gender}<br />
                                                            <b>Office: </b> {getOfficeName(staffMember.officeID)}<br />
                                                            <Collapse in = {staffMember.type == 1} >
                                                                <b>Department: </b> {getDepartmentName(staffMember.departmentID)}<br />
                                                            </Collapse>
                                                        </Box>
                                                        <Box width="35%">
                                                        <b>Extra Info:</b><br />
                                                        {staffMember.extraInfo.map(elm =>{
                                                            return(
                                                                <div>{elm}</div>
                                                            )
                                                        })} 
                                                        </Box>
                                                    </Box>
                                                </Typography>
                                            </CardContent>
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"DELETE_" + staffMember.ID}
                                                color='primary'
                                                onClick={handleDelete}
                                            >
                                                <DeleteIcon style={{ fontSize: 25, opacity: 0.8,paddingTop:"0px" }}
                                                />
                                            </IconButton>
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"UPDATE_" + staffMember.ID}
                                                color='primary'
                                                onClick={handleUpdate}
                                            >
                                                <EditIcon style={{ fontSize: 30, opacity: 1 ,paddingTop:"0px"}}
                                                />
                                            </IconButton>
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"viewAttendance_" + staffMember.ID}
                                                color='primary'
                                                onClick={handleUpdate}
                                            >
                                                <Badge badgeContent={0} color="secondary"><TodayIcon /></Badge>
                                            </IconButton>
                                        </div>
                                    </Card>
                                </CardActionArea>
                            </Grid>
                        )
                    }
                </Grid>
            </Container>
            {/* <EditStaffMemberForm
                open={openUpdateLocation}
                handleOpenEdit={handleOpenEdit}
                handleCloseEdit={handleCloseEdit}
                location={updatedLocation}
                setComponentInMain={props.setComponentInMain} />
            <AddStaffMemberForm
                open={openAddLocation}
                handleOpenAdd={handleOpenAdd}
                handleCloseAdd={handleCloseAdd}
                setComponentInMain={props.setComponentInMain} />
            <AddStaffMemberForm
                open={openAddLocation}
                handleOpenAdd={handleOpenAdd}
                handleCloseAdd={handleCloseAdd}
                setComponentInMain={props.setComponentInMain} />
                 */}
        </div >
    );
}
