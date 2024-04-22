const express = require('express')
const router = express.Router()
const { createSpecialities, allSpecialities } = require('../controllers/doctorSpecialitiesController')


router.route('/specialities').post(createSpecialities)

router.route('/specialities').get(allSpecialities)




module.exports = router