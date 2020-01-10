const path = require('path')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const viewRouter = require('./routes/viewRoutes')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const bookingRouter = require('./routes/bookingRoutes')

const app = express()
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

///1) Global Middlewares
// Serving Static Files
// app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(__dirname, 'public')))

//SET Security HTTP Headers
app.use(helmet())

// Development logging
// console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Limit Requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
})

app.use('/api', limiter)
app.use(xss())

//Body parser, reading data from body into req.body
app.use(express.json({
  limit: '10kb'
})) 
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

//middleware

// Data sanitization againse noSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS - cross site scripting attacks
app.use(xss())

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
  ]
}))

// test middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware 🤞')
  next()
})
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  // console.log(req.cookies)
  next()
})

// Routes
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app