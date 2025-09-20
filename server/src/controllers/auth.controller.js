const Player = require('../models/Player');
const Guest = require('../models/guest');
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

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    try {
      let user;
      if (decoded.guest) {
        user = await Guest.findById(decoded.id);
      } else {
        user = await Player.findById(decoded.id);
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Attach full user + guest flag
      req.user = {
        id: user._id,
        name: decoded.guest ? user.displayName : user.name,
        email: decoded.guest ? null : user.email,
        isAdmin: !decoded.guest && user.isAdmin,
        guest: decoded.guest
      };

      next();
    } catch (dbErr) {
      console.error(dbErr);
      res.status(500).json({ error: 'Server error' });
    }
  });
};

exports.getProfile = async (req, res) => {
  try {
    let user;

    if (req.user.guest) {
      // Guest user
      user = await Guest.findById(req.user.id).select('-__v');
      if (!user) return res.status(404).json({ error: 'Guest not found' });

      return res.json({
        id: user._id,
        displayName: user.displayName,
        uniqueName: user.uniqueName,
        guest: true
      });
    } else {
      // Player user
      user = await Player.findById(req.user.id).select('-passwordHash -__v');
      if (!user) return res.status(404).json({ error: 'Player not found' });

      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        guest: false
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.createGuest = async (req, res) => {
  try {
    const { displayName } = req.body;
    if (!displayName) {
      return res.status(400).json({ error: 'Display name is required' });
    }

    // Generate a unique guest username
    const uniqueName = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Create guest document
    const guest = new Guest({ uniqueName, displayName });
    await guest.save();

    // Issue a temporary JWT token (e.g. valid for 12h)
    const token = jwt.sign(
      { id: guest._id, guest: true }, // payload includes a `guest` flag
      JWT_SECRET,
      { expiresIn: '12h' } // guest accounts are temporary
    );

    res.status(201).json({
      token,
      guest: {
        id: guest._id,
        uniqueName,
        displayName,
        guest: true
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


