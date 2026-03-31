// إعدادات الاستراتيجية المالية (الموجة الأولى)
const STRATEGY = {
    ENTRY_FEE: 80,          // دفع 80 دينار
    TARGET_PER_USER: 500,   // المحصل 500
    DISCOUNT_PROTOCOL: 160, // خصم 160
    NET_PROFIT: 340,        // صافي 340
    WAVE_SIZE: 10,          // سعة الموجة 10 رواد
    ZERO_MULTIPLIER: 10     // معامل القيمة الصفرية
};

async function processWaveStrategy(currentUserId) {
    try {
        // 1. حساب عدد الرواد الحاليين في هذه الموجة من قاعدة البيانات
        const countRes = await pool.query('SELECT COUNT(*) FROM entrepreneurs WHERE status = $1', ['Active']);
        const currentCount = parseInt(countRes.rows[0].count);

        // 2. تطبيق الحسابات المالية لكل رائد
        const userFinancials = {
            fee: STRATEGY.ENTRY_FEE,
            total: STRATEGY.TARGET_PER_USER,
            discount: STRATEGY.DISCOUNT_PROTOCOL,
            net: STRATEGY.NET_PROFIT
        };

        console.log(`رائد الأعمال رقم ${currentCount} دخل المنظومة بـ ${userFinancials.fee} د.ل`);

        // 3. التحقق: هل وصلنا للرقم 10؟ (إغلاق الموجة)
        if (currentCount >= STRATEGY.WAVE_SIZE) {
            
            // حساب القيمة الصفرية للموجة بالكامل
            const waveTotalInput = STRATEGY.ENTRY_FEE * STRATEGY.WAVE_SIZE; // 800
            const finalPulseValue = waveTotalInput * STRATEGY.ZERO_MULTIPLIER; // 8,000

            console.log("⚠️ تم اكتمال النصاب (10 رواد). تفعيل القيمة الصفرية: 8,000 د.ل");

            // 4. تحديث حالة الموجة في قاعدة البيانات
            await pool.query("UPDATE entrepreneurs SET status = 'Completed' WHERE status = 'Active'");
            
            // 5. تفعيل الموجة الثانية مباشرة
            console.log("🚀 تم إغلاق الموجة الأولى وفتح الموجة الثانية آلياً.");
            
            return {
                status: "Wave_Closed",
                finalValue: finalPulseValue,
                nextWave: 2
            };
        }

        return {
            status: "In_Progress",
            count: currentCount,
            financials: userFinancials
        };

    } catch (err) {
        console.error("خطأ في معالجة الاستراتيجية:", err);
    }
}
