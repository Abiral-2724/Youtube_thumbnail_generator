const express = require('express') ;

const router = express.Router() ;
const CollectionController = require('../controllers/collection.controller.js');
router.route('/search').get(CollectionController.searchCollections);
router.route('/').post(CollectionController.createCollection) ;
router.route('/').get(CollectionController.getAllCollections) ;
router.route('/user/:userId').get(CollectionController.getCollections) ;
//router.route('/:id').put(updateCollection) ;
router.route('/add-thumbnail').post(CollectionController.addThumbnail) ;
//router.route('/:collectionId/thumbnails/:thumbnailId').get(removeThumbnailFromCollection) ;
router.route('/download/:id').get(CollectionController.downloadCollection) ;
router.route('/:id').delete(CollectionController.deleteCollection);
router.route('/:id/thumbnails').get(CollectionController.getThumbnailsForCollection);
//router.route('/thumbnails').get(CollectionController.getAllThumbnails);
//router.route('/thumbnails/search').get(CollectionController.searchThumbnails)
module.exports = router