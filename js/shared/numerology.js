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
    return [];
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
        // Fallback for years outside 1-2200 (including BC dates)
        if (month === 1 || (month === 2 && day < 4)) {
            chineseYear -= 1;
        }
    }

    const animals = ["Monkey", "Rooster", "Dog", "Boar", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Sheep"];
    const elements = ["Metal", "Metal", "Water", "Water", "Wood", "Wood", "Fire", "Fire", "Earth", "Earth"];

    const animalIdx = ((chineseYear % 12) + 12) % 12;
    const elementIdx = ((chineseYear % 10) + 10) % 10;

    const animal = animals[animalIdx];
    const element = elements[elementIdx];

    return `${element} ${animal}`;
}

// ==========================================
// PERSONAL DAY ENERGY (day numbers vs. the user's own numbers)
// ==========================================

// Tuning knobs. Four pairings, each scored friendly +1 / neutral 0 / enemy -1, times its weight.
// Max total = 3 + 1 + 1 + 1 = 6, so the total ranges from -6 to +6 (keep the weights summing to 6
// or retune PERSONAL_LEVELS below).
const PERSONAL_RELATION_POINTS = { friendly: 1, neutral: 0, enemy: -1 };
const PERSONAL_WEIGHT_LP = 3;     // day life path <-> user life path (the most important pairing)
const PERSONAL_WEIGHT_DAY = 1;    // day number <-> user day number
const PERSONAL_WEIGHT_CROSS = 1;  // life path <-> day number, both ways
// Highest first: the first level whose `min` is <= total wins.
const PERSONAL_LEVELS = [
    { min: 4, key: 'very-good', label: 'Very good' },
    { min: 2, key: 'good', label: 'Good' },
    { min: -1, key: 'neutral', label: 'Neutral' },
    { min: -3, key: 'challenging', label: 'Challenging' },
    { min: -Infinity, key: 'very-challenging', label: 'Very challenging' }
];

// How `from` regards `to`, per the compatibility table (rows: { number, friendly, neutral, enemy }).
// The table has a row for every number 1-9, 11, 22 and 33 (2 mirrors 11, since 11 reduces to 2).
// A pair that no row lists has no data and counts as neutral.
function getNumberRelation(compatibility, from, to) {
    const row = compatibility.find(r => r.number === from);
    if (!row) return 'neutral';
    if (row.friendly && row.friendly.includes(to)) return 'friendly';
    if (row.enemy && row.enemy.includes(to)) return 'enemy';
    return 'neutral';
}

// dayLP / dayNum: the calendar day's life path and day number; userLP / userDay: the user's own.
// Returns { total, level: { key, label }, pairs: [{ dayKind, dayNumber, userKind, userNumber, relation, weight, points }] }.
// The day's number is the `from` side of each lookup; the table is not perfectly symmetric.
function scorePersonalDay(dayLP, dayNum, userLP, userDay, compatibility) {
    const defs = [
        ['lp', dayLP, 'lp', userLP, PERSONAL_WEIGHT_LP],
        ['day', dayNum, 'day', userDay, PERSONAL_WEIGHT_DAY],
        ['lp', dayLP, 'day', userDay, PERSONAL_WEIGHT_CROSS],
        ['day', dayNum, 'lp', userLP, PERSONAL_WEIGHT_CROSS]
    ];
    const pairs = defs.map(([dayKind, dayNumber, userKind, userNumber, weight]) => {
        const relation = getNumberRelation(compatibility, dayNumber, userNumber);
        return { dayKind, dayNumber, userKind, userNumber, relation, weight, points: PERSONAL_RELATION_POINTS[relation] * weight };
    });
    const total = pairs.reduce((sum, p) => sum + p.points, 0);
    const { key, label } = PERSONAL_LEVELS.find(l => total >= l.min);
    return { total, level: { key, label }, pairs };
}
