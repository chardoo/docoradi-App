require('dotenv').config();
const accessTokenUtils  =  require('../../utils/usersAccessToken')
const db = require('../../libs/data/db').getDB();
const generateJwtToken =  require('../../utils/jwt_Utils')
const registerUser = async (req, res, next) => {
    try {
      const { firstName, email, mobile, role, password}  =  req.body  
      const { hashedToken, accessToken } = await accessTokenUtils.generateUserAccessToken(password);
      const newData = {
          firstName:firstName,
          email:email,
          role:role,
          mobile:mobile,
          password: hashedToken
      }
      const response = await db.collection(process.env.USERS).add(newData)
      if (!response) {
        throw new Error('something went wrong');
      }
      res.status(201).json(accessToken);
    } catch (err) {
      return Error('something went wrong');
    }
  };
  
  const loginUser = async (req, res, next) =>{
      try{
          const{email, password} =  req.body
         
          const userFound = db.collection(process.env.USERS);
          const adminExists = userFound.where('email', '==', email)
          const userExists =  await adminExists.get();
            if (!userExists) {
            throw new BadRequestError('Login Failed!');
          }
          let isValidPassword
         await  userExists.forEach(element => {
          isValidPassword = accessTokenUtils.checkAccessToken(password, element.password);
           });

          if (!isValidPassword) {
            throw new BadRequestError('Login Failed');
          }
      
          const { jwtToken, expiration } = generateJwtToken(userExists.email, userExists.firstName,
            userExists.role);
      
          return res.status(200).json({
            email: userExists.email,
            role: userExists.role,
            name: userExists.firstName,
            token: jwtToken,
            expiration,
          });
  
      } 
      catch (error) {
          return next(error);
        }
  }

  module.exports = {
    registerUser,
    loginUser,

  }