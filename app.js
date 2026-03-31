const path = require('path');
// أخبر السيرفر أن يستخدم الملفات الموجودة في مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// عند فتح الرابط الرئيسي، أرسل ملف index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
