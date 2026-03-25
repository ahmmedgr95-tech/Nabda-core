const http = require('http');
const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
        <div style="font-family: Arial; text-align: center; padding: 50px; background: #1a1a2e; color: white; height: 100vh;">
            <h1 style="color: #00d4ff;">🛡️ نظام نبضة (NABDA) السيادي</h1>
            <div style="border: 2px solid #00d4ff; display: inline-block; padding: 20px; border-radius: 15px; background: #16213e;">
                <h3>حالة الخزينة المركزية</h3>
                <h2 style="color: #4cd137;">4,600 LYD (مؤمنة)</h2>
                <hr style="border: 0.5px solid #00d4ff;">
                <h3>استحقاق الرائد القادم</h3>
                <h2 style="color: #fbc531;">340 LYD</h2>
            </div>
            <p style="margin-top: 30px; font-size: 1.2em;">نظام مكافحة التضخم (7 أيام) مفعل ✅</p>
            <p style="color: #888;">نظام ذكي يعمل عبر DigitalOcean AI App Platform</p>
        </div>
    `);
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
