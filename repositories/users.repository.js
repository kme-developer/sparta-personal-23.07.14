// repositories>users.repository.js

const { Users, UserInfos } = require('../models');
const { Transaction } = require('sequelize'); // <= transaction
const bcrypt = require('bcrypt');

class UserRepository {
  // 사용자 생성 (POST)
  createUser = async (email, nickname, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const transaction = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      // Repository => ORM(Sequelize)
      const user = await Users.create(
        {
          email: email,
          password: hashedPassword,
        },
        { transaction }
      );
      // Repository => ORM(Sequelize)
      const userinfo = await UserInfos.create(
        {
          userId: user.userId,
          email: email,
          nickname: nickname,
          userDesc: null,
        },
        { transaction }
      );
      await transaction.commit();
    } catch {
      await transaction.rollback();
      throw new Error('Error! => transaction(createUser)');
    }
  };

  // 사용자 검색 (GET)
  findUserById = async (userId) => {
    // Repository => ORM(Sequelize)
    const user = await Users.findOne({ where: { userId } });
    return user;
  };
  findUserByEmail = async (email) => {
    // Repository => ORM(Sequelize)
    const user = await Users.findOne({ where: { email } });
    return user;
  };
  // 사용자 정보 검색 (GET)
  findUserInfoById = async (userId) => {
    // Repository => ORM(Sequelize)
    const userinfo = await UserInfos.findOne({ where: { userId } });
    return userinfo;
  };
  afterNicknameCheck = async (afterNickname) => {
    // Repository => ORM(Sequelize)
    const checkResult = await UserInfos.findOne({ where: { nickname: afterNickname } });
    return checkResult;
  };

  // 사용자 정보 조회 (GET)
  getUserInfo = async (userId) => {
    // Repository => ORM(Sequelize)
    const userinfo = await Users.findOne({
      attributes: ['userId', 'email', 'createdAt', 'updatedAt'],
      include: [
        {
          model: UserInfos,
          attributes: ['nickname', 'userDesc'],
        },
      ],
      where: { userId },
    });
    return userinfo;
  };

  // 사용자 정보 수정 (PUT)
  updateUserInfo = async (userId, afterPassword, afterNickname, afterUserDesc) => {
    const hashedAfterPassword = await bcrypt.hash(afterPassword, 10);
    const transaction = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      // Repository => ORM(Sequelize)
      await Users.update(
        {
          password: hashedAfterPassword,
        },
        { where: { userId } },
        { transaction }
      );
      // Repository => ORM(Sequelize)
      await UserInfos.update(
        {
          nickname: afterNickname,
          userDesc: afterUserDesc,
        },
        { where: { userId } },
        { transaction }
      );
      await transaction.commit();
    } catch {
      await transaction.rollback();
      throw new Error('Error! => transaction(updateUserInfo)');
    }
  };

  // 사용자 정보 삭제 (DELETE)
  deleteUserInfo = async (userId) => {
    // Repository => ORM(Sequelize)
    await Users.destroy({ where: { userId } });
  };
}

module.exports = UserRepository;
