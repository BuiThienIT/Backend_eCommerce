'use strict'

const ProductService = require('../services/product.service')
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class ProductController {
    // CREATE

    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new product success',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,
            }),
        }).send(res)
    }

    // PUT,PATCH

    /**
     * @desc publish product by shop
     * @param {String} product_shop
     * @param {String} product_id
     * @return {Number [0,1]} modifiedCount
     */

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product success',
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish product success',
            metadata: await ProductService.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res)
    }

    // END PUT, PATCH

    // QUERY
    /**
     * @desc Get all drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */

    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list draft success',
            metadata: await ProductService.findAllDraftsForShop({ product_shop: req.user.userId }),
        }).send(res)
    }

    getPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list publish success',
            metadata: await ProductService.findAllPublishForShop({ product_shop: req.user.userId }),
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search product success',
            metadata: await ProductService.searchProducts(req.params),
        }).send(res)
    }

    findAllProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all product success',
            metadata: await ProductService.findAllProducts(req.query),
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get product success',
            metadata: await ProductService.findProduct({
                product_id: req.params.id,
            }),
        }).send(res)
    }

    // END QUERY
}

module.exports = new ProductController()
