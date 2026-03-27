// موديول المنطق الحسابي (Logic Module)
function calculatePulse(waveSize) {
    const initial = waveSize * 80; // 800
    const zeroValue = initial * 10; // 8,000 (القيمة الصفرية)
    const operational = 5000;
    const traditionalDisc = 160;
    const payout = 340 * waveSize; // 3,400
    const centralVault = zeroValue - payout; // 4,600 (الفائض)
    return { payout: 340, vault: centralVault };
}

// موديول الواجهة الزجاجية (Glass UI)
const glassStyle = `
    .glass-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 25px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }
    /* شارة النبض المتحركة */
    .pulse-glow {
        width: 12px; height: 12px; background: #00f2fe;
        border-radius: 50%; box-shadow: 0 0 15px #00f2fe;
        animation: pulse-ring 1.5s infinite;
    }
    @keyframes pulse-ring { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(3); opacity: 0; } }
`;
