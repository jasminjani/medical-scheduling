exports.homePage = (req, res) => {
    try {
        return res.render('pages/homePage')
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


exports.aboutPage = (req, res) => {
    try {
        return res.render('pages/aboutPage')
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}