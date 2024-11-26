import cors from "cors";

const corsMiddleware = cors({
    origin: (origin, callback) => {
        if (["https://log2.axleshift.com", "http://localhost:3000"].includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
});

export default corsMiddleware;
