const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const port = process.env.PORT || 8080;

// تهيئة قاعدة البيانات
const db = new sqlite3.Database('nabda.db');
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

            // لوحة الإدارة السرية
            if (name === 'admin123') {
                db.all('SELECT * FROM users ORDER BY date DESC', [], (err, rows) => {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    let list = rows.map(u => `<tr><td>${u.name}</td><td>${u.phone}</td><td>${u.service}</td><td>${u.date}</td></tr>`).join('');
                    res.end(`
                        <div dir="rtl" style="background:#1a1a2e; color:white; padding:20px; font-family:Arial;">
                            <h2>📊 سجل الرواد المسجلين (قاعدة بيانات دائمة)</h2>
                            <table border="1" style="width:100%; text-align:center; border-collapse:collapse;">
                                <tr style="background:#00d4ff; color:#1a1a2e;"><th>الاسم</th><th>الهاتف</th><th>الخدمة</th><th>التاريخ</th></tr>
                                ${list}
                            </table>
                            <br><a href="/" style="color:#00d4ff;">العودة</a>
                        </div>
                    `);
                });
                return;
            }

            // حفظ البيانات في القاعدة
            const stmt = db.prepare('INSERT INTO users (name, phone, service) VALUES (?, ?, ?)');
            stmt.run(name, phone, service);
            stmt.finalize();

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end('<div dir="rtl" style="text-align:center; padding:100px; background:#1a1a2e; color:white; height:100vh;"><h1>✅ تم الحفظ في قاعدة البيانات بنجاح!</h1><a href="/" style="color:#00d4ff;">العودة</a></div>');
        });
        return;
    }

    // الواجهة الرئيسية
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: #1a1a2e; color: white; text-align: center; padding: 20px; }
                .container { max-width: 450px; margin: auto; border: 2px solid #00d4ff; border-radius: 15px; padding: 25px; background: #16213e; }
                input, select, button { width: 95%; padding: 12px; margin: 10px 0; border-radius: 8px; border: none; }
                input, select { background: #1a1a2e; color: white; border: 1px solid #00d4ff; }
                button { background: #00d4ff; color: #1a1a2e; font-weight: bold; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🛡️ نظام نبضة السيادي</h1>
                <p>سجل بياناتك للانضمام للرواد</p>
                <form action="/" method="POST">
                    <input type="text" name="name" placeholder="الاسم الكامل" required>
                    <input type="tel" name="phone" placeholder="رقم الهاتف" required>
                    <select name="service" required>
                        <option value="sadad">سداد</option>
                        <option value="mubikash">موبي كاش</option>
                        <option value="nouran">مصرف النوران</option>
                    </select>
                    <button type="submit">تثبيت النبضة في القاعدة 💾</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

server.listen(port);
