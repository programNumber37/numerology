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
    const reducedDay = isMasterNumber(day) ? day : sumDigits(day);
    const reducedMonth = isMasterNumber(month) ? month : sumDigits(month);
    const reducedYear = sumDigits(year);

    const baseSum = reducedDay + reducedMonth + reducedYear;
    const finalDigit = getReducedNumber(baseSum);

    return { base: baseSum, final: finalDigit };
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

function calculateHiddenSum(day, month, year = new Date().getFullYear()) {
    const rawSum = day + month;
    const reduced = getReducedNumber(rawSum);
    const visualConcat = parseInt(String(day) + String(month));

    const reducedYear1 = sumDigits(year);

    const myRaw = month + reducedYear1;
    const myFinal = getReducedNumber(myRaw);

    const dmyRaw = day + month + reducedYear1;
    const dmyFinal = getReducedNumber(dmyRaw);

    return {
        raw: rawSum,
        final: reduced,
        visual: visualConcat,
        dm: { raw: rawSum, final: reduced },
        my: { raw: myRaw, final: myFinal },
        dmy: { raw: dmyRaw, final: dmyFinal },
        reducedYear1: reducedYear1
    };
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

// Chinese Zodiac mapping
// cnyDates is now loaded from cnyDates.js

function getChineseZodiac(year, month, day) {
    let chineseYear = year;
    if (typeof cnyDates !== 'undefined' && cnyDates[year]) {
        const [cnyMonth, cnyDay] = cnyDates[year];
        if (month < cnyMonth || (month === cnyMonth && day < cnyDay)) {
            chineseYear -= 1;
        }
    } else {
        // Fallback for years outside 1-2200
        if (month === 1 || (month === 2 && day < 4)) {
            chineseYear -= 1;
        }
    }

    const animals = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Cat", "Dragon", "Snake", "Horse", "Goat"];
    const elements = ["Metal", "Metal", "Water", "Water", "Wood", "Wood", "Fire", "Fire", "Earth", "Earth"];

    const animal = animals[chineseYear % 12];
    const element = elements[chineseYear % 10];

    return `${element} ${animal}`;
}
