const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const port = process.env.PORT || 8080;

const dbPath = path.resolve(__dirname, 'nabda.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, service TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP)`);
});

const server = http.createServer((req, res) => {
    let body = '';
    if (req.method === 'POST') {
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const name = params.get('name') || 'N/A';
            const service = params.get('service') || 'N/A';
            const stmt = db.prepare('INSERT INTO users (name, service) VALUES (?, ?)');
            stmt.run(name, service, (err) => {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end('<div dir="rtl" style="background:#0d1117; color:#00f2fe; text-align:center; padding-top:150px; font-family:sans-serif; height:100vh;"><h2>✅ تم استقبال النبضة بنجاح</h2><p style="color:white">نحن نعالج طلبك الآن.</p><br><a href="/" style="color:#00f2fe; text-decoration:none; border:1px solid #00f2fe; padding:10px 20px; border-radius:8px;">عودة للمحرك</a></div>');
            });
            stmt.finalize();
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
            <title>NABDA | Dashboard</title>
            <style>
                body { background: #0b0e14; color: #e6edf3; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; display: flex; flex-direction: column; min-height: 100vh; overflow-x: hidden; }
                .engine-container { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
                
                .header { text-align: center; margin-bottom: 30px; }
                .logo-text { font-size: 28px; font-weight: bold; color: white; letter-spacing: 4px; margin: 0; }
                .status-line { font-size: 10px; color: #00f2fe; font-family: monospace; opacity: 0.8; }

                .tabs-logic { display: flex; background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 4px; width: 100%; max-width: 320px; margin-bottom: 20px; }
                .tab { flex: 1; padding: 10px; text-align: center; cursor: pointer; font-size: 13px; font-weight: 600; color: #8b949e; transition: 0.3s; }
                .tab.active { background: #00f2fe; color: #0b0e14; border-radius: 9px; }

                .main-card { background: #161b22; border: 1px solid #30363d; border-radius: 20px; padding: 30px; width: 100%; max-width: 320px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
                input, select { width: 100%; padding: 14px; margin: 10px 0; background: #0b0e14; border: 1px solid #30363d; color: white; border-radius: 10px; font-size: 15px; box-sizing: border-box; }
                .btn-core { width: 100%; padding: 16px; background: #00f2fe; border: none; border-radius: 10px; color: #0b0e14; font-weight: 800; font-size: 16px; cursor: pointer; margin-top: 10px; }

                footer { padding: 25px; text-align: center; border-top: 1px solid #161b22; background: #090c10; }
                .footer-link { color: #58a6ff; text-decoration: none; font-size: 12px; margin: 0 15px; opacity: 0.7; transition: 0.3s; cursor: pointer; }
                .footer-link:hover { opacity: 1; color: #00f2fe; }
            </style>
        </head>
        <body>
            <div class="engine-container">
                <div class="header">
                    <p class="status-line">SYSTEM_ID: NABDA_CORE_V1.2</p>
                    <h1 class="logo-text">نَـبْـضَـة</h1>
                </div>

                <div class="tabs-logic">
                    <div class="tab active" id="p-tab" onclick="setMode('p')">تفعيل فردي</div>
                    <div class="tab" id="b-tab" onclick="setMode('b')">مؤسسات</div>
                </div>

                <div class="main-card">
                    <form action="/" method="POST">
                        <input type="text" name="name" id="main-input" placeholder="الاسم الرباعي" required>
                        <select name="service">
                            <option>مصرف النوران</option>
                            <option>سداد</option>
                            <option>موبي كاش</option>
                        </select>
                        <button type="submit" class="btn-core">تأكيد التفعيل ⚡</button>
                    </form>
                </div>
            </div>

            <footer>
                <div>
                    <span class="footer-link" onclick="alert('نبضة: محرك سيادي للربط المالي الرقمي في ليبيا.')">لماذا نبضة؟</span>
                    <span class="footer-link" onclick="alert('الإصدار 1.2 المستقر - 2026')">لمحة</span>
                </div>
                <p style="font-size: 9px; color: #333; margin-top: 10px;">&copy; NABDA SOVEREIGN CORE</p>
            </footer>

            <script>
                function setMode(m) {
                    document.getElementById('p-tab').classList.toggle('active', m=='p');
                    document.getElementById('b-tab').classList.toggle('active', m=='b');
                    const input = document.getElementById('main-input');
                    input.placeholder = (m == 'p') ? "الاسم الرباعي" : "اسم المؤسسة / الشركة";
                }
            </script>
        </body>
        </html>
    `);
});

server.listen(port);
