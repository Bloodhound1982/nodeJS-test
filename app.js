'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    index = require('./routes/index'),
    app = express(),
    router = express.Router();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(router);

app.use('/api', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(9001, function () {
    console.log('Server is started on localhost:9001');
});

module.exports = app;
