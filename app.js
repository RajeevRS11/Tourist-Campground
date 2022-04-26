const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const ExpressError = require('./utils/expressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const session = require('express-session');
const sessionConfig = require('./middleware/sessionConfig');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// const Campground = require('./models/campground');
// const catchAsync = require('./utils/catchAsync');
// const { validateCampground } = require('./middleware/validatecampground');
// const { validateReview } = require('./middleware/validatereview');
// const Review = require('./models/review');

mongoose
  .connect('mongodb://127.0.0.1:27017/camp-ground')
  .then(() => {
    console.log('Connected to mongodb');
  })
  .catch((err) => {
    console.log('Error Occured during connection with mongodb');
  });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/', (req, res) => {
  res.render('Home');
});

app.get('/fakeUser', async (req, res) => {
  const user = new User({ email: 'monkeycap@gmail.com', username: 'monkey' });
  const newUser = await User.register(user, 'chicken');
  res.send(newUser);
});
app.use('/', campgroundRoutes);
app.use('/', reviewRoutes);
app.use('/', userRoutes);

// app.get('/makecampground', async (req, res) => {
//   const camp = new Campground({
//     title: 'My Backyard',
//     description: 'cheap camping available',
//   });
//   await camp.save();
//   res.send(camp);
// });

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong';
  res.status(statusCode).render('error', { err });
  // res.send('Ooooo! something went wrong');
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}/`);
});
