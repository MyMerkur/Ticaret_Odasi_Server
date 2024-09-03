// app.js
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const bodyParser = require('body-parser');
const adminRoute = require('./routes/adminRoutes');
const adminOpsRoute = require('./routes/adminOperations');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const port = 5050;
const multer = require('multer');
const path = require('path');

var store = new MongoDBStore({
  uri:process.env.MongoDB,
  collection:'mySession'
});

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CORS OPTIONS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type, Authorization', 
  credentials: true
}));

//SESSION OPTİONS
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 5 * 60 * 60 * 1000
  },
  store: store
}))

//IMAGE STORAGE
const storage = multer.diskStorage({
  destination:function(req,file,cb){
      cb(null,'./public/uploads');
  },
  filename: function (req, file, cb) {
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})




//ROUTES
app.use(adminRoute);
app.use(adminOpsRoute);

//MULTER
app.use(multer({storage:storage}).single('image'));






mongoose.connect(process.env.MongoDB)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı...');
    app.listen(port, () => {
      console.log(`Sunucu ${port} portunda çalışıyor...`);
    });
  })
  .catch(err => {
    console.log('Bağlantı hatası', err);
  });
