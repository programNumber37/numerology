// ============================================
// DOM REFERENCES
// ============================================

// Birth Reading Elements
const getReadingBtn = document.getElementById("getReadingBtn");
const birthDateInput = document.getElementById("birthDate");
const readingResult = document.getElementById("readingResult");
const readingEmpty = document.getElementById("readingEmpty");
const readingGrid = document.getElementById("readingGrid");
const readingQuotes = document.getElementById("readingQuotes");
const shareReadingBtn = document.getElementById("shareReadingBtn");

// Word Analysis Elements
const tabBirth = document.getElementById("tabBirth");
const tabWord = document.getElementById("tabWord");
const birthReadingForm = document.getElementById("birthReadingForm");
const wordReadingForm = document.getElementById("wordReadingForm");
const getWordReadingBtn = document.getElementById("getWordReadingBtn");
const wordInput = document.getElementById("wordInput");
const wordResult = document.getElementById("wordResult");
const wordAnalysisContent = document.getElementById("wordAnalysisContent");
const emptyMessage = document.getElementById("emptyMessage");

// Name Analysis Elements
const tabName = document.getElementById("tabName");
const nameReadingForm = document.getElementById("nameReadingForm");
const getNameReadingBtn = document.getElementById("getNameReadingBtn");
const nameInput = document.getElementById("nameInput");
const nameResult = document.getElementById("nameResult");
const nameGrid = document.getElementById("nameGrid");
const nameAnalysisContent = document.getElementById("nameAnalysisContent");

// ============================================
// TABS LOGIC
// ============================================
function switchTab(tab) {
    if (tab === 'birth') {
        tabBirth.classList.add('active');
        tabWord.classList.remove('active');
        tabName.classList.remove('active');

        birthReadingForm.classList.remove('hidden');
        wordReadingForm.classList.add('hidden');
        nameReadingForm.classList.add('hidden');

        readingResult.classList.add('hidden');
        wordResult.classList.add('hidden');
        nameResult.classList.add('hidden');

        readingEmpty.classList.remove('hidden');
        if (emptyMessage) emptyMessage.textContent = "Enter your birthdate to reveal your numerology reading.";
    } else if (tab === 'word') {
        tabWord.classList.add('active');
        tabBirth.classList.remove('active');
        tabName.classList.remove('active');

        wordReadingForm.classList.remove('hidden');
        birthReadingForm.classList.add('hidden');
        nameReadingForm.classList.add('hidden');

        readingResult.classList.add('hidden');
        wordResult.classList.add('hidden');
        nameResult.classList.add('hidden');

        readingEmpty.classList.remove('hidden');
        if (emptyMessage) emptyMessage.textContent = "Enter a word or sentence to reveal its numerical essence.";
    } else if (tab === 'name') {
        tabName.classList.add('active');
        tabBirth.classList.remove('active');
        tabWord.classList.remove('active');

        nameReadingForm.classList.remove('hidden');
        birthReadingForm.classList.add('hidden');
        wordReadingForm.classList.add('hidden');

        readingResult.classList.add('hidden');
        wordResult.classList.add('hidden');
        nameResult.classList.add('hidden');

        readingEmpty.classList.remove('hidden');
        if (emptyMessage) emptyMessage.textContent = "Enter your full name at birth to reveal your core numbers.";
    }
}

tabBirth.addEventListener("click", () => switchTab('birth'));
tabWord.addEventListener("click", () => switchTab('word'));
tabName.addEventListener("click", () => switchTab('name'));

