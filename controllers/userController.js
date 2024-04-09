
exports.allUser = async (req, res) => {
    try {

        // allUser controller logic

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


