"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const users = [];
const register = (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(409).json({ message: 'User already exists' });
    }
    users.push({ username, email, password });
    res.status(201).json({ message: 'User registered successfully' });
};
exports.register = register;
const login = (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', user: { username: user.username, email: user.email } });
};
exports.login = login;
