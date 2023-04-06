'use strict'

const { authenticationV2 } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const router = require('express').Router()

// Search product
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))

router.use(authenticationV2)

router.post('/create', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

// Query product
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getPublishForShop))

module.exports = router
