const usersService = require('./users.service');

module.exports = {

  registerUser: async (req, res, next) => {
    try {
      const { userName, userEmail, userPassword } = req.body;
      await usersService.registerService(userName, userEmail, userPassword);
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      next(error);
    }
  },

  loginUser: async (req, res, next) => {
    try {
      const { userEmail, userPassword } = req.body;
      const responseBody = await usersService.loginService(userEmail, userPassword);
      res.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },

  getToken: async (req, res, next) => {
    try {
      const { userName, userEmail, refreshToken } = req.body;
      const responseBody = await usersService.getTokenService(userName, userEmail, refreshToken);
      res.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },

  logoutUser: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      await usersService.logoutUserService(token);
      res.status(200).json({ message: 'You have been Logged Out' });
    } catch (error) {
      next(error);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { userEmail } = req.body;
      await usersService.forgotPasswordService(userEmail);
      res.status(200).json({ message: 'Email sent' });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { token, userPassword } = req.body;
      await usersService.resetPasswordService(token, userPassword);
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  }
};
