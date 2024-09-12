import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js"
import ProductRoute from "./routes/ProductRoute.js"
import AuthRoute from './routes/AuthRoute.js';
import helmet from "helmet";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db
});

// (async()=>{
//     await db.sync();
// })();

const port = process.env.APP_PORT;
const fe_port = process.env.FE_PORT;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});

app.use(limiter);
app.use(hpp());

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}))
app.use(cors({
    credentials: true,
    origin: `http://localhost:${fe_port}`
}));
app.use(
    helmet({
    frameguard: {
        action: 'sameorigin'
    },
    referrerPolicy: {
        policy: 'same-origin'
    },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "trusted-cdn.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    }
}))
app.use(express.json());
app.use(UserRoute)
app.use(ProductRoute)
app.use(AuthRoute)

app.listen(port, ()=>{
    console.log(`Server up and running on ${port}`)
});
