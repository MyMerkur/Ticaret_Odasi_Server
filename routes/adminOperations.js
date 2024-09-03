const express = require('express');
const routes = express.Router();
const adminOpsControllers = require('../controllers/adminOpsControllers');
const authenticateToken = require('../middleware/authenticateToken');

routes.post('/announcement',adminOpsControllers.postAnnouncement);
routes.get('/getAnnouncement',adminOpsControllers.getAnnouncement);
routes.get('/announcementDetail/:id',adminOpsControllers.getAnnouncementDetail);

routes.get('/announcementEdit/:id',adminOpsControllers.getAnnouncementEdit);
routes.post('/announcementEdit',adminOpsControllers.postAnnouncementEdit);

routes.post('/deleteAnnouncement',adminOpsControllers.postDeleteAnnouncement);


routes.get('/addImporterCompany',adminOpsControllers.getAddImporterCompany);
routes.post('/addImporterCompany',adminOpsControllers.postAddImporterCompany);


routes.get('/sendContactInfo',adminOpsControllers.getSendContactInfo);
routes.post('/sendContactInfo',adminOpsControllers.postSendContactInfo);



module.exports = routes;