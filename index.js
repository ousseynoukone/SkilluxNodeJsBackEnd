const express = require('express');
const  db  = require("./db/models/index");
const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');
const tagRoutes = require('./src/routes/tagRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const moderationRoutes = require('./src/routes/moderationRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const userRoutes = require('./src/routes/userRoutes');

require('dotenv').config(); // Load environment variables from .env file

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const cron = require('node-cron');
const { logMessage } = require('./src/helper/helper');
const { cleanupOldNotifications } = require('./src/controllers/cronJobs/notificationCronJob');
const { cleanupOldBlackListedToken } = require('./src/controllers/cronJobs/blackListedTokenCronJob');
const { cleanupOldDeactivatedAccount } = require('./src/controllers/cronJobs/deleteOldDeactivatedAccount');

const app = express();
const PORT = process.env.PORT || 5050;
const cors = require('cors');



// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body for html post form
app.use(express.urlencoded({ extended: true }));

// To use cors and allow all origins
app.use(cors())

app.listen(PORT, async () => {
  console.log("Server running on port "+PORT);
  console.log('Swagger UI Express server is running on http://localhost:5050/api-docs');
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await db.sequelize.sync({ alter: true });
    //{ force: true }
    // { alter: true }
    
  } catch (error) {   
    console.error('Unable to connect to the database:', error);
  }
});


// enable Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount your routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', postRoutes);
app.use('/api/v1', tagRoutes);
app.use('/api/v1', commentRoutes);
app.use('/api/v1', moderationRoutes);
app.use('/api/v1', notificationRoutes);
app.use('/api/v1', userRoutes);


// ////////////////////////////////////////////////////BACKGROUND TASK//////////////////////////////////////////////////////

// BACKGROUND TASK TO CLEAN UP OLD READ NOTIFICATION
            // ┌───────────── minute (0 - 59)
            // │ ┌───────────── heure (0 - 23)
            // │ │ ┌───────────── jour du mois (1 - 31)
            // │ │ │ ┌───────────── mois (1 - 12 ou JAN-DÉC)
            // │ │ │ │ ┌───────────── jour de la semaine (0 - 6 ou DIM-SAM)
            // │ │ │ │ │
            // * * * * *  
cron.schedule('0 0 * * 0', async () => {
  logMessage()
  cleanupOldNotifications()
});

// BACKGROUND TASK TO CLEAN UP OLD EXPIRED TOKEN
cron.schedule(' 0 0 * * * ', async () => {
  cleanupOldBlackListedToken()
  logMessage()
});


// BACKGROUND TASK TO CLEAN UP OLD Deactivated Account
cron.schedule(' 0 0 * * * ', async () => {
  cleanupOldDeactivatedAccount()
  logMessage()
});








