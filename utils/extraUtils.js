const Accidental_Leave_Request = require("../Models/Requests/Accidental_Leave_Request")
const Annual_Leave_Request = require("../Models/Requests/Annual_Leave_Request")
const Compensation_Leave_Request = require("../Models/Requests/Compensation_Leave_Request")
const Maternity_Leave_Request = require("../Models/Requests/Maternity_Leave_Request")
const Sick_Leave_Request = require("../Models/Requests/Sick_Leave_Request")
const Staff_Member = require("../Models/Users/Staff_Member")
const Location = require("../Models/Others/Location")
const Academic_Member = require("../Models/Users/Academic_Member")
const Department = require("../Models/Academic/Department")

const getAcademicMemberByID = async (ID) => {
    const academicMem = await Staff_Member.findOne({ ID: ID, type: 0 });
    return academicMem;
}

const getAcademicMembersByID_arr = async(ID_arr)=>{
    let allMembers = await Staff_Member.find({type:0});
    let result =[];
    allMembers = allMembers.filter(function(value){return ID_arr.includes(value.ID)});
    for(const curMem of allMembers){
        result.push({ID:curMem.ID, name:curMem.name})
    }
    return result;

}


const getAcademicMemberByID_arr = async (ID_arr) => {
    const academicMem = await Staff_Member.find({type : 0});
    const academicMem2 = await Academic_Member.find();
    const academicMemNames = [];
    for(const id of ID_arr){
        academicMemNames.push(academicMem.filter(elem => elem.ID == id)[0]);
    }
    for(const mem of academicMemNames){
        const ac = academicMem2.filter(elem=>elem.ID==mem.ID)[0];
        mem['_doc'].ac = ac;
     //   console.log(mem)
    }
    return academicMemNames;
}


const getOfficeByID = async (ID) => {
    const office = await Location.findOne({ ID: ID});
    return office;
}

const getDepartmentByID = async (ID) => {
    const dep = await Department.findOne({ ID: ID});
    return dep;
}

const trimMonogoObj = (obj, deletedProperties) => {
    return Object.keys(obj).reduce((object, key) => {
        if (!deletedProperties.includes(key)) {
            object[key] = obj[key]
        }
        return object
    }, {})
}

const getDifferenceInDays = (date2, date1) => {
    date1 = new Date(date1);
    date2 = new Date(date2);
    const Difference_In_Time = date2.getTime() - date1.getTime();
    // To calculate the no. of days between two dates 
    return (Difference_In_Time / (1000 * 3600 * 24));

}

const isRequestInWeek = (RequestDate, date) => { // all dates are entered in normal format not in miliseconds
    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth();
    const dateDay = date.getDate();

    const dateDayInWeek = date.getDay();
    const startDayOfWeek = new Date(dateYear, dateMonth, dateDay - ((dateDayInWeek + 1) % 7), 2, 0, 0, 0);
    const endDayOfWeek = new Date(dateYear, dateMonth,  dateDay - ((dateDayInWeek + 1) % 7) + 6, 2, 0, 0, 0);
    return (startDayOfWeek <= RequestDate && RequestDate <= endDayOfWeek);
}

