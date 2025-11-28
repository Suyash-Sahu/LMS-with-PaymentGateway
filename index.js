import express from "express"
import rateLimit from "express-rate-limit"
import morgan from "morgan"
import helmet from "helmet"
import mongoSanitizer from "express-mongo-sanitize"
import hpp from "hpp"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import userRoute from "./routes/user.route.js"
import healthRoute from "./routes/health.route.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT

// Global rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 min
    limit: 100, //Limit each ip to 100 request per 'window'
    message: "Too many request form this ip, please try again later"
})

// Security middleware
app.use(helmet())
app.use(mongoSanitizer())
app.use(hpp())
app.use("/api", limiter)

// Logging Middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// Body Parser Middleware
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(cookieParser())


// Global Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
        status: "error",
        messgae: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    })
})

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "device-remember-token",
        "Access-Control-Allow-Origin",
        "Origin",
        "Accept",
    ],
}))

//API Routes
app.use("/health",healthRoute)
app.use("/api/v1/user",userRoute)


// 404 Error
app.use((req, res) => {
    res.status(404).json({
        status: "Error",
        message: "Route not found"
    })
})

app.listen(PORT, () => {
    console.log((`Server is running on port ${PORT}`))
})