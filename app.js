// ... (إعدادات السيرفر وقاعدة البيانات السابقة تبقى كما هي) ...

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>NABDA | المحرك السيادي</title>
            <style>
                :root { --bg: #0d1117; --card-bg: #161b22; --accent: #00f2fe; --text-dim: #8b949e; }
                body { background: var(--bg); color: #c9d1d9; font-family: 'Segoe UI', system-ui, sans-serif; margin: 0; display: flex; flex-direction: column; min-height: 100vh; }
                
                .main-ui { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
                
                /* الشعار العلوي */
                .header-logo { text-align: center; margin-bottom: 40px; }
                .pulse-icon { width: 60px; height: 60px; border: 2px solid var(--accent); border-radius: 15px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(0,242,254,0.1); }
                
                /* التبويبات الرئيسية (منطق التفعيل فقط) */
                .action-tabs { display: flex; background: var(--card-bg); padding: 5px; border-radius: 12px; border: 1px solid #30363d; width: 100%; max-width: 400px; margin-bottom: 20px; }
                .tab-btn { flex: 1; padding: 12px; border: none; background: none; color: var(--text-dim); cursor: pointer; border-radius: 8px; font-weight: bold; font-size: 14px; transition: 0.3s; }
                .tab-btn.active { background: var(--accent); color: #0d1117; }

                /* صندوق المحرك الرئيسي */
                .engine-card { background: var(--card-bg); border: 1px solid #30363d; border-radius: 20px; width: 100%; max-width: 400px; padding: 30px; box-sizing: border-box; }
                
                input, select { width: 100%; padding: 14px; margin: 10px 0; background: var(--bg); border: 1px solid #30363d; color: white; border-radius: 8px; font-size: 16px; box-sizing: border-box; }
                .submit-pulse { width: 100%; padding: 16px; background: var(--accent); border: none; border-radius: 10px; color: #0d1117; font-weight: bold; font-size: 18px; cursor: pointer; margin-top: 15px; }

                /* منطقة الشرح (مخفية/صغيرة في الأسفل) */
                footer { padding: 30px 20px; border-top: 1px solid #30363d; text-align: center; background: #090c10; }
                .footer-nav { display: flex; justify-content: center; gap: 30px; margin-bottom: 15px; }
                .secondary-link { color: var(--text-dim); text-decoration: none; font-size: 13px; cursor: pointer; background:none; border:none; border-bottom: 1px solid transparent; }
                .secondary-link:hover { color: var(--accent); border-bottom: 1px solid var(--accent); }
                
                /* النافذة المنبثقة للشرح الهادئ */
                .info-panel { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 450px; background: var(--card-bg); border: 1px solid var(--accent); padding: 30px; border-radius: 20px; z-index: 1000; box-shadow: 0 0 50px rgba(0,0,0,0.8); }
                .overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 999; }
            </style>
        </head>
        <body>
            <div class="main-ui">
                <div class="header-logo">
                    <div class="pulse-icon"><div style="width:25px; height:2px; background:var(--accent); box-shadow: 0 0 10px var(--accent);"></div></div>
                    <h1 style="color:white; margin:0; font-size:24px; letter-spacing:2px;">نَـبْـضَـة</h1>
                </div>

                <div class="action-tabs">
                    <button class="tab-btn active" onclick="switchMode('personal')">تفعيل فردي</button>
                    <button class="tab-btn" onclick="switchMode('business')">مؤسسات</button>
                </div>

                <div class="engine-card">
                    <form action="/" method="POST">
                        <div id="dynamic-fields">
                            <label style="color:var(--accent); font-size:10px; font-family:monospace;">> IDENTITY_INPUT</label>
                            <input type="text" name="name" placeholder="الاسم الرباعي" required>
                            
                            <label style="color:var(--accent); font-size:10px; font-family:monospace;">> CHANNEL_SELECT</label>
                            <select name="service">
                                <option>مصرف النوران</option>
                                <option>سداد</option>
                                <option>موبي كاش</option>
                            </select>
                        </div>
                        <button type="submit" class="submit-pulse">تفعيل الآن ⚡</button>
                    </form>
                </div>
            </div>

            <footer>
                <div class="footer-nav">
                    <button class="secondary-link" onclick="openInfo('why')">لماذا نبضة؟</button>
                    <button class="secondary-link" onclick="openInfo('about')">لمحة عن المشروع</button>
                </div>
                <p style="font-size:10px; color:#555; font-family:monospace;">CORE_ID: NB-2026-LY | GLOBAL_ACCESS</p>
            </footer>

            <div id="overlay" class="overlay" onclick="closeInfo()"></div>
            <div id="info-panel" class="info-panel">
                <div id="info-content"></div>
                <button onclick="closeInfo()" style="margin-top:20px; width:100%; padding:10px; background:#30363d; color:white; border:none; border-radius:8px; cursor:pointer;">فهمت</button>
            </div>

            <script>
                function switchMode(mode) {
                    const btns = document.querySelectorAll('.tab-btn');
                    btns.forEach(b => b.classList.remove('active'));
                    event.currentTarget.classList.add('active');
                    const fields = document.getElementById('dynamic-fields');
                    if(mode === 'business') {
                        fields.innerHTML = '<label style="color:var(--accent); font-size:10px; font-family:monospace;">> BIZ_NAME</label><input type="text" name="name" placeholder="اسم الشركة / المؤسسة" required><label style="color:var(--accent); font-size:10px; font-family:monospace;">> BIZ_ID</label><input type="text" name="id" placeholder="رقم السجل التجاري" required>';
                    } else {
                        fields.innerHTML = '<label style="color:var(--accent); font-size:10px; font-family:monospace;">> IDENTITY_INPUT</label><input type="text" name="name" placeholder="الاسم الرباعي" required><label style="color:var(--accent); font-size:10px; font-family:monospace;">> CHANNEL_SELECT</label><select name="service"><option>مصرف النوران</option><option>سداد</option><option>موبي كاش</option></select>';
                    }
                }

                function openInfo(type) {
                    const p = document.getElementById('info-panel');
                    const o = document.getElementById('overlay');
                    const c = document.getElementById('info-content');
                    if(type === 'why') {
                        c.innerHTML = '<h3 style="color:var(--accent)">لماذا نبضة؟</h3><p style="font-size:14px; line-height:1.6;">لأننا نقدم الجيل القادم من التفاعل الرقمي في ليبيا، بتركيز كامل على السرعة والسيادة التقنية للمستخدم.</p>';
                    } else {
                        c.innerHTML = '<h3 style="color:var(--accent)">لمحة عن المشروع</h3><p style="font-size:14px; line-height:1.6;">نبضة هو محرك ذكي صُمم ليكون الجسر بين البنوك والمشتركين، بأقل مجهود وأعلى أمان.</p>';
                    }
                    p.style.display = 'block'; o.style.display = 'block';
                }

                function closeInfo() {
                    document.getElementById('info-panel').style.display = 'none';
                    document.getElementById('overlay').style.display = 'none';
                }
            </script>
        </body>
        </html>
    `);
