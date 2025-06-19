require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models/init');
const telegramBot = require('./config/telegram');
const apiRoutes = require('./routes');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
  })
  .catch(err => console.error('DB error:', err));

require('./bot/telegramBot');
