import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import config from "./config/config.js"
import productRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import cors from "cors"

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: "https://fit-fusion-kappa-wheat.vercel.app",
    credentials: true
}));
app.set("trust proxy", 1); 

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_REDIRECT_URI
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}))

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoutes);
// Base Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to FitFusion API' });
});


// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

export default app;
