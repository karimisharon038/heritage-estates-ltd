require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/chat', require('./routes/chat'));

// health
app.get('/', (req, res) => res.send('Heritage backend running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
