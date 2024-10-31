import cors from "cors";

const corsMiddleware = cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
});

export default corsMiddleware;
