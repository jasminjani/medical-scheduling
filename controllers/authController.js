const jwt = require("jsonwebtoken");
const conn = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const logger = require('../utils/pino')

const { specialitiesCombo } = require('./patientController')
dotenv.config();

// city combo
const generateCityCombo = async () => {
  try {
    let [result] = await conn.query("select * from cities order by city");

    if (!result.length) {
      let html = "";
      return html;
    }

    let html = `<option value="">--Select City--</option>`;

    result.forEach((value) => {
      html += `<option value="${value.city}">${value.city} </option>`;
    });

    return html;
  } catch (error) {
    logger.error(error.message);
  }
};

exports.getDoctorDetails = async (req, res) => {
  try {
    let result;
    try {
      let sql = `SELECT u.id, u.fname, u.lname, dd.qualification, dd.consultancy_fees, ch.name AS hospital_name, ch.city,
      ch.location,pp.profile_picture,s.speciality,COUNT(rr.id) AS total_reviews,AVG(rr.rating) AS rating
    FROM users AS u
    INNER JOIN
      doctor_details AS dd ON u.id = dd.doctor_id AND dd.approved = 1
    INNER JOIN
      profile_pictures AS pp ON u.id = pp.user_id AND pp.is_active = 1
    INNER JOIN
      doctor_has_specialities AS ds ON u.id = ds.doctor_id
    INNER JOIN
      specialities AS s ON ds.speciality_id = s.id
    INNER JOIN
      clinic_hospitals AS ch ON dd.hospital_id = ch.id
    LEFT JOIN
      rating_and_reviews AS rr ON u.id = rr.doctor_id
    GROUP BY u.id,pp.created_at,pp.profile_picture,s.speciality,dd.qualification,dd.consultancy_fees,ch.name,
      ch.city,ch.location ORDER BY rating DESC; `;
      [result] = await conn.query(sql);
      // logger.info(result);
    } catch (error) {
      logger.error(error.message)
      return res.status(500).json({
        success: false,
        message: "DB error Occur"
      })
    }

    result = Object.values(result.reduce((acc, { id, fname, lname, qualification, consultancy_fees, hospital_name, city, location, profile_picture, speciality, total_reviews, rating }) => {
      acc[id] ??= { id, fname, lname, qualification, consultancy_fees, hospital_name, city, location, profile_picture, total_reviews, rating, specialities: [] };
      acc[id].specialities.push(speciality)
      return acc;
    }, {}))

    result.sort((a,b)=> Number(b.rating ) - Number(a.rating))
    // logger.info(result)
    return res.json({
      success: true,
      data: result
    })

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }

}

