import axios from "axios";
import logger from "../utils/logger.js";
import { RECAPTCHA_SECRET_KEY } from "../utils/config.js";

const verifyRecaptcha = async (req, res, next) => {
    const { recaptcha_ref } = req.body;

    if (!recaptcha_ref) {
        return res.status(400).json({ message: "reCAPTCHA token is required." });
    }

    try {
        const response = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
            params: {
                secret: RECAPTCHA_SECRET_KEY,
                response: recaptcha_ref,
            },
        });
        const { success, score } = response.data;
        if (!success || score < 0.5) return res.status(403).send();

        return next();
    } catch (err) {
        logger.error(err);
    }
    res.status(401).send();
};

export { verifyRecaptcha };
