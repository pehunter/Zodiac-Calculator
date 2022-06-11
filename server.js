const express = require('express');
const morgan = require('morgan');
const dataFuncs = require('./controllers/dataController.js');

//Setup server & EJS
const app = express();
app.listen(8888);
app.set('view engine', 'ejs');

//Log all requests
//app.use(morgan('dev'));

//Handle static requests
app.use(express.static("public"));

//Redirect to /
app.get("/index", (req, res) => {
    res.redirect("/");
})

//Load index page
app.get("/", (req, res) => {
    res.render("index");
})

//Load selection page
app.get("/select", (req, res) => {
    res.render("select");
})

app.get("/retrieve", dataFuncs.loadResults)