// داخل دالة التسجيل في app.js
const entryFee = 80; // الدفع المبدئي
const totalTarget = 500; // المحصل النهائي
const discount = 160; // بروتوكول الخصم
const netProfit = totalTarget - discount; // صافي الربح (340)

// القيمة الصفرية (عند اكتمال 10 رواد)
const waveTotal = entryFee * 10; // 800
const zeroValueResult = waveTotal * 10; // 8,000 (بإضافة الصفر)
