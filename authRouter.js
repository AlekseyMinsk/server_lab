const express = require('express');
const controller = require('./authController');
const router = express.Router();
const authMiddleware = require('./authMiddleware');

router.post('/registration', controller.registration);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.post('/removeuser', authMiddleware, controller.removeuser);
router.post('/updatepassword', controller.updatepassword);
router.get('/getitems', authMiddleware, controller.getitems);
router.post('/additem', authMiddleware, controller.additem);
router.get('/updateitem', authMiddleware, controller.updateitem);
router.post('/removeitem', authMiddleware, controller.removeitem);

router.get('/users', controller.getUsers);
//router.get('/logOut', authMiddleware, controller.logOut );

module.exports = router;