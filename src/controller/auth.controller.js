const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const { User } = require('../models');

const registerHandler = async(req, res) => {
  const { email, userName, role, password } = req.body;

  try {
    // const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
    //   email
    // ]);
    const user = await User.findAll({ 
      where: {
        email: email
      },
    })

    if (user.length > 0) {
      return res.status(401).json("User already exist!");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    
    let newUser = await User.create({ 
      email: email, userName: userName, role: role, password: bcryptPassword
    })
    // let newUser = await pool.query(
    //   "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
    //   [name, email, bcryptPassword]
    // );

    const jwtToken = jwtGenerator(newUser.id);

    return res.status(201).json({
      status: 'created',
      data:{
        newUser
      },
      token: jwtToken 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(
      err.message
    );
  }
}

const loginHandler = async(req, res) => {
  const { email, password } = req.body;
  
  try {
    // const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
    //   email
    // ]);
    const user = await User.findOne({
      where: {email: email},
    })

    if (!user) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    const jwtToken = jwtGenerator(user.id);
    return res.status(200).json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
}

const verifyHandler = async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
}

module.exports = {
    registerHandler,
    loginHandler,
    verifyHandler,
}