const getMissingHours = (staffMem, accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves) => {
    const curDate = new Date();
    const curYear = curDate.getFullYear();
    const curMonth = curDate.getMonth();
    const curDay = curDate.getDate();
    let startOfMonth = new Date(curYear, curMonth, 11, 2, 0, 0, 0);
    const endOfMonth = new Date(curYear, curMonth + 1, 10, 2, 0, 0, 0);
    if (curDay <= 10) {
        startOfMonth.setMonth(curMonth - 1);
        endOfMonth.setMonth(curMonth);
    }

    const staff_member = staffMem;
    const attendanceArray = staff_member.attendanceRecord;
    let attendedHours = 0;
    let totalHours = 0;
    for (const record of attendanceArray) {
        if (record.signin && record.signout && startOfMonth.getTime() <= record.signin && record.signin <= endOfMonth.getTime()) {
            // const isFree = isFreeDay(staffMem, new Date(record.signin), accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves);
            // if (isFree)
            //     continue;
            if((getCurDay(new Date(record.signin)) == "friday"))
                continue;
            const signinDate = new Date(record.signin);
            const signinYear = signinDate.getFullYear();
            const signinMonth = signinDate.getMonth();
            const signinDay = signinDate.getDate();
            const startDate = new Date(signinYear, signinMonth, signinDay, 7, 0, 0, 0).getTime();
            const endDate = new Date(signinYear, signinMonth, signinDay, 19, 0, 0, 0).getTime();
            const startOfInterval = Math.max(startDate, record.signin);
            const endOfInterval = Math.min(endDate, record.signout);

            attendedHours += Math.max(0, (endOfInterval - startOfInterval) / (1000 * 60 * 60));
        }
    }

    let startDay = startOfMonth.getDate();
    let startMonth = startOfMonth.getMonth();
    let startYear = startOfMonth.getFullYear();
    let noOfDaysTillToday = 0;
    while (startOfMonth.getTime() <= curDate.getTime()) {
        
        //if (!isFreeDay(staffMem, startOfMonth, accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves)) {
          if (!(getCurDay(new Date(startOfMonth)) == "friday")) {
                const missingDay= isMissingDay(staffMem, startOfMonth, accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves);
            if(!missingDay){
            
            noOfDaysTillToday = noOfDaysTillToday + 1;
        }
    }
        startDay = startDay + 1;
        startOfMonth = new Date(startYear, startMonth, startDay, 2, 0, 0, 0);
    }
    return missingHours = noOfDaysTillToday * 8.4 - attendedHours;
}
const isFreeDay = (staffMem, date, accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves) => {
    if (staffMem.dayOff == getCurDay(date) || (getCurDay(date) == "friday")) return true;
    if (staffMem.type == 1) return false; // if he is an HR i won't check leaves since HR can't submit leaves so for any leave sender ID he is Academic Mem

    //handling accidental leave request
    if (accidentalLeaves)
        for (const leave of accidentalLeaves) {
            if (leave.senderID == staffMem.ID && twoDatesAreEqual(leave.requestedDate, date) && leave.status == "accepted")
                return true;
        }

    //handling anuual leave request
    if (annualLeaves)
        for (const leave of annualLeaves) {
            if (leave.senderID == staffMem.ID && twoDatesAreEqual(leave.requestedDate, date) && leave.status == "accepted")
                return true;
        }

    //handling compensation leave request
    if (compensationLeaves)
        for (const leave of compensationLeaves) {
            if (leave.senderID == staffMem.ID && twoDatesAreEqual(leave.absenceDate, date) && leave.status == "accepted")
                return true;
        }

    //handling maternality leave request
    if (maternalityLeaves)
        for (const leave of maternalityLeaves) {
            if (leave.senderID == staffMem.ID && (twoDatesAreEqual(leave.startDate, date) || twoDatesAreEqual(leave.endDate, date) || (leave.startDate.getTime() <= date.getTime() && date.getTime() <= leave.endDate.getTime())) && leave.status == "accepted")
                return true;
        }

    //handling sick leave request
    if (sickLeaves)
        for (const leave of sickLeaves) {

            if (leave.senderID == staffMem.ID && twoDatesAreEqual(leave.requestedDate, date) && leave.status == "accepted")
                return true;
        }

    return false;
}




const haveMissingDays = async (staffMem, accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves) => {
    const allMissed = await getMissingDays(staffMem, accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves);
    return (allMissed.length != 0);

}
const getMissingDays = async (staffMem, accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves) => {
    const curDate = new Date();
    const curYear = curDate.getFullYear();
    const curMonth = curDate.getMonth();
    const curDay = curDate.getDate();
    let startOfMonth = new Date(curYear, curMonth, 11, 2, 0, 0, 0);
    const endOfMonth = new Date(curYear, curMonth + 1, 10, 2, 0, 0, 0);
    if (curDay <= 10) {
        startOfMonth.setMonth(curMonth - 1);
        endOfMonth.setMonth(curMonth);
    }
    let startDay = startOfMonth.getDate();
    let startMonth = startOfMonth.getMonth();
    let startYear = startOfMonth.getFullYear();
    let missingDays = [];
    while (startOfMonth.getTime() <= curDate.getTime()) {
        const miss =  isMissingDay(staffMem, startOfMonth, accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves);
        if (miss) {
            missingDays.push(startOfMonth);
        }
        startDay = startDay + 1;
        startOfMonth = new Date(startYear, startMonth, startDay, 2, 0, 0, 0);
    }
    return missingDays;
}

