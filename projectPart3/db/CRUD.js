const con = require("./db"); //ייבוא החיבור לבסיס נתונים
const js_validation = require("../static/js/pages_validation");



//function to return all contact details and events
const selectedPerson = (req, res) => {
    var userEmail = req.cookies.userEmail;
    var personEmail = req.cookies.personEmail;
    con.query("SELECT * from user_contacts_details where user_email = ? and contact_email = ?", [userEmail, personEmail], (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        con.query("SELECT event_type, DATE_FORMAT(event_date,'%d-%m-%Y') as event_date from contact_events where user_email = ? and contact_email = ?", [userEmail, personEmail], (err, mysqlres2) => {
            if (err) {
                console.log("error: ", err);
                res.status(400).send({message: "error: " + err});
                return;
            }

        res.render('personPage', {
            page_title: 'פרטי איש קשר',
            page_h2: 'פרטי איש קשר',
            contactDetails: mysqlres[0],
            contactEvents: mysqlres2,
            is_login: true
        });
    })});
};




const updateCloseness = (req, res)=>{
    if (!req.query) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    var userEmail = req.cookies.userEmail;
    var personEmail = req.cookies.personEmail;
    var newCloseness = req.query.closeness;
    console.log(newCloseness);
    con.query("UPDATE user_contacts_details SET closeness = ? where user_email = ? and contact_email = ?", [newCloseness, userEmail, personEmail], (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error in update user: " + err + newDetails});
            return;
        }
        console.log("update closeness");
        con.query("SELECT * from user_contacts_details where user_email = ? and contact_email = ?", [userEmail, personEmail], (err, mysqlres2) => {
            if (err) {
                console.log("error: ", err);
                res.status(400).send({message: "error: " + err});
                return;
            }
            con.query("SELECT event_type, DATE_FORMAT(event_date,'%d-%m-%Y') as event_date from contact_events where user_email = ? and contact_email = ?", [userEmail, personEmail], (err, mysqlres3) => {
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({message: "error: " + err});
                    return;
                }
    
            res.render('personPage', {
                page_title: 'פרטי איש קשר',
                page_h2: 'פרטי איש קשר',
                contactDetails: mysqlres2[0],
                contactEvents: mysqlres3,
                is_login: true, 
                msg: "הקרבה של איש הקשר עודכנה בהצלחה!"
            });
            return;
        })});

    

    });

        
};

const signUpToDB = (req, res)=>{
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    const newUser = {
        "email": req.body.Email,
        "first_name": req.body.fname,
        "last_name": req.body.lname,
        "user_name": req.body.user_name,
        "gender": req.body.selectGender,
        "birth_date": req.body.Bdate,
        "phone_number": req.body.phone_number,
        "password": req.body.Password
    };
    con.query("select * from users where email like ?", req.body.Email + "%", (err, mysqlres) =>{
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        
        else if (mysqlres.length == 0) {
            con.query("select * from users where user_name like ?", req.body.user_name + "%", (err, mysqlres2) =>{
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({message: "error: " + err});
                    return;
                }
                else if (mysqlres2.length == 0) {
                    var check_fname = js_validation.check_first_name(req.body.fname);
                    var check_lname = js_validation.check_last_name(req.body.lname);
                    var check_pass = js_validation.CheckPassword(req.body.Password);
                    var check_confirm_pass = js_validation.checkConfirmPass(req.body.Password, req.body.confirm_pass);
                    if (check_fname == "" && check_lname == "" && check_pass == "" && check_confirm_pass == "") {
                        con.query("INSERT INTO users SET ?", newUser, (err, mysqlres3) => {
                            if (err) {
                                console.log("error: ", err);
                                res.status(400).send({message: "error in create user: " + err + newUser});
                                return;
                            }
                            console.log("created user");
                            res.render('signIn', {
                                page_title: 'התחברות',
                                page_h2: 'התחברות',
                                alert_msg: "נרשמת לאתר בהצלחה! בצע התחברות",
                                is_login: false
                            });
            
                            return;
                        });
                    } else {
                        res.render('signUp', {
                            page_title: 'הרשמה',
                            page_h2: 'הרשמה',
                            userDetails: newUser,
                            fname_err: check_fname,
                            lname_err: check_lname,
                            pass_err: check_pass,
                            confirm_pass_err: check_confirm_pass,
                            is_login: false
                        });
                        return;
                    }

                }
                else {
                    res.render('signUp', {
                        page_title: 'הרשמה',
                        page_h2: 'הרשמה',
                        userDetails: newUser,
                        username_err: "קיים משתמש עם שם משתמש זהה, אנא בחר שם אחר",
                        is_login: false
                    });
                    return;
                }
            })
        } else {
            res.render('signUp', {
                page_title: 'הרשמה',
                page_h2: 'הרשמה',
                userDetails: newUser,
                email_err: "קיים משתמש עם כתובת מייל זו, אנא בחר מייל אחר",
                is_login: false
            });
            return;
        }
})};


