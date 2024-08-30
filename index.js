const express = require('express');
const  db  = require("./db/models/index");
const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');
const tagRoutes = require('./src/routes/tagRoutes');
const userLikesRoutes = require('./src/routes/userLikeRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const moderationRoutes = require('./src/routes/moderationRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const userRoutes = require('./src/routes/userRoutes');
const path = require('path');

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
const PORT = (process.env.PORT && process.env.PORT.trim() !== "") ? process.env.PORT : 5050;

const cors = require('cors');
// Cors setting up 
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))





const BASE_ENDPOINT = (process.env.BASE_ENDPOINT && process.env.BASE_ENDPOINT.trim() !== "") ? process.env.BASE_ENDPOINT : "/api/v1";

// Serve static files from the "medias" directory
app.use(BASE_ENDPOINT+'/medias', express.static(path.join(__dirname, 'medias')));

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body for html post form
app.use(express.urlencoded({ extended: true }));




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
app.use(BASE_ENDPOINT, authRoutes);
app.use(BASE_ENDPOINT, postRoutes);
app.use(BASE_ENDPOINT, tagRoutes);
app.use(BASE_ENDPOINT, commentRoutes);
app.use(BASE_ENDPOINT, moderationRoutes);
app.use(BASE_ENDPOINT, notificationRoutes);
app.use(BASE_ENDPOINT, userRoutes);
app.use(BASE_ENDPOINT, userLikesRoutes);




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








