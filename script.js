// ==========================================
// ENERGY GUIDE DATA LOADING & HELPERS
// ==========================================
let energyGuideData = typeof energyGuideDataDefault !== 'undefined' ? energyGuideDataDefault : null;

fetch("Number energy.json")
    .then(response => response.json())
    .then(data => {
        energyGuideData = data.numerology_energy_guide;
    })
    .catch(err => {
        console.warn("Failed to fetch Number energy.json, using fallback database:", err);
        if (typeof energyGuideDataDefault !== 'undefined') {
            energyGuideData = energyGuideDataDefault;
        }
    });

function getSingleDigit(num) {
    let current = num;
    while (current > 9) {
        current = String(current).split('').reduce((acc, curr) => acc + parseInt(curr), 0);
    }
    return current;
}

// ==========================================
// COMPATIBILITY DATA & HELPERS
// ==========================================
let compatibilityData = null;

const COMPATIBILITY_FALLBACK = [
    { "number": 1, "planet": "Sun", "friendly": [1, 2, 3, 5, 6, 9], "neutral": [4, 7], "enemy": [8] },
    { "number": 2, "planet": "Moon", "friendly": [1, 2, 3, 5], "neutral": [6, 7], "enemy": [4, 8, 9] },
    { "number": 3, "planet": "Jupiter", "friendly": [1, 2, 3, 5, 7], "neutral": [4, 8, 9], "enemy": [6] },
    { "number": 4, "planet": "Rahu", "friendly": [1, 4, 5, 6, 7, 8], "neutral": [3], "enemy": [2, 9] },
    { "number": 5, "planet": "Mercury", "friendly": [1, 2, 3, 5, 6], "neutral": [4, 7, 8, 9], "enemy": [] },
    { "number": 6, "planet": "Venus", "friendly": [1, 4, 5, 6, 7], "neutral": [2, 8, 9], "enemy": [3] },
    { "number": 7, "planet": "Ketu", "friendly": [1, 3, 4, 5, 6], "neutral": [2, 7, 8, 9], "enemy": [] },
    { "number": 8, "planet": "Saturn", "friendly": [3, 4, 5, 6, 7, 8], "neutral": [], "enemy": [1, 2, 9] },
    { "number": 9, "planet": "Mars", "friendly": [1, 3, 5], "neutral": [6, 7, 8, 9], "enemy": [2, 4] }
];

const planetMap = {
    1: "Sun",
    2: "Moon",
    3: "Jupiter",
    4: "Rahu",
    5: "Mercury",
    6: "Venus",
    7: "Ketu",
    8: "Saturn",
    9: "Mars"
};

fetch("number compability.json")
    .then(response => response.json())
    .then(data => {
        compatibilityData = data;
    })
    .catch(err => {
        console.warn("Failed to fetch number compatibility.json, using fallback database:", err);
        compatibilityData = COMPATIBILITY_FALLBACK;
    });

function getCompatibilityNumber(num) {
    let current = num;
    while (current > 9) {
        current = String(current).split('').reduce((acc, curr) => acc + parseInt(curr), 0);
    }
    return current;
}

function renderCompatibilityCard(typeLabel, originalNum, accentClass) {
    if (!compatibilityData) {
        compatibilityData = COMPATIBILITY_FALLBACK;
    }
    const reducedNum = getCompatibilityNumber(originalNum);
    const profile = compatibilityData.find(item => item.number === reducedNum) ||
        COMPATIBILITY_FALLBACK.find(item => item.number === reducedNum);

    if (!profile) return '';

    const createBadgesHTML = (list, relationType) => {
        if (!list || list.length === 0) return `<span style="font-size: 0.85rem; color: var(--th-text-muted); font-style: italic;">None</span>`;
        return list.map(n => {
            const planet = planetMap[n] || "Unknown";
            return `<span class="rd-number-badge rd-number-badge--${relationType}" title="Number ${n} (${planet}): ${relationType.charAt(0).toUpperCase() + relationType.slice(1)} relationship with ${typeLabel} ${originalNum}">
                ${n}
            </span>`;
        }).join('');
    };

    return `
        <div class="rd-compatibility-card ${accentClass}">
            <div class="rd-comp-header">
                <div class="rd-comp-title-group">
                    <span class="rd-comp-type">${typeLabel}</span>
                    <span class="rd-comp-number">${originalNum}</span>
                </div>
                <span class="rd-comp-planet-badge">Ruling: ${profile.planet}</span>
            </div>
            
            <div class="rd-comp-group">
                <span class="rd-comp-group-title">Friendly (Goes Well)</span>
                <div class="rd-comp-badges">
                    ${createBadgesHTML(profile.friendly, "friendly")}
                </div>
            </div>
            
            <div class="rd-comp-group">
                <span class="rd-comp-group-title">Neutral</span>
                <div class="rd-comp-badges">
                    ${createBadgesHTML(profile.neutral, "neutral")}
                </div>
            </div>
            
            <div class="rd-comp-group">
                <span class="rd-comp-group-title">Enemy (Avoid/Caution)</span>
                <div class="rd-comp-badges">
                    ${createBadgesHTML(profile.enemy, "enemy")}
                </div>
            </div>
        </div>
    `;
}

