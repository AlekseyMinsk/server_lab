const User = require('./models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret, tokenName } = require('./config.js');

const generateAccessToken = (username) => {
  const payLoad = {
    username
  }
  return jwt.sign(payLoad, secret, {expiresIn: "24h"})
}

class authController {
  async registration(request, response) {
    try {
      const {username, password} = request.body;
      const candidate = await  User.findOne({username});
      console.log(candidate);
      if(candidate) {
        return response.status(400).json({message: "User already exists"})
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      await User.create({
        username: username,
        password: hashPassword
      })
      const token = generateAccessToken(username);
      //console.log(token)
      //return response.status(200).json({message: "User registered successfully"});
      //const token = generateAccessToken(username); 
      return response
      .cookie(tokenName, token, {
        expires: new Date(Date.now() + 864000000),
        httpOnly: true
      })
      .status(200)
      .json({ message: "User registered successfully"})
    } catch (e) {
      console.log('Registration error' + e)
      response.status(400).json({message: 'Registration error'})
    }
  }
  async login(request, response) {
      try {
          const {username, password} = request.body;
          const user = await User.findOne({username});
          const wrongCredentials = "Wrong login credentials";
          if(!user) {
              return response.status(400).json({message: wrongCredentials})
          }
          const validPassword = bcrypt.compareSync(password, user.password);
          if(!validPassword) {
              return response.status(400).json({message: wrongCredentials})
          }
          const token = generateAccessToken(user.username);

          return response
          .cookie(tokenName, token, {
            expires: new Date(Date.now() + 864000000),
            httpOnly: true
          })
          .status(200)
          .json({ message: "Login successfully", user: user })
      } catch (e) {
          console.log('Login error' + e)
          response.status(400).json({message: 'Login error'})
      }
  }
  async logout(request, response) {
      try {
          return response
          .clearCookie(tokenName)
          .status(200)
          .json({ message: "Logout successfully" });
      } catch (e) {
          console.log('Logout error' + e)
          response.status(400).json({message: 'Logout error'})
      }
  } 
  async removeuser(request, response) {
      try {
        console.log('start')
        const { username } = request.body;
        const filter = { username: username };
        const result =  await User.deleteOne(filter);
        console.log(result)
        return response
          .clearCookie(tokenName)
          .status(200)
          .json({ message: "User removed" });          
      } catch (e) {

      }
  }
  async updatepassword(request, response) {
      try {
          const { username, newpassword} = request.body;
          const filter = { username: username };
          const hashPassword = bcrypt.hashSync(newpassword, 7);
          const updateDoc = {
              $set: {
                password: hashPassword
              },
            };
          const result =  await User.updateOne(filter, updateDoc);

          console.log(result)
          // const users = await User.find();
          response.status(200).json({message: 'password changed'})
          
      } catch (e) {
        console.log(e);
      }
  }
  async getitems(request, response) {
      try {
          const username = request.username;
          const userDB = await User.findOne({username});
          const user = {
            userName: userDB.username,
            items: userDB.quote
          }
          response.json({ message: "Items successfully", user: user });
      } catch (e) {
        console.log(e);
      }
  }

  async additem(request, response) {
      try {
        const { newItem } = request.body;
        const username = request.username;

        const filter = { username: username };
        const result =  await User.updateOne(filter, 
          {
            $push: { quote: newItem }
          }
          );


        
        console.log(result);
        return response.status(200).json({ message: 'Added' });
          // const users = await User.find();
          // response.json(users);
            //user.quote.push("strings!");
          
      } catch (e) {
        console.log(e);
      }
  }
  async updateitem(request, response) {
      try {
          // const users = await User.find();
          // response.json(users);

          // const result = await User.updateOne(filter,
          //   { $set: { "quote.2" : 'xxx' } }
          // )
          // console.log(result);
          // return response.status(200).json({ message: "Updated" });
      } catch (e) {

      }
  }
  async removeitem(request, response) {
      try {
        //itemToRemove
        const { itemToRemove } = request.body;
        const username = request.username;
        const filter = { username: username };
        const result =  await User.updateOne(filter, 
          { $pull: { quote: { $in: [itemToRemove] } } }
        )
        response.json({ message: "Item removed successfully" });
      } catch (e) {
        console.log(e);
      }
  }
  async getUsers(request, response) {
      try {
          const users = await User.find();
          response.json(users);
      } catch (e) {
        console.log(e);
      }
  }
}

module.exports = new authController();


// registration 
// const user = new User({username, password: hashPassword});
            // await user.save();
            // return response.json({message: "User registered successfully "});
            // console.log(request.body);
            // console.log('______');
            // console.log(username);
            // console.log(password);
            // response.json('server work getUsers')
            // const candidate = await User.findOne({username});
            // if(candidate) {
            //     return response.status(400).json({message: "User exists"})
            // }


//login
//console.log(request.cookies);
            //   const token = jwt.sign({ id: 7, role: "captain" }, "YOUR_SECRET_KEY");
            //   return response
            //     .cookie("access_token", token, {
            //       httpOnly: true,
            //       secure: process.env.NODE_ENV === "production",
            //     })
            //     .status(200)
            //     .json({ message: "Logged in successfully 😊 👌" });

            
           // const isToken = request.cookies;
            //console.log(isToken);
            // if(isToken) {
            //     console.log("Already log in");
            //     console.log(isToken);
            //     return response.json({ status: 'Already log in' });
            // }

//            //
            //

           // return response.json({ status: 'ok', user: token })


            // return response.json({ status: 'ok' }).cookie('token', token, {
            //     expires: new Date(Date.now() + 86400), // time until expiration
            //     secure: false, // set to true if you're using https
            //     httpOnly: true, 
            // }).json({ status: 'ok' });


            //
            // console.log('token');
            // console.log(token)
            // console.log('token')    

            // return res.cookie('token', token, {
            //     expires: new Date(Date.now() + expiration), // time until expiration
            //     secure: false, // set to true if you're using https
            //     httpOnly: true,
            // });
                        //.redirect('/dashboard')
            //.setHeader('location', '/dashboard');
            // .status(200)
            // .json({ message: "Login successfully", user: user.username })
            // .redirect('/dashboard'); 

            // redirect dashboard
// logout 
            // response.clearCookie("access_token_1");
            // response.end();

            // return response
            // .cookie("access_token_1", '1',{
            //   expires: Date.now(),
            //   httpOnly: true
            // })
            // .status(200)
            // .json({ message: "Logout successfully" });

            // пока здесь будет удаление из локал стодж


            //   const token = jwt.sign({ id: 7, role: "captain" }, "YOUR_SECRET_KEY");
            //   console.log('I was here15');
            //   return response
            //     .cookie("test16", token, {
            //       httpOnly: true,
            //       secure: process.env.NODE_ENV === "production",
            //     })
            //     .status(200)
            //     .json({ message: "Logged in successfully 😊 👌" });
            

