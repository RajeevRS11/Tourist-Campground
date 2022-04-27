const express = require('express');
const router = express();
const { validateCampground } = require('../middleware/validatecampground');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor } = require('../middleware');

router.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

router.get('/campgrounds/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.post(
  '/campgrounds',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'You have Successfully created a new campground!');
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

router.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  // const campground = await Campground.findById(id);
  const campground = await Campground.findById(id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('author');
  console.log(campground);
  if (!campground) {
    req.flash('error', 'Cannot found that Campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
});

router.get(
  '/campgrounds/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash('error', 'Cannot found that Campground!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
  })
);

router.put(
  '/campgrounds/:id',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success', 'You have successfully updated Campground!');
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

router.delete(
  '/campgrounds/:id',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Campground!');
    res.redirect('/campgrounds');
  })
);

module.exports = router;
