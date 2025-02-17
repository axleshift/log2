import cors from "cors";

const corsMiddleware = cors({
    origin: (origin, callback) => {
        console.log("Request Origin:", origin); // LOG THE ORIGIN
        const allowedOrigins = ["https://log2.axleshift.com", "http://localhost:3000"];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // ALLOW COOKIES AND HEADERS ACCESS
});

export default corsMiddleware;