const updateUserDetails = (req, res)=>{
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    var userEmail = req.cookies.userEmail;
    var newDetails = "";
    if (req.body.Password != "") {
        newDetails = {
            "first_name": req.body.fname,
            "last_name": req.body.lname,
            "user_name": req.body.user_name,
            "gender": req.body.selectGender,
            "birth_date": req.body.Bdate,
            "phone_number": req.body.phone_number,
            "password": req.body.Password
        };
    }
    else {
        newDetails = {
            "first_name": req.body.fname,
            "last_name": req.body.lname,
            "user_name": req.body.user_name,
            "gender": req.body.selectGender,
            "birth_date": req.body.Bdate,
            "phone_number": req.body.phone_number
        };
    }
    console.log(req.body.user_name);
    con.query("select * from users where user_name like ? and email not like ?", [req.body.user_name, userEmail], (err, mysqlres) =>{
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        
        else if (mysqlres.length == 0) {
            var check_fname = js_validation.check_first_name(req.body.fname);
            var check_lname = js_validation.check_last_name(req.body.lname);
            var check_pass = "";
            var check_confirm_pass = "";
            if (req.body.Password != "") {
                check_pass = js_validation.CheckPassword(req.body.Password);
                check_confirm_pass = js_validation.checkConfirmPass(req.body.Password, req.body.confirm_pass);
            }
            if (check_fname == "" && check_lname == "" && check_pass == "" && check_confirm_pass == "") {
                con.query("UPDATE users SET ? where email = ?", [newDetails, userEmail], (err, mysqlres2) => {
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message: "error in update user: " + err + newDetails});
                        return;
                    }
                    console.log("update user");
                    // res.redirect("/psPage");
                    res.render('psPage', {
                        page_title: 'פרטים אישיים',
                        page_h2: 'פרטים אישיים',
                        userDetails: newDetails,
                        email: userEmail,
                        alert_msg: "הפרטים עודכנו בהצלחה!",
                        is_login: true
                    });
    
                    return;
                });
            } else {
                res.render('psPage', {
                    page_title: 'פרטים אישיים',
                    page_h2: 'פרטים אישיים',
                    userDetails: newDetails,
                    email: userEmail,
                    fname_err: check_fname,
                    lname_err: check_lname,
                    pass_err: check_pass,
                    confirm_pass_err: check_confirm_pass,
                    is_login: true
                });
                return;
            }

        } else {
            res.render('psPage', {
                page_title: 'פרטים אישיים',
                page_h2: 'פרטים אישיים',
                userDetails: newDetails,
                email: userEmail,
                username_err: "קיים משתמש עם שם משתמש זהה, אנא בחר שם אחר",
                is_login: true
            });
            return;
        }
        
})};


const findUser = (req, res)=>{
    if (!req.body) { 
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    const userData = {
        "user_name": req.body.user_name,
        "password": req.body.Password
    };
    console.log(userData.user_name, userData.password);
        //הרצת שאילתה
    con.query("SELECT email, password FROM users where user_name like ?", userData.user_name + "%", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        console.log(mysqlres);
        if (mysqlres.length == 0) {
            res.render('signIn', {
                page_title: 'התחברות',
                page_h2: 'התחברות',
                is_login: false,
                user_name: userData.user_name,
                user_name_msg: 'שם משתמש לא קיים'
            });
            return;
            // window.alert("שם משתמש לא קיים");
            // return;
        }
        else {
            if (mysqlres[0].password == userData.password) {
                // res.redirect("/userPage");
                res.redirect("/setCookie/" + mysqlres[0].email);
                return;
            } else {
                res.render('signIn', {
                    page_title: 'התחברות',
                    page_h2: 'התחברות',
                    is_login: false,
                    user_name: userData.user_name,
                    pass_msg: 'סיסמה לא נכונה'
                });
                return;
            }
        }
    });
};

