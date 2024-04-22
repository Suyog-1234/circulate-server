import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export const bcryptPassword = async (password: string) => {
    const saltRound = 10
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    const doesMatched = bcrypt.compare(password, hashedPassword);
    return doesMatched
}

export const generateOtp = (length: number) => {
    var chars = "0123456789";
    var otp = "";
    for (var i = 0; i < length; i++) {
        otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return otp;
}

export const generateAccessToken = (id:string) => {
    const token = jwt.sign({
        id: id
    },process.env.ACCESS_TOKEN_SECRET as string,{ expiresIn:'15m'});
    return token
}
export const generateRefreshToken = (id:string) => {
    const token = jwt.sign({
        id: id
    }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d"});
    return token
}