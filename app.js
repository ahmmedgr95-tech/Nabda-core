const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const port = process.env.PORT || 8080;

const dbPath = path.resolve(__dirname, 'nabda.db');
const db = new sqlite3.Database(dbPath);

// إنشاء قاعدة البيانات والجداول
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, service TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP)`);
});

const server = http.createServer((req, res) => {
    let body = '';
    if (req.method === 'POST') {
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const action = params.get('action');

            // --- نظام تسجيل الدخول للوحة التحكم ---
            if (action === 'login') {
                const pass = params.get('password');
                if (pass === 'Nabda2026Secure') { // كلمة السر الجديدة
                    db.all('SELECT * FROM users ORDER BY date DESC', [], (err, rows) => {
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                        let list = rows.map(u => `<div style="display:grid; grid-template-columns:1fr 1fr 1fr; padding:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-family:monospace;"><div>${u.name}</div><div>${u.phone}</div><div style="color:#00f2fe">${u.service}</div></div>`).join('');
                        res.end(`
                            <div dir="rtl" style="background:#0a0f1e; color:white; padding:20px; font-family:sans-serif; min-height:100vh;">
                                <h2 style="color:#00f2fe; text-align:center;">📊 مركز بيانات نبضة السيادي</h2>
                                <div style="max-width:800px; margin:auto; background:rgba(255,255,255,0.05); border-radius:15px; overflow:hidden; border:1px solid #00f2fe;">
                                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; padding:12px; background:rgba(0,242,254,0.1); font-weight:bold; color:#00f2fe;"><div>الاسم</div><div>الهاتف</div><div>الوسيلة</div></div>
                                    ${list || '<p style="padding:20px; text-align:center;">لا يوجد مسجلون حالياً</p>'}
                                </div>
                                <br><a href="/" style="color:#8a2be2; text-decoration:none; display:block; text-align:center;">خروج آمن</a>
                            </div>`);
                    });
                } else {
                    res.end('<h1 style="text-align:center; color:red; font-family:sans-serif; margin-top:50px;">Access Denied: Incorrect Key</h1><br><center><a href="/">Back</a></center>');
                }
                return;
            }

            // --- تسجيل مستخدم جديد ---
            const name = params.get('name');
            const phone = params.get('phone');
            const service = params.get('service');
            const stmt = db.prepare('INSERT INTO users (name, phone, service) VALUES (?, ?, ?)');
            stmt.run(name, phone, service);
            stmt.finalize();

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<div dir="rtl" style="background:#0a0f1e; color:white; text-align:center; padding-top:100px; font-family:sans-serif; height:100vh;">
                <h1 style="color:#00f2fe;">✅ تم تفعيل نبضتك بنجاح!</h1>
                <p>أهلاً بك في الجيل القادم من الأنظمة السيادية.</p>
                <a href="/" style="color:#8a2be2; text-decoration:none;">العودة للرئيسية</a>
            </div>`);
        });
        return;
    }

    // --- الواجهة الأمامية الرئيسية (التصميم الاحترافي) ---
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>NABDA | النظام السيادي</title>
            <style>
                :root { --bg: #0d1117; --primary: #58a6ff; --cyan: #00f2fe; --purple: #8a2be2; }
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; background: var(--bg); color: #c9d1d9; margin: 0; padding: 20px; }
                
                .main-container { max-width: 500px; margin: auto; animation: slideIn 0.8s ease; }
                @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                /* التصميم العلوي والشعار */
                .logo-section { text-align: center; margin-bottom: 30px; }
                .pulse-box { width: 80px; height: 80px; margin: auto; border: 2px solid var(--cyan); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(0,242,254,0.2); }
                .pulse-wave { width: 40px; height: 10px; background: linear-gradient(90deg, transparent, var(--cyan), transparent); animation: wave 2s infinite linear; }
                @keyframes wave { 0% { transform: scaleX(0.5); opacity: 0; } 50% { opacity: 1; } 100% { transform: scaleX(2); opacity: 0; } }

                /* نظام التبويبات Replit Style */
                .tabs { display: flex; background: #161b22; border-radius: 12px; padding: 5px; margin-bottom: 20px; border: 1px solid #30363d; }
                .tab-btn { flex: 1; padding: 10px; border: none; background: none; color: #8b949e; cursor: pointer; border-radius: 8px; font-weight: bold; transition: 0.3s; font-size: 13px; }
                .tab-btn.active { background: #21262d; color: var(--cyan); box-shadow: 0 4px 10px rgba(0,0,0,0.3); }

                .content-box { background: #161b22; border: 1px solid #30363d; border-radius: 16px; padding: 25px; min-height: 250px; }
                .tab-content { display: none; animation: fadeIn 0.4s ease; }
                .tab-content.active { display: block; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                /* الفورم والمدخلات */
                input, select { width: 100%; padding: 12px; margin: 8px 0; border-radius: 8px; border: 1px solid #30363d; background: #0d1117; color: white; box-sizing: border-box; }
                button { width: 100%; padding: 15px; margin-top: 15px; border-radius: 8px; border: none; background: var(--cyan); color: #0d1117; font-weight: bold; cursor: pointer; transition: 0.3s; }
                button:hover { filter: brightness(1.2); transform: translateY(-2px); }

                .hint { font-size: 11px; color: #8b949e; margin-bottom: 5px; font-family: monospace; display: block; }
            </style>
        </head>
        <body>
            <div class="main-container">
                <div class="logo-section">
                    <div class="pulse-box"><div class="pulse-wave"></div></div>
                    <h1 style="color:white; margin:10px 0 5px 0;">نَـبْـضَـة</h1>
                    <span style="font-family:monospace; color:var(--cyan); font-size:12px;">SYSTEM_STATUS: OPERATIONAL</span>
                </div>

                <div class="tabs">
                    <button class="tab-btn active" onclick="showTab('join')">انضمام</button>
                    <button class="tab-btn" onclick="showTab('why')">لماذا نبضة؟</button>
                    <button class="tab-btn" onclick="showTab('about')">لمحة</button>
                </div>

                <div class="content-box">
                    <div id="join" class="tab-content active">
                        <form action="/" method="POST">
                            <span class="hint">> ENTER_FULL_NAME</span>
                            <input type="text" name="name" placeholder="الاسم الكريم" required>
                            
                            <span class="hint">> LINK_PHONE_NUMBER</span>
                            <input type="tel" name="phone" placeholder="رقم الهاتف" required>
                            
                            <span class="hint">> SELECT_PAYMENT_GATEWAY</span>
                            <select name="service" required>
                                <option value="" disabled selected>اختر وسيلة الدفع</option>
                                <option value="مصرف النوران">مصرف النوران</option>
                                <option value="سداد">سداد (Sadad)</option>
                                <option value="موبي كاش">موبي كاش</option>
                            </select>
                            <button type="submit">تأكيد التفعيل الرقمي ⚡</button>
                        </form>
                    </div>

                    <div id="why" class="tab-content">
                        <h3 style="color:var(--cyan)">السيادة الرقمية</h3>
                        <p style="font-size:14px; line-height:1.6;">نبضة ليس مجرد تطبيق، بل هو حجر الأساس لبناء هوية مالية مستقلة. نهدف لتسهيل الوصول للخدمات المصرفية الليبية بأحدث تقنيات الربط العالمي.</p>
                        <ul style="font-size:12px; color:var(--cyan); font-family:monospace;">
                            <li>+ أمان عالي</li>
                            <li>+ ربط مباشر</li>
                            <li>+ خصوصية تامة</li>
                        </ul>
                    </div>

                    <div id="about" class="tab-content">
                        <h3 style="color:var(--purple)">مشروع نبضة</h3>
                        <p style="font-size:14px; line-height:1.6;">بدأت الرحلة من فكرة لتمكين المستخدم من التحكم في نبضاته المالية. نحن نطور محركاً ذكياً يربط بين البنوك والمستخدمين بذكاء اصطناعي سيادي.</p>
                        <hr border="0" style="border-top:1px solid #30363d">
                        <form action="/" method="POST">
                            <input type="hidden" name="action" value="login">
                            <span class="hint">> ADMIN_PORTAL_KEY</span>
                            <input type="password" name="password" placeholder="كلمة سر الإدارة">
                            <button type="submit" style="background:none; color:var(--purple); border:1px solid var(--purple); padding:8px; font-size:12px;">دخول الإدارة</button>
                        </form>
                    </div>
                </div>

                <div style="text-align:center; margin-top:20px; font-size:10px; color:#8b949e; font-family:monospace;">
                    &copy; 2026 NABDA SOVEREIGN CORE | V1.0.2
                </div>
            </div>

            <script>
                function showTab(tabId) {
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    document.getElementById(tabId).classList.add('active');
                    event.currentTarget.classList.add('active');
                }
            </script>
        </body>
        </html>
    `);
});

server.listen(port);
