const Player = require('../models/Player');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'b3bb6aaaabbb6addda65dbc14956a7c30fc0ea5341ec982920e896846d7c662535f7ac417bdae0ec4a79130519d013e6187382c56e57900d52f7f18cb1b34464';


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!(name && email && password)) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const existingUser = await Player.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const player = new Player({ name, email, passwordHash });
    await player.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const player = await Player.findOne({ email });
    if (!player) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, player.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: player._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      player: { id: player._id, name: player.name, email: player.email, isAdmin: player.isAdmin }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header required' });
  }
  const token = authHeader.split(' ')[1];
  console.log("Token:", token);
  console.log("JWT_SECRET:", JWT_SECRET);
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

exports.getProfile = async (req, res) => {
  try {
    const player = await Player.findById(req.user.id).select('-passwordHash');
    if (!player) return res.status(404).json({ error: 'User not found' });
    res.json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
    