const dotenv = require("dotenv");
const conn = require("../config/dbConnection");
const jwtStrategy = require("passport-jwt").Strategy;
dotenv.config();

// getToken function for passport
const getToken = (req) => {
  return (
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    null
  );
};

// opts for passport-jwt
let opts = {
  jwtFromRequest: getToken,
  secretOrKey: process.env.JWT_SECRET,
};

// passport-jwt configuration logic
exports.passportConfig = (passport) => {
  passport.use(
    new jwtStrategy(opts, async (payload, next) => {
      let result;
      let id = payload.id;
      try {
        [result] = await conn.query("select * from users where id = ?", [id]);
      } catch (error) {
        // if any error during query execution
        return next(error, false);
      }

      // if user present then call next with payload
      if (result.length > 0) {
        return next(null, result[0]);
      } else {
        // if user not present then call next with empty data
        return next(null, false);
      }
    })
  );
};

exports.isAdmin = async (req, res, next) => {
  try {
    let result;
    try {
      [result] = await conn.query(
        "select roles.role as role,users.id,users.fname  from users left join roles on users.role_id=roles.id where users.id=?",
        [id]
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    if (result[0].role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Admin",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

exports.isPatient = async (req, res, next) => {
  try {
    let result;
    try {
      [result] = await conn.query(
        "select roles.role as role,users.id,users.fname  from users left join roles on users.role_id=roles.id where users.id=?",
        [id]
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    if (result[0].role !== "patient") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Patient",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

exports.isDoctor = async (req, res, next) => {
  try {
    let result;
    try {
      [result] = await conn.query(
        "select roles.role as role,users.id,users.fname  from users left join roles on users.role_id=roles.id where users.id=?",
        [id]
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    if (result[0].role !== "doctor") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Doctor",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};
