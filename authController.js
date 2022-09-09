const User = require('./models/user.js');
const Task = require('./models/tasks.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret, tokenName } = require('./config.js');

const generateAccessToken = (username) => {
  const payLoad = {
    username
  }
  return jwt.sign(payLoad, secret, {expiresIn: '24h'})
}

class authController {
  async registration(request, response) {
    try {
      const { username, password } = request.body;
      const candidate = await User.findOne({username});
      if( candidate ) {
        return response.status(400).json({ message: 'User already exists' })
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      await User.create({
        username: username,
        password: hashPassword
      })
      const token = generateAccessToken(username);
      return response
      .cookie(tokenName, token, {
        expires: new Date(Date.now() + 86400000),
        httpOnly: true
      })
      .status(200)
      .json({ message: 'User registered successfully', token: token})
    } catch (e) {
      console.log( 'registration ' + e )
      return response.status(400).json({ message: 'Registration error' })
    }
  }
  async login(request, response) {
    try {
      const {username, password} = request.body;
      const user = await User.findOne({username});
      const wrongCredentials = 'Wrong login credentials';
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
      .json({ message: 'Login successfully', user: user, token: token })
    } catch (e) {
      console.log( 'login ' + e )
      return response.status(400).json({ message: 'Login error' })
    }
  }
  async logout(request, response) {
    try {
      return response
      .clearCookie(tokenName)
      .status(200)
      .json({ message: 'Logout successfully' });
    } catch (e) {
      console.log( 'logout ' + e )
      response.status(400).json({ message: 'Logout error' })
    }
  } 
  async removeuser(request, response) {
    try {
      const { username } = request.body;
      const user = await User.findOne({username});
      const userId = user._id.toString();
      await Task.deleteMany({userId: userId});
      const filter = { username: username };
      await User.deleteOne(filter);
      return response
        .clearCookie(tokenName)
        .status(200)
        .json({ message: 'User removed' });          
    } catch (e) {
      console.log( 'removeuser ' + e );
      return response.status(400).json({ message: 'User not removed' })
    }
  }
  async updatepassword(request, response) {
    try {
      const { username, newpassword } = request.body;
      const filter = { username: username };
      const hashPassword = bcrypt.hashSync(newpassword, 7);
      const updateDoc = {
        $set: {
          password: hashPassword
        },
      };
      await User.updateOne(filter, updateDoc);
      return response.status(200).json({ message: 'Password changed' })
    } catch (e) {
      console.log( 'updatepassword ' + e );
      return response.status(400).json({ message: 'Password not changed' })
    }
  }
  async getitems(request, response) {
    try {
      const username = request.username;
      const user = await User.findOne({username: username});
      const userId = user._id.toString();
      const list = await Task.find({userId: userId})
      const preparedList = list.map(item => {
        return {
          id: item._id.toString(),
          taskCore: item.taskCore
        }
      })
      const userData = {
        username: username,
        list: preparedList
      }
      return response.status(200).json({ message: 'Items got successfully', userData: userData });
    } catch (e) {
      console.log( 'getitems ' + e );
      return response.status(400).json({ message: 'Items did not get' });
    }
  }

  async additem(request, response) {
    try {
      const { newItem } = request.body;
      const username = request.username;
      const user = await User.findOne({username: username});
      const userId = user._id.toString();
      await Task.create({
        userId: userId,
        taskCore: newItem
      })
      return response.status(200).json({ message: 'Item added' });
    } catch (e) {
      console.log( 'additem ' + e );
      return response.status(400).json({ message: 'Item not added' });
    }
  }
  async removeitem(request, response) {
    try {
      const { itemToRemove } = request.body;
      console.log(itemToRemove);
      const filter = { _id: itemToRemove };
      await Task.deleteOne(filter);
      response.status(200).json({ message: 'Item removed successfully' });
    } catch (e) {
      console.log( 'removeitem ' + e );
      response.status(400).json({ message: 'Item not removed' });
    }
  }
  async getUsers(request, response) {
    try {
      const users = await User.find();
      response.status(200).json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new authController();