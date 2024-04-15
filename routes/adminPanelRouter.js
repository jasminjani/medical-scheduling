const express = require('express')
const { adminPanelControllers } = require('../controllers/adminPanelController')
const { getSpecialties, deleteSpecialty, getNewSpecialties, addNewSpecialties } = require('../controllers/getSpecialtiesController')
const adminRouter = express.Router()

adminRouter.route('/admin').get(adminPanelControllers);
adminRouter.route('/get-specialties').get(getSpecialties);
adminRouter.route('/delete-specialty').post(deleteSpecialty);
adminRouter.route('/get-new-specialties').get(getNewSpecialties);
adminRouter.route('/add-specialty').post(addNewSpecialties);


module.exports = { adminRouter }