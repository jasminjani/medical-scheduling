const express = require('express')
const { adminPanelControllers } = require('../controllers/adminPanelController');
const { getSpecialties, deleteSpecialty, getNewSpecialties, addNewSpecialties } = require('../controllers/adminGetSpecialtiesController');
const { pendingDoctos, individualDoctor, approveDoctor, rejectDoctor } = require('../controllers/adminApproveDoc');
const adminRouter = express.Router()

adminRouter.route('/admin').get(adminPanelControllers);
adminRouter.route('/get-specialties').get(getSpecialties);
adminRouter.route('/delete-specialty').post(deleteSpecialty);
adminRouter.route('/get-new-specialties').get(getNewSpecialties);
adminRouter.route('/add-specialty').post(addNewSpecialties);


adminRouter.route('/individual-doctor/:id').get(individualDoctor);
adminRouter.route('/get-pending-doctor').get(pendingDoctos);
adminRouter.route('/approve-doctor/:id').get(approveDoctor);
adminRouter.route('/reject-doctor/:id').get(rejectDoctor);





module.exports = { adminRouter }