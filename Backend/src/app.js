import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import config from "./config/config.js"
import productRoutes from "./routes/product.routes.js"


const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({ extended: true,limit:"50mb" }));
app.use(cookieParser());
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}))

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products',productRoutes);
// Base Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to FitFusion API' });
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

export default app;
