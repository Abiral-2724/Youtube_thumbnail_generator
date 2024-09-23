const express = require('express') ;
const { generateThumbnail, getAllThumbnails, searchThumbnails, getUserThumbnails } = require('../controllers/thumbnail.controller.js');

const router = express.Router() ;

router.route('/thumbnail').post(generateThumbnail) ;
router.route('/getthumbnails').get(getAllThumbnails) ;
router.route('/search').get(searchThumbnails) ;
router.route('/user/:userId').get(getUserThumbnails)
module.exports = router