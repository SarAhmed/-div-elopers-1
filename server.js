const mongoose = require('mongoose');
const app = require('./index.js');
const periodic = require('./periodic.js');

const port = process.env.PORT || 5000;

mongoose.connect("mongodb+srv://ali:ali@cluster0.ds8cg.mongodb.net/productionTeam9?retryWrites=true&w=majority")
    .then(async() => {
        app.listen(port);
        console.log("Server is UP");
        periodic.loop_month(0);
    })
    .catch((err) => {
        console.log(err);
    })