const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const port = process.env.PORT || 8080;

const db = new sqlite3.Database(path.resolve(__dirname, 'nabda_dev.db'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS pulse_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, amount REAL, status TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);
});

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        // محاكاة إتمام الموجة (Logic Test)
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`
            <style>
                body { background: #0b0e14; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .glass-result { background: rgba(255,255,255,0.05); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); padding: 40px; border-radius: 25px; text-align: center; width: 80%; max-width: 400px; }
                .timer { color: #00f2fe; font-family: monospace; font-size: 20px; margin-top: 20px; }
                .pulse-dot { width: 10px; height: 10px; background: #00f2fe; border-radius: 50%; display: inline-block; animation: pulse 1s infinite; }
                @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(3); opacity: 0; } }
            </style>
            <div class="glass-result">
                <div class="pulse-dot"></div>
                <h2 style="color:#00f2fe;">إثبات استحقاق</h2>
                <div style="font-size: 48px; font-weight: bold; margin: 20px 0;">340 <span style="font-size:18px;">LYD</span></div>
                <p style="opacity:0.7;">تمت معالجة النبضة بنجاح بناءً على بروتوكول التشغيل.</p>
                <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1);">
                <div class="timer">إغلاق الموجة: متبقي 07:00:00:00</div>
                <p style="font-size:10px; margin-top:20px; color:#555;">SECURITY_HASH: DB-8000-X10</p>
            </div>
        `);
        return;
    }

    // الواجهة الزجاجية للاختبار
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { background: #0d1117; color: #c9d1d9; font-family: 'Segoe UI', sans-serif; margin: 0; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
                .test-env { position: fixed; top: 10px; left: 10px; background: red; color: white; padding: 2px 10px; font-size: 10px; font-weight: bold; border-radius: 5px; z-index: 1000; }
                .main-ui { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; }
                
                /* تصميم الزجاج الشفاف */
                .glass-card { 
                    background: rgba(255, 255, 255, 0.03); 
                    backdrop-filter: blur(20px); 
                    border: 1px solid rgba(255, 255, 255, 0.08); 
                    border-radius: 30px; 
                    padding: 40px; 
                    width: 320px; 
                    text-align: center;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                }

                .pulse-anim { width: 50px; height: 50px; border: 1px solid #00f2fe; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; position: relative; }
                .pulse-anim::after { content: ''; position: absolute; width: 100%; height: 100%; border: inherit; border-radius: inherit; animation: wave 2s infinite; }
                @keyframes wave { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }

                .input-style { width: 100%; padding: 15px; margin: 15px 0; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 12px; text-align: center; }
                .btn-exec { width: 100%; padding: 18px; background: #00f2fe; color: #0d1117; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; font-size: 16px; }
                
                footer { padding: 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
                .footer-link { color: #58a6ff; font-size: 12px; margin: 0 15px; cursor: pointer; text-decoration: none; }
            </style>
        </head>
        <body>
            <div class="test-env">LAB_ENVIRONMENT: DEV_MODE</div>
            <div class="main-ui">
                <div class="glass-card">
                    <div class="pulse-anim"><div style="width:10px; height:10px; background:#00f2fe; border-radius:50%;"></div></div>
                    <h1 style="margin:0; font-size:24px; letter-spacing:3px;">نَـبْـضَـة</h1>
                    <p style="font-size:10px; color:#8b949e; margin-bottom:30px;">SOVEREIGN OPERATING SYSTEM</p>
                    
                    <form action="/" method="POST">
                        <input type="text" class="input-style" placeholder="قيمة النبضة: 80 LYD" readonly>
                        <button type="submit" class="btn-exec">بدء التفعيل ⚡</button>
                    </form>
                </div>
            </div>
            <footer>
                <a class="footer-link" onclick="alert('800 -> 8000 (Value Logic)')">لماذا؟</a>
                <a class="footer-link" onclick="alert('Sovereign Central Vault System')">لمحة</a>
            </footer>
        </body>
        </html>
    `);
});
server.listen(port);
