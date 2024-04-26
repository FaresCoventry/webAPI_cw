const cors = require('cors');
const express = require('express');
const router = express.Router();
const User = require('../models/User');

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Error in registration
 */
router.post('/register', cors(corsOptions), async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });
        await user.save();
        res.status(201).send({ user });
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Incorrect password
 *       500:
 *         description: Server error
 */
router.post('/login', cors(corsOptions), async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('Unable to login/un');
        }

        if (user.password !== password) {
            return res.status(400).send('Unable to login/pw');
        }

        res.send({ user });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
