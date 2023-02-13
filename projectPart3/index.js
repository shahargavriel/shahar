//all the modules
const express = require('express');  //ייבוא חבילת אקספרס
const app = express(); //יצירת אפליקציה ואתחול לתוכה את כל הפונקציות של אקספרס
const path = require('path');  //ייבוא חבילת אקספרס
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const sql = require("./db/db"); //ייבוא החיבור לבסיס נתונים
const CRUD = require("./db/CRUD");
const CRUDdb = require("./db/CRUDdb");
const port = 3000;


app.use(express.static(path.join(__dirname,'static'))); //אומר שכל הקבצים הסטטיים נמצאים בתיקיית סטטיק
app.use(bodyParser.json()); //שורות 11-12 המשמעות היא שיש לנו עכשיו יכולת לפרסר בקשות של גייסונים ושל יואראל
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views')); //אתחול לאיפה התיקייה נמצאת
app.set('view engine', 'pug');

//routs
app.get('/', (req, res) => {
    res.render('homePage');
});

app.get('/homePage', (req, res) => {
    res.render('homePage');
});

app.get('/signIn', (req, res) => {
    res.render('signIn', {
        page_title: 'התחברות',
        page_h2: 'התחברות',
        is_login: false
    });
});

app.get('/signUp', (req, res) => { 
    res.render('signUp', {
        page_title: 'הרשמה',
        page_h2: 'הרשמה',
        is_login: false
    });
});

app.get('/contact', (req, res) => {
    var login_user = false;
    if (req.cookies.userEmail != null) {
        login_user = true;
    }
    res.render('contact', {
        page_title: 'צור קשר',
        page_h2: 'צור קשר',
        is_login: login_user
    });
});

app.get('/aboutUs', (req, res) => { 
    var login_user = false;
    if (req.cookies.userEmail != null) {
        login_user = true;
    }
    res.render('aboutUs', {
        page_title: 'אודות',
        page_h2: 'קצת עלינו',
        is_login: login_user
    });
});

app.get('/userPage', (req, res) => {
    res.render('userPage', {
        page_title: 'הפרופיל שלי',
        page_h2: 'הפרופיל שלי',
        is_login: true
    });
});


app.get("/deleteEvent/:type/:day(\\d{2})-:month(\\d{2})-:year(\\d{4})", CRUD.deleteEvent);


app.get("/personPage", CRUD.selectedPerson);

app.get("/selectContacts", CRUD.select_contacts);

app.get("/selectedPerson/:email", (req, res) => {
    var personEmail = req.params.email;
    res.cookie('personEmail', personEmail);
    console.log(req.cookies.personEmail);
    res.redirect('/personPage');
});

app.post('/updateUser', CRUD.updateUserDetails);

app.post('/signUpData', CRUD.signUpToDB);

app.post('/signInData', CRUD.findUser);

app.get('/psPage', CRUD.selectUserDetails);

app.get("/setCookie/:email", (req, res) => {
    var userEmail = req.params.email;
    res.cookie('userEmail', userEmail);
    res.redirect("/userPage");
});

app.get('/events', CRUD.select_contacts_email_name);

app.get('/changeCloseness', CRUD.updateCloseness);

app.get('/sync', (req, res) => {
    res.render('sync');
})


//route to delete cookie
app.get('/deleteUserCookie', (req,res) => {
    res.clearCookie("userEmail");
    res.clearCookie("personEmail");
    res.redirect('/homePage');
});

app.post('/addEvent', CRUD.insertNewEvent);




////////// initialize db //////////

//route to create all DB tables
app.get('/createAllTables', [CRUDdb.createUsersTable, CRUDdb.createContactsTable, CRUDdb.createContactEventsTable]);

//routes to insert data into tables
app.get('/insertUsers', CRUDdb.InsertUsersData);
app.get('/insertUsersContacts', CRUDdb.InsertUserContactsData);
app.get('/InsertContactsEvents', CRUDdb.InsertContactsEventsData);


//route to drop all tables
app.get('/dropAllTables', [CRUDdb.dropEventsTable, CRUDdb.dropContactsTable, CRUDdb.dropUsersTable]); 

//routes to show the tables
app.get('/showUsersData', CRUDdb.ShowUsersTable);
app.get('/showUsersContactsData', CRUDdb.ShowContactsTable);
app.get('/ShowEvents', CRUDdb.ShowEventsTable);


//listen
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});