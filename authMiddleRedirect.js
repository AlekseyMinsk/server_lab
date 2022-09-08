const jwt = require('jsonwebtoken');
const { secret } = require('./config.js');

module.exports = (request, response, next) => {
   console.log('Im here20')
   try {
      const token = request.cookies.testName;
      console.log(token)
      // if (!token) {
      //    return response.sendStatus(403);
      // }
      // console.log(token);
      // const token = request.headers['x-access-token'];
      const decodedData = jwt.verify(token,secret);
      console.log(decodedData);

      // request.username = decodedData.username;
   //  console.log(request.headers.authorization)
   //  const token = request.headers.authorization.split(" ")[1];
   //  const decodedData = jwt.verify(token,secret);
   //  request.user = decodedData;
    next();
   } catch (e) {
    console.log(e);
    return response.status(403).json({message: "Not authorized "})
   }
}