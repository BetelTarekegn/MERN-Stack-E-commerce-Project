import userModel from "../model/user.js";
import { sendToken } from "../middleware/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { delete_file, upload_file } from "../utils/cloudinary.js"

import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
export const registerUser = async (req, res, next) => {

    try {
        const { name, email, password } = req.body;
        const user = await userModel.create({ name, email, password });
        /**const token = await user.getJwtToken();

        res.status(200).json({
            success: true,
            user,
            token
        });**/
        sendToken(user, 200, res)
    } catch (error) {
        next(error);
    }
};
// Login User
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter email & password",
            });
        }

        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// Logout user   =>   /api/logout
export const logout = async (req, res, next) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'Logged out'
        });
    } catch (error) {
        // Pass the error to your global error handler
        next(error);
    }
};
// Uploade user Avater   =>   /api/me/upload_Avater
export const uploadAvatar = async (req, res, next) => {
    try {
        const fileStr = req.body.avatar;

        // Upload image to Cloudinary
        const uploadResponse = await upload_file(fileStr, "utopia/avatars");
        //delete avater
        if (req?.user?.avatar?.url) {
            await delete_file(req?.user?.avatar?.public_id);
        }

        // Update user avatar URL in DB
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            { avatar: { url: uploadResponse.url, public_id: uploadResponse.public_id } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Avatar uploaded successfully",
            user,  // <-- very important to send updated user here
        });
    } catch (error) {
        next(error);
    }
};
export const forgotPassword = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this email'
            });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset password url
        const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

        const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you did not request this email, please ignore it.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'E-Commerce Password Recovery',
                message,
                html: getResetPasswordTemplate(user.email, resetUrl),
            });

            return res.status(200).json({
                success: true,
                message: `Email sent to: ${user.email}`,
            });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: emailError.message
            });
        }

    } catch (err) {
        next(err);
    }
};
export const resetPassword = async (req, res) => {
    try {
        // Hash the token from the URL
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // Find user by token and check expiration
        const user = await userModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Password reset token is invalid or has expired'
            });
        }

        // Check if passwords match
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password does not match'
            });
        }

        // Set new password and clear reset token
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // Send new token
        sendToken(user, 200, res);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Get currently logged-in user details => /api/getuserprofile
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Update / Change password => /api/password/update
export const updatePassword = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check previous user password
        const isMatched = await user.comparePassword(req.body.oldPassword);
        if (!isMatched) {
            return res.status(400).json({
                success: false,
                message: 'Old password is incorrect'
            });
        }

        // Set new password and save
        user.password = req.body.password;
        await user.save();

        // Send new token
        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Update user profile   =>   /api/update
export const updateProfile = async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email
        }
        const user = await userModel.findByIdAndUpdate(req.user._id, newUserData, {
            new: true,
        })
        res.status(200).json({
            user,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}
// Admin Routes

// Get all users   =>   /api/admin/users
export const allUsers = async (req, res) => {
    try {
        const users = await userModel.find();

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};


// Get user details   =>   /api/admin/user/:id
export const getUserDetails = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with id: ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
// Update user profile   =>   /api/admin/user/:id
export const updateUser = async (req, res) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        };

        const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,

        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with id: ${req.params.id}`
            });
        }


        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};


// Delete user   =>   /api/admin/user/:id
export const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with id: ${req.params.id}`
            });
        }

        // Remove avatar from cloudinary
        await user.deleteOne();

        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};





