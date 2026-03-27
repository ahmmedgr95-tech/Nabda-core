// ... (نفس إعدادات السيرفر وقاعدة البيانات السابقة) ...

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>NABDA | المحرك السيادي</title>
            <style>
                body { background: #0d1117; color: #c9d1d9; font-family: 'Segoe UI', sans-serif; margin: 0; display: flex; flex-direction: column; min-height: 100vh; }
                .container { max-width: 480px; margin: auto; padding: 20px; flex: 1; }
                
                /* خيارات التفعيل - المنطق الرئيسي */
                .activation-tabs { display: flex; gap: 8px; margin-bottom: 20px; background: #161b22; padding: 5px; border-radius: 12px; border: 1px solid #30363d; }
                .act-btn { flex: 1; padding: 12px; border: none; background: none; color: #8b949e; cursor: pointer; border-radius: 8px; font-weight: bold; font-size: 13px; transition: 0.3s; }
                .act-btn.active { background: #00f2fe; color: #0d1117; box-shadow: 0 0 15px rgba(0,242,254,0.3); }

                .card { background: #161b22; border: 1px solid #30363d; border-radius: 20px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.4); }
                
                /* أسفل الصفحة - تبويبات المعلومات */
                footer { background: #090c10; padding: 20px; border-top: 1px solid #30363d; text-align: center; }
                .info-links { display: flex; justify-content: center; gap: 20px; margin-bottom: 10px; }
                .info-btn { background: none; border: none; color: #58a6ff; cursor: pointer; font-size: 14px; text-decoration: underline; }
                
                .modal { display: none; position: fixed; bottom: 0; left: 0; width: 100%; background: #161b22; border-top: 2px solid #00f2fe; padding: 25px; box-sizing: border-box; animation: slideUp 0.4s; }
                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
            </style>
        </head>
        <body>
            <div class="container">
                <div style="text-align:center; margin-bottom:30px;">
                    <h1 style="color:white; font-size:32px; margin:0;">نَـبْـضَـة</h1>
                    <code style="color:#00f2fe; font-size:11px;">[ CORE_LOGIC_ACTIVE ]</code>
                </div>

                <div class="activation-tabs">
                    <button class="act-btn active" onclick="switchMode('personal')">نبضة فردية</button>
                    <button class="act-btn" onclick="switchMode('business')">مؤسسات</button>
                </div>

                <div class="card">
                    <form action="/" method="POST">
                        <div id="form-content">
                            <label style="color:#00f2fe; font-size:11px;">> بيانات الهوية</label>
                            <input type="text" name="name" placeholder="الاسم الكامل" style="width:100%; padding:12px; margin:10px 0; background:#0d1117; border:1px solid #30363d; color:white; border-radius:8px;" required>
                            
                            <label style="color:#00f2fe; font-size:11px;">> قناة الارتباط</label>
                            <select name="service" style="width:100%; padding:12px; margin:10px 0; background:#0d1117; border:1px solid #30363d; color:white; border-radius:8px;">
                                <option>مصرف النوران</option>
                                <option>سداد</option>
                                <option>موبي كاش</option>
                            </select>
                        </div>
                        <button type="submit" style="width:100%; padding:15px; background:#00f2fe; border:none; border-radius:10px; font-weight:bold; margin-top:15px; cursor:pointer;">إرسال الموجة ⚡</button>
                    </form>
                </div>
            </div>

            <footer>
                <div class="info-links">
                    <button class="info-btn" onclick="showModal('why')">لماذا نبضة؟</button>
                    <button class="info-btn" onclick="showModal('about')">لمحة عن المشروع</button>
                </div>
                <div style="font-size:10px; color:#8b949e; font-family:monospace;">&copy; 2026 NABDA SOVEREIGN ENGINE</div>
            </footer>

            <div id="info-modal" class="modal">
                <div id="modal-text"></div>
                <button onclick="closeModal()" style="margin-top:20px; background:#30363d; color:white; border:none; padding:8px 20px; border-radius:5px;">إغلاق</button>
            </div>

            <script>
                function switchMode(mode) {
                    const btns = document.querySelectorAll('.act-btn');
                    btns.forEach(b => b.classList.remove('active'));
                    event.currentTarget.classList.add('active');
                    // هنا يمكننا تغيير الحقول بناءً على نوع التفعيل (فردي أو مؤسسات)
                }

                function showModal(type) {
                    const m = document.getElementById('info-modal');
                    const txt = document.getElementById('modal-text');
                    if(type === 'why') {
                        txt.innerHTML = "<h3 style='color:#00f2fe'>لماذا نبضة؟</h3><p>لأننا نؤمن بالسيادة الرقمية الليبية وتوفير أسرع الطرق للتحقق المالي.</p>";
                    } else {
                        txt.innerHTML = "<h3 style='color:#00f2fe'>لمحة عن المشروع</h3><p>نبضة هو محرك ذكي يربط بين تكنولوجيا الـ Fintech والاحتياجات المحلية.</p>";
                    }
                    m.style.display = 'block';
                }

                function closeModal() { document.getElementById('info-modal').style.display = 'none'; }
            </script>
        </body>
        </html>
    `);