// ============================================
// BIRTH READING
// ============================================
getReadingBtn.addEventListener("click", () => {
    const dateVal = birthDateInput.value;
    if (!dateVal) {
        alert("Please enter your birthdate.");
        return;
    }

    const dateObj = new Date(dateVal);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // 1-indexed for numerology
    const year = dateObj.getFullYear();

    const lp = calculateLifePath(day, month, year);
    const dayNum = calculateDayNumber(day);
    const yearReducer = calculateYearReducer(year);
    const hidden = calculateHiddenSum(day, month, year);

    // Helpers
    const getMasterClass = (num) => {
        if (num === 33) return 'text-master-33';
        return isMasterNumber(num) ? 'text-master' : '';
    };

    const getHiddenClass = (num) => {
        if (num === 33) return 'text-master-33';
        return (isMasterNumber(num) || num === 20) ? 'text-master' : '';
    };

    const chineseZodiacStr = getChineseZodiac(year, month, day);
    const czParts = chineseZodiacStr.split(" ");
    const czElement = czParts.length > 1 ? czParts[0] : "";
    const czAnimal = czParts.length > 1 ? czParts[1] : czParts[0];

    readingGrid.innerHTML = `
        <div class="detail-item">
            <strong>Life Path</strong> 
            <span class="${getMasterClass(lp.final)}">${lp.base} / ${lp.final}</span> 
            <small>Standard Calculation</small>
        </div>
        
        <div class="detail-item">
            <strong>Day Number</strong> 
            <span class="${getHiddenClass(dayNum)}">${dayNum}</span>
            <small>Reduced from ${day}</small>
        </div>

        <div class="detail-item">
            <strong>Hidden Numbers</strong> 
            <span class="${getMasterClass(hidden.dmy.final)}">${hidden.dmy.raw} / ${hidden.dmy.final}</span>
            <small>Day + Month + Year (1 Step)</small>
        </div>

        <div class="detail-item">
            <strong>Year Reducer</strong> 
            <span class="${getMasterClass(yearReducer)}">${yearReducer}</span>
            <small>Reduced from ${year}</small>
        </div>

        <div class="detail-item">
            <strong>Chinese Zodiac</strong> 
            <span class="text-master">${chineseZodiacStr}</span>
            <small>Year of Birth</small>
        </div>
    `;

    let insightsHTML = `<h3 class="rd-insights-title">Your Numerology Insights</h3>`;

    // Add Lifepath Reading
    if (readingsDatabase.lifepaths[lp.final]) {
        insightsHTML += `
            <div class="rd-card rd-card--lifepath">
                <h4 class="rd-card__title">Lifepath ${lp.final}</h4>
                <p class="rd-card__text">${readingsDatabase.lifepaths[lp.final]}</p>
            </div>
        `;
    }

    // Add Extended Day/Month Reading
    const birthMonthDayKey = `${month}-${day}`;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const birthMonthName = monthNames[month - 1];
    if (typeof dayMonthDatabase !== 'undefined' && dayMonthDatabase[birthMonthDayKey]) {
        insightsHTML += `
            <div class="rd-card rd-card--month">
                <h4 class="rd-card__title">${birthMonthName} ${day} Reading</h4>
                <p class="rd-card__text">${dayMonthDatabase[birthMonthDayKey]}</p>
            </div>
        `;
    }

    // Always show the Birth Day (1-31) reading from readingsDatabase
    if (readingsDatabase.days[day]) {
        insightsHTML += `
            <div class="rd-card rd-card--day">
                <h4 class="rd-card__title">Birth Day ${day}</h4>
                <p class="rd-card__text">${readingsDatabase.days[day]}</p>
            </div>
        `;
    }

    // Add Year Number Reading (alongside days)
    if (readingsDatabase.years[yearReducer]) {
        insightsHTML += `
            <div class="rd-card rd-card--year">
                <h4 class="rd-card__title">Born in a ${yearReducer} Year:</h4>
                <p class="rd-card__text">${readingsDatabase.years[yearReducer]}</p>
            </div>
        `;
    }

    if (typeof chineseSignDatabase !== 'undefined' && chineseSignDatabase[czAnimal]) {
        const czData = chineseSignDatabase[czAnimal];
        const typeData = czData.types[czElement] || "";

        // Extract the pure personality text by finding where "THE [ANIMAL] PERSONALITY" starts
        const personalityMarker = `THE ${czAnimal.toUpperCase()} PERSONALITY`;
        const markerIndex = czData.personality.indexOf(personalityMarker);
        const purePersonality = markerIndex !== -1
            ? czData.personality.slice(markerIndex + personalityMarker.length).trim()
            : czData.personality;

        const signRelationships = {
            "Rat": { friendly: ["Dragon", "Monkey"], enemy: "Horse" },
            "Ox": { friendly: ["Snake", "Rooster"], enemy: "Sheep" },
            "Tiger": { friendly: ["Horse", "Dog"], enemy: "Monkey" },
            "Rabbit": { friendly: ["Sheep", "Boar"], enemy: "Rooster" },
            "Dragon": { friendly: ["Rat", "Monkey"], enemy: "Dog" },
            "Snake": { friendly: ["Ox", "Rooster"], enemy: "Boar" },
            "Horse": { friendly: ["Tiger", "Dog"], enemy: "Rat" },
            "Sheep": { friendly: ["Rabbit", "Boar"], enemy: "Ox" },
            "Monkey": { friendly: ["Rat", "Dragon"], enemy: "Tiger" },
            "Rooster": { friendly: ["Ox", "Snake"], enemy: "Rabbit" },
            "Dog": { friendly: ["Tiger", "Horse"], enemy: "Dragon" },
            "Boar": { friendly: ["Rabbit", "Sheep"], enemy: "Snake" }
        };
        const rels = signRelationships[czAnimal];

        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 100;
        const endYear = currentYear + 20;

        const signIndexMap = {
            "Monkey": 0, "Rooster": 1, "Dog": 2, "Boar": 3,
            "Rat": 4, "Ox": 5, "Tiger": 6, "Rabbit": 7,
            "Dragon": 8, "Snake": 9, "Horse": 10, "Sheep": 11
        };

        const getYearsForSign = (sign) => {
            const index = signIndexMap[sign];
            const years = [];
            for (let y = startYear; y <= endYear; y++) {
                if (y % 12 === index) {
                    years.push(y);
                }
            }
            return years.join(', ');
        };

        insightsHTML += `
            <div class="rd-card rd-card--chinese">
                <div class="rd-collapsible-header" onclick="const body = this.nextElementSibling; body.classList.toggle('hidden'); const arrow = this.querySelector('.rd-arrow'); arrow.style.transform = body.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';">
                    <div class="rd-collapsible-preview">
                        <h4 class="rd-card__title" style="margin-bottom: 6px;">${czAnimal} Sign Reading</h4>
                        <div class="rd-collapsible-preview-text">
                            <p>Discover Ranking order, Hours ruled, the ${czAnimal} personality, ${czElement} type details, and more inner attributes...</p>
                        </div>
                    </div>
                    <span class="rd-arrow">▼</span>
                </div>
                <div class="rd-collapsible-body hidden">
                    <h5 class="rd-section-title">Sign Details</h5>
                    <p class="rd-section-text">${czData.stats}</p>
                    <p class="rd-section-text">
                        <strong>Friendly Signs:</strong><br>
                        ${rels.friendly[0]} (${getYearsForSign(rels.friendly[0])})<br>
                        ${rels.friendly[1]} (${getYearsForSign(rels.friendly[1])})
                    </p>
                    <p class="rd-section-text">
                        <strong>Enemy Sign:</strong><br>
                        ${rels.enemy} (${getYearsForSign(rels.enemy)})
                    </p>
                    
                    <h5 class="rd-section-title">The ${czAnimal} Personality</h5>
                    <p class="rd-section-text">${purePersonality}</p>
                    
                    <h5 class="rd-section-title">The Year of the ${czAnimal}</h5>
                    <p class="rd-section-text">${czData.year_energy}</p>
                    <p class="rd-section-note">Note: This represents the energy for ${czAnimal} years in general.</p>
                    
                    <h5 class="rd-section-title">The ${czElement} ${czAnimal}</h5>
                    <p class="rd-section-text">${typeData}</p>
                    
                    <h5 class="rd-section-title">The ${czAnimal} Child</h5>
                    <p class="rd-section-text" style="margin-bottom: 0;">${czData.child}</p>
                    
                </div>
            </div>
        `;
    }

    readingQuotes.innerHTML = insightsHTML;

    readingEmpty.classList.add("hidden");
    readingResult.classList.remove("hidden");

    if (window.innerWidth <= 768) {
        setTimeout(() => {
            readingResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
});

// ============================================
// WORD ANALYSIS LOGIC
// ============================================

// A=1 to Z=26
function getLetterValue(char) {
    const code = char.toUpperCase().charCodeAt(0);
    if (code >= 65 && code <= 90) {
        return code - 64;
    }
    return 0; // ignores spaces/punctuation
}

// Case sensitive: a=1..z=26, A=27..Z=52
function getCaseSensitiveValue(char) {
    const code = char.charCodeAt(0);
    if (code >= 97 && code <= 122) { // a-z
        return code - 96;
    } else if (code >= 65 && code <= 90) { // A-Z
        return code - 64 + 26;
    }
    return 0;
}

function getStrictReducedNumber(num) {
    let current = num;
    while (current > 9) {
        current = sumDigits(current);
    }
    return current;
}

const addWordBtn = document.getElementById("addWordBtn");
const wordInputsContainer = document.getElementById("wordInputsContainer");
let wordInputCount = 1;

if (addWordBtn) {
    addWordBtn.addEventListener("click", () => {
        wordInputCount++;
        const newGroup = document.createElement("div");
        newGroup.className = "search-group word-input-group";
        newGroup.innerHTML = `
            <label>Word or Sentence ${wordInputCount}</label>
            <input type="text" class="word-input-field" placeholder="e.g. WORD">
        `;
        wordInputsContainer.appendChild(newGroup);

        const newInput = newGroup.querySelector('.word-input-field');
        newInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                getWordReadingBtn.click();
            }
        });
    });
}




