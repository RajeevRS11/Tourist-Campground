const express = require('express');
const router = express();
const { validateCampground } = require('../middleware/validatecampground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor } = require('../middleware');
const campControllers = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });
const Campground = require('../models/campground');

router
  .route('/')
  .get(catchAsync(campControllers.index))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateCampground,
    catchAsync(campControllers.createCampground)
  );

// UPLOAD MULTIPLE IMAGE
// .post(upload.array('image'), (req, res) => {
//   console.log(req.files);
//   res.send('It worked');
// });
// UPLOAD SINGLE IMAGE
// .post(upload.single('image'), (req, res) => {
//   res.send(req.body, req.file);
// });

// router.get('/', catchAsync(campControllers.index));

// router.post(
//   '/',
//   isLoggedIn,
//   validateCampground,
//   catchAsync(campControllers.createCampground)
// );

router.get('/new', isLoggedIn, campControllers.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(campControllers.showCampground))
  .put(
    isLoggedIn,
    upload.array('image'),
    validateCampground,
    catchAsync(campControllers.updateCampground)
  )
  .delete(isLoggedIn, catchAsync(campControllers.deleteCampground));

// router.get('/:id', catchAsync(campControllers.showCampground));
// router.put(
//   '/:id',
//   isLoggedIn,
//   validateCampground,
//   catchAsync(campControllers.updateCampground)
//   );
//   router.delete('/:id', isLoggedIn, catchAsync(campControllers.deleteCampground));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campControllers.editCampground)
);

module.exports = router;
