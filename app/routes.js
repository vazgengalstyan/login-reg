var fs = require('file-system');
var con = require('../server');
var randomstring = require("randomstring");
var bcrypt = require('bcrypt');
const saltRounds = 10;
var nodemailer = require('nodemailer');
var ip = require('ip');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'galstyanvazgen1992@gmail.com',
        pass: '098123235V'
    }
});

module.exports = function (app) {
	
	app.post('/api/user-registration', function (req, res) {

        var myData = req.body;
        var mailSql = "SELECT id FROM users WHERE users.login = '" + myData.email + "'";

        con.query(mailSql, function (err, result) {

            if (err) {

                res.send(err);

            } else if (result[0]) {

                res.send('This email is alrady in use');

            } else {

                myData.verify_token = randomstring.generate(16);

                bcrypt.hash(myData.password, saltRounds, function (err, hash) {

                    var sql = "INSERT INTO users (login,password,name,surname,b_date,verify_token,is_verifyed) VALUES ('" + myData.email + "','" + hash + "','" + myData.firstname + "','" + myData.lastname + "','" + myData.b_date + "','" + myData.verify_token + "','" + 0 + "')";

                    var mailOptions = {
                        from: 'galstyanvazgen1992@gmail.com',
                        to: myData.email,
                        subject: 'Sending Email for registration',
                        text: 'http://' + ip.address() + ':8080/api/verify/' + myData.verify_token
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    con.query(sql, function (err, result) {

                        if (err) {

                            res.send(err);

                        } else {

                            myData.password = '';
                            res.json({success: true});

                        }
                    });

                });

            }

        });

    });

    app.get('/api/verify/:verify_token', function (req, res) {

        var sql = "UPDATE users SET is_verifyed = '" + 1 + "' WHERE verify_token = '" + req.params.verify_token + "'";

        con.query(sql, function (err, result) {

            if (err) {

                throw err;

            } else {

                res.redirect('http://' + ip.address() + ':8080/');
                console.log(result.affectedRows + " record(s) updated");

            }
			
        });

    });

    app.post('/api/user-login', function (req, res) {

        var myData = req.body;

        var loginSql = "SELECT login,is_verifyed,password,id FROM users WHERE users.login = '" + myData.email + "'";

        con.query(loginSql, function (err, result) {

            if (err) {

                throw err;

            } else {

                if (!result[0]) {

                    res.send('Invalid login.');

                } else {

                    var user_id = result[0].id;

                    bcrypt.compare(myData.password, result[0].password).then(function (password) {

                        if (!password) {

                            res.send('Invalid password.');

                        } else {

                            if (!result[0].is_verifyed) {

                                res.send('Please verify.');

                            } else {

                                var tzoffset = (new Date()).getTimezoneOffset() * 60000;
                                var localISOTime = (new Date(Date.now() - tzoffset));
                                var date = localISOTime.toISOString().substring(0, 19).replace('T', ' ');

                                var lastLoginSql = "UPDATE users SET last_login_date = '" + date + "' WHERE login = '" + myData.email + "'";

                                con.query(lastLoginSql, function (err, result) {

                                    if (err) {

                                        throw err;

                                    } else {

                                        var sessionSql = "INSERT INTO sessions(session_id,user_id) VALUES ('" + req.sessionID + "','" + user_id + "')";
                                        con.query(sessionSql, function (err, result) {
                                        });

                                        res.json({
                                            success: true,
                                            session_id: req.sessionID
                                        });

                                    }

                                });

                            }

                        }

                    });
                }

            }

        });

    });
	
	app.get('/api/authorization_with_session', function (req, res) {

        var session_id = req.cookies.session_id;
        var sql = "SELECT id FROM sessions WHERE sessions.session_id = '" + session_id + "'";

        con.query(sql, function (err, result) {

            if (result[0] && result[0].id) {

                res.json({success: true});

            } else {

                res.json({success: false});

            }

        });

    });

    app.get('/api/logout', function (req, res) {

        var session_id = req.cookies.session_id;
        var sql = "DELETE FROM sessions WHERE session_id = '" + session_id + "'";

        con.query(sql, function (err, result) {

            res.json({logout: true});

        });

    });

    app.post('/api/reset_password_invitation', function (req, res) {

        var myData = req.body;

        myData.change_password_token = randomstring.generate(16);
        var sql = "UPDATE users SET change_password_token = '" + myData.change_password_token + "' WHERE login = '" + myData.resetPasswordEmail + "'";

        con.query(sql, function (err, result) {

            if (result.changedRows == 1) {

                var mailOptions = {
                    from: 'galstyanvazgen1992@gmail.com',
                    to: myData.resetPasswordEmail,
                    subject: 'Sending Email for reset password',
                    text: 'http://' + ip.address() + ':8080/reset_password/' + myData.change_password_token
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                res.json({mailSend: true});

            } else {

                res.send('Invalid email.')

            }

        });

        var change_password_token = myData.change_password_token;
        var sqlDeleteToken = "UPDATE users SET change_password_token = '" + null + "' WHERE change_password_token = '" + change_password_token + "'";

        setTimeout(function () {

            con.query(sqlDeleteToken, function (err, result) {

                if (result.changedRows) {

                    console.log(result.changedRows + ' change_password_token updated null');

                }

            });

        }, 600 * 1000);

    });

    app.post('/api/chenge_password', function (req, res) {

        var myData = req.body;

        if (myData.change_password_token == 'null') {

            res.send('Error.');
            return

        }

        bcrypt.hash(myData.password, saltRounds, function (err, hash) {

            var sql = "UPDATE users SET password = '" + hash + "',change_password_token = '" + null + "'WHERE change_password_token = '" + myData.change_password_token + "'";

            con.query(sql, function (err, result) {

                if (result.changedRows == 1) {

                    res.json({chenged: true});

                } else {

                    res.send('Error.')

                }

            });

        });

    });

};