const express = require('express');
const app = express();
const fs = require('fs');
const dateInfo = require('./date_timeET');
let wisdom = [];



app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
   // res.send("töötab");
   res.render('index');

});

app.get('/timenow', (req, res) => {
    const timeNow = dateInfo.timeNowET();
    const dateNow = dateInfo.dateNowET();
    res.render('timenow', {date: dateNow, time: timeNow});
});

app.get('/folkw', (req, res) => {
    let folkWisdom = [];
    fs.readFile("public/txtfiles/vanasonad.txt", "utf8", (err, data)=> {
        if(err) {
            console.log(err);
        }
        else {
             
            folkWisdom = data.split(";");
            res.render('justlist', {h1: 'Vanasõnad', wisdoms: folkWisdom});

        }
    });



});

app.listen(5218);