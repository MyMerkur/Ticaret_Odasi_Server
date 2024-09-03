const Announcement = require('../models/announcement');
const ImporterCompany = require('../models/importerCompanys');
const ContactInfo = require('../models/contactInfo');
const multer = require('multer');
const path = require('path');
const announcement = require('../models/announcement');
const fs = require('fs');

// Multer yapılandırması
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads')); // Görsellerin kaydedileceği dizin
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Benzersiz dosya ismi oluştur
  }
});

const upload = multer({ storage: storage });


//Duyuru Ekleme İşlemleri
exports.postAnnouncement = [
  upload.fields([
    { name: 'announcementImg', maxCount: 1 }, 
    { name: 'announcementFile', maxCount: 1 }  
  ]), 
  (req, res, next) => {
    const { announcement, announcementDetail, announcement2, announcementDetail2, announcement3, announcementDetail3 } = req.body;
    const announcementImg = req.files['announcementImg'] ? req.files['announcementImg'][0].filename : null;
    const announcementFile = req.files['announcementFile'] ? req.files['announcementFile'][0].filename : null;

    if (!announcement || !announcementDetail || !announcementImg) {
      return res.status(400).json({ message: 'Tüm alanlar gereklidir.' });
    }

    const newAnnouncement = new Announcement({
      announcement: announcement,
      announcementDetail: announcementDetail,
      announcement2: announcement2,
      announcementDetail2: announcementDetail2,
      announcement3: announcement3,
      announcementDetail3: announcementDetail3,
      announcementImg: announcementImg,
      announcementFile: announcementFile 
    });

    newAnnouncement.save()
      .then(() => {
        res.status(201).json({ message: 'Duyuru başarıyla eklendi.' });
      })
      .catch((error) => {
        console.error('Duyuru ekleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
      });
  }
];


exports.getAnnouncement = (req, res, next) => {
  Announcement.find({})
    .then(announcements => {
      console.log('Duyurular', announcements)
      res.status(200).json(announcements);
    })
    .catch(err => {
      res.status(500).json({ message: 'Duyurular alınırken bir hata oluştu.' });

    });
};

exports.getAnnouncementDetail = (req, res, next) => {
  console.log('Gelen ID:', req.params.id); 
  Announcement.findById(req.params.id)
    .then((announcement) => {
      if (announcement) {
        res.json(announcement);
      } else {
        res.status(404).json({ message: 'Duyuru bulunamadı.' });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: 'Sunucu hatası.' });
    });
};

//Duyuru Düzenleme  İşlemleri
exports.getAnnouncementEdit =(req,res,next)=>{
  Announcement.findById(req.params.id)
  .then((announcement) => {
    if (announcement) {
      res.json(announcement);
    } else {
      res.status(404).json({ message: 'Duyuru bulunamadı.' });
    }
  })
  .catch((error) => {
    res.status(500).json({ message: 'Sunucu hatası.' });
  });
}

exports.postAnnouncementEdit = [
  upload.single('announcementImg'), // Tek bir dosya yükle
  (req, res, next) => {
    const { id } = req.body; // Duyuru ID'si
    const { announcement, announcementDetail, announcement2, announcementDetail2, announcement3, announcementDetail3 } = req.body;
    const announcementImg = req.file;

    if (!announcement || !announcementDetail || !id) {
      return res.status(400).json({ message: 'Tüm alanlar gereklidir.' });
    }

    Announcement.findById(id)
      .then((announcementToUpdate) => {
        if (!announcementToUpdate) {
          return res.status(404).json({ message: 'Duyuru bulunamadı.' });
        }

        announcementToUpdate.announcement = announcement;
        announcementToUpdate.announcementDetail = announcementDetail;
        announcementToUpdate.announcement2 = announcement2;
        announcementToUpdate.announcementDetail2 = announcementDetail2;
        announcementToUpdate.announcement3 = announcement3;
        announcementToUpdate.announcementDetail3 = announcementDetail3;

        if (announcementImg) {
          announcementToUpdate.announcementImg = announcementImg.filename;
        }

        return announcementToUpdate.save();
      })
      .then(() => {
        res.status(200).json({ message: 'Duyuru başarıyla güncellendi.' });
      })
      .catch((error) => {
        console.error('Duyuru güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
      });
  }
];


exports.postDeleteAnnouncement=(req,res,next)=>{
  const id = req.body.announcementid;

  Announcement.findOne({_id:id})
    .then(announcement=>{
      if(!announcement){
        return next(new Error('Silmek istediğiniz haber-duyuru bulunamadı.'))
      }
      fs.unlink('public/uploads/'+announcement.announcementImg,err=>{
        if(err){console.log(err)}
      });
      return Announcement.deleteOne({_id:id})
    })
    .catch(err=>{
      console.log(err);
    })
}


//İthalatçı Firma Ekleme İşlemleri
exports.getAddImporterCompany =(req,res,next)=>{
  ImporterCompany.find({})
    .then(company => {
      console.log('Şirketler:', company)
      res.status(200).json(company);
    })
    .catch(err => {
      res.status(500).json({ message: 'Şirketler alınırken bir hata oluştu.' });

    });
}

exports.postAddImporterCompany =(req,res,next)=>{
  const { uyeSicil, unvan, adresTip, adres, isTelefon, uyeKayitTarihi, naceKodu, naceAdi, durumu } = req.body;
 

  if (!uyeSicil || !unvan || !adresTip || !adres || !isTelefon || !uyeKayitTarihi || !naceKodu || !naceAdi || !durumu) {
    return res.status(400).json({ message: 'Tüm alanlar gereklidir.' });
  }

  const newImporterCompany = new ImporterCompany({
    uyeSicil:uyeSicil,
    unvan:unvan,
    adresTip:adresTip,
    adres:adres,
    isTelefon:isTelefon,
    uyeKayitTarihi:uyeKayitTarihi,
    naceKodu:naceKodu,
    naceAdi:naceAdi,
    durumu:durumu,
  });

  newImporterCompany.save()
    .then(() => {
      res.status(201).json({ message: 'Şirket başarıyla eklendi.' });
    })
    .catch((error) => {
      console.error('Şirket ekleme hatası:', error);
      res.status(500).json({ message: 'Sunucu hatası.' });
    });
}

exports.getSendContactInfo=(req,res,nex)=>{
  ContactInfo.find({})
    .then(contacts=>{
      console.log('İletişim Formları:',contacts)
      res.status(200).json(contacts)
    })
    .catch(err=>{
      res.status(500).json({message:'İletişim Formları Alınırken Bir Hata Oluştu'});
    })
}

exports.postSendContactInfo=(req,res,nex)=>{
  const {name,surname,phone,email,aciklama} = req.body

  if (!name || !surname || !phone || !email || !aciklama ) {
    return res.status(400).json({ message: 'Tüm alanlar gereklidir.' });
  }

  const newContactInfo = new ContactInfo({
    name:name,
    surname:surname,
    email:email,
    phone:phone,
    aciklama:aciklama
  })

  newContactInfo.save()
    .then(()=>{
      res.status(200).json({message:'İletişim formu başarıyla dolduruldu'})
    })
    .catch(err=>{
      res.status(500).json({message:'Form kaydedilirken bir hata oluştu.'});
    })
}