function renderCombinedCompatibilityCard(num1, num1Label, num2, num2Label) {
    if (!compatibilityData) {
        compatibilityData = COMPATIBILITY_FALLBACK;
    }
    const red1 = getCompatibilityNumber(num1);
    const red2 = getCompatibilityNumber(num2);

    if (red1 === red2) return '';

    const prof1 = compatibilityData.find(item => item.number === red1) || COMPATIBILITY_FALLBACK.find(item => item.number === red1);
    const prof2 = compatibilityData.find(item => item.number === red2) || COMPATIBILITY_FALLBACK.find(item => item.number === red2);

    if (!prof1 || !prof2) return '';

    const getRelation = (prof, target) => {
        if (prof.friendly && prof.friendly.includes(target)) return { type: 'friendly', score: 1, label: 'Friendly' };
        if (prof.enemy && prof.enemy.includes(target)) return { type: 'enemy', score: -1, label: 'Enemy' };
        return { type: 'neutral', score: 0, label: 'Neutral' };
    };

    const friendlyList = [];
    const neutralList = [];
    const enemyList = [];

    const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

    candidates.forEach(n => {
        const rel1 = getRelation(prof1, n);
        const rel2 = getRelation(prof2, n);
        const totalScore = rel1.score + rel2.score;

        const planet = planetMap[n] || "Unknown";
        let titleText = `Number ${n} (${planet}): ${rel1.label} with ${num1Label} (${num1}) + ${rel2.label} with ${num2Label} (${num2})`;

        const itemObj = { num: n, title: titleText };

        if (totalScore >= 1) {
            friendlyList.push(itemObj);
        } else if (totalScore === 0) {
            neutralList.push(itemObj);
        } else {
            enemyList.push(itemObj);
        }
    });

    const createBadgesHTML = (list, badgeType) => {
        if (!list || list.length === 0) return `<span style="font-size: 0.85rem; color: var(--th-text-muted); font-style: italic;">None</span>`;
        return list.map(item => {
            return `<span class="rd-number-badge rd-number-badge--${badgeType}" title="${item.title}">
                ${item.num}
            </span>`;
        }).join('');
    };

    return `
        <div class="rd-compatibility-card rd-compatibility-card--combined" style="margin-top: 4px;">
            <div class="rd-comp-header">
                <div class="rd-comp-title-group">
                    <span class="rd-comp-type">Combined Energy Synergy</span>
                    <span class="rd-comp-number">${num1} + ${num2}</span>
                </div>
            </div>
            
            <p style="font-size: 0.88rem; color: var(--th-text-muted); margin: 0 0 4px 0; line-height: 1.5;">
                This synthesis calculates compatibility across both your <strong>${num1Label} (${num1})</strong> and <strong>${num2Label} (${num2})</strong> energies. Numbers that conflict (good for one energy but challenging for the other) equalize to <strong>Neutral</strong>.
            </p>

            <div class="rd-comp-group">
                <span class="rd-comp-group-title">Harmonious for Both (Synergy)</span>
                <div class="rd-comp-badges">
                    ${createBadgesHTML(friendlyList, "friendly")}
                </div>
            </div>
            
            <div class="rd-comp-group">
                <span class="rd-comp-group-title">Neutral & Mixed (Balanced)</span>
                <div class="rd-comp-badges">
                    ${createBadgesHTML(neutralList, "neutral")}
                </div>
            </div>
            
            <div class="rd-comp-group">
                <span class="rd-comp-group-title">Challenging for Both (Avoid/Caution)</span>
                <div class="rd-comp-badges">
                    ${createBadgesHTML(enemyList, "enemy")}
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// 2. DOM ELEMENTS, STATE
// ==========================================

let currentDate = new Date();

let searchFilterLP = null;
let searchFilterDay = null;
let searchFilterAny = null;

const daysContainer = document.getElementById("daysContainer");
const monthSelect = document.getElementById("monthSelect");
const yearInput = document.getElementById("yearInput");
const luckyNumDisplay = document.getElementById("luckyNumDisplay");

const detailsPanel = document.getElementById("detailsPanel");
const detailsDate = document.getElementById("detailsDate");
const detailsContent = document.querySelector(".details-content");

const inputLP = document.getElementById("searchLP");
const inputDay = document.getElementById("searchDay");
const inputAny = document.getElementById("searchAny");
const btnClear = document.getElementById("clearSearch");
const btnShowList = document.getElementById("showListBtn");
const searchResultsSection = document.getElementById("searchResultsSection");
const searchResultsList = document.getElementById("searchResultsList");

// Advanced Search DOM
const finderToggle = document.getElementById("finderToggle");
const finderChevron = document.getElementById("finderChevron");
const advancedSearchPanel = document.getElementById("advancedSearchPanel");
const startMonthInput = document.getElementById("startMonth");
const startYearInput = document.getElementById("startYear");
const endMonthInput = document.getElementById("endMonth");
const endYearInput = document.getElementById("endYear");

// Pagination State
let lastSearchedPastDate = null;
let lastSearchedFutureDate = null;


// ==========================================
// 3. UI FUNCTIONS
// ==========================================

function updateDetailsPanel(dateStr, day, month, year) {
    detailsPanel.classList.remove("hidden");

    const dateObj = new Date(dateStr);

    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNumStr = dateObj.getDate();
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });
    const yearStr = dateObj.getFullYear();
    // formattedDate removed, inline in detailsDate.innerHTML instead

    const lp = calculateLifePath(day, month, year);
    const dayNum = calculateDayNumber(day);
    const yearReducer = calculateYearReducer(year);
    const hidden = calculateHiddenSum(day, month, year);
    const luckyVal = calculateLuckyNumber(month, year);

    const allEnergiesForEmojis = [
        day, dayNum, lp.base, lp.final,
        hidden.raw, hidden.final, hidden.visual,
        hidden.dm.raw, hidden.dm.final,
        hidden.my.raw, hidden.my.final,
        hidden.dmy.raw, hidden.dmy.final,
        luckyVal
    ];
    const emojiArray = getEmojis(allEnergiesForEmojis);
    const dayEmojis = emojiArray.join(' ').trim();

    const yearSplitForm = String(year).split('').join('+');

    const emojiHtml = dayEmojis ? ` <span class="detail-emoji">${dayEmojis}</span>` : '';
    detailsDate.innerHTML = `<span class="date-line-day">${dayName}</span><span class="date-line-date">${dayNumStr} ${monthName}, ${yearStr}${emojiHtml}</span>`;

    const isThirtyThree = lp.final === 33 || dayNum === 33 || hidden.visual === 33 || hidden.raw === 33 || hidden.dm.final === 33 || hidden.my.final === 33 || hidden.dmy.final === 33;
    const isMainMaster = isMasterNumber(lp.final) || isMasterNumber(dayNum);
    const isHiddenMaster = isMasterNumber(hidden.raw) || dayNum === 20 || isMasterNumber(hidden.visual) || isMasterNumber(hidden.dm.final) || isMasterNumber(hidden.my.final) || isMasterNumber(hidden.dmy.final);

    detailsPanel.classList.remove("master-theme", "master-33-theme");

    if (isThirtyThree) {
        detailsPanel.classList.add("master-33-theme");
    } else if (isMainMaster || isHiddenMaster) {
        detailsPanel.classList.add("master-theme");
    }

    // Same colors as the calendar boxes: 11 cobalt, 22 purple, 33 golden orange
    const getMasterClass = (num) => numClass(num);

    const getHiddenClass = (num) => numClass(num) || (num === 20 ? 'text-master' : '');

    let energyReadingHTML = '';
    if (energyGuideData) {
        const reducedLP = getSingleDigit(lp.final);
        const reducedDay = getSingleDigit(dayNum);

        const lpEnergy = energyGuideData.find(item => item.day === reducedLP);
        const dayEnergy = energyGuideData.find(item => item.day === reducedDay);

        const renderGuideCard = (titlePrefix, originalNum, energyObj, featuredClass, showDouble = false) => {
            if (!energyObj) return '';

            const doListHTML = energyObj.do.map(item => `
                <li class="energy-li"><strong>${item.action}</strong>: ${item.details}</li>
            `).join('');

            const avoidListHTML = energyObj.avoid.map(item => `
                <li class="energy-li"><strong>${item.action}</strong>: ${item.details}</li>
            `).join('');

            const doubleTag = showDouble
                ? `<span class="energy-double-tag">Double Energy</span>`
                : '';

            return `
                <div class="energy-card ${featuredClass}">
                    <div class="energy-header">
                        <span class="energy-badge">${titlePrefix} ${originalNum} Energy</span>
                        ${doubleTag}
                        <h5 class="energy-title">${energyObj.title}</h5>
                    </div>
                    <p class="energy-desc">${energyObj.description}</p>
                    <div class="energy-lists">
                        <div class="energy-list energy-list--do">
                            <strong>Do:</strong>
                            <ul class="energy-ul">
                                ${doListHTML}
                            </ul>
                        </div>
                        <div class="energy-list energy-list--avoid">
                            <strong>Avoid:</strong>
                            <ul class="energy-ul">
                                ${avoidListHTML}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        };

        let lpCardHTML, dayCardHTML;
        if (reducedLP === reducedDay) {
            // Same energy — show one combined card with double energy label
            lpCardHTML = renderGuideCard("Life Path & Day Number", lp.final, lpEnergy, "energy-card--featured", true);
            dayCardHTML = '';
        } else {
            lpCardHTML = renderGuideCard("Life Path", lp.final, lpEnergy, "energy-card--featured");
            dayCardHTML = renderGuideCard("Day Number", dayNum, dayEnergy, "energy-card--day");
        }

        energyReadingHTML = `
            <div class="energy-reading-section">
                <h4 class="energy-section-title">Daily Energy Guide</h4>
                ${lpCardHTML}
                ${dayCardHTML}
            </div>
        `;
    } else {
        energyReadingHTML = `
            <div class="energy-reading-section">
                <p style="font-size: 0.85rem; color: var(--th-text-muted); font-style: italic;">
                    Daily energy readings are loading from the Number energy JSON file...
                    <br>
                    <small>Note: If you are opening this page via file://, CORS rules may block the loading of JSON files. Consider running a local web server.</small>
                </p>
            </div>
        `;
    }

    const isDoubleEnergy = getCompatibilityNumber(lp.final) === getCompatibilityNumber(dayNum);

    let compatibilityGridHTML;
    if (isDoubleEnergy) {
        const combinedCompatibilityHTML = renderCompatibilityCard("Lifepath & Day Number", lp.final, "rd-compatibility-card--lifepath");
        compatibilityGridHTML = combinedCompatibilityHTML;
    } else {
        const lpCompatibilityHTML = renderCompatibilityCard("Life Path", lp.final, "rd-compatibility-card--lifepath");
        const dayCompatibilityHTML = renderCompatibilityCard("Day Number", dayNum, "rd-compatibility-card--day");
        const synergyCompatibilityHTML = renderCombinedCompatibilityCard(lp.final, "Life Path", dayNum, "Day Number");
        compatibilityGridHTML = lpCompatibilityHTML + dayCompatibilityHTML + synergyCompatibilityHTML;
    }

    const compatibilityReadingHTML = `
            <div class="rd-compatibility-section" style="margin-top: 24px;">
                <h4 class="rd-compatibility-title">Number Compatibility</h4>
                <div class="rd-compatibility-grid">
                    ${compatibilityGridHTML}
                </div>
            </div>
        `;

    detailsContent.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item full-width" onclick="this.classList.toggle('expanded')">
                    <div class="item-header">
                        <div class="item-content">
                            <strong>Life Path</strong> 
                            <span class="main-value ${getMasterClass(lp.final)}">${lp.base} / ${lp.final}</span> 
                            <small>Standard Calculation</small>
                        </div>
                        <span class="expand-icon">▼</span>
                    </div>
                    <div class="detail-calculation">
                        The <strong>Life Path Number</strong> is calculated by reducing the day, month, and year separately (except Master Numbers 11, 22, and 33), and then adding them together. Some calculators reduce completely first before adding, but this method reduces once first.<br><br>
                        <strong>Day:</strong> ${day} &rarr; ${isMasterNumber(day) ? day : sumDigits(day)}<br>
                        <strong>Month:</strong> ${month} &rarr; ${isMasterNumber(month) ? month : sumDigits(month)}<br>
                        <strong>Year:</strong> ${year} &rarr; ${yearSplitForm} = ${sumDigits(year)}<br>
                        <strong>Total:</strong> ${isMasterNumber(day) ? day : sumDigits(day)} + ${isMasterNumber(month) ? month : sumDigits(month)} + (${yearSplitForm}) = ${lp.base} &rarr; <strong>${lp.final}</strong>
                    </div>
                </div>
                
                <div class="detail-item" onclick="this.classList.toggle('expanded')">
                    <div class="item-header">
                        <div class="item-content">
                            <strong>Day Number</strong> 
                            <span class="main-value ${getHiddenClass(dayNum)}">${dayNum}</span>
                            <small>Reduced from ${day}</small>
                        </div>
                        <span class="expand-icon">▼</span>
                    </div>
                    <div class="detail-calculation">
                        The <strong>Day Number</strong> is the sum of the digits of the calendar day, reduced to a single digit or Master Number.<br><br>
                        <strong>Calculation:</strong> ${day} &rarr; <strong>${dayNum}</strong>
                    </div>
                </div>

                <div class="detail-item" onclick="this.classList.toggle('expanded')">
                    <div class="item-header">
                        <div class="item-content">
                            <strong>Year Reducer</strong> 
                            <span class="main-value ${getMasterClass(yearReducer)}">${yearReducer}</span>
                            <small>Reduced from ${year}</small>
                        </div>
                        <span class="expand-icon">▼</span>
                    </div>
                    <div class="detail-calculation">
                        The <strong>Year Reducer</strong> is the sum of the digits of the current calendar year.<br><br>
                        <strong>Calculation:</strong> ${year} &rarr; <strong>${yearReducer}</strong>
                        ${typeof readingsDatabase !== 'undefined' && readingsDatabase.years && readingsDatabase.years[yearReducer]
            ? `<br><br><strong>Year ${yearReducer} Energy:</strong><br>${readingsDatabase.years[yearReducer]}`
            : ''}
                    </div>
                </div>

                <div class="detail-item full-width" onclick="this.classList.toggle('expanded')">
                    <div class="item-header">
                        <div class="item-content">
                            <strong>Hidden Numbers</strong> 
                            <span class="main-value ${getMasterClass(hidden.dmy.final)}">${hidden.dmy.raw} / ${hidden.dmy.final}</span>
                            <small>Day + Month + Year (1 Step)</small>
                        </div>
                        <span class="expand-icon">▼</span>
                    </div>
                    
                    <div class="hidden-energy-row">
                        <div class="hidden-energy-box">
                            <strong>Day + Month</strong>
                            <span class="${getMasterClass(hidden.dm.final)}">${hidden.dm.raw} / ${hidden.dm.final}</span>
                            <small>${day} + ${month}</small>
                        </div>
                        <div class="hidden-energy-box">
                            <strong>Month + Year</strong>
                            <span class="${getMasterClass(hidden.my.final)}">${hidden.my.raw} / ${hidden.my.final}</span>
                            <small>${month} + (${yearSplitForm})</small>
                        </div>
                        <div class="hidden-energy-box">
                            <strong>Day + Month + Year</strong>
                            <span class="${getMasterClass(hidden.dmy.final)}">${hidden.dmy.raw} / ${hidden.dmy.final}</span>
                            <small>${day} + ${month} + (${yearSplitForm})</small>
                        </div>
                    </div>

                    <div class="detail-calculation">
                        The <strong>Hidden Energy</strong> reveals underlying numerological influences. This system calculates three components without reducing the day or month, but reducing the year by one step (${year} &rarr; ${yearSplitForm} = ${hidden.reducedYear1}).<br><br>
                        1. <strong>Day + Month:</strong> ${day} + ${month} = ${hidden.dm.raw} &rarr; <strong>${hidden.dm.final}</strong><br>
                        2. <strong>Month + Year:</strong> ${month} + (${yearSplitForm}) = ${hidden.my.raw} &rarr; <strong>${hidden.my.final}</strong><br>
                        3. <strong>Full Hidden Sum:</strong> ${day} + ${month} + (${yearSplitForm}) = ${hidden.dmy.raw} &rarr; <strong>${hidden.dmy.final}</strong><br>
                        ${hidden.visual === 33 ? '<br><b>Special Note:</b> Visual 33 detected (Day ' + day + ' and Month ' + month + ').' : ''}
                    </div>
                </div>

                <div class="detail-item full-width" onclick="this.classList.toggle('expanded')">
                    <div class="item-header">
                        ${(() => {
                            const zodiacStr = getChineseZodiac(year, month, day);
                            const animalName = zodiacStr.split(' ').pop().toLowerCase();
                            return `
                                <div style="display: flex; align-items: center; gap: 14px; min-width: 0;">
                                    <div style="width: 64px; height: 64px; flex-shrink: 0; border-radius: 12px; background: var(--th-surface-hover, rgba(0,0,0,0.05)); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 3px;">
                                        <img src="zodiac/${animalName}.png" alt="${animalName}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">
                                    </div>
                                    <div class="item-content" style="min-width: 0;">
                                        <strong>Chinese Zodiac</strong> 
                                        <span class="main-value text-master">${zodiacStr}</span>
                                    </div>
                                </div>
                            `;
                        })()}
                        <span class="expand-icon">▼</span>
                    </div>
                    <div class="detail-calculation">
                        ${(() => {
            const zodiacStr = getChineseZodiac(year, month, day);
            const animalName = zodiacStr.split(' ').pop();
            const signData = typeof chineseSignDatabase !== 'undefined' && chineseSignDatabase[animalName];
            const yearEnergy = signData ? signData.year_energy : null;

            // Compute the Chinese year number for this date
            let chineseYear = year;
            if (typeof cnyDates !== 'undefined' && cnyDates[year]) {
                const [cnyM, cnyD] = cnyDates[year];
                if (month < cnyM || (month === cnyM && day < cnyD)) chineseYear -= 1;
            }

            // Build start/end date strings
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            let dateRangeHtml = '';
            if (typeof cnyDates !== 'undefined') {
                const startEntry = cnyDates[String(chineseYear)];
                const nextEntry = cnyDates[String(chineseYear + 1)];
                if (startEntry) {
                    const startStr = `${startEntry[1]} ${monthNames[startEntry[0] - 1]} ${chineseYear}`;
                    let endStr = '';
                    if (nextEntry) {
                        // end = day before next CNY
                        const endDate = new Date(chineseYear + 1, nextEntry[0] - 1, nextEntry[1] - 1);
                        endStr = `${endDate.getDate()} ${monthNames[endDate.getMonth()]} ${endDate.getFullYear()}`;
                    }
                    dateRangeHtml = `<div style="display:inline-flex;gap:10px;align-items:center;margin-bottom:12px;font-size:0.85rem;font-weight:600;opacity:0.75;">
                                        <span>📅 ${startStr}</span>
                                        <span style="opacity:0.5">→</span>
                                        <span>${endStr || '?'}</span>
                                    </div><br>`;
                }
            }

            const imageBoxHtml = `<div style="width:100%; max-height:280px; background:var(--th-surface-hover, rgba(0,0,0,0.04)); border-radius:12px; margin: 10px 0 18px 0; display:flex; align-items:center; justify-content:center; padding:16px; border:1px solid rgba(255,255,255,0.08); overflow:hidden;">
                                      <img src="zodiac/${animalName.toLowerCase()}.png" alt="${animalName}" style="max-height:250px; width:auto; max-width:100%; object-fit:contain; border-radius:8px; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.25)); transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                                  </div>`;

            if (yearEnergy) {
                return `${dateRangeHtml}${imageBoxHtml}<strong>Year Energy — ${zodiacStr}</strong><br><br>${yearEnergy.replace(/\n/g, '<br>')}`;
            }
            return `${dateRangeHtml}${imageBoxHtml}The <strong>Chinese Zodiac</strong> changes according to the Lunar New Year and follows a 12-year animal cycle.<br><br><strong>Date:</strong> ${day}.${month}.${year} &rarr; <strong>${zodiacStr}</strong>`;
        })()}
                    </div>
                </div>
            </div>
            
            <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
            
            <div style="line-height: 1.6; color: #555; margin-bottom: 4px;">
                <p style="margin-bottom: 0;"><strong>Daily Insights:</strong></p>
                ${dayNum === 20 ? '<p style="margin-top: 4px; margin-bottom: 0;"><b>Special Note:</b> The day 20 is considered a hidden 11.</p>' : ''}
            </div>
            ${energyReadingHTML}
            ${compatibilityReadingHTML}
        `;
}

// Calendar number colors (see --th-num-* in themes.css): 11 cobalt, 22 purple, 33 golden orange
function numClass(num) {
    return (num === 11 || num === 22 || num === 33) ? `num-${num}` : '';
}

// ==========================================
// BOOK BIRTHDAYS ON THE CALENDAR
// ==========================================
let bookBirthdays = new Map(); // "month-day" -> [{ id, name, birthdate }]

const BDAY_ICON = '<svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 2.5C3 2.22 3.22 2 3.5 2H12C12.55 2 13 2.45 13 3V14L8 11.2L3 14V2.5Z" fill="currentColor"/></svg>';

function isLeapYear(y) {
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

// People whose birthday falls on this calendar day. 29 Feb birthdays show on 28 Feb in non-leap years.
function birthdaysForDay(year, month, day) {
    const people = (bookBirthdays.get(`${month}-${day}`) || []).map(p => ({ ...p, feb29Shifted: false }));
    if (month === 2 && day === 28 && !isLeapYear(year)) {
        (bookBirthdays.get('2-29') || []).forEach(p => people.push({ ...p, feb29Shifted: true }));
    }
    return people.sort((a, b) => a.name.localeCompare(b.name));
}

function readingUrl(person) {
    return `reading.html?dob=${encodeURIComponent(person.birthdate)}&name=${encodeURIComponent(person.name)}`;
}

// One popup shared by all chips; lives on <body> because day boxes clip their content.
const bdayTip = document.createElement("div");
bdayTip.className = "bday-tip";
bdayTip.hidden = true;
document.body.appendChild(bdayTip);
let bdayTipTimer = null;

function showBdayTip(anchor, nodes) {
    clearTimeout(bdayTipTimer);
    bdayTip.replaceChildren(...nodes);
    bdayTip.hidden = false;
    const a = anchor.getBoundingClientRect();
    const t = bdayTip.getBoundingClientRect();
    const above = a.top - t.height - 6 >= 8;
    bdayTip.style.top = `${above ? a.top - t.height - 6 : a.bottom + 6}px`;
    bdayTip.style.left = `${Math.max(8, Math.min(a.left + a.width / 2 - t.width / 2, window.innerWidth - t.width - 8))}px`;
}

function hideBdayTip(delay = 120) {
    clearTimeout(bdayTipTimer);
    if (delay === 0) { bdayTip.hidden = true; return; }
    bdayTipTimer = setTimeout(() => { bdayTip.hidden = true; }, delay);
}

bdayTip.addEventListener("mouseenter", () => clearTimeout(bdayTipTimer));
bdayTip.addEventListener("mouseleave", () => hideBdayTip());
document.addEventListener("click", (e) => {
    if (!bdayTip.contains(e.target) && !e.target.closest(".bday-chip")) hideBdayTip(0);
});
window.addEventListener("scroll", () => hideBdayTip(0), { passive: true });

function tipLine(text, className) {
    const d = document.createElement("div");
    d.className = className || "bday-tip-name";
    d.textContent = text;
    return d;
}

function createPersonChip(person) {
    const chip = document.createElement("a");
    chip.className = "bday-chip";
    chip.href = readingUrl(person);
    chip.setAttribute("aria-label", `${person.name}'s birthday reading`);
    chip.innerHTML = BDAY_ICON;
    const name = document.createElement("span");
    name.className = "bday-name";
    name.textContent = person.name;
    chip.appendChild(name);

    const show = () => {
        const nodes = [tipLine(person.name)];
        if (person.feb29Shifted) nodes.push(tipLine("29 Feb birthday (shown on 28 Feb)", "bday-tip-note"));
        showBdayTip(chip, nodes);
    };
    chip.addEventListener("mouseenter", show);
    chip.addEventListener("focus", show);
    chip.addEventListener("mouseleave", () => hideBdayTip());
    chip.addEventListener("blur", () => hideBdayTip());
    // Opening the reading must not also select the day box.
    chip.addEventListener("click", (e) => e.stopPropagation());
    chip.addEventListener("keydown", (e) => e.stopPropagation());
    return chip;
}

