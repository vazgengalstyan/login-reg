var con = require('../server');

module.exports = function (app) {

    app.get('/api/user-me', function (req, res) {

        var user_token = req.cookies.user_token;
        if (!user_token || user_token == 'null') {

            res.send('error');

        } else {

            var sql = "SELECT name,surname,b_date,user_token FROM users WHERE users.user_token = '" + user_token + "'";

            con.query(sql, function (err, result) {

                if (err) {

                    res.send('user not found');

                } else {

                    res.json(result[0]);

                }

            });

        }

    });

};