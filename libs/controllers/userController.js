require('dotenv').config();
const accessTokenUtils = require('../../utils/usersAccessToken');
const db = require('../../libs/data/db').getDB();
const generateJwtToken = require('../../utils/jwt_Utils');

const registerUser = async (req, res, next) => {
  try {
    const { email, mobile, password } = req.body;
    const {
      hashedToken,
      accessToken,
    } = await accessTokenUtils.generateUserAccessToken(password);
    const role = 'user';
    // const userFound = db.collection(process.env.USERS);
    // const adminExists = userFound.where('email', '==', email)
    // const userExists =  await adminExists.get();
    //   if (userExists) {
    //   throw new BadRequestError('email already exits');
    // }
    const newData = {
      email: email,
      role: role,
      mobile: mobile,
      password: hashedToken,
    };
    const response = await db.collection(process.env.USERS).add(newData);
    if (!response) {
      throw new Error('something went wrong');
    }
    // console.log(hashedToken);
    res.status(201).json(accessToken);
  } catch (err) {
    return Error('something went wrong');
  }
};
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userFound = db.collection(process.env.USERS);
    console.log(userFound);
    const adminExists = userFound.where('email', '==', email);
    const userExists = await adminExists.get();
    const newobject = {};
    console.log(userExists);
    await userExists.forEach((element) => {
      Object.assign(newobject, element.data());
    });

    if (Object.keys(newobject).length === 0) {
      throw new BadRequestError('Login Failed!');
    }

    const isValidPassword = await accessTokenUtils.checkAccessToken(
      password,
      newobject.password
    );
    if (!isValidPassword) {
      throw new BadRequestError('Login Failed');
    }
    const { jwtToken, expiration } = await generateJwtToken(
      newobject.email,
      newobject.mobile,
      newobject.role
    );

    return res.status(200).json({
      email: newobject.email,
      role: newobject.role,
      mobile: newobject.mobile,
      token: jwtToken,
      expiration,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
