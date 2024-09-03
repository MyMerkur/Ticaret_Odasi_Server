const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postRegister = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    Admin.findOne({ email: email })
        .then(admin => {
            if (admin) {
                return res.status(409).json({ message: "Bu email zaten kullanılıyor." });
            }
            return bcrypt.hash(password, 10);
        })
        .then(hashedPassword => {
            if (!hashedPassword) return;
            const newAdmin = new Admin({
                email: email,
                password: hashedPassword,
            });
            return newAdmin.save();
        })
        .then((savedAdmin) => {
            // JWT token oluştur
            const token = jwt.sign(
                { userId: savedAdmin._id, email: savedAdmin.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Token'ı frontend'e gönder
            res.status(201).json({ token: token, message: 'Kayıt başarılı!' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Kayıt sırasında bir hata oluştu.' });
        });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    Admin.findOne({ email: email })
        .then(admin => {
            if (!admin) {
                return res.status(401).json({ message: 'Email veya şifre hatalı.' });
            }
            bcrypt.compare(password, admin.password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(401).json({ message: 'Email veya şifre hatalı.' });
                    }
                    const token = jwt.sign(
                        { email: admin.email, adminId: admin._id },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );
                    res.status(200).json({ token: token, adminId: admin._id });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Sunucu hatası.' });
        });
};
