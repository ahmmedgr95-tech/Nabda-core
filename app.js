// قواعد النموذج المرجعي للموجة الأولى في نبضة.
// هذه الأرقام للحساب المرجعي؛ لا تنشئ وحدها قيود دفتر أو تسوية.
const STRATEGY = Object.freeze({
    REFERENCE_CURRENCY: "USD",
    CONTRIBUTION_PER_USER: 80,
    WAVE_SIZE: 10,
    GENERATION_MULTIPLIER: 10,
    DISTRIBUTION_OBLIGATION_PER_USER: 340,
    OPERATING_RESERVE_PER_USER: 160
});

function deriveWaveTotals() {
    const contributionTotal = STRATEGY.CONTRIBUTION_PER_USER * STRATEGY.WAVE_SIZE;
    const generatedValue = contributionTotal * STRATEGY.GENERATION_MULTIPLIER;
    const distributionObligations =
        STRATEGY.DISTRIBUTION_OBLIGATION_PER_USER * STRATEGY.WAVE_SIZE;
    const operatingReserve =
        STRATEGY.OPERATING_RESERVE_PER_USER * STRATEGY.WAVE_SIZE;
    const treasuryRemainder = generatedValue - distributionObligations;
    const generativeCreditBase = treasuryRemainder - operatingReserve;

    if (
        contributionTotal !== 800 ||
        generatedValue !== 8000 ||
        distributionObligations !== 3400 ||
        treasuryRemainder !== 4600 ||
        operatingReserve !== 1600 ||
        generativeCreditBase !== 3000
    ) {
        throw new Error("NABDA reference wave arithmetic invariant failed");
    }

    return Object.freeze({
        contributionTotal,
        generatedValue,
        distributionObligations,
        operatingReserve,
        treasuryRemainder,
        generativeCreditBase
    });
}

async function processWaveStrategy(currentUserId) {
    try {
        // يحسب هذا النموذج عدد المشاركين من مصدر قاعدة البيانات الداخلي.
        const countRes = await pool.query(
            "SELECT COUNT(*) FROM entrepreneurs WHERE status = $1",
            ["Active"]
        );
        const currentCount = Number.parseInt(countRes.rows[0].count, 10);

        const userFinancials = {
            contribution: STRATEGY.CONTRIBUTION_PER_USER,
            distributionObligation: STRATEGY.DISTRIBUTION_OBLIGATION_PER_USER,
            operatingReserve: STRATEGY.OPERATING_RESERVE_PER_USER,
            currency: STRATEGY.REFERENCE_CURRENCY
        };

        console.log(
            `المشارك رقم ${currentCount} — مساهمة مرجعية: ${userFinancials.contribution} ${STRATEGY.REFERENCE_CURRENCY}`
        );

        if (currentCount >= STRATEGY.WAVE_SIZE) {
            const waveTotals = deriveWaveTotals();

            console.log(
                `اكتملت الموجة: قيمة مولّدة ${waveTotals.generatedValue} ${STRATEGY.REFERENCE_CURRENCY}، والمتبقي ${waveTotals.treasuryRemainder} ${STRATEGY.REFERENCE_CURRENCY}`
            );

            // هذا التحديث التشغيلي لا ينشئ قيدًا ماليًا ولا يثبت تسوية.
            await pool.query(
                "UPDATE entrepreneurs SET status = 'Completed' WHERE status = 'Active'"
            );

            return {
                status: "Wave_Closed",
                currency: STRATEGY.REFERENCE_CURRENCY,
                waveTotals,
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
        throw err;
    }
}
