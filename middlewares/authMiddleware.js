const dotenv = require("dotenv");
const conn = require("../config/dbConnection");
const logger = require("../utils/pino");
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
        [result] = await conn.query("select u.*,pp.profile_picture from users as u inner join profile_pictures as pp on u.id = pp.user_id where pp.is_active=1 and u.id=?;", [id]);
      } catch (error) {
        // if any error during query execution
        logger.error(error)
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
    let id = req.user.id;
    let result;
    try {
      [result] = await conn.query(
        "select roles.role as role,users.id,users.fname  from users left join roles on users.role_id=roles.id where users.id=?",
        [id]
      );
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    if (result[0].role !== "admin") {
      return res.render('./common/404')
    }

    next();
  } catch (error) {
    logger.error(error);
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

exports.isPatient = async (req, res, next) => {
  try {
    let id = req.user.id;
    let result;
    try {
      [result] = await conn.query(
        "select roles.role as role,users.id,users.fname  from users left join roles on users.role_id=roles.id where users.id=?",
        [id]
      );
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    if (result[0].role !== "patient") {
      return res.render('./common/404')
    }

    next();
  } catch (error) {
    logger.error(error);
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

exports.isDoctor = async (req, res, next) => {
  try {
    let id = req.user.id;
    let result;
    try {
      [result] = await conn.query(
        "select roles.role as role,users.id,users.fname  from users left join roles on users.role_id=roles.id where users.id=?",
        [id]
      );
    } catch (error) {
      logger.error(error)
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    if (result[0].role !== "doctor") {
      return res.render('./common/404')
    }

    next();
  } catch (error) {
    logger.error(error)
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};


exports.roleHasPermissions = async (req, res, next) => {
  try {
    let url = req.baseUrl + req.path;
    url = url.split("/");
    url.shift();

    let id = url.pop();

    url = url.join("/");
    if (isNaN(id)) {
      url += `/${id}`
    }

    let roleId = req.user.role_id;

    let sql = `select * from role_has_permissions as rp inner join permissions p on rp.permission_id = p.id where rp.role_id = ? and p.permission=?`;
    let result;
    try {
      [result] = await conn.query(sql, [roleId, url])
    } catch (error) {
      logger.error(error)
    }

    if (result.length == 0) {
      return res.render('./common/404')
    }

    next()

  } catch (error) {
    logger.error(error)
    return res.json({
      success: false,
      message: error.message
    })
  }
}