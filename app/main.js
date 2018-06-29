module.exports = function (app) {
	
    require('./user')(app);
    require('./routes')(app);

    app.get('*', function (req, res) {

        res.sendfile('./public/index.html');

    });

};