// controllers>users.controller.js

const UserService = require('../services/users.service.js');
const AuthService = require('../services/auth.service.js');

class UsersController {
  userService = new UserService();
  authService = new AuthService();
  
  // POST
  signup = async (req, res) => {
    try {
      const { email, nickname, password, confirm } = req.body;
      if (!email || !nickname || !password || !confirm) throw new Error('입력되지 않은 값이 존재합니다.');
      // Controller => Service(signup)
      const result = await this.userService.signup(email, nickname, password, confirm);
      console.log(result);
      return res.status(result.statusCode).json(result.response);
    } catch {
      return res.status(500).json({ message: 'Error! => UserController(signup)' });
    }
  };

  // POST
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw new Error('입력되지 않은 값이 존재합니다.');
      // Controller => Service(login)
      const token = await this.authService.login(email, password);
      res.cookie('authorization', `Bearer ${token}`); //
      return res.status(200).json({ message: 'log-in 되었습니다.' });
    } catch {
      return res.status(500).json({ message: 'Error! => UserController(login)' });
    }
  };

  // POST
  logout = async (req, res) => {
    try {
      // Controller => Service(logout)
      const result = await this.authService.logout(res);
      return res.status(result.statusCode).json(result.response);
    } catch {
      return res.status(500).json({ message: 'Error! => UserController(logout)' });
    }
  };

  // GET
  getUserInfo = async (req, res) => {
    try {
      const { userId } = res.locals.user; // from authMiddlewareww
      if (!userId) throw new Error('log-in이 필요한 기능입니다.');
      // Controller => Service(getUserInfo)
      const result = await this.userService.getUserInfo(userId);
      return res.status(result.statusCode).json(result.response);
    } catch {
      return res.status(500).json({ message: 'Error! => UserController(getUserInfo)' });
    }
  };

  // PUT
  updateUserInfo = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { password, afterPassword, afterPasswordConfirm, afterNickname, afterUserDesc } = req.body;
      if (!userId) throw new Error('log-in이 필요한 기능입니다.');
      if (!password || !afterPassword || !afterPasswordConfirm || !afterNickname || !afterUserDesc) throw new Error('입력되지 않은 값이 존재합니다.');
      // Controller => Service(updateUserInfo)
      const result = await this.userService.updateUserInfo(userId, password, afterPassword, afterPasswordConfirm, afterNickname, afterUserDesc);
      return res.status(result.statusCode).json(result.response);
    } catch {
      return res.status(500).json({ message: 'Error! => UserController(updateUserInfo)' });
    }
  };

  // DELETE
  deleteUserInfo = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { password } = req.body;
      if (!userId) throw new Error('log-in이 필요한 기능입니다.');
      if (!password) throw new Error('입력되지 않은 값이 존재합니다.');
      // Controller => Service(deleteUserInfo)
      const result = await this.userService.deleteUserInfo(userId, password);
      return res.status(result.statusCode).json(result.response);
    } catch {
      return res.status(500).json({ message: 'Error! => UserController(deleteUserInfo)' });
    }
  };
}

module.exports = UsersController;
