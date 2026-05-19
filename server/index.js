const express = require('express')
const mongoose = require('mongoose')
const dns = require('dns')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Force Node to use Google DNS for Atlas SRV lookups when local DNS is not resolving correctly
dns.setServers(['8.8.8.8', '8.8.4.4'])

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth',    require('./routes/auth'))
app.use('/api/leads',   require('./routes/leads'))
app.use('/api/tasks',   require('./routes/tasks'))
app.use('/api/reports', require('./routes/reports'))
app.use('/api/users',   require('./routes/users'))

// Test route
app.get('/', (req, res) => res.json({ message: 'Nexivo CRM API running' }))

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    )
  })
  .catch(err => console.error('MongoDB error:', err))