getWordReadingBtn.addEventListener("click", () => {
    const inputs = document.querySelectorAll(".word-input-field");
    const isCapitalSensitive = document.getElementById("capitalSensitiveCheck").checked;

    let words = [];
    inputs.forEach(input => {
        const val = input.value.trim();
        if (val) words.push(val);
    });

    if (words.length === 0) {
        alert("Please enter at least one word or sentence.");
        return;
    }

    let allWordsHTML = '';

    words.forEach((word) => {
        const letters = word.replace(/[^A-Za-z]/g, '').split('');
        if (letters.length === 0) return;

        let topSum = 0;
        let bottomSum = 0;

        let equationHTML = `<div class="word-equation-row">`;
        let subEquationHTML = `<div class="word-equation-row">`;

        letters.forEach((l, index) => {
            const val = isCapitalSensitive ? getCaseSensitiveValue(l) : getLetterValue(l);
            const pythagoreanVal = getPythagoreanValue(l);

            topSum += val;
            bottomSum += pythagoreanVal;

            equationHTML += `
                <div class="letter-group">
                    <div class="letter">${l}</div>
                    <div class="value">${val}</div>
                </div>
            `;
            if (index < letters.length - 1) {
                equationHTML += `<div class="operator">+</div>`;
            }

            if (!isCapitalSensitive) {
                subEquationHTML += `
                    <div class="letter-group">
                        <div class="letter">${l}</div>
                        <div class="sub-value">${pythagoreanVal}</div>
                    </div>
                `;
                if (index < letters.length - 1) {
                    subEquationHTML += `<div class="operator">+</div>`;
                }
            }
        });

        const finalTopSum = getReducedNumber(topSum);

        equationHTML += `
            <div class="result-group">
                <div class="operator">=</div>
                <div class="sum-result">${topSum}</div>
                <div class="operator">=</div>
                <div class="final-result">${finalTopSum}</div>
            </div>
        </div>`;

        if (!isCapitalSensitive) {
            const finalBottomSum = getStrictReducedNumber(bottomSum);
            subEquationHTML += `
                <div class="result-group">
                    <div class="operator">=</div>
                    <div class="sum-result">${bottomSum}</div>
                    <div class="operator">=</div>
                    <div class="sub-final-result">${finalBottomSum}</div>
                </div>
            </div>`;
        }

        allWordsHTML += `
            <div class="word-analysis-box" style="margin-bottom: 20px;">
                <h3 style="text-align: center; margin-bottom: 15px;">${word}</h3>
                <div style="font-size: 0.85em; color: var(--th-text-muted); margin-bottom: 5px;">${isCapitalSensitive ? 'Capital Sensitive (a=1..z=26, A=27..Z=52)' : 'Standard (A-Z = 1-26)'}</div>
                ${equationHTML}
                ${!isCapitalSensitive ? `
                <div class="word-row-divider"></div>
                <div style="font-size: 0.85em; color: var(--th-text-muted); margin-bottom: 5px;">Pythagorean Method (A-Z = 1-9)</div>
                ${subEquationHTML}` : ''}
            </div>
        `;
    });

    if (allWordsHTML === '') {
        alert("Please enter valid alphabetical characters.");
        return;
    }

    wordAnalysisContent.innerHTML = allWordsHTML;

    readingEmpty.classList.add("hidden");
    readingResult.classList.add("hidden");
    nameResult.classList.add("hidden");
    wordResult.classList.remove("hidden");

    if (window.innerWidth <= 768) {
        setTimeout(() => {
            wordResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
});

// ============================================
// NAME ANALYSIS LOGIC
// ============================================

function getPythagoreanValue(char) {
    const code = char.toUpperCase().charCodeAt(0);
    if (code >= 65 && code <= 90) {
        return ((code - 65) % 9) + 1;
    }
    return 0;
}

function isVowel(char) {
    return ['A', 'E', 'I', 'O', 'U'].includes(char.toUpperCase());
}

getNameReadingBtn.addEventListener("click", () => {
    const fullName = nameInput.value.trim();
    if (!fullName) {
        alert("Please enter a full name.");
        return;
    }

    const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('');
    if (letters.length === 0) {
        alert("Please enter valid alphabetical characters.");
        return;
    }

    let totalExp = 0;
    let totalPer = 0;
    let totalSoul = 0;

    letters.forEach(l => {
        const val = getPythagoreanValue(l);
        totalExp += val;
        if (isVowel(l)) {
            totalSoul += val;
        } else {
            totalPer += val;
        }
    });

    const finalExp = getReducedNumber(totalExp);
    const finalPer = getReducedNumber(totalPer);
    const finalSoul = getReducedNumber(totalSoul);

    const getMasterClass = (num) => {
        if (num === 33) return 'text-master-33';
        return isMasterNumber(num) ? 'text-master' : '';
    };

    nameGrid.innerHTML = `
        <div class="detail-item">
            <strong>Expression Number</strong> 
            <span class="${getMasterClass(finalExp)}">${totalExp} / ${finalExp}</span> 
            <small>All Letters</small>
        </div>
        
        <div class="detail-item">
            <strong>Personality Number</strong> 
            <span class="${getMasterClass(finalPer)}">${totalPer} / ${finalPer}</span>
            <small>Consonants Only</small>
        </div>

        <div class="detail-item">
            <strong>Soul Urge Number</strong> 
            <span class="${getMasterClass(finalSoul)}">${totalSoul} / ${finalSoul}</span>
            <small>Vowels Only</small>
        </div>
    `;

    // Create breakdown UI
    let equationHTML = `<div class="word-equation-row" style="flex-wrap: wrap; justify-content: center; gap: 10px;">`;

    const words = fullName.toUpperCase().split(/\s+/);

    words.forEach((wordElement, wordIndex) => {
        let wordBlockHTML = `<div style="display: flex; gap: 5px;">`;

        for (let i = 0; i < wordElement.length; i++) {
            const l = wordElement[i];
            const charCode = l.charCodeAt(0);
            if (charCode >= 65 && charCode <= 90) {
                const val = getPythagoreanValue(l);
                const isVow = isVowel(l);

                wordBlockHTML += `
                    <div class="letter-group" style="padding: 5px; border: 1px solid var(--th-border-light); border-radius: 5px; background: ${isVow ? 'var(--th-accent-bg)' : 'var(--th-surface-alt)'};">
                        <div class="letter" style="font-size: 1.2rem; font-weight: bold;">${l}</div>
                        <div class="value" style="font-size: 0.9rem;">${val}</div>
                        <div style="font-size: 0.7rem; color: ${isVow ? 'var(--th-accent)' : 'var(--th-text-muted)'};">${isVow ? 'Vowel' : 'Cons'}</div>
                    </div>
                `;
            }
        }
        wordBlockHTML += `</div>`;
        equationHTML += wordBlockHTML;
        if (wordIndex < words.length - 1) {
            equationHTML += `<div style="width: 20px;"></div>`; // Space between words
        }
    });
    equationHTML += `</div>`;

    nameAnalysisContent.innerHTML = `
        <div class="word-analysis-box" style="margin-top: 20px;">
            <h3 style="margin-bottom: 15px; text-align: center;">Letter Breakdown</h3>
            ${equationHTML}
            <div style="text-align: center; margin-top: 15px; font-size: 0.9em; color: var(--th-text-muted);">
                Note: Using Pythagorean reduction (A=1...I=9)
            </div>
        </div>
    `;

    readingEmpty.classList.add("hidden");
    readingResult.classList.add("hidden");
    wordResult.classList.add("hidden");
    nameResult.classList.remove("hidden");

    if (window.innerWidth <= 768) {
        setTimeout(() => {
            nameResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
const initialWordInput = document.querySelector('.word-input-field');
if (initialWordInput) {
    initialWordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            getWordReadingBtn.click();
        }
    });
}

birthDateInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        getReadingBtn.click();
    }
});

nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        getNameReadingBtn.click();
    }
});

// ============================================
// URL PARAMS & SHARING
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dob = urlParams.get('dob');
    if (dob) {
        birthDateInput.value = dob;
        getReadingBtn.click();
    }
});

if (shareReadingBtn) {
    shareReadingBtn.addEventListener("click", () => {
        const dateVal = birthDateInput.value;
        if (!dateVal) {
            alert("Please calculate a reading first.");
            return;
        }

        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?dob=${dateVal}`;

        navigator.clipboard.writeText(shareUrl).then(() => {
            const originalText = shareReadingBtn.textContent;
            shareReadingBtn.textContent = "Link Copied!";
            shareReadingBtn.style.backgroundColor = "#4caf50";
            shareReadingBtn.style.color = "white";
            setTimeout(() => {
                shareReadingBtn.textContent = originalText;
                shareReadingBtn.style.backgroundColor = "";
                shareReadingBtn.style.color = "";
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            alert("Could not copy automatically. Here is the link:\n" + shareUrl);
        });
    });
}