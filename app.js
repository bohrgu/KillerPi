var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var helmet = require('helmet');
var Sequelize = require('sequelize')
const myLog = require('./utils/myLog')

var indexRouter = require('./routes/indexRouter')
var gameRouter = require('./routes/gameRouter')
var attemptRouter = require('./routes/attemptRouter')
var adminRouter = require('./routes/adminRouter')

var app = express()

// Set up database connection
// Use simple sqlite3 database for development
var devDatabaseURI = 'sqlite:./Killer.db'
global.databaseURI = process.env.DATABASE_URI || devDatabaseURI
myLog.log(global.databaseURI)
var sequelize = new Sequelize(global.databaseURI)
sequelize
.authenticate()
.then(() => {
	myLog.log('Connection has been established successfully.');
})
.catch(err => {
	myLog.error('Unable to connect to the database:\n', err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(helmet());

app.use('/', indexRouter)
app.use('/games', gameRouter)
app.use('/attempts', attemptRouter)
app.use('/admin', adminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app
