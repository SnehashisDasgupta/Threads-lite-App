import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign( {userId}, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    res.cookie("jwt", token, {
        httpOnly: true, //It prevents from being accessed by client-side scripts such as JavaScript
        maxAge: 1 * 24 * 60 * 60 * 1000,
        samesite: "strict",//helps to mitigate CSRF (Cross-Site Request Forgery) attacks
    });

    return token;
};

export default generateTokenAndSetCookie;