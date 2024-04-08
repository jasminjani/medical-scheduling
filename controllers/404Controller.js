exports.page404 = (req, res) => {
    try {
        res.render('pages/404Page');
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}