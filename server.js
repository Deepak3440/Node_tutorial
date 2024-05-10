const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');
const Person = require('./models/Person');
const personRoutes = require('./routes/personRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(passport.initialize());

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        console.log('received credentials', username, password);

        if (!username || !password) {
            return done(null, false, { message: 'Username and password are required' });
        }

        const user = await Person.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username' });
        } else {
            const isPasswordMatch = user.comparePassword(user.password);
            if (isPasswordMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password' });
            }
        }
    } catch (err) {
        return done(err);
    }
}));

// Middleware to log requests (place it before authentication)
const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()}, request on ${req.originalUrl}`);
    next();
};
app.use(logRequest);
app.use(passport.authenticate('local', { session: false }));


app.use('/', personRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the hotel");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
