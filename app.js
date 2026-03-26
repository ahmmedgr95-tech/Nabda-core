const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const port = process.env.PORT || 8080;

const dbPath = path.resolve(__dirname, 'nabda.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, service TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP)`);
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

            if (name === 'admin123') {
                db.all('SELECT * FROM users ORDER BY date DESC', [], (err, rows) => {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    let list = rows.map(u => `<div style="display:grid; grid-template-columns:1fr 1fr 1fr; padding:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:13px;"><div>${u.name}</div><div>${u.phone}</div><div style="color:#00f2fe">${u.service}</div></div>`).join('');
                    res.end(`<div dir="rtl" style="background:#0a0f1e; color:white; padding:20px; font-family:sans-serif; min-height:100vh;">
                        <h2 style="color:#00f2fe; text-align:center;">📊 لوحة تحكم الرواد</h2>
                        <div style="background:rgba(255,255,255,0.05); border-radius:15px; overflow:hidden;">
                            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; padding:12px; background:rgba(0,242,254,0.1); font-weight:bold; color:#00f2fe;"><div>الاسم</div><div>الهاتف</div><div>الخدمة</div></div>
                            ${list || '<p style="padding:20px; text-align:center;">لا يوجد مسجلون</p>'}
                        </div>
                        <br><a href="/" style="color:#8a2be2; text-decoration:none; display:block; text-align:center;">العودة للرئيسية</a>
                    </div>`);
                });
                return;
            }

            const stmt = db.prepare('INSERT INTO users (name, phone, service) VALUES (?, ?, ?)');
            stmt.run(name, phone, service);
            stmt.finalize();

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<div dir="rtl" style="background:#0a0f1e; color:white; text-align:center; padding-top:100px; font-family:sans-serif; height:100vh;">
                <h1 style="color:#00f2fe;">✅ تم تثبيت نبضتك!</h1>
                <p>شكراً لانضمامك لرواد النظام السيادي.</p>
                <a href="/" style="color:#8a2be2; text-decoration:none;">العودة</a>
            </div>`);
        });
        return;
    }

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                :root { --bg: #0a0f1e; --primary: #00f2fe; --secondary: #8a2be2; }
                body { font-family: sans-serif; background: var(--bg); color: white; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                .app-card { width: 90%; max-width: 380px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 30px; padding: 30px; backdrop-filter: blur(15px); text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: fadeIn 1.2s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                /* الشعار المبرمج */
                .logo-svg { width: 80px; height: 80px; margin-bottom: 15px; filter: drop-shadow(0 0 8px var(--primary)); }
                .pulse-line { stroke: var(--primary); stroke-width: 2; fill: none; stroke-dasharray: 100; animation: draw 3s infinite linear; }
                @keyframes draw { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }

                h1 { font-size: 24px; margin: 0; background: linear-gradient(to right, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                p { font-size: 13px; opacity: 0.6; margin-bottom: 30px; }
                input, select { width: 100%; padding: 14px; margin: 10px 0; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: white; box-sizing: border-box; outline: none; transition: 0.3s; }
                input:focus { border-color: var(--primary); box-shadow: 0 0 10px rgba(0,242,254,0.2); }
                button { width: 100%; padding: 16px; margin-top: 15px; border-radius: 12px; border: none; background: linear-gradient(45deg, var(--primary), var(--secondary)); color: #0a0f1e; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 8px 20px rgba(0,242,254,0.3); transition: 0.3s; }
                button:active { transform: scale(0.98); }
            </style>
        </head>
        <body>
            <div class="app-card">
                <svg class="logo-svg" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.05)" stroke-width="1" fill="none" />
                    <path class="pulse-line" d="M20,50 L35,50 L42,30 L50,70 L58,40 L65,50 L80,50" />
                    <path d="M50,25 C65,25 75,35 75,50 C75,65 65,75 50,75 C35,75 25,65 25,50" stroke="var(--secondary)" stroke-width="1.5" fill="none" opacity="0.5" />
                </svg>
                
                <h1>نَـبْـضَـة</h1>
                <p>النظام السيادي الموحد - NABDA CORE</p>
                
                <form action="/" method="POST">
                    <input type="text" name="name" placeholder="الاسم الكامل" required>
                    <input type="tel" name="phone" placeholder="رقم الهاتف" required>
                    <select name="service" required>
                        <option value="" disabled selected>اختر وسيلة الدفع</option>
                        <option value="مصرف النوران">مصرف النوران</option>
                        <option value="سداد">سداد (Sadad)</option>
                        <option value="موبي كاش">موبي كاش</option>
                        <option value="تداول">تداول</option>
                    </select>
                    <button type="submit">تفعيل النبضة الرقمية 🚀</button>
                </form>
                <div style="margin-top:20px; font-size:10px; opacity:0.3; letter-spacing:1px;">SECURED BY NABDA SHIELD</div>
            </div>
        </body>
        </html>
    `);
});

server.listen(port);
