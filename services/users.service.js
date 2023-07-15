// services>users.service.js

const UserRepository = require('../repositories/users.repository.js');

const bcrypt = require('bcrypt');

class UserService {
  userRepository = new UserRepository();
  
  // POST
  signup = async (email, nickname, password, confirm) => {
    try {
      const result = {
        statusCode: 200,
        response: { message: '회원 가입에 성공하였습니다.' },
      };
      // Service => Repository(findUserByEmail)
      const existUserEmail = await this.userRepository.findUserByEmail(email);
      if (existUserEmail) {
        result.statusCode = 412;
        result.response = { message: '중복된 email입니다.' };
        return result;
      }
      if (nickname.length < 3 || !/^[a-z A-Z 0-9]+$/.test(nickname)) {
        result.statusCode = 412;
        result.response = { message: 'nickname의 형식이 올바르지 않습니다.' };
        return result;
      }
      if (password !== confirm) {
        result.statusCode = 412;
        result.response = { message: 'password가 일치하지 않습니다.' };
        return result;
      }
      if (password.includes(nickname)) {
        result.statusCode = 412;
        result.response = { message: 'password에 nickname이 포함되어 있습니다.' };
        return result;
      }
      // Service => Repository(createUser)
      await this.userRepository.createUser(email, nickname, password);
      return result;
    } catch {
      const result = {
        statusCode: 500,
        response: { message: 'Error! => UserService(signup)' },
      };
      return result;
    }
  };
  
  // GET
  getUserInfo = async (userId) => {
    try {
      const result = {
        statusCode: 200,
        response: {},
      };
      // Service => Repository(getUserInfo)
      const user = await this.userRepository.getUserInfo(userId);
      result.response = { data: user };
      return result;
    } catch {
      const result = {
        statusCode: 500,
        response: { message: 'Error! => UserService(getUserInfo)' },
      };
      return result;
    }
  };

  // PUT
  updateUserInfo = async (userId, password, afterPassword, afterPasswordConfirm, afterNickname, afterUserDesc) => {
    try {
      const result = {
        statusCode: 200,
        response: { message: '사용자 정보 수정에 성공하였습니다.' },
      };
      if (!password) {
        result.statusCode = 400;
        result.response = { message: 'password를 입력해주세요.' };
        return result;
      }
      // Service => Repository(findUserById)
      const user = await this.userRepository.findUserById(userId);
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        result.statusCode = 400;
        result.response = { message: 'password가 일치하지 않습니다.' };
        return result;
      }

      if (afterNickname) {
        if (afterNickname.length < 3 || !/^[a-z A-Z 0-9]+$/.test(afterNickname)) {
          result.statusCode = 412;
          result.response = { message: '변경된 nickname의 형식이 올바르지 않습니다.' };
          return result;
        }
        // Service => Repository(afterNicknameCheck)
        const checkResult = await this.userRepository.afterNicknameCheck(afterNickname);
        if (checkResult) {
          result.statusCode = 412;
          result.response = { message: '중복된 nickname입니다.' };
          return result;
        }
      }

      if (afterPassword || afterPasswordConfirm) {
        if (afterPassword.length < 4 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/.test(afterPassword)) {
          result.statusCode = 412;
          result.response = { message: '변경된 password 형식이 올바르지 않습니다.' };
          return result;
        }
        if (afterPassword !== afterPasswordConfirm) {
          result.statusCode = 412;
          result.response = { message: '변경된 password가 일치하지 않습니다.' };
          return result;
        }
        if (afterPassword.includes(afterNickname)) {
          result.statusCode = 412;
          result.response = { message: '변경된 password에 nickname이 포함되어 있습니다.' };
          return result;
        }
      }
      console.log('안녕하세요!');
      // Service => Repository(updateUserInfo)
      await this.userRepository.updateUserInfo(userId, afterPassword, afterNickname, afterUserDesc);
      return result;
    } catch {
      const result = {
        statusCode: 500,
        response: { message: 'Error! => UserService(updateUserInfo)' },
      };
      return result;
    }
  };

  // DELETE
  deleteUserInfo = async (userId, password) => {
    try {
      const result = {
        statusCode: 200,
        response: { message: '사용자 정보 삭제에 성공하였습니다.' },
      };
      // Service => Repository(findUserbyId)
      const user = await this.userRepository.findUserById(userId);
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        result.statusCode = 412;
        result.response = { message: 'password가 일치하지 않습니다.' };
        return result;
      }
      // Service => Repository(deleteUserInfo)
      await this.userRepository.deleteUserInfo(userId);
      return result;
    } catch {
      const result = {
        statusCode: 500,
        response: { message: 'Error! => UserService(deleteUserInfo)' },
      };
      return result;
    }
  };
}

module.exports = UserService;
