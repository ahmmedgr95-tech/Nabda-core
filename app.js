// ... (إعدادات السيرفر وقاعدة البيانات السابقة تبقى كما هي دون تغيير) ...

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>NABDA | ENGINE</title>
            <style>
                :root { --bg: #0d1117; --accent: #00f2fe; --card: #161b22; --text: #c9d1d9; }
                body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', system-ui; margin: 0; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
                
                /* الواجهة المركزية - لوحة التحكم الفورية */
                .dashboard { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
                
                .logo-area { text-align: center; margin-bottom: 30px; }
                .logo-box { width: 50px; height: 50px; border: 2px solid var(--accent); border-radius: 12px; margin: auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(0,242,254,0.1); }
                
                /* أزرار المنطق البرمجي (خيارات التفعيل فقط) */
                .logic-tabs { display: flex; background: var(--card); padding: 4px; border-radius: 10px; border: 1px solid #30363d; width: 100%; max-width: 360px; margin-bottom: 15px; }
                .logic-btn { flex: 1; padding: 10px; border: none; background: none; color: #8b949e; cursor: pointer; border-radius: 7px; font-weight: bold; font-size: 13px; transition: 0.2s; }
                .logic-btn.active { background: var(--accent); color: #0d1117; }

                /* صندوق الإدخال (The Engine) */
                .engine-box { background: var(--card); border: 1px solid #30363d; border-radius: 16px; width: 100%; max-width: 360px; padding: 25px; box-sizing: border-box; }
                
                input, select { width: 100%; padding: 12px; margin: 8px 0; background: var(--bg); border: 1px solid #30363d; color: white; border-radius: 8px; outline: none; box-sizing: border-box; }
                .exec-btn { width: 100%; padding: 14px; background: var(--accent); border: none; border-radius: 8px; color: #0d1117; font-weight: bold; cursor: pointer; margin-top: 10px; font-size: 16px; }

                /* القبو (Footer) - تذييل الصفحة الهادئ */
                footer { padding: 15px; border-top: 1px solid #30363d; background: #090c10; display: flex; justify-content: space-between; align-items: center; }
                .footer-links { display: flex; gap: 15px; }
                .f-btn { background: none; border: none; color: #58a6ff; font-size: 11px; cursor: pointer; text-decoration: none; padding: 0; }
                .status-tag { font-family: monospace; font-size: 9px; color: #444; }

                /* النافذة المنبثقة للهوامش */
                .modal-info { display: none; position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 340px; background: #1c2128; border: 1px solid var(--accent); border-radius: 12px; padding: 20px; z-index: 100; box-shadow: 0 -10px 40px rgba(0,0,0,0.6); animation: slideUp 0.3s; }
                @keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
            </style>
        </head>
        <body>
            <div class="dashboard">
                <div class="logo-area">
                    <div class="logo-box"><div style="width:20px; height:1px; background:var(--accent); box-shadow:0 0 10px var(--accent);"></div></div>
                    <h2 style="margin:10px 0 0 0; letter-spacing:1px; color:white; font-size:20px;">نَـبْـضَـة</h2>
                </div>

                <div class="logic-tabs">
                    <button class="logic-btn active" onclick="setLogic('personal')">تفعيل فردي</button>
                    <button class="logic-btn" onclick="setLogic('business')">تفعيل مؤسسات</button>
                </div>

                <div class="engine-box">
                    <form action="/" method="POST">
                        <div id="logic-fields">
                            <label style="font-size:9px; color:var(--accent); font-family:monospace;">> USER_NAME</label>
                            <input type="text" name="name" placeholder="الاسم الكامل" required>
                            
                            <label style="font-size:9px; color:var(--accent); font-family:monospace;">> GATEWAY</label>
                            <select name="service">
                                <option>مصرف النوران</option>
                                <option>سداد</option>
                                <option>موبي كاش</option>
                            </select>
                        </div>
                        <button type="submit" class="exec-btn">تأكيد الارتباط ⚡</button>
                    </form>
                </div>
            </div>

            <footer>
                <div class="status-tag">NB-CORE v1.2 // SECURE</div>
                <div class="footer-links">
                    <button class="f-btn" onclick="toggleInfo('why')">لماذا نبضة؟</button>
                    <button class="f-btn" onclick="toggleInfo('about')">لمحة عن المشروع</button>
                </div>
            </footer>

            <div id="modal" class="modal-info">
                <div id="modal-body" style="font-size:13px; line-height:1.5;"></div>
                <button onclick="this.parentElement.style.display='none'" style="margin-top:15px; width:100%; padding:5px; background:#30363d; color:white; border:none; border-radius:5px; cursor:pointer;">إغلاق</button>
            </div>

            <script>
                function setLogic(mode) {
                    const btns = document.querySelectorAll('.logic-btn');
                    btns.forEach(b => b.classList.remove('active'));
                    event.currentTarget.classList.add('active');
                    const fields = document.getElementById('logic-fields');
                    if(mode === 'business') {
                        fields.innerHTML = '<label style="font-size:9px; color:var(--accent); font-family:monospace;">> BIZ_TITLE</label><input type="text" name="name" placeholder="اسم الشركة" required><label style="font-size:9px; color:var(--accent); font-family:monospace;">> REG_NUMBER</label><input type="text" name="id" placeholder="رقم القيد التجاري" required>';
                    } else {
                        fields.innerHTML = '<label style="font-size:9px; color:var(--accent); font-family:monospace;">> USER_NAME</label><input type="text" name="name" placeholder="الاسم الكامل" required><label style="font-size:9px; color:var(--accent); font-family:monospace;">> GATEWAY</label><select name="service"><option>مصرف النوران</option><option>سداد</option><option>موبي كاش</option></select>';
                    }
                }

                function toggleInfo(type) {
                    const m = document.getElementById('modal');
                    const b = document.getElementById('modal-body');
                    m.style.display = 'block';
                    if(type === 'why') {
                        b.innerHTML = '<b style="color:var(--accent)">لماذا نبضة؟</b><p>محرك سيادي لتبسيط التحقق المالي الرقمي في السوق الليبي بخصوصية تامة.</p>';
                    } else {
                        b.innerHTML = '<b style="color:var(--accent)">لمحة</b><p>نظام ذكي يربط بين بياناتك المصرفية واحتياجاتك التقنية بضغطة زر واحدة.</p>';
                    }
                }
            </script>
        </body>
        </html>
    `);