function createMoreChip(people) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "bday-chip bday-more";
    chip.textContent = `+${people.length}`;
    chip.setAttribute("aria-label", `${people.length} more birthdays`);

    const show = () => {
        const nodes = people.map(p => {
            const link = document.createElement("a");
            link.className = "bday-tip-link";
            link.href = readingUrl(p);
            link.textContent = p.feb29Shifted ? `${p.name} (29 Feb)` : p.name;
            return link;
        });
        showBdayTip(chip, nodes);
    };
    chip.addEventListener("mouseenter", show);
    chip.addEventListener("focus", show);
    chip.addEventListener("mouseleave", () => hideBdayTip());
    chip.addEventListener("blur", () => hideBdayTip(250));
    chip.addEventListener("click", (e) => { e.stopPropagation(); show(); });
    chip.addEventListener("keydown", (e) => e.stopPropagation());
    return chip;
}

function renderBirthdayChips() {
    document.querySelectorAll(".cell-birthdays").forEach(n => n.remove());
    if (bookBirthdays.size === 0) return;
    document.querySelectorAll(".day-cell").forEach(cell => {
        const [y, m, d] = cell.dataset.date.split("-").map(Number);
        const people = birthdaysForDay(y, m, d);
        if (people.length === 0) return;
        const wrap = document.createElement("div");
        wrap.className = "cell-birthdays";
        wrap.appendChild(createPersonChip(people[0]));
        if (people.length > 1) wrap.appendChild(createMoreChip(people.slice(1)));
        cell.appendChild(wrap);
    });
}

