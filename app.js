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
            const name = params.get('name') || 'N/A';
            const service = params.get('service') || 'N/A';
            const stmt = db.prepare('INSERT INTO users (name, service) VALUES (?, ?)');
            stmt.run(name, service);
            stmt.finalize();
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end('<div dir="rtl" style="background:#0d1117; color:#00f2fe; text-align:center; padding-top:100px; font-family:sans-serif; height:100vh;"><h1>✅ تم استقبال النبضة</h1><a href="/" style="color:white;">عودة</a></div>');
        });
        return;
    }

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { background: #0d1117; color: white; font-family: sans-serif; margin: 0; display: flex; flex-direction: column; min-height: 100vh; }
                .main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .card { background: #161b22; border: 1px solid #30363d; border-radius: 20px; padding: 30px; width: 320px; text-align: center; }
                .logic-tabs { display: flex; background: #0d1117; border-radius: 10px; padding: 5px; margin-bottom: 20px; }
                .tab { flex: 1; padding: 8px; font-size: 12px; cursor: pointer; color: #8b949e; }
                .tab.active { background: #00f2fe; color: #0d1117; border-radius: 7px; font-weight: bold; }
                input, select { width: 100%; padding: 12px; margin: 10px 0; background: #0d1117; border: 1px solid #30363d; color: white; border-radius: 8px; box-sizing: border-box; }
                button { width: 100%; padding: 12px; background: #00f2fe; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
                footer { padding: 20px; text-align: center; font-size: 11px; border-top: 1px solid #30363d; }
                .f-link { color: #58a6ff; text-decoration: none; margin: 0 10px; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="main">
                <h2 style="letter-spacing:2px;">نَـبْـضَـة</h2>
                <div class="logic-tabs">
                    <div class="tab active" id="t1" onclick="sel(1)">تفعيل فردي</div>
                    <div class="tab" id="t2" onclick="sel(2)">مؤسسات</div>
                </div>
                <div class="card">
                    <form action="/" method="POST">
                        <input type="text" name="name" placeholder="الاسم الرباعي" id="inp" required>
                        <select name="service"><option>مصرف النوران</option><option>سداد</option><option>موبي كاش</option></select>
                        <button type="submit">تفعيل ⚡</button>
                    </form>
                </div>
            </div>
            <footer>
                <span class="f-link" onclick="alert('لأننا نبني مستقبلاً مالياً سيادياً')">لماذا نبضة؟</span>
                <span class="f-link" onclick="alert('مشروع تقني ليبي طموح')">لمحة</span>
            </footer>
            <script>
                function sel(n) {
                    document.getElementById('t1').classList.toggle('active', n==1);
                    document.getElementById('t2').classList.toggle('active', n==2);
                    document.getElementById('inp').placeholder = n==1 ? "الاسم الرباعي" : "اسم المؤسسة";
                }
            </script>
        </body>
        </html>
    `);
});
server.listen(port);
