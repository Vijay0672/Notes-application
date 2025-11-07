import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to mongoDB")
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

// to make input as json
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  })
)

// For Vercel serverless functions
export default app

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

// import routes
import authRouter from "./routes/auth.route.js"
import noteRouter from "./routes/note.route.js"

app.use("/api/auth", authRouter)
app.use("/api/note", noteRouter)

// error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Serer Error"

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