const getCurDay = (date) => { // date entered as normal date not miliseconds
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
}

const twoDatesAreEqual = (date1, date2) => { // date entered as normal date not miliseconds
    return (date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear())
}



const isMissingDay =  (staffMem, date, accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves) => { // date is in normal date format not miliseconds
    const dateInms = date.getTime();

    //checking that this is not a dayOff or friday
    if (staffMem.dayOff == getCurDay(date) || (getCurDay(date) == "friday")) return false;

    //checking that he signed in on this date
    const attendanceArray = staffMem.attendanceRecord;
    for (const record of attendanceArray) {
     //   console.log("record ",record);
        if (record.status == 1 && record.signin && record.signout) {
            signinDate = new Date(record.signin);
       //     console.log("in check equality ",twoDatesAreEqual(signinDate, date) ,signinDate,date)
            if (twoDatesAreEqual(signinDate, date))
                return false;

        }
    }

    if (staffMem.type == 1) return true; // if he is an HR i won't check leaves since HR can't submit leaves so for any leave sender ID he is Academic Mem
    //handling accidental leave request
    // const accidentalLeaves= await Accidental_Leave_Request.find({senderID:staffMem.ID,status:"accepted"});
    if (accidentalLeaves)
        for (const leave of accidentalLeaves) {
            if (leave.senderID == staffMem.ID && twoDatesAreEqual(leave.requestedDate, date) && leave.status == "accepted")
                return false;
        }

    //handling anuual leave request
    //  const annualLeaves=await Annual_Leave_Request.find({senderID:staffMem.ID,status:"accepted"});
    if (annualLeaves)
        for (const leave of annualLeaves) {
            if (leave.senderID == staffMem.ID && twoDatesAreEqual(leave.requestedDate, date) && leave.status == "accepted")
                return false;
        }

    //handling compensation leave request
    // const compensationLeaves=await Compensation_Leave_Request.find({senderID:staffMem.ID,status:"accepted"});
    if (compensationLeaves)
        for (const leave of compensationLeaves) {
            if (leave.senderID == staffMem.ID && twoDatesAreEqual(leave.absenceDate, date) && leave.status == "accepted")
                return false;
        }


    //handling maternality leave request
    // const maternalityLeaves=await Maternity_Leave_Request.find({senderID:staffMem.ID,status:"accepted"});
    if (maternalityLeaves)
        for (const leave of maternalityLeaves) {
            if (leave.senderID == staffMem.ID && (twoDatesAreEqual(leave.startDate, date) || twoDatesAreEqual(leave.endDate, date) || (leave.startDate.getTime() <= date.getTime() && date.getTime() <= leave.endDate.getTime())) && leave.status == "accepted")
                return false;
        }



    //handling sick leave request
    //  const sickLeaves=await Sick_Leave_Request.find({senderID:staffMem.ID,status:"accepted"});\c

    if (sickLeaves)
        for (const leave of sickLeaves) {

            if (leave.senderID == staffMem.ID && twoDatesAreEqual(leave.requestedDate, date) && leave.status == "accepted")
                return false;
        }





    return true;
}




module.exports = {
    trimMonogoObj,
    getMissingHours,
    getDifferenceInDays,
    twoDatesAreEqual,
    isRequestInWeek,
    getMissingDays,
    haveMissingDays,
    getCurDay,
    getAcademicMemberByID,
    getOfficeByID,
   getAcademicMembersByID_arr,
    getDepartmentByID,
    getAcademicMemberByID_arr
}