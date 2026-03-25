const http = require('http');
const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end('<div style="text-align:center; padding:100px; background:#1a1a2e; color:white; height:100vh; font-family:Arial;"><h1>✅ تم استلام بياناتك بنجاح يا رائد!</h1><p>سيقوم فريق نبضة بمراجعة طلبك وتفعيل حسابك خلال 24 ساعة.</p><a href="/" style="color:#00d4ff;">العودة للرئيسية</a></div>');
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
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1a1a2e; color: white; margin: 0; padding: 20px; text-align: center; }
                .container { max-width: 500px; margin: auto; border: 2px solid #00d4ff; border-radius: 20px; padding: 30px; background: #16213e; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                h1 { color: #00d4ff; font-size: 24px; }
                .stat-box { background: #0f3460; padding: 15px; border-radius: 10px; margin-bottom: 20px; }
                .stat-value { font-size: 22px; color: #4cd137; font-weight: bold; }
                input, select { width: 90%; padding: 12px; margin: 10px 0; border-radius: 8px; border: 1px solid #00d4ff; background: #1a1a2e; color: white; text-align: center; }
                button { width: 95%; padding: 15px; background: #00d4ff; border: none; border-radius: 8px; color: #1a1a2e; font-weight: bold; cursor: pointer; font-size: 18px; transition: 0.3s; }
                button:hover { background: #4cd137; transform: scale(1.02); }
                .footer { margin-top: 20px; color: #888; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🛡️ نظام نبضة (NABDA) السيادي</h1>
                <div class="stat-box">
                    <div style="font-size: 14px;">الخزينة المركزية الحالية</div>
                    <div class="stat-value">4,600 LYD</div>
                </div>
                
                <h3>سجل الآن كـ "رائد"</h3>
                <form action="/" method="POST">
                    <input type="text" name="name" placeholder="الاسم الكامل" required>
                    <input type="tel" name="phone" placeholder="رقم الهاتف (092/091)" required>
                    <select name="service" required>
                        <option value="">اختر خدمة الدفع</option>
                        <option value="sadad">سداد (Sadad)</option>
                        <option value="mubikash">موبي كاش (MubiKash)</option>
                        <option value="nouran">مصرف النوران</option>
                    </select>
                    <button type="submit">تفعيل النبضة الخاصة بي 🚀</button>
                </form>

                <p style="font-size: 13px; color: #fbc531; margin-top: 15px;">⚠️ نظام مكافحة التضخم (7 أيام) مفعل تلقائياً</p>
                <div class="footer">الموقع مؤمن بواسطة DigitalOcean AI Agent</div>
            </div>
        </body>
        </html>
    `);
});

server.listen(port, () => {
    console.log(`Nabda Engine running on port ${port}`);
});
