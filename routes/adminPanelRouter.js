const express = require('express')
const { adminPanelControllers } = require('../controllers/adminPanelController')
const { getSpecialties, deleteSpecialty } = require('../controllers/getSpecialtiesController')
const adminRouter = express.Router()

adminRouter.route('/admin').get(adminPanelControllers);
adminRouter.route('/get-specialties').get(getSpecialties);
adminRouter.route('/delete-specialty').post(deleteSpecialty);


module.exports = {adminRouter}