exports.homePage = async (req, res) => {
  try {
    let html = await specialitiesCombo();
    let city = await generateCityCombo();
    return res.render('./common/homepage', { html, city });

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.contactUsHomePage = async (req, res) => {

  const { name, mobile_no, email, city, role, message } = req.body;

  try {
    await conn.query('insert into contact_us(name,mobile_no,email,city,role,message) values (?)'
      , [[name, mobile_no, email, city, role, message]]);
    res.json({
      success: true,
      message: "Data inserted .."
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.allDoctors = async (req, res) => {
  try {
    let html = await specialitiesCombo();
    let city = await generateCityCombo();
    res.render('./pages/patientPanel/allDoctors', { html, city })
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// get => /register
exports.getCreateUserForm = async (req, res) => {
  try {
    let html = await generateCityCombo();
    return res.render("./pages/auth/register", { html });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get => /login
exports.getLoginForm = async (req, res) => {
  try {
    return res.render("./pages/auth/login");
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// post => /register
exports.createUser = async (req, res) => {
  try {
    // get data from the req body
    let {
      fname,
      lname,
      email,
      dob,
      gender,
      phone,
      city,
      address,
      password,
      confirmPassword,
    } = req.body;

    let profile = req.file?.filename || "";

    // validate data
    if (
      !fname ||
      !lname ||
      !email ||
      !dob ||
      !gender ||
      !city ||
      !phone ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        body: req.body,
        message: "Please fill all the fields",
      });
    }

    // check password and confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "confirm password doesn't match",
      });
    }

    // if password and confirmPassword same
    let result;

    try {
      let sql = "select * from users where email=?";
      [result] = await conn.query(sql, [email]);
    } catch (error) {
      logger.error(error.message)
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    // if user exist
    if (result.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    // if user not exist

    // generate hashpassword
    let hashPassword;
    try {
      
      let bcryptsalt = await bcrypt.genSaltSync(10);
      hashPassword = await bcrypt.hash(password, bcryptsalt);
    } catch (error) {
      logger.error(error.message)
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    // A string containing a randomly generated, 36 character long v4 UUID.
    let verification_token = crypto.randomUUID();

    // make query for insert the data

    let sql =
      "insert into users (fname,lname,email,dob,gender,phone,password,city,address,role_id,activation_token) values (?)";

    // execute the query
    try {
      [result] = await conn.query(sql, [
        [
          fname,
          lname,
          email,
          new Date(dob),
          gender,
          phone,
          hashPassword,
          city,
          address,
          1, // default role is patient so role_id = 1
          verification_token,
        ],
      ]);
    } catch (error) {
      logger.error(error.message)
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Internal server Error",
      });
    }


    try {
      let sql = "insert into profile_pictures (profile_picture,user_id) values (?)";
      await conn.query(sql, [[profile, result.insertId]])
    } catch (error) {
      logger.error(error.message)
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Internal server Error",
      });
    }



    // data inserted
    if (!result.affectedRows) {
      return res.status(400).json({
        success: false,
        message: "error occur during registration",
      });
    }

    // get the inserted data by email to return to user
    try {
      let sql = "select * from users where email=?;";
      [result] = await conn.query(sql, [email]);
    } catch (error) {
      logger.error(error.message)
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Internal server Error",
      });
    }

    return res.json({
      success: true,
      user: result[0],
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// post => /login
exports.login = async (req, res) => {
  try {
    // get data
    let { email, password } = req.body;

    // validate data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // execute the query to find user in DB by email
    let result;
    try {
      let sql = "select * from users where email=? and is_active=1";
      [result] = await conn.query(sql, [email]);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    // user not found then return res
    if (result.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }

    // user found the verify DB password with entered password
    let hashPassword = result[0].password;
    if (await bcrypt.compare(password, hashPassword)) {
      // both are same

      //if db password and user's password matched then put the entry in login_attempts as accept

      try {
        await conn.query(
          "insert into login_attempts (user_id, password, status) values (?)",
          [[result[0].id, password, true]]
        );
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
          message: "Internal Server Error",
        });
      }

      let profile;
      try {
        let sql = "select * from profile_pictures where user_id = ? and is_active=1";
        let [data] = await conn.query(sql, [result[0].id]);
        profile = data[0]?.profile_picture;
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
          message: "Internal Server Error",
        });
      }

      // generate token for the cookie
      let payload = {
        id: result[0].id,
        email: result[0].email,
        role_id: result[0].role_id,
      };

      // remove password from the user obj
      let { password:_, created_at, deleted_at, updated_at, is_active, token_created_at, is_deleted, activation_token, ...newObj } = result[0];
      // generate token
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // set token into userObj
      newObj.token = token;
      newObj.profile = profile;

      return res
        .cookie("token", token, {
          maxAge: 4 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
        .json({
          success: true,
          user: newObj,
        });
    } else {
      //if db password and user's password not matched then put the entry in login_attempts as fail
      try {
        await conn.query(
          "insert into login_attempts (user_id, password, status) values (?)",
          [[result[0].id, password, false]]
        );
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: error.message,
          message: "Internal Server Error",
        });
      }

      //return res for the not match the password with stored password
      return res.json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete => /user/:id
exports.deleteUser = async (req, res) => {
  try {
    // get user id
    let id = req.params.id;

    let result;
    // execute query
    try {
      let sql = "select * from users where id=? and is_deleted=0";
      [result] = await conn.query(sql, [id]);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    // if user not found
    if (result.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // user found
    // query for deleting user
    try {
      let sql = "update users set is_deleted=1,deleted_at=? where id=?";
      [result] = await conn.query(sql, [new Date(Date.now()), id]);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    // check deleted or not
    if (!result.affectedRows) {
      return res.status(400).json({
        success: false,
        message: "error in deleting the data",
      });
    }
    // return res deleted successfully
    return res.json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.activationForm = async (req, res) => {
  try {
    let token = req.query.activationKey;
    let email = req.query.email;

    if (!token || !email) {
      return res.render("./common/404");
    }

    let html = `<div class="container">
    <div class="thanks-registration">
      <p><img src="/assets/done.png" class="done" alt=""></p>
      <p class="thanks-msg">Thank You for Your Registration!</p>
      <p class="activate-msg">Click on Below Link to Activate Your Account</p>
      <p class="activate-link"><a href="/activate/?activationKey=${token}&email=${email}" target="_blank">http://localhost:8000/activate/?activationKey=${token}&email=${email}</a></p>
    </div>
  </div>`;

    return res.render("./pages/auth/activationForm", { html });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.activationAccount = async (req, res) => {
  try {
    let token = req.query.activationKey;
    let email = req.query.email;

    let result;
    try {
      let sql =
        "select * from users where email=? and activation_token=? and is_active=0";
      [result] = await conn.query(sql, [email, token]);
    } catch (error) {
      return res.status(500).json({
        success: "false",
        message: error.message,
      });
    }

    if (result.length <= 0) {
      let html = ` <div class="success-page">
                  <div>
                    <img src="/assets/linkExpire.png" alt="Verification link has been expired!">
                  </div>
                  </div>`;
      return res.render("./pages/auth/activationForm", { html });
    }

    let diff = new Date(Date.now()) - new Date(result[0].token_created_at);
    let mins = Math.floor((diff % 86400000) / 60000); // minutes

    if (mins > 1) {
      let html = ` <div class="success-page">
      <div>
        <img src="/assets/linkExpire.png" alt="Verification link has been expired!">
      </div>
      <p class="btn-size"><a href="" class="btn-text" id="generate-token">Generate new link</a></p>
  
      <input type="hidden" id="active-account">
    </div>`;
      return res.render("./pages/auth/activationForm", { html });
    }

    try {
      let sql = "update users set is_active=true where email=?";
      [result] = await conn.query(sql, [email]);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    let html = `<div class="success-page">
    <div>
      <img class="img" src="/assets/activationLinkSuccess.gif" alt="Hurray">
    </div>
    <p class="text-font">Your Account is Activated!</p>
    <p class="btn-size"><a class="btn-text" href="/login">Go to Login</a></p>
  </div>`;
    return res.render("./pages/auth/activationForm", { html });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.generateToken = async (req, res) => {
  try {
    let email = req.body.email;
    let result;
    try {
      [result] = await conn.query("select * from users where email=? ", [
        email,
      ]);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
    if (result.length == 0) {
      res.status(500).json({
        success: false,
        message: "user not found",
      });
    }

    // A string containing a randomly generated, 36 character long v4 UUID.
    let newToken = crypto.randomUUID();
    try {
      [result] = await conn.query(
        "update users set activation_token=?, token_created_at=? where email=?",
        [newToken, new Date(Date.now()), email]
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      message: "token generated successfully",
      token: newToken,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    return res.clearCookie("token").json({
      success: true,
      message: "user Logged out successfully",
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let html = `<div class="email-input content">
                        <h4>Please Enter your Registered Email!</h4>
                        <div class="fields">
                          <input type="text" name="email" id="email" placeholder="Enter email" class="dvalid">
                          <input type="submit" value="Generate" class="submit" id ="submit">
                        </div>
                    </div>`;

    return res.render("pages/auth/forgotPass", { html });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.forgotPassLink = async (req, res) => {
  try {
    let email = req.body.email;

    let result;
    try {
      [result] = await conn.query("select * from users where email=?", [email]);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (result.length == 0) {
      return res.json({
        success: false,
        message: "user not found :( !",
      });
    }

    let verification_token = result[0].activation_token;
    try {
      await conn.query("update users set token_created_at=? where email=?", [
        new Date(Date.now()),
        email,
      ]);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      token: verification_token,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createPasswordForm = async (req, res) => {
  try {
    let token = req.query.token;
    let email = req.query.email;

    let result;
    try {
      [result] = await conn.query(
        "select * from users where email=? and activation_token=?",
        [email, token]
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (result.length == 0) {
      let html = `
                 <div class="active-button">
                    <p>Invalid Token or Expired Token 1</p>
                 </div> 
                  `;

      return res.render("createPassword", { html });
    }

    let diff = new Date(Date.now()) - new Date(result[0].token_created_at);
    let min = Math.floor((diff % 86400000) / 60000);

    if (min > 30) {
      let html = `
                 <div class="active-button">
                    <p>Invalid Token or Expired Token !</p>
                 </div> 
                  `;

      return res.render("createPassword", { html });
    }

    let html = `<div class="resetPass">
                    <div class="password">
                        <label for="lname">Create Password: </label>
                        <input type="password" name="password" id="password" placeholder="Enter a password" class="dvalid" >
                    </div>
                    <div class="confirmPassword">
                        <label for="confirmPassword">Re-enter Password: </label>
                        <input type="password" name="confirmPassword" id="confirmPassword"
                            placeholder="Re-enter the same password" class="dvalid" >
                    </div>
                      <input type="submit" value="Create" id ="submit" class="submit">
                </div>`;

    return res.render("./pages/auth/resetPass", { html });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    let token = req.query.token;
    let email = req.query.email;

    if (!token || !email) {
      return res.json({
        success: false,
        message: "invalid route access"
      })
    }

    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    let result;
    try {
      [result] = await conn.query(
        "select * from users where email=? and activation_token=?",
        [email, token]
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (result.length == 0) {
      return res.json({
        success: false,
        message: "Invalid User or Token",
      });
    }

    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "confirm password doesn't match",
      });
    }

    // generate hashpassword
    let hashPassword;
    try {
      let bcryptsalt = await bcrypt.genSaltSync(10);
      hashPassword = await bcrypt.hash(password, bcryptsalt);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    try {
      [result] = await conn.query(
        "update users set password = ? where email=?",
        [hashPassword, email]
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Password Created successfully",
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateNotification = async(req,res)=>{
  try {
    let id = req.body.id;
    let result;
    try {
      [result] = await conn.query("update notifications set status=1 where id =?",[id]);
    } catch (error) {
      logger.error(error);
      return res.json({
        success:false,
        message:error.message
      })
    }

    if(!result.affectedRows){
      return res.json({
        success:false,
        message:"no row found for update"
      })
    }

    return res.json({
      success:true,
      message:"notification updated successfully"
    })

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}