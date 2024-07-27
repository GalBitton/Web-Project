import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import validator from 'validator';
import config from 'config';

const authConfig = config.get('auth');
const JWT_AWT_SECRET = authConfig.get('jwt-access-token-secret');
const passwordRegex = /^.{1,}$/;

const UserSchema = new mongoose.Schema({
   email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: (props) => `${props.value} is not a valid email address`,
        }
   },
    password: {
       type: String,
        required: false, // Because of Google OAuth
        select: false, // Don't select password by default
        validate: {
            validator: (value) => passwordRegex.test(value),
            message: (props) => `Password must be 8-64 characters long, contain at least one uppercase letter, one lowercase letter, and one special character.`,
        },
    },
    avatarUrl: { type: String, default: 'https://i.imgur.com/DA1hvi3.png' },
    refreshToken: { type: String, default: '' },
    googleSignIn: { type: Boolean, default: false, select: false },
    forgottenPassToken: { type: String, default: null, select: false },
}, {
    versionKey: false,
    timestamps: true,
    collection: 'users'
});


UserSchema.methods.hashPassword = async function() {
    this.password = await bcrypt.hash(this.password, 10);
};

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateResetPasswordToken = async function() {
    const token = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            resetPasswordTokenExpiration: Date.now() + 24 * 60 * 60 * 100, // Expires in 24 hours
        },
        JWT_AWT_SECRET
    );

    // Update the user document with the generated token and expiration
    this.set({
        resetPasswordToken: token,
        resetPasswordTokenExpiration: new Date(Date.now() + 24 * 60 * 60 * 100),
    });

    await this.save(); // Save the updated user document
    return token;
};

UserSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            await this.hashPassword();
        }
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.index({ email: 'text' });

const User = mongoose.model('User', UserSchema);

export default User;
