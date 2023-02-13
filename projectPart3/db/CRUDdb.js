var sql = require("./db");
const path = require("path");
const csv = require("csvtojson");

//create tables
const createUsersTable = (req,res,next)=>{
    var Q1 = "CREATE TABLE IF NOT EXISTS users (email varchar(255) PRIMARY KEY, first_name VARCHAR(255) not null, last_name VARCHAR(255) not null, user_name VARCHAR(255) not null, gender ENUM('זכר', 'נקבה', 'אחר') not null, birth_date date not null, phone_number varchar(10) not null, password varchar(15) not null) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    sql.query(Q1,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating users table"});
            return;
        }
        console.log('users table created successfully');
        return;
    })
    next();
};

const createContactsTable = (req,res,next)=>{
    var Q2 = "CREATE TABLE IF NOT EXISTS user_contacts_details (user_email varchar(255), contact_email VARCHAR(255), contact_name varchar(255), phone_number varchar(10) not null, closeness ENUM('1', '2', '3', '4', '5') not null, primary key(user_email, contact_email), CONSTRAINT FK_user_email FOREIGN KEY (user_email) REFERENCES users(email)) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    sql.query(Q2,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating user contacts details table"});
            return;
        }
        console.log('user contacts details table created successfully');
        return;
    })
    next();
};

const createContactEventsTable = (req,res)=>{
    var Q3 = "CREATE TABLE IF NOT EXISTS contact_events (user_email varchar(255), contact_email VARCHAR(255), event_type ENUM('יום הולדת', 'מבחן', 'יום נישואים', 'אירוע בריאותי', 'לידה', 'טיסה/נסיעה', 'אחר') not null, event_date date not null, primary key(user_email, contact_email, event_type, event_date), CONSTRAINT FK_emails FOREIGN KEY (user_email, contact_email) REFERENCES user_contacts_details(user_email, contact_email)) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    sql.query(Q3,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating contact events table"});
            return;
        }
        console.log('contact events table created successfully');
        //add
        res.send("all tables created");
        return;
    })
};


//insert data into tables
const InsertUsersData = (req,res)=>{
    var Q4 = "INSERT INTO users SET ?";
    const csvFilePath= path.join(__dirname, "users_data.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    jsonObj.forEach(element => {
        var NewUserEntry = {
            "email": element.email,
            "first_name": element.first_name,
            "last_name": element.last_name,
            "user_name": element.user_name,
            "gender": element.gender,
            "birth_date": element.birth_date,
            "phone_number": element.phone_number,
            "password": element.password
        }
        sql.query(Q4, NewUserEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting user data", err);
                return;
            }
            console.log("created user row sucssefuly");
        });
    });
        res.send("The data has been successfully inserted into users table");
        return;
    });
};

const InsertUserContactsData = (req,res)=>{
    var Q5 = "INSERT INTO user_contacts_details SET ?";
    const csvFilePath= path.join(__dirname, "contacts_details.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    // console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewContactEntry = {
            "user_email": element.user_email,
            "contact_email": element.contact_email,
            "contact_name": element.contact_name,
            "phone_number": element.phone_number,
            "closeness": element.closeness
        }
        sql.query(Q5, NewContactEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting users contacts data", err);
                return;
            }
            console.log("created user contact row sucssefuly ");
        });
    });
        res.send("The data has been successfully inserted into users contacts details table");
        return;
    });
};


const InsertContactsEventsData = (req,res)=>{
    var Q6 = "INSERT INTO contact_events SET ?";
    const csvFilePath= path.join(__dirname, "contact_event.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    jsonObj.forEach(element => {
        var NewEventEntry = {
            "user_email": element.user_email,
            "contact_email": element.contact_email,
            "event_type": element.event_type,
            "event_date": element.event_date
        }
        sql.query(Q6, NewEventEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting users contacts data", err);
                return;
            }
            console.log("created user contact row sucssefuly ");
        });
    });
        res.send("The data has been successfully inserted into contact events table");
        return;
    });

};


//show tables
const ShowUsersTable = (req,res)=>{
    var Q7 = "SELECT * FROM users";
    sql.query(Q7, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing users table ", err);
            res.send("error in showing users table ");
            return;
        }
        console.log("showing users table");
        res.send(mySQLres);
        return;
    })
};

const ShowContactsTable = (req,res)=>{
    var Q8 = "SELECT * FROM user_contacts_details";
    sql.query(Q8, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing user contacts details table ", err);
            res.send("error in showing user contacts details table ");
            return;
        }
        console.log("showing user contacts details table");
        res.send(mySQLres);
        return;
    })
};

const ShowEventsTable = (req,res)=>{
    var Q9 = "SELECT * FROM contact_events";
    sql.query(Q9, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing contact events table ", err);
            res.send("error in showing contact events table ");
            return;
        }
        console.log("showing contact events table");
        res.send(mySQLres);
        return;
    })
};


//drop tables
const dropUsersTable = (req,res)=>{
    var Q10 = "DROP TABLE users";
    sql.query(Q10, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping users table ", err);
            res.status(400).send({message: "error in dropping users table" + err});
            return;
        }
        console.log("users table dropped");
        res.send("all tables dropped");
        return;
    });
};

const dropContactsTable = (req,res,next)=>{
    var Q11 = "DROP TABLE user_contacts_details";
    sql.query(Q11, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping user_contacts_details table ", err);
            res.status(400).send({message: "error in dropping user_contacts_details users table" + err});
            return;
        }
        console.log("user_contacts_details table dropped");
        return;
    });
    next();
};

const dropEventsTable = (req,res,next)=>{
    var Q12 = "DROP TABLE contact_events";
    sql.query(Q12, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping contact_events table ", err);
            res.status(400).send({message: "error in dropping contact_events users table" + err});
            return;
        }
        console.log("contact_events table dropped");
        return;
    });
    next();
};






module.exports={createUsersTable, createContactsTable, createContactEventsTable, ShowUsersTable, ShowContactsTable, ShowEventsTable, dropUsersTable, dropContactsTable, dropEventsTable, InsertUsersData, InsertUserContactsData, InsertContactsEventsData};