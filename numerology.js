// ==========================================
// 1. NUMEROLOGY LOGIC FUNCTIONS
// ==========================================

function isMasterNumber(num) {
    return [11, 22, 33].includes(num);
}

function sumDigits(num) {
    return String(num).split('').reduce((acc, curr) => acc + parseInt(curr), 0);
}

function getReducedNumber(num) {
    let current = num;
    while (!isMasterNumber(current) && current > 9) {
        current = sumDigits(current);
    }
    return current;
}

function calculateLifePath(day, month, year) {
    const fullDateStr = `${day}${month}${year}`;
    const firstSum = sumDigits(fullDateStr);
    const finalDigit = getReducedNumber(firstSum);
    return { base: firstSum, final: finalDigit };
}

function calculateDayNumber(day) {
    return getReducedNumber(day);
}

function calculateYearReducer(year) {
    return getReducedNumber(year);
}

function calculateLuckyNumber(month, year) {
    const monthStr = String(month);
    const yearStr = String(year);
    const firstDigitMonth = monthStr[0];
    const lastDigitYear = yearStr[yearStr.length - 1];
    return parseInt(firstDigitMonth + lastDigitYear);
}

function calculateHiddenSum(day, month) {
    const rawSum = day + month;
    const reduced = getReducedNumber(rawSum);
    const visualConcat = parseInt(String(day) + String(month));
    return { raw: rawSum, final: reduced, visual: visualConcat };
}

// Emoji mapping 
function getEmojis(numbersArray) {
    let emojis = [];
    if (numbersArray.includes(7)) emojis.push('🦴');
    if (numbersArray.includes(4)) emojis.push('👮');
    if (numbersArray.includes(1)) emojis.push('💪');
    if (numbersArray.includes(28)) emojis.push('💰');
    if (numbersArray.includes(8)) emojis.push('♾️');
    return emojis;
}

