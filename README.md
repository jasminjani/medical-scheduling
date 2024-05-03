# Medical-Scheduling-A-Alpha-Team


## Contributor

- A1 - Alpesh Prajapati 
- A2 - Ashish Zapadiya
- A3 - Darshan Panchal
- A4 - Grishma Sao
- A5 - Jani Jasmin
- A6 - Dixit Kaneriya
- A7 - Yash Babaria

## Project status

## Folder
```
.
├── config
│   ├── dbConnection.js
│   └── flagsValuesInProject.js
├── controllers
│   ├── adminController.js
│   ├── authController.js
│   ├── doctorController.js
│   ├── patientController.js
│   └── pdfController.js
├── demo.html
├── index.js
├── middlewares
│   ├── allRequestLogs.js
│   └── authMiddleware.js
├── models
│   └── medical_scheduling_final.sql
├── package.json
├── package-lock.json
├── public
│   ├── assets
│   │   ├── 404.png
│   │   ├── activationLinkSuccess.gif
│   │   ├── adminPanel
│   │   │   ├── account-create.svg
│   │   │   ├── arrow_forward.svg
│   │   │   ├── b3.jpg
│   │   │   ├── b4.jpg
│   │   │   ├── b8.jpg
│   │   │   ├── bg01.jpg
│   │   │   ├── calendar.svg
│   │   │   ├── icons
│   │   │   │   ├── accountsettings.svg
│   │   │   │   ├── add.svg
│   │   │   │   ├── back-iceblue.svg
│   │   │   │   ├── back-white.svg
│   │   │   │   ├── book-balck.svg
│   │   │   │   ├── book-hover.svg
│   │   │   │   ├── book.svg
│   │   │   │   ├── dashboard-hover.svg
│   │   │   │   ├── dashboard.svg
│   │   │   │   ├── delete-iceblue.svg
│   │   │   │   ├── delete-white.svg
│   │   │   │   ├── doctors-hover.svg
│   │   │   │   ├── doctors.svg
│   │   │   │   ├── edit-iceblue.svg
│   │   │   │   ├── edit-white.svg
│   │   │   │   ├── filter-iceblue.svg
│   │   │   │   ├── filter-white.svg
│   │   │   │   ├── home-iceblue.svg
│   │   │   │   ├── home.svg
│   │   │   │   ├── patients-hover.svg
│   │   │   │   ├── patients.svg
│   │   │   │   ├── schedule-hover.svg
│   │   │   │   ├── schedule.svg
│   │   │   │   ├── search.svg
│   │   │   │   ├── session-iceblue.svg
│   │   │   │   ├── session.svg
│   │   │   │   ├── settings-iceblue.svg
│   │   │   │   ├── settings.svg
│   │   │   │   ├── view-iceblue.svg
│   │   │   │   └── view-white.svg
│   │   │   ├── info.svg
│   │   │   ├── notfound.svg
│   │   │   ├── patient.png
│   │   │   ├── search.svg
│   │   │   ├── user.png
│   │   │   └── view-gray.svg
│   │   ├── bg01.jpg
│   │   ├── bstar.png
│   │   ├── calendar.png
│   │   ├── contact-us.jpg
│   │   ├── curved_line.png
│   │   ├── doctor1.jpg
│   │   ├── doctor2.png
│   │   ├── doctor3.jpg
│   │   ├── doctor4.jpg
│   │   ├── doctor-about.png
│   │   ├── Doctor-Apponitment.png
│   │   ├── doctor-nurses-special-equipment.jpg
│   │   ├── doctorPanel
│   │   │   ├── bluestar.png
│   │   │   ├── bluestar.webp
│   │   │   ├── colorstar.png
│   │   │   ├── dlogo1.png
│   │   │   ├── dprofile.png
│   │   │   ├── drevenue.png
│   │   │   ├── dtotal_appointment.png
│   │   │   ├── dtotal_patients.png
│   │   │   ├── images.jpeg
│   │   │   ├── images.png
│   │   │   ├── Star 2.png
│   │   │   ├── star-color.jpg
│   │   │   ├── star-color.webp
│   │   │   ├── star-empty-icon.webp
│   │   │   └── starwhite.jpg
│   │   ├── doctor.png
│   │   ├── done.png
│   │   ├── facebook.png
│   │   ├── final-logo.png
│   │   ├── gstar.png
│   │   ├── homepatientpanel.jpg
│   │   ├── hrline4.png
│   │   ├── instagram.png
│   │   ├── linkExpire.png
│   │   ├── loginimg.jpg
│   │   ├── logo.png
│   │   ├── medical-team.png
│   │   ├── noReview.png
│   │   ├── patient-dashboard.jpg
│   │   ├── profile.png
│   │   ├── sideBar
│   │   │   └── profile-icon-png-898.png
│   │   ├── solution.png
│   │   ├── starblack.jpeg
│   │   ├── starwhite.jpg
│   │   ├── tick.png
│   │   ├── twitter.png
│   │   ├── users-icon.png
│   │   └── youtube.png
│   ├── css
│   │   ├── adminPanel
│   │   │   ├── adminApproveDoc.css
│   │   │   ├── adminDashboard.css
│   │   │   ├── allPatientDetails.css
│   │   │   ├── approveDoctor.css
│   │   │   └── patientsAllAppoinment.css
│   │   ├── auth
│   │   │   ├── activateForm.css
│   │   │   ├── forgotPass.css
│   │   │   ├── login.css
│   │   │   ├── register.css
│   │   │   └── resetPass.css
│   │   ├── doctorPanel
│   │   │   ├── a7dashboard.css
│   │   │   ├── doctorPatientDetails.css
│   │   │   ├── profile.css
│   │   │   └── viewfeedback.css
│   │   ├── homepage.css
│   │   ├── loaderComponent.css
│   │   ├── Pagination
│   │   │   └── paginationComp.css
│   │   ├── patientCSS
│   │   │   ├── appointment.css
│   │   │   ├── patientDashboard.css
│   │   │   ├── patientHomePage.css
│   │   │   ├── patientPastBookings.css
│   │   │   ├── patientProfile.css
│   │   │   ├── patientReview.css
│   │   │   ├── patientSlotBooked.css
│   │   │   └── paymentHistory.css
│   │   ├── prescription
│   │   │   ├── createPrescription.css
│   │   │   ├── editPrescription.css
│   │   │   ├── pdfPopup.css
│   │   │   └── prescriptionOfAllPatient.css
│   │   ├── sideBar
│   │   │   ├── newSidebar.css
│   │   │   └── sidebar.css
│   │   └── slotPanel
│   │       ├── slotPanel.css
│   │       └── upcomingSlots.css
│   └── javascript
│       ├── adminPanel
│       │   ├── addDocSpeciality.js
│       │   ├── adminApproveDoc.js
│       │   ├── adminApproveSpecificDoctor.js
│       │   ├── adminContact.js
│       │   ├── adminDashboard.js
│       │   ├── adminShowOneDoc.js
│       │   ├── allPatientDetail.js
│       │   └── patientAllAppointment.js
│       ├── auth
│       │   ├── forgotPass.js
│       │   ├── generateLink.js
│       │   ├── login.js
│       │   ├── logout.js
│       │   ├── register.js
│       │   ├── resetPass.js
│       │   └── script.js
│       ├── carousel.js
│       ├── common
│       │   ├── patientNotification.js
│       │   └── upcomingNotification.js
│       ├── doctorPanel
│       │   ├── becomeDoctor.js
│       │   ├── doctorDashboard.js
│       │   ├── doctorPatientDetails.js
│       │   ├── doctorPatientHistory.js
│       │   ├── doctorProfile.js
│       │   ├── doctorProfileUpdate.js
│       │   ├── doctorReview.js
│       │   ├── doctorValidation.js
│       │   ├── fetchCity.js
│       │   ├── fetchSpeciality.js
│       │   ├── patientHistory.js
│       │   ├── patientPaymentHistory.js
│       │   ├── paymentHistory.js
│       │   ├── urlPath.js
│       │   └── viewPayment.js
│       ├── homepage.js
│       ├── loaderComponent.js
│       ├── Pagination
│       │   └── pagination.js
│       ├── patientPanel
│       │   ├── appointment.js
│       │   ├── home.js
│       │   ├── patientDashboardDoctor.js
│       │   ├── patientPastBookings.js
│       │   ├── patientProfile.js
│       │   ├── patientProfileUpdate.js
│       │   ├── patientProfileview.js
│       │   ├── patientReview.js
│       │   └── paymentHistory.js
│       ├── prescription
│       │   ├── createPrescription.js
│       │   ├── editPrescription.js
│       │   ├── generatePDF.js
│       │   └── prescriptionOfAllPatient.js
│       └── slotPanel
│           ├── getSlots.js
│           └── slotPanel.js
├── README.md
├── routes
│   ├── adminRouter.js
│   ├── authRouter.js
│   ├── doctorRouter.js
│   ├── nearByDoctorsRouter.js
│   ├── patientRouter.js
│   └── rootRouter.js
├── uploads
│   ├── files
│   ├── imgs
│   ├── logger
│   ├── pdfs
│   └── requestLogs
│       └── requestURL.log
├── utils
│   ├── multer.js
│   └── pino.js
└── views
    ├── common
    │   ├── 404.ejs
    │   ├── homepage.ejs
    │   ├── newSidebar
    │   │   ├── adminSidebar.ejs
    │   │   ├── doctorSidebar.ejs
    │   │   ├── patientNav.ejs
    │   │   └── patientSidebar.ejs
    │   └── Pagination
    │       └── paginationComp.ejs
    └── pages
        ├── adminPanel
        │   ├── addDocSpecialty.ejs
        │   ├── adminApproveDoc.ejs
        │   ├── adminApproveSpecificDoctor.ejs
        │   ├── adminContact.ejs
        │   ├── adminDashboard.ejs
        │   ├── adminShowOneDoc.ejs
        │   ├── allPatientDetail.ejs
        │   └── patientAllAppointment.ejs
        ├── auth
        │   ├── activationForm.ejs
        │   ├── forgotPass.ejs
        │   ├── login.ejs
        │   ├── register.ejs
        │   └── resetPass.ejs
        ├── doctorPanel
        │   ├── becomeDoctorDetails.ejs
        │   ├── doctorDashboard.ejs
        │   ├── doctorPatientDetails.ejs
        │   ├── doctorPatientHistory.ejs
        │   ├── doctorProfileUpdate.ejs
        │   ├── doctorReview.ejs
        │   ├── doctorViewProfile.ejs
        │   ├── patientPaymentHistory.ejs
        │   └── viewpayment.ejs
        ├── patientPanel
        │   ├── allDoctors.ejs
        │   ├── appointment.ejs
        │   ├── patientDashboard.ejs
        │   ├── patientPastBookings.ejs
        │   ├── patientProfile.ejs
        │   ├── patientProfileUpdate.ejs
        │   ├── patientProfileView.ejs
        │   └── paymentHistory.ejs
        ├── Prescription
        │   ├── createPrescription.ejs
        │   ├── editPrescription.ejs
        │   └── prescriptionOfAllPatient.ejs
        └── slotPanel
            ├── addSlots.ejs
            └── upcomingSlots.ejs
```