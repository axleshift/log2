import cors from "cors";

const corsMiddleware = cors({
    origin: true,
    credentials: true, // ALLOW COOKIES AND HEADERS ACCESS
});

export default corsMiddleware;
