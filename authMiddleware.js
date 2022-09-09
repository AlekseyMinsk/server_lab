const jwt = require('jsonwebtoken');
const { secret } = require('./config.js');

module.exports = (request, response, next) => {
  try {
    const tokenLocal = request.headers.authorization.split(' ')[1];
    const decodedData = jwt.verify(tokenLocal, secret);
    request.username = decodedData.username;
    next();
  } catch (e) {
    console.log(e);
    return response.status(400).json({message: 'Not authorized'})
  }
}