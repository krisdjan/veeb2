const express = require('express');
const app = express();
const fs = require('fs');
const mysql = require('mysql2');
const dbConfig = require('../../config');
const dateInfo = require('./date_timeET');
const database = 'if23_kristjans';
const bodyparser = require('body-parser');
let wisdom = [];



app.set('view engine', 'ejs');
app.use(express.static('public'));
//loon andmebaasi ühenduse
const connection = mysql.createConnection({
    host: dbConfig.configData.host,
    user: dbConfig.configData.user,
    password: dbConfig.configData.password,
    database: database
});
app.use(bodyparser.urlencoded({extended: false})); 


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

app.get('/eestifilm', (req, res) => {
    // res.send("töötab");
    res.render('eestiFilmIndex');
 
 });

 app.get('/eestifilm/filmiloend', (req, res) => {
    // res.send("töötab");
    let sql = 'SELECT title, production_year FROM movie';
    let sqlResult = [];

    connection.query(sql, (err, result) => {
        if(err) {
            throw err;
            res.render('eestiFilmList', {filmlist: sqlResult});
        } else {
            sqlResult = result;
            res.render('eestiFilmList', {filmlist: sqlResult});
        }
        
    });

    //res.render('eestiFilmList', {filmlist: sqlResult});
 });

 app.get('/eestifilm/lisapersoon', (req, res) => {
    // res.send("töötab");
    res.render('eestiFilmAddPerson');
 
 });
//Vormi postimine
 app.post('/eestifilm/lisapersoon', (req, res) => {
    let notice = '';
    let sql = 'INSERT INTO person (first_name, last_name, birth_date) VALUES (?, ?, ?)'
    connection.query(sql, [req.body.firstNameInput, req.body.lastNameInput, req.body.birthDateInput], (err, result)=> {
        if(err) {
            throw err; 
            notice = 'andmete salvestamine ebaõnnestus' + err;
            
        }
        else {
            notice = 'filmitegelase: ' + req.body.firstNameInput + ' ' + req.body.lastNameInput + ' salvestumine õnnestus';
            res.render('eestiFilmAddPerson', {notice: notice});
        }
    });


 });
 
app.listen(5218);