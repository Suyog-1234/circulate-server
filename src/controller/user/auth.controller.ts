import { Request, Response } from "express";
import User from "../../models/user.model";
import { bcryptPassword, comparePassword, generateAccessToken, generateRefreshToken } from "../../helpers/commonHelper";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../../types/common";

export const registerUser = async (req: CustomRequest, res: Response) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const userExists = await User.findOne({ email }).lean().exec();
        if (userExists) {
            return res.status(400).json({
                message: "User already has an account. Please log in directly.",
            });
        }

        const hashedPassword = await bcryptPassword(password);

        const registeredUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (!registeredUser) {
            return res.status(400).json({
                message: "Failed to register User",
            });
        }

        const userData = await User.findById(registeredUser._id)
            .select("-password")
            .lean()
            .exec();

        return res.status(200).json({
            data: userData,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const loginUser = async (req: CustomRequest, res: Response) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email }).lean().exec();
        if (!user) {
            return res.status(400).json({
                message: "User not found. Please register before logging in.",
            });
        }

        const isPasswordMatched = await comparePassword(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Wrong password",
            });
        }
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            accessToken,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const refresh = (req: CustomRequest, res: Response) => {
    const cookies = req.cookies
    console.log(cookies, "jwtjwt")
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        async (err: any, decoded: any) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            const foundUser = await User.findById(decoded.id).exec()
            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })
            const accessToken = generateAccessToken(foundUser._id)
            res.json({ accessToken })
        }
    )
}


export const logout = (req: CustomRequest, res: Response) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    res.json({ message: 'Cookie cleared' })
}

export const myAccount = async (req: CustomRequest, res: Response) => {
    try {
        const myAccount = await User.findById(req.user).exec();
        if (!myAccount) {
            return res.status(400).json({
                message: "Account Not Found"
            })
        }
        return res.status(200).json({
             data:myAccount
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}