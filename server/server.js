require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ──
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// ── BODY PARSER ──
app.use(express.json({ limit: '10kb' }));

// ── RATE LIMITER (contact form) ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/contact', limiter);

// ── ROUTES ──
app.use('/api/contact', contactRoutes);

// ── HEALTH CHECK ──
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', service: 'HydroDefendSolution API' });
});

// ── 404 ──
app.use((_, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── ERROR HANDLER ──
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── MONGODB + START ──
if (!process.env.MONGO_URI) {
  console.error('❌ ERROR: MONGO_URI environment variable is not defined!');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error details:', err);
    process.exit(1);
  });
