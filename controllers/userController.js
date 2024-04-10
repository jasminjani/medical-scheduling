const jwt = require("jsonwebtoken");
const conn = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

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
    let random_salt = Math.random().toString(36).substring(2, 6);
    password += random_salt;
    try {
      let bcryptsalt = await bcrypt.genSaltSync(10);
      hashPassword = await bcrypt.hash(password, bcryptsalt);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    let verification_token = crypto.randomUUID();

    // make query for insert the data
    let sql =
      "insert into users (fname,lname,email,dob,gender,phone,password,salt,city,address,role_id,activation_token,profile) values (?)";

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
          random_salt,
          city,
          address,
          1,
          verification_token,
          profile,
        ],
      ]);
    } catch (error) {
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
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Internal server Error",
      });
    }

    result[0].activation_token = verification_token;

    return res.json({
      success: true,
      user: result[0],
    });
  } catch (error) {
    // any error occur during the registration
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
      let sql = "select * from users where email=?";
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
    let newPassword = password + result[0].salt;
    if (await bcrypt.compare(newPassword, hashPassword)) {
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

      // generate token for the cookie
      let payload = {
        id: result[0].id,
        email: result[0].email,
        role_id: result[0].role_id,
      };

      // remove password from the user obj
      let { password: _, ...newObj } = result[0];
      // generate token
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // set token into userObj
      newObj.token = token;

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
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// get => /user , get all deleted or not deleted user
exports.getAllUser = async (req, res) => {
  try {
    // execute query for get all users
    let result;
    try {
      let sql = "select * from users order by id;";
      [result] = await conn.query(sql);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server Error",
      });
    }

    // user present the return res
    return res.json({
      success: true,
      users: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// get => /user/:id
exports.getUserById = async (req, res) => {
  try {
    // get userid from the params
    let id = req.params.id;

    let result;
    // executer the query
    try {
      let sql = "select * from users where id=?";
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

    // remove password field from the user obj
    let { password: _, ...newObj } = result[0];

    // return res
    return res.json({
      success: true,
      user: newObj,
    });
  } catch (error) {
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.activationForm = async (req, res) => {
  try {
    let token = req.query.token;
    let email = req.query.email;

    if (!token || !email) {
      return res.render("404");
    }

    let html = `<div class="active-button">
                        <h4>Thank you for Registration !</h4>
                        <p>Click on Below Link to Activate Your Account !</p>
                        <a href="http://localhost:8000/media/verify/?token=${token}&email=${email}">http://localhost:8000/media/verify/?token=${token}&email=${email}</a>
                    </div>`;

    return res.render("login-registration/activationForm", { html });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.activationAccount = async (req, res) => {
  try {
    let token = req.query.token;
    let email = req.query.email;

    let result;
    try {
      let sql = "select * from users where email=? and activation_token=?";
      [result] = await conn.query(sql, [email, token]);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (result.length <= 0) {
      let html = `<div class="active-button">
                            <p>Token is invalid or expired!</p>
                        </div>`;
      return res.render("login-registration/activationForm", { html });
    }

    let diff = new Date(Date.now()) - new Date(result[0].token_created_at);
    let mins = Math.floor((diff % 86400000) / 60000); // minutes

    if (mins > 30 && result[0].isActivated == false) {
      let html = `<div class="active-button">
                            <p>Verification link has been expired!, <a href="" id="generate-token">click here</a> to Generate new link!</p>
                            <input type="hidden" id="active-account">
                        </div>`;
      return res.render("login-registration/activationForm", { html });
    }

    try {
      let sql = "update users set isActivated=true where email=?";
      [result] = await conn.query(sql, [email]);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    let html = `<div class="active-button">
                            <h4>Hurray</h4>
                            <p>Your Account is Activated!</p>
                            <a href="http://localhost:8000/media/login">Go to Login</a>
                        </div>`;
    return res.render("login-registration/activationForm", { html });
  } catch (error) {
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
      message: "user Logged out successfully   ",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let html = `<div class="active-button">
                        <h4>Please Enter your Registered Email!</h4>
                        <input type="text" name="email" id="email" placeholder="Enter email">
                        <input type="submit" value="Generate" id ="submit">
                    </div>`;

    return res.render("login-registration/forgotPass", { html });
  } catch (error) {
    res.status(500).json({
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

    let verification_token = result[0].verification_token;
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
    res.status(500).json({
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

    let html = `<div class="active-button">
                    <div class="password">
                        <label for="lname">Create Password: </label>
                        <input type="password" name="password" id="password" placeholder="Enter a password" class="dvalid" >
                    </div>
                    <div class="confirmPassword">
                        <label for="confirmPassword">Re-enter Password: </label>
                        <input type="password" name="confirmPassword" id="confirmPassword"
                            placeholder="Re-enter the same password" class="dvalid" >
                    </div>
                      <input type="submit" value="Create" id ="submit">
                </div>`;

    return res.render("login-registration/createPassword", { html });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    let token = req.query.token;
    let email = req.query.email;

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
    let random_salt = Math.random().toString(36).substring(2, 6);
    password += random_salt;
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
        "update users set password = ?, salt=? where email=?",
        [hashPassword, random_salt, email]
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
    res.status(500).json({
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
    return res.json({
      success: false,
      error: error.message,
    });
  }
};
