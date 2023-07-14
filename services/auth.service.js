// services>auth.service.js

const UserRepository = require('../repositories/users.repository.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  userRepository = new UserRepository();

  login = async (email, password) => {
    try {
      const result = {
        statusCode: 200,
        response: { message: 'log-in 되었습니다.' },
      };
      // Service => Repository(findUserByEmail)
      const user = await this.userRepository.findUserByEmail(email);
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!user || !passwordMatch) {
        result.statusCode = 412;
        result.response = { message: 'email 또는 password를 확인해주세요.' };
        return result;
      }
      // JWT
      const token = jwt.sign({ userId: user.userId }, 'customized_secret_key');
      return token;
    } catch {
      const result = {
        statusCode: 500,
        response: { message: 'Error! => AuthService(login)' },
      };
      return result;
    }
  };

  logout = async (res) => {
    try {
      res.clearCookie('authorization');
      const result = {
        statusCode: 200,
        response: { message: 'log-out 되었습니다.' },
      };
      return result;
    } catch {
      const result = {
        statusCode: 400,
        response: { message: 'log-out에 실패하였습니다.' },
      };
      return result;
    }
  };
}

module.exports = AuthService;