async function loadBookBirthdays() {
    const map = new Map();
    if (window.Account && Account.configured && Account.username) {
        try {
            (await Account.listProfiles()).forEach(p => {
                const [, m, d] = p.birthdate.split("-").map(Number);
                const key = `${m}-${d}`;
                if (!map.has(key)) map.set(key, []);
                map.get(key).push(p);
            });
        } catch (err) {
            console.warn("Could not load Book birthdays:", err);
        }
    }
    bookBirthdays = map;
    renderBirthdayChips();
}

// setTimeout: Supabase must not be called from inside its own auth-change callback.
if (window.Account) {
    Account.onChange(() => setTimeout(loadBookBirthdays, 0));
    // The session may already be restored before this script registered its listener.
    Account.ready.then(() => setTimeout(loadBookBirthdays, 0));
}

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const numerologyMonth = month + 1;

    // Update Header
    monthSelect.value = String(month);
    yearInput.value = year;

    const lucky = calculateLuckyNumber(numerologyMonth, year);
    luckyNumDisplay.innerText = lucky;
    luckyNumDisplay.className = numClass(lucky);

    daysContainer.innerHTML = "";
    hideBdayTip(0);

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement("div");
        daysContainer.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("day-cell");
        dayCell.tabIndex = 0;

        const dateString = `${year}-${String(numerologyMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const displayDate = `${day}.${numerologyMonth}.${year}`;
        dayCell.dataset.date = dateString;

        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayCell.classList.add("today");
        }

        const lp = calculateLifePath(day, numerologyMonth, year);
        const dayNum = calculateDayNumber(day);
        const hidden = calculateHiddenSum(day, numerologyMonth, year);
        const luckyVal = calculateLuckyNumber(numerologyMonth, year);

        // --- SEARCH CHECK ---
        let isMatch = false;

        let lpMatch = searchFilterLP !== null ? (lp.final === searchFilterLP || lp.base === searchFilterLP) : true;
        let dayMatch = searchFilterDay !== null ? (dayNum === searchFilterDay || day === searchFilterDay) : true;

        if (searchFilterLP !== null || searchFilterDay !== null) {
            isMatch = lpMatch && dayMatch;
        }

        // Check "Any Energy"
        if (searchFilterAny !== null) {
            const allEnergies = [
                lp.base, lp.final, day, dayNum,
                hidden.raw, hidden.final, hidden.visual,
                hidden.dm.raw, hidden.dm.final,
                hidden.my.raw, hidden.my.final,
                hidden.dmy.raw, hidden.dmy.final,
                luckyVal
            ];
            if (allEnergies.includes(searchFilterAny)) {
                isMatch = true;
            } else {
                isMatch = false; // Override if it doesn't match the "Any" filter
            }
        }

        if (isMatch && (searchFilterLP !== null || searchFilterDay !== null || searchFilterAny !== null)) {
            dayCell.classList.add("search-match");
        }

        // --- MASTER THEMES & EMOJIS ---
        const allEnergiesForEmojis = [
            day, dayNum, lp.base, lp.final,
            hidden.raw, hidden.final, hidden.visual,
            hidden.dm.raw, hidden.dm.final,
            hidden.my.raw, hidden.my.final,
            hidden.dmy.raw, hidden.dmy.final
        ];
        const emojiArray = getEmojis(allEnergiesForEmojis);
        const dayEmojis = emojiArray.join('');

        // If more than 2 emojis, add the small-emojis class
        const emojiClass = emojiArray.length > 2 ? "cell-emoji small-emojis" : "cell-emoji";

        // Hidden-number master energy (11/22/33 among the hidden numbers): tinted panel/box in that master's color
        const hiddenValues = [hidden.raw, hidden.visual, hidden.dm.final, hidden.my.final, hidden.dmy.final];
        const hiddenMaster = [33, 22, 11].find(n => hiddenValues.includes(n));
        const hiddenMasterClass = hiddenMaster ? `hid-${hiddenMaster}` : '';
        if (hiddenMaster) dayCell.classList.add(hiddenMasterClass);
        dayCell.innerHTML = `
            ${emojiArray.length > 0 ? `<div class="${emojiClass}">${dayEmojis}</div>` : ''}
            <div class="cell-date">${displayDate}</div>
            <div class="cell-lp ${numClass(lp.final)} ${hiddenMasterClass}">${lp.final}</div>
            <div class="cell-primary-day ${numClass(lp.final)}">${day}</div>
            <div class="cell-day-num">D: <span class="${numClass(dayNum)}">${dayNum}</span></div>
        `;

        dayCell.addEventListener("click", () => selectDay(dayCell, dateString, day, numerologyMonth, year));
        dayCell.addEventListener("keydown", (e) => {
            if (e.key === "Enter") selectDay(dayCell, dateString, day, numerologyMonth, year);
        });

        daysContainer.appendChild(dayCell);
    }
    renderBirthdayChips();
}

function selectDay(cell, dateStr, day, month, year, initialLoad = false) {
    document.querySelectorAll(".day-cell.selected").forEach(el => el.classList.remove("selected"));
    cell.classList.add("selected");
    cell.focus({ preventScroll: initialLoad });
    updateDetailsPanel(dateStr, day, month, year);
    // On first load don't yank a phone user down to the details panel.
    if (!initialLoad && window.innerWidth <= 768) {
        setTimeout(() => {
            detailsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

// ==========================================
// 4. YEAR & INPUT LOGIC
// ==========================================

function setCalendarMonthYear(month, year) {
    if (Number.isNaN(month) || Number.isNaN(year)) return;
    const day = Math.min(
        currentDate.getDate(),
        new Date(year, month + 1, 0).getDate()
    );
    currentDate = new Date(year, month, day);
    renderCalendar(currentDate);
}

function handleScrollChange(e, type) {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    if (delta === 0) return;

    let newMonth = currentDate.getMonth();
    let newYear = currentDate.getFullYear();

    if (type === 'month') {
        newMonth += (delta > 0 ? 1 : -1);
    } else if (type === 'year') {
        newYear += (delta > 0 ? 1 : -1);
    }

    setCalendarMonthYear(newMonth, newYear);
}

if (monthSelect) {
    monthSelect.addEventListener("wheel", (e) => handleScrollChange(e, 'month'), { passive: false });
    monthSelect.addEventListener("change", (e) => setCalendarMonthYear(parseInt(e.target.value, 10), currentDate.getFullYear()));
}

if (yearInput) {
    yearInput.addEventListener("wheel", (e) => handleScrollChange(e, 'year'), { passive: false });
    yearInput.addEventListener("change", (e) => {
        const newYear = parseInt(e.target.value, 10);
        if (!isNaN(newYear) && newYear >= 1 && newYear <= 9999) {
            setCalendarMonthYear(currentDate.getMonth(), newYear);
        }
    });
}

function handleSearchUpdate() {
    const valLP = inputLP.value;
    const valDay = inputDay.value;
    const valAny = inputAny.value;

    searchFilterLP = valLP ? parseInt(valLP) : null;
    searchFilterDay = valDay ? parseInt(valDay) : null;
    searchFilterAny = valAny ? parseInt(valAny) : null;
    renderCalendar(currentDate);
}

inputLP.addEventListener("input", handleSearchUpdate);
inputDay.addEventListener("input", handleSearchUpdate);
inputAny.addEventListener("input", handleSearchUpdate);

[inputLP, inputDay, inputAny].forEach(input => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            btnShowList.click();
        }
    });
});

btnClear.addEventListener("click", () => {
    inputLP.value = "";
    inputDay.value = "";
    inputAny.value = "";
    startMonthInput.value = "";
    startYearInput.value = "";
    endMonthInput.value = "";
    endYearInput.value = "";
    searchResultsSection.classList.add("hidden");
    searchResultsList.innerHTML = "";
    lastSearchedPastDate = null;
    lastSearchedFutureDate = null;
    handleSearchUpdate();
});

// Toggle Advanced Search
finderToggle.addEventListener("click", () => {
    advancedSearchPanel.classList.toggle("hidden");
    if (advancedSearchPanel.classList.contains("hidden")) {
        finderChevron.style.transform = "rotate(0deg)";
    } else {
        finderChevron.style.transform = "rotate(180deg)";
    }
});

const mobileToolsToggle = document.getElementById("mobileToolsToggle");
if (mobileToolsToggle) {
    mobileToolsToggle.addEventListener("click", () => {
        document.querySelectorAll(".side-panel").forEach(panel => {
            panel.classList.toggle("mobile-show");
        });
        if (mobileToolsToggle.innerText.includes("Show Tools")) {
            mobileToolsToggle.innerText = "Hide Tools (Finder & Legend) ▲";
        } else {
            mobileToolsToggle.innerText = "Show Tools (Finder & Legend) ▼";
        }
    });
}

// ==========================================
// 5. FIND MATCHES ("SHOW LIST") LOGIC
// ==========================================

function checkDateMatch(d) {
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    const lp = calculateLifePath(day, month, year);
    const dayNum = calculateDayNumber(day);
    const hidden = calculateHiddenSum(day, month, year);

    let lpMatch = searchFilterLP !== null ? (lp.final === searchFilterLP || lp.base === searchFilterLP) : true;
    let dayMatch = searchFilterDay !== null ? (dayNum === searchFilterDay || day === searchFilterDay) : true;

    let match = true;
    if (searchFilterLP !== null || searchFilterDay !== null) match = lpMatch && dayMatch;

    if (searchFilterAny !== null) {
        const lucky = calculateLuckyNumber(month, year);
        const all = [
            lp.base, lp.final, day, dayNum,
            hidden.raw, hidden.final, hidden.visual,
            hidden.dm.raw, hidden.dm.final,
            hidden.my.raw, hidden.my.final,
            hidden.dmy.raw, hidden.dmy.final,
            lucky
        ];
        match = all.includes(searchFilterAny);
    }

    return match && (searchFilterLP !== null || searchFilterDay !== null || searchFilterAny !== null);
}

const PAST_LIMIT = 10;
const FUTURE_LIMIT = 33;
const MAX_SCAN = 20000;

function performSearch(appending = false, direction = 'both') {
    if (searchFilterLP === null && searchFilterDay === null && searchFilterAny === null) {
        searchResultsSection.classList.remove("hidden");
        searchResultsList.innerHTML = "<p style='color:red; font-size:0.8rem; grid-column: 1 / -1;'>Please enter criteria first.</p>";
        return;
    }

    searchResultsSection.classList.remove("hidden");

    if (!appending) {
        searchResultsList.innerHTML = "<p style='font-size:0.8rem; color:#888; grid-column: 1 / -1;'>Searching...</p>";
        lastSearchedPastDate = null;
        lastSearchedFutureDate = null;
    } else {
        // Remove load more buttons if appending
        document.querySelectorAll('.load-more-btn').forEach(btn => btn.remove());
    }

    const sMonth = parseInt(startMonthInput.value) || 1;
    let sYear = parseInt(startYearInput.value);
    const eMonth = parseInt(endMonthInput.value) || 12;
    let eYear = parseInt(endYearInput.value);

    // If both years provided, run exact timeframe search
    if (!isNaN(sYear) && !isNaN(eYear)) {
        if (!appending) searchResultsList.innerHTML = "";

        let startD = new Date(sYear, sMonth - 1, 1);
        let endD = new Date(eYear, eMonth, 0); // Last day of end month
        if (startD > endD) {
            searchResultsList.innerHTML = "<p style='color:red; font-size:0.8rem; grid-column: 1 / -1;'>Start date must be before end date.</p>";
            return;
        }

        const matches = [];
        let tempDate = new Date(startD);

        // Prevent infinite hangs on massive ranges
        let safety = 0;
        while (tempDate <= endD && safety < 50000) {
            if (checkDateMatch(tempDate)) {
                matches.push(new Date(tempDate));
            }
            tempDate.setDate(tempDate.getDate() + 1);
            safety++;
        }

        if (matches.length > 0) {
            const header = document.createElement("div");
            header.className = "result-header";
            header.innerText = `Range Matches (${matches.length})`;
            searchResultsList.appendChild(header);

            // Reusing appendBoxToYearGroup inline since we need it above the main scan scope if appending to timeframe
            // We can just create groups manually for timeframe loop to keep scope clean
            matches.forEach(date => {
                const year = date.getFullYear();
                let yearGroup = searchResultsList.querySelector(`.year-group[data-year="${year}"]`);
                if (!yearGroup) {
                    yearGroup = document.createElement("div");
                    yearGroup.className = "year-group";
                    yearGroup.setAttribute("data-year", year);

                    const separator = document.createElement("h3");
                    separator.className = "year-separator";
                    separator.innerText = year;

                    const grid = document.createElement("div");
                    grid.className = "results-grid";

                    yearGroup.appendChild(separator);
                    yearGroup.appendChild(grid);
                    searchResultsList.appendChild(yearGroup);
                }
                const item = createResultItemElement(date, "result-range");
                yearGroup.querySelector('.results-grid').appendChild(item);
            });
        } else {
            searchResultsList.innerHTML = "<p style='font-size:0.8rem; grid-column: 1 / -1;'>No matches found in this range.</p>";
        }
        return;
    }

    // Default Infinite Scan
    if (!appending) searchResultsList.innerHTML = "";

    // Helper function for grouping boxes by year
    function appendBoxToYearGroup(container, date, className) {
        const year = date.getFullYear();
        let yearGroup = container.querySelector(`.year-group[data-year="${year}"]`);

        if (!yearGroup) {
            // Determine where to insert the new year group to maintain chronological/reverse-chronological order
            yearGroup = document.createElement("div");
            yearGroup.className = "year-group";
            yearGroup.setAttribute("data-year", year);

            const separator = document.createElement("h3");
            separator.className = "year-separator";
            separator.innerText = year;

            const grid = document.createElement("div");
            grid.className = "results-grid";

            yearGroup.appendChild(separator);
            yearGroup.appendChild(grid);

            // Find correct insertion point
            const existingGroups = Array.from(container.querySelectorAll('.year-group'));
            let inserted = false;

            for (let i = 0; i < existingGroups.length; i++) {
                const groupYear = parseInt(existingGroups[i].getAttribute("data-year"));
                // For future: ascending (insert before first group larger than current)
                // For past: descending (insert before first group smaller than current)
                if ((className.includes('future') && year < groupYear) ||
                    (className.includes('past') && year > groupYear)) {
                    container.insertBefore(yearGroup, existingGroups[i]);
                    inserted = true;
                    break;
                }
            }

            if (!inserted) {
                // Always put the Load More button at the very end if it exists
                const loadBtn = container.querySelector('.load-more-btn');
                if (loadBtn) {
                    container.insertBefore(yearGroup, loadBtn);
                } else {
                    container.appendChild(yearGroup);
                }
            }
        }

        const grid = yearGroup.querySelector('.results-grid');
        const item = createResultItemElement(date, className);
        grid.appendChild(item);
    }

    // --- FUTURE SCAN (RENDERED FIRST) ---
    if (direction === 'both' || direction === 'future') {
        const futureMatches = [];
        let fDate = lastSearchedFutureDate ? new Date(lastSearchedFutureDate) : new Date(); // Start today

        let hitFutureLimit = false;
        for (let i = 0; i < MAX_SCAN; i++) {
            if (futureMatches.length >= FUTURE_LIMIT) {
                hitFutureLimit = true;
                break;
            }
            if (checkDateMatch(fDate)) futureMatches.push(new Date(fDate));
            fDate.setDate(fDate.getDate() + 1);
        }
        lastSearchedFutureDate = new Date(fDate);

        let futureContainer = document.getElementById("futureResultsContainer");
        if (!futureContainer) {
            futureContainer = document.createElement("div");
            futureContainer.id = "futureResultsContainer";
            futureContainer.className = "results-segment";

            const header = document.createElement("div");
            header.className = "result-header";
            header.innerText = "Upcoming Dates";
            futureContainer.appendChild(header);

            // Ensure future comes before past if past already exists
            if (searchResultsList.firstChild) {
                searchResultsList.insertBefore(futureContainer, searchResultsList.firstChild);
            } else {
                searchResultsList.appendChild(futureContainer);
            }
        }

        futureMatches.forEach(date => {
            appendBoxToYearGroup(futureContainer, date, "result-future");
        });

        if (hitFutureLimit) {
            let loadBtn = futureContainer.querySelector('.load-more-btn');
            if (!loadBtn) {
                loadBtn = document.createElement("button");
                loadBtn.className = "load-more-btn";
                loadBtn.innerText = "Load More Upcoming";
                loadBtn.onclick = () => performSearch(true, 'future');
                futureContainer.appendChild(loadBtn);
            }
        } else if (futureMatches.length === 0 && !appending) {
            const p = document.createElement("p");
            p.style.fontSize = "0.8rem";
            p.style.gridColumn = "1 / -1";
            p.innerText = "No upcoming matches found.";
            futureContainer.appendChild(p);
        }
    }

    // --- PAST SCAN (RENDERED SECOND) ---
    if (direction === 'both' || direction === 'past') {
        const pastMatches = [];
        let pDate = lastSearchedPastDate ? new Date(lastSearchedPastDate) : new Date();
        if (!lastSearchedPastDate) pDate.setDate(pDate.getDate() - 1); // Start yesterday

        let hitPastLimit = false;
        for (let i = 0; i < MAX_SCAN; i++) {
            if (pastMatches.length >= PAST_LIMIT) {
                hitPastLimit = true;
                break;
            }
            if (checkDateMatch(pDate)) pastMatches.push(new Date(pDate));
            pDate.setDate(pDate.getDate() - 1);
        }
        lastSearchedPastDate = new Date(pDate);

        let pastContainer = document.getElementById("pastResultsContainer");
        if (!pastContainer) {
            pastContainer = document.createElement("div");
            pastContainer.id = "pastResultsContainer";
            pastContainer.className = "results-segment";

            const header = document.createElement("div");
            header.className = "result-header";
            header.innerText = "Previous Dates";
            pastContainer.appendChild(header);
            searchResultsList.appendChild(pastContainer);
        }

        pastMatches.forEach(date => {
            appendBoxToYearGroup(pastContainer, date, "result-past");
        });

        if (hitPastLimit) {
            let loadBtn = pastContainer.querySelector('.load-more-btn');
            if (!loadBtn) {
                loadBtn = document.createElement("button");
                loadBtn.className = "load-more-btn";
                loadBtn.innerText = "Load More Past";
                loadBtn.onclick = () => performSearch(true, 'past');
                pastContainer.appendChild(loadBtn);
            }
        } else if (pastMatches.length === 0 && !appending) {
            const p = document.createElement("p");
            p.style.fontSize = "0.8rem";
            p.style.gridColumn = "1 / -1";
            p.innerText = "No previous matches found.";
            pastContainer.appendChild(p);
        }
    }
}

btnShowList.addEventListener("click", () => performSearch());

function createResultItemElement(date, className) {
    const div = document.createElement("div");
    div.className = `result-box ${className}`;

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const lp = calculateLifePath(day, month, year);

    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const dateStr = date.toLocaleDateString('en-US', options);

    div.innerHTML = `
        <div class="box-date">${dateStr}</div>
    `;

    div.addEventListener("click", () => {
        currentDate = new Date(date);
        renderCalendar(currentDate);
        setTimeout(() => {
            const targetStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const cell = document.querySelector(`.day-cell[data-date='${targetStr}']`);
            if (cell) selectDay(cell, targetStr, date.getDate(), date.getMonth() + 1, date.getFullYear());
        }, 50);
    });

    return div;
}

// ==========================================
// 6. KEYBOARD NAVIGATION
// ==========================================

document.addEventListener("keydown", (e) => {

    if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        renderCalendar(currentDate);
        return;
    }
    if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        renderCalendar(currentDate);
        return;
    }

    if (e.ctrlKey && e.key === 'ArrowLeft') {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
        return;
    }
    if (e.ctrlKey && e.key === 'ArrowRight') {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
        return;
    }

    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const activeEl = document.activeElement;
    if (!activeEl.classList.contains("day-cell")) return;

    e.preventDefault();

    const allDays = Array.from(document.querySelectorAll(".day-cell"));
    const currentIndex = allDays.indexOf(activeEl);
    let newIndex = currentIndex;

    if (e.key === 'ArrowRight') newIndex++;
    if (e.key === 'ArrowLeft') newIndex--;
    if (e.key === 'ArrowUp') newIndex -= 7;
    if (e.key === 'ArrowDown') newIndex += 7;

    if (newIndex >= 0 && newIndex < allDays.length) {
        allDays[newIndex].focus();
        allDays[newIndex].click();
    }
});

// ==========================================
// 7. MAIN LISTENERS
// ==========================================

document.getElementById("prevBtn").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

document.getElementById("nextBtn").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

document.getElementById("closeDetails").addEventListener("click", () => {
    detailsPanel.classList.add("hidden");
    document.querySelectorAll(".day-cell.selected").forEach(el => el.classList.remove("selected"));
});

renderCalendar(currentDate);

// Page load only: open today's details as if the user had clicked it.
{
    const todayCell = document.querySelector(".day-cell.today");
    if (todayCell) {
        const [y, m, d] = todayCell.dataset.date.split("-").map(Number);
        selectDay(todayCell, todayCell.dataset.date, d, m, y, true);
    }
}