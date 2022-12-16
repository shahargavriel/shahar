/*cheack confirm password*/
function checkConfirmPass(){
    let check_pass = false;
    let pass_input = document.getElementById('Password').value;
    let confirm_input = document.getElementById('confirm_pass').value;
    if (pass_input !== confirm_input) {
        document.getElementById('confirm-pass-error').innerHTML = 'אין התאמה בין הסיסמאות, נסה שוב';
    }
    else {
        document.getElementById('confirm-pass-error').innerHTML = '';
        check_pass = true;
    }
    return check_pass;
}

/*check first name, laxt name*/
function check_first_last_name() {
    let is_valid = false;
    let fname_input = document.getElementById("fname").value;
    let lname_input = document.getElementById("lname").value;
    let check_fname = check_onlyLetters(fname_input);
    let check_lname = check_onlyLetters(lname_input);
    if (!check_fname) {
        document.getElementById('fname-error').innerHTML = 'שם פרטי צריך להכיל רק אותיות ללא רווחים';
    } else {
        document.getElementById('fname-error').innerHTML = '';
    }
    if (!check_lname) {
        document.getElementById('lname-error').innerHTML = 'שם משפחה צריך להכיל רק אותיות ללא רווחים';
    } else {
        document.getElementById('lname-error').innerHTML = '';
    }
    if (check_fname && check_lname) {
      is_valid = true;
    }
    return is_valid;
    

}

/*check first name, laxt name- auxiliary function*/
function check_onlyLetters(str) {
  return (/^[\u0590-\u05ea]+$/i.test(str) || /^[a-z]+$/i.test(str));
}

/* Main function that sends to validation tests from personal private editing pages and creating a new user*/
function validate_inputs(alert_msg) {
  let check_full_name = check_first_last_name();
  let check_confirm_pass = checkConfirmPass();
  if (check_full_name && check_confirm_pass) {
    alert(alert_msg);
    return true;
  } else {
    return false;
  }

}

/*Validation function for the contact form*/
function contact_validation() {
  let check_names = check_first_last_name();
  if (check_names) {
    alert('ההודעה נשלחה בהצלחה!');
    return true;
  } else {
    return false;
  }

}

function saved_event() {
  alert('האירוע נוסף בהצלחה!');
}

/*dynamic function to sentences in the home page*/
function welcomeText() {
    var words=['עכשיו תחזרו לקשר עם כל מי שרציתם להיות...', 'ככה שומרים על קשר! ', 'Keep in Touch ;)'];
    var id='text';
    var visible = true;
    var colorText= '#000';
    var con = document.getElementById('console');
    var letterCount = 1;
    var x = 1;
    var waiting = false;
    var target = document.getElementById(id)
    target.setAttribute('style', 'color:' + colorText)
    window.setInterval(function() {
  
      if (letterCount === 0 && waiting === false) {
        waiting = true;
        target.innerHTML = words[0].substring(0, letterCount)
        window.setTimeout(function() {
          var usedWord = words.shift();
          words.push(usedWord);
          x = 1;
          target.setAttribute('style', 'color:' + colorText)
          letterCount += x;
          waiting = false;
        }, 1000)
      } else if (letterCount === words[0].length + 1 && waiting === false) {
        waiting = true;
        window.setTimeout(function() {
          x = -1;
          letterCount += x;
          waiting = false;
        }, 1000)
      } else if (waiting === false) {
        target.innerHTML = words[0].substring(0, letterCount)
        letterCount += x;
      }
    }, 120)
    window.setInterval(function() {
      if (visible === true) {
        con.className = 'console-underscore hidden'
        visible = false;
      } else {
        con.className = 'console-underscore'
        visible = true;
      }
    }, 400)
  }



/*dynamic function for open more peple in contact list foem (read more)*/

function show_more_less() {
    var list = document.getElementsByClassName("hidethis");
    for (var i = 0; i < list.length; i++) {
      if (list[i].style.display == 'none') {
        list[i].style.display = 'table-row';
      }
      else {
        list[i].style.display = 'none';
      }
    }
    var button_element = document.getElementById("more_less_span");
    if (button_element.value == 'הצג עוד') {
      button_element.value = 'הצג פחות';
    }
    else {
      button_element.value = 'הצג עוד';
    }
    
}

  /*Charging to sync*/

function redirect_sync() {
  setTimeout(function(){
    location.href = 'contact_list.html';
  }, 5000);

}