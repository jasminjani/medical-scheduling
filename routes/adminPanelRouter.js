const express = require('express')
const { adminPanelControllers } = require('../controllers/adminPanelController')
const adminRouter = express.Router()

adminRouter.get('/admin', adminPanelControllers)


module.exports = {adminRouter }