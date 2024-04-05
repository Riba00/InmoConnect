import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const protectRoute = async (req, res, next) => {
    // Check if token is present
    const { _token} = req.cookies;

    if (!_token) {
        return res.redirect("/auth/login");
    }

    // Check if token is valid
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const user = await User.scope('dropPassword').findByPk(decoded.id);

        // Save user in Req
        if (user) {
            req.user = user;
        } else {
            return res.clearCookie("_token").redirect("/auth/login");
        }
        return next();
        
    } catch (error) {
        return res.clearCookie("_token").redirect("/auth/login");
    }
}

export default protectRoute;