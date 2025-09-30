import userModel from '../model/user.js';
import jwt from 'jsonwebtoken';


export const isAuthenticatedUser = async (req, res, next) => {
  try {

    const { token } = req.cookies;  // Retrieve the token from cookies

    if (!token) {
      return next(new Error('Login first to access this resource.'));
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await userModel.findById(decoded.id);
    console.log(decoded)

    console.log('Authenticated User:', req.user);  // Log the user object for debugging

    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);  // Log errors for debugging
    return next(error); // Pass any errors to the error handler
  }
};
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const err = new Error(`Role (${req.user.role}) is not allowed to access this resource`);
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};