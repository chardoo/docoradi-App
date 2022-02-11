const bcrypt =  require('bcrypt')

const hashAccessToken = async (token) => {
  const hashedToken = await bcrypt.hash(token, 12);
  return hashedToken;
};
const generateUserAccessToken = async (password) => {
  const data = password;
  const accessToken = data
  const hashedToken = await hashAccessToken(accessToken);
  return { accessToken, hashedToken };
};

const checkAccessToken = (accessToken, hashedToken)=> {
  return  bcrypt.compare(accessToken, hashedToken);
 
};

module.exports = { generateUserAccessToken, checkAccessToken };
