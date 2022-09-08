const jwt = require('jsonwebtoken');
const { tokenName, secret } = require('./config.js');

module.exports = (request, response, next) => {
  try {
    const token = request.cookies[tokenName];
    const decodedData = jwt.verify(token, secret);
    request.username = decodedData.username;
    next();
  } catch (e) {
    console.log(request.route.path);
  //  if(request.route.path == "") { redirect if it not login or register
  //  }
    console.log(e);
    return response.status(400).json({message: "Not authorized"})
  }
}



     // if (!token) {
      //    return response.sendStatus(403);
      // }
      // console.log(token);
      // const token = request.headers['x-access-token'];
      
      //console.log(request.route.path);

      //  request.username = decodedData.username;
      //  console.log(request.headers.authorization)
      //  const token = request.headers.authorization.split(" ")[1];
      //  const decodedData = jwt.verify(token,secret);
      //  request.user = decodedData;