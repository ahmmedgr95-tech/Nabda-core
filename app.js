const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const port = process.env.PORT || 8080;

// تحديد مسار قاعدة البيانات بشكل آمن
const dbPath = path.resolve(__dirname, 'nabda.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('خطأ في فتح القاعدة:', err.message);
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        service TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});


const server = http.createServer((req, res) => {
    let body = '';
    if (req.method === 'POST') {
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const name = params.get('name');
            const phone = params.get('phone');
            const service = params.get('service');

            // لوحة الإدارة السرية (مطورة لعرض عصري)
            if (name === 'admin123') {
                db.all('SELECT * FROM users ORDER BY date DESC', [], (err, rows) => {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    let list = rows.map(u => `<div class="admin-row"><div>${u.name}</div><div>${u.phone}</div><div>${u.service}</div></div>`).join('');
                    res.end(`
                        <style>
                            body { background: #0a0f1e; color: #fff; font-family: 'Cairo', sans-serif; direction: rtl; padding: 20px; }
                            h2 { color: #00f2fe; text-align: center; }
                            .admin-table { background: rgba(255,255,255,0.05); border-radius: 15px; padding: 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
                            .admin-header, .admin-row { display: grid; grid-template-columns: 2fr 1.5fr 1fr; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: center; }
                            .admin-header { font-weight: bold; color: #00f2fe; }
                        </style>
                        <div class="admin-table">
                            <h2>📊 مركز إدارة النبضات</h2>
                            <div class="admin-header"><div>الاسم</div><div>الهاتف</div><div>الخدمة</div></div>
                            ${list}
                            <br><a href="/" style="color:#00f2fe; text-align:center; display:block;">العودة للمنصة</a>
                        </div>
                    `);
                });
                return;
            }

            // حفظ البيانات (نفس الإجراء)
            const stmt = db.prepare('INSERT INTO users (name, phone, service) VALUES (?, ?, ?)');
            stmt.run(name, phone, service);
            stmt.finalize();

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`
                <style>
                    body { background: #0a0f1e; color: #fff; font-family: 'Cairo', sans-serif; text-align:center; padding:100px; display:flex; justify-content:center; align-items:center; height:80vh; }
                    .success-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(0,242,254,0.3); border-radius: 20px; padding: 40px; box-shadow: 0 0 20px rgba(0,242,254,0.2); }
                    h1 { color: #00f2fe; }
                    a { color: #8a2be2; text-decoration:none; margin-top:20px; display:block; }
                </style>
                <div class="success-card">
                    <h1>✅ تم دمج نبضتك بنجاح!</h1>
                    <p>أهلاً بك في الجيل القادم من الخدمات السيادية.</p>
                    <a href="/">العودة للرئيسية</a>
                </div>
            `);
        });
        return;
    }

    // الواجهة الرئيسية العصرية (Modern FinTech App UI)
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <title>NABDA | الجيل القادم</title>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
            <style>
                :root { --bg: #0a0f1e; --glass: rgba(255, 255, 255, 0.03); --border: rgba(255, 255, 255, 0.08); --primary: #00f2fe; --secondary: #8a2be2; --text: #ffffff; }
                body { font-family: 'Cairo', sans-serif; background: var(--bg); color: var(--text); margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; overflow: hidden; }
                
                /* خلفية متحركة (النبضة الكونّية) */
                body::before { content: ''; position: absolute; width: 300px; height: 300px; background: var(--secondary); filter: blur(150px); opacity: 0.2; border-radius: 50%; top: -100px; right: -100px; z-index: -1; }
                body::after { content: ''; position: absolute; width: 300px; height: 300px; background: var(--primary); filter: blur(150px); opacity: 0.2; border-radius: 50%; bottom: -100px; left: -100px; z-index: -1; }

                .app-container { width: 90%; max-width: 400px; background: var(--glass); border: 1px solid var(--border); border-radius: 25px; padding: 30px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); position: relative; overflow: hidden; }
                
                /* تأثير "النبضة" البصري */
                .pulse-icon { width: 60px; height: 60px; background: var(--glass); border: 2px solid var(--primary); border-radius: 50%; margin: 0 auto 20px; display: flex; justify-content: center; align-items: center; position: relative; box-shadow: 0 0 15px rgba(0,242,254,0.3); }
                .pulse-icon::after { content: ''; position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px solid var(--primary); animation: pulse 2s infinite; opacity: 0; }

                @keyframes pulse { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }

                h1 { font-size: 22px; margin: 0 0 10px; font-weight: 700; background: linear-gradient(to right, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                p { font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 25px; }

                .form-group { position: relative; margin-bottom: 15px; text-align: right; }
                input, select { width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'Cairo', sans-serif; font-size: 14px; box-sizing: border-radius; transition: 0.3s; }
                input:focus, select:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 10px rgba(0,242,254,0.2); }

                /* تخصيص الـ Select ليبدو عصرياً */
                select { appearance: none; -webkit-appearance: none; background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>'); background-repeat: no-repeat; background-position: left 10px center; }

                button { width: 100%; padding: 15px; background: linear-gradient(45deg, var(--primary), var(--secondary)); border: none; border-radius: 12px; color: var(--bg); font-weight: bold; font-size: 16px; cursor: pointer; transition: 0.3s; margin-top: 10px; box-shadow: 0 5px 15px rgba(0,242,254,0.3); }
                button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,242,254,0.5); }

                .footer { margin-top: 25px; font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; }
            </style>
        </head>
        <body>
            <div class="app-container">
                <div class="pulse-icon">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#00f2fe"/></svg>
                </div>
                <h1>نِظَام نَبْضَة السيادي</h1>
                <p>الجيل القادم من التحقق الرقمي في ليبيا</p>
                <form action="/" method="POST">
                    <div class="form-group">
                        <input type="text" name="name" placeholder="الاسم الكامل للرائد" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" name="phone" placeholder="رقم الهاتف المؤكد" required>
                    </div>
                    <div class="form-group">
                        <select name="service" required>
                            <option value="" disabled selected>اختر محفظتك الرقمية</option>
                            <option value="sadad">سداد (Sadad)</option>
                            <option value="mubikash">موبي كاش (MubiKash)</option>
                            <option value="nouran">مصرف النوران</option>
                            <option value="tadawul">تداول (Tadawul)</option>
                        </select>
                    </div>
                    <button type="submit">تثبيت النبضة الرقمية 🚀</button>
                </form>
                <div class="footer">الموقع مؤمن بواسطة DigitalOcean AI Agent</div>
            </div>
        </body>
        </html>
    `);
});

server.listen(port);