const deleteEvent = (req, res) => {
    var userEmail = req.cookies.userEmail;
    var personEmail = req.cookies.personEmail;
    var eventType = req.params.type;
    var new_date = new Date(
        +req.params.year,
        +req.params.month-1,
        +req.params.day+1
      );
    var str_date = getCurrentDate(new_date);
    con.query("DELETE FROM contact_events WHERE user_email = ? and contact_email = ? and event_type = ? and event_date = ?", [userEmail, personEmail, eventType, str_date], (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        res.redirect('/personPage');
    });

    
};

function getCurrentDate(t) {
    const date = ('0' + (t.getDate() - 1)).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    return `${year}-${month}-${date}`;
}



const selectUserDetails = (req, res)=>{
    //ולידציה שהבודי קיים
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    var userEmail = req.cookies.userEmail;
    con.query("SELECT first_name, last_name, user_name, gender, DATE_FORMAT(birth_date,'%Y-%m-%d') as birth_date, phone_number, password FROM users where email like ?", userEmail + "%", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        console.log(mysqlres);
        res.render('psPage', {
            page_title: 'פרטים אישיים',
            page_h2: 'פרטים אישיים',
            userDetails: mysqlres[0],
            email: userEmail,
            is_login: true
        });
    });
};



const select_contacts = (req,res)=>{
    var userEmail = req.cookies.userEmail;
    res.clearCookie("personEmail"); //מוחק את הקוקי שמחזיק את המייל של האיש קשר הקודם שנבחר
    console.log("show contacts list");
    console.log(userEmail);

    con.query("SELECT * from user_contacts_details where user_email like ?", userEmail + "%", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        res.render('contactList', {
            page_title: 'אנשי הקשר שלי',
            page_h2: 'אנשי הקשר שלי',
            contacts: mysqlres,
            is_login: true
        })
        return;
    });

};

const select_contacts_email_name = (req,res)=>{
    var userEmail = req.cookies.userEmail;
    con.query("SELECT contact_email, contact_name from user_contacts_details where user_email like ?", userEmail + "%", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        res.render('events', {
            page_title: 'הוספת אירוע',
            page_h2: 'הוסף אירוע',
            contacts: mysqlres,
            is_login: true
        });
        return;
    });

};




const insertNewEvent = (req, res)=>{
    var userEmail = req.cookies.userEmail;
    const newEvent = {
        "user_email": userEmail,
        "contact_email": req.body.selectContact,
        "event_type": req.body.selectEvent, 
        "event_date": req.body.event_date
    };
    con.query("select * from contact_events where user_email = ? and contact_email = ? and event_type = ? and event_date = ?", [userEmail, req.body.selectContact, req.body.selectEvent, req.body.event_date], (err, mysqlres) => {
        if(err) {
            res.status(400).send({message: "error in creating EVENT: " + err + newEvent});
            return;
        }
        else {
            if (mysqlres && mysqlres.length) {
                console.log("event exist");
                con.query("SELECT contact_email, contact_name from user_contacts_details where user_email like ?", userEmail + "%", (err, mysqlres2) => {
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message: "error: " + err});
                        return;
                    }
                    res.render('events', {
                        page_title: 'הוספת אירוע',
                        page_h2: 'הוסף אירוע',
                        contacts: mysqlres2,
                        is_login: true,
                        msg: 'האירוע שניסית ליצור כבר קיים, אנא נסה שנית'

                    });
                    return;
                });

            } else {
                con.query("INSERT INTO contact_events SET ?", newEvent, (err, mysqlres3) => {
                    if (err) {
                        res.status(400).send({message: "error in creating event: " + err + newEvent});
                        return;
                    }
                    con.query("SELECT contact_email, contact_name from user_contacts_details where user_email like ?", userEmail + "%", (err, mysqlres4) => {
                        if (err) {
                            console.log("error: ", err);
                            res.status(400).send({message: "error: " + err});
                            return;
                        }
                        console.log("created event");
                        res.render('events', {
                            page_title: 'הוספת אירוע',
                            page_h2: 'הוסף אירוע',
                            contacts: mysqlres4,
                            is_login: true,
                            msg: 'האירוע נוצר בהצלחה'
    
                        });
                        return;
                    });

                });
            }
        }
    });
};






module.exports = {signUpToDB, findUser, select_contacts, insertNewEvent, selectedPerson, select_contacts_email_name, selectUserDetails, updateUserDetails, deleteEvent, updateCloseness};