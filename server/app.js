const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes');
const brightStarsRouter = require('./routes/brigth-stars');
const events = require('./routes/events');
const neo = require('./routes/neo');
const sun = require('./routes/sun');

// יוצר את השרת
const app = express();

// מחבר כל מיני ספריות כדי לעזור לשרת לרוץ
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/bright-stars', brightStarsRouter);
app.use('/events', events);
app.use('/neo', neo);
app.use('/sun', sun);


module.exports = app;
