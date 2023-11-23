const express = require('express');
const app = express();
const fs = require('fs');
const mysql = require('mysql2');
const dbConfig = require('../../config');
const dateInfo = require('./date_timeET');
const database = 'if23_kristjans';
const bodyparser = require('body-parser');
const multer = require('multer'); //seame multeri jaoks vahevara, mis määrab üleslaadimise kataloogi
const upload = multer({dest: './public/gallery/orig/'});// käib multeriga käsi-käes
const mime = require('mime');
const sharp = require('sharp');

app.set('view engine', 'ejs');
app.use(express.static('public'));
//app.use(bodyparser.urlencoded({extended: false})); kui aint teksti postida
app.use(bodyparser.urlencoded({extended: true}));

//loon andmebaasi ühenduse
const connection = mysql.createConnection({
    host: dbConfig.configData.host,
    user: dbConfig.configData.user,
    password: dbConfig.configData.password,
    database: database
});

app.get('/', (req, res) => {
   // res.send("töötab");
   res.render('index');

});

app.get('/news', (req, res) => {
    res.render('news');
});

app.get('/photoupload', (req, res) => {
    res.render('photoupload');
});

app.get('/news/addnews', (req, res) => {
    res.render('addNews');
});

app.get('/news/readnews', (req, res) => {
    res.render('readNews');
});

app.get('/news/readnews/:id', (req, res) => {
    console.log(req.params.id);
    //console.log(req.query)
    res.send('Vaatame uudist, mille id on ' + req.params.id);
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

app.get('/photogallery', (req, res) => {
    let photoList = [];
    let sql = 'SELECT id,filename,alttext FROM id_gallery WHERE privacy > 1 AND deleted IS NULL ORDER BY id DESC';
    connection.execute(sql, (err,result)=>{
		if (err){
			throw err;
			res.render('photogallery', {photoList : photoList});
		}
		else {
			photoList = result;
			console.log(result);
			res.render('photogallery', {photoList : photoList});
        }
	});
});

app.get('/eestifilm/lisaseos', (req, res) => {
    res.render('eestiFilmAddRelation'); //to be continued
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

 app.post('/photoupload', upload.single("photoInput"), (req, res) => {
    let notice = '';
    console.log(req.file);
    console.log(req.body);
    const fileName = 'vp_' + Date.now() + '.jpg'
    fs.rename(req.file.path, './public/gallery/orig/' + fileName, (err)=> {
        console.log("Viga" + err);
    });
    const mimeType = mime.getType('./public/gallery/orig/' + fileName);

   console.log("tüüp: " + mimeType);
   sharp('./public/gallery/orig/' + fileName).resize(800,600).jpeg({quality : 90}).toFile('./public/gallery/normal/' + fileName);
   sharp('./public/gallery/orig/' + fileName).resize(100,100).jpeg({quality : 10}).toFile('./public/gallery/thumbs/' + fileName);
   
   notice = 'Pilt: ' + req.file.originalname + ' laeti üles.';
   res.render('photoupload', {notice: notice});
   let sql = 'INSERT INTO id_gallery (filename, originalname, alttext, privacy, userid) VALUES (?, ?, ?, ?, ?)';
   const userid = 1;
   connection.execute(sql, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userid], (err, result)=>{
    if(err) {
        notice = 'Foto andmete salvestamine ebaõnnestus!' + err;
        res.render('photoupload', {notice: notice});
        throw err;
    }
    else {
        notice = 'Pilt "' + req.file.originalname + '" laeti üles!';
        res.render('photoupload', {notice: notice});
    }
    });
 });
 
app.listen(5218);