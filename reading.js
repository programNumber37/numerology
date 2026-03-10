// Birth Reading Elements
const getReadingBtn = document.getElementById("getReadingBtn");
const birthDateInput = document.getElementById("birthDate");
const readingResult = document.getElementById("readingResult");
const readingEmpty = document.getElementById("readingEmpty");
const readingGrid = document.getElementById("readingGrid");
const readingQuotes = document.getElementById("readingQuotes");

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

// Tabs Logic
function switchTab(tab) {
    if (tab === 'birth') {
        tabBirth.classList.add('active');
        tabWord.classList.remove('active');
        birthReadingForm.classList.remove('hidden');
        wordReadingForm.classList.add('hidden');

        readingResult.classList.add('hidden');
        wordResult.classList.add('hidden');
        readingEmpty.classList.remove('hidden');
        if (emptyMessage) emptyMessage.textContent = "Enter your birthdate to reveal your numerology reading.";
    } else {
        tabWord.classList.add('active');
        tabBirth.classList.remove('active');
        wordReadingForm.classList.remove('hidden');
        birthReadingForm.classList.add('hidden');

        readingResult.classList.add('hidden');
        wordResult.classList.add('hidden');
        readingEmpty.classList.remove('hidden');
        if (emptyMessage) emptyMessage.textContent = "Enter a word or sentence to reveal its numerical essence.";
    }
}

tabBirth.addEventListener("click", () => switchTab('birth'));
tabWord.addEventListener("click", () => switchTab('word'));

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
    `;

    let insightsHTML = `<h3 style="margin-bottom:15px; color:#555;">Your Numerology Insights</h3>`;

    // Add Lifepath Reading
    if (readingsDatabase.lifepaths[lp.final]) {
        insightsHTML += `
            <div class="reading-card" style="margin-bottom: 20px; padding: 15px; background: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-left: 4px solid var(--primary-color);">
                <h4 style="color: var(--primary-color); margin-bottom: 10px;">Lifepath ${lp.final}</h4>
                <p style="line-height: 1.6; color: #444;">${readingsDatabase.lifepaths[lp.final]}</p>
            </div>
        `;
    }

    // Add Year Number Reading
    if (readingsDatabase.years[yearReducer]) {
        insightsHTML += `
            <div class="reading-card" style="margin-bottom: 20px; padding: 15px; background: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-left: 4px solid var(--secondary-color);">
                <h4 style="color: var(--secondary-color); margin-bottom: 10px;">Personal Year ${yearReducer}</h4>
                <p style="line-height: 1.6; color: #444;">${readingsDatabase.years[yearReducer]}</p>
            </div>
        `;
    }

    // Add Extended Day/Month Reading
    const birthMonthDayKey = `${month}-${day}`;
    if (typeof dayMonthDatabase !== 'undefined' && dayMonthDatabase[birthMonthDayKey]) {
        insightsHTML += `
            <div class="reading-card" style="margin-bottom: 20px; padding: 15px; background: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-left: 4px solid #6b4c9a;">
                <h4 style="color: #6b4c9a; margin-bottom: 10px;">Birth Date Extended Reading</h4>
                <p style="line-height: 1.6; color: #444;">${dayMonthDatabase[birthMonthDayKey]}</p>
            </div>
        `;
    } else if (readingsDatabase.days[day]) {
        // Fallback to generic day if no specific month/day text exists
        insightsHTML += `
            <div class="reading-card" style="margin-bottom: 20px; padding: 15px; background: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-left: 4px solid #6b4c9a;">
                <h4 style="color: #6b4c9a; margin-bottom: 10px;">Birth Day ${day}</h4>
                <p style="line-height: 1.6; color: #444;">${readingsDatabase.days[day]}</p>
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

// --- Word Analysis Logic --- //

// A=1 to Z=26
function getLetterValue(char) {
    const code = char.toUpperCase().charCodeAt(0);
    if (code >= 65 && code <= 90) {
        return code - 64;
    }
    return 0; // ignores spaces/punctuation
}

getWordReadingBtn.addEventListener("click", () => {
    const word = wordInput.value.trim();
    if (!word) {
        alert("Please enter a word or sentence.");
        return;
    }

    // Filter only letters
    const letters = word.toUpperCase().replace(/[^A-Z]/g, '').split('');
    if (letters.length === 0) {
        alert("Please enter valid alphabetical characters.");
        return;
    }

    let topSum = 0;
    let bottomSum = 0;
    let equationHTML = `<div class="word-equation-row">`;
    let subEquationHTML = `<div class="word-equation-row">`;

    letters.forEach((l, index) => {
        const val = getLetterValue(l); // e.g. W = 23
        const reducedVal = getReducedNumber(val); // W = 23 -> 5

        topSum += val;
        bottomSum += reducedVal;

        equationHTML += `
            <div class="letter-group">
                <div class="letter">${l}</div>
                <div class="value">${val}</div>
            </div>
        `;
        if (index < letters.length - 1) {
            equationHTML += `<div class="operator">+</div>`;
        }

        subEquationHTML += `
            <div class="letter-group">
                <div class="letter">${l}</div>
                <div class="sub-value">${reducedVal}</div>
            </div>
        `;
        if (index < letters.length - 1) {
            subEquationHTML += `<div class="operator">+</div>`;
        }
    });

    const finalTopSum = getReducedNumber(topSum);
    const finalBottomSum = getReducedNumber(bottomSum);

    equationHTML += `
        <div class="result-group">
            <div class="operator">=</div>
            <div class="sum-result">${topSum}</div>
            <div class="operator">=</div>
            <div class="final-result">${finalTopSum}</div>
        </div>
    </div>`;

    subEquationHTML += `
        <div class="result-group">
            <div class="operator">=</div>
            <div class="sum-result">${bottomSum}</div>
            <div class="operator">=</div>
            <div class="sub-final-result">${finalBottomSum}</div>
        </div>
    </div>`;

    wordAnalysisContent.innerHTML = `
        <div class="word-analysis-box">
            ${equationHTML}
            <div class="word-row-divider"></div>
            ${subEquationHTML}
        </div>
    `;

    readingEmpty.classList.add("hidden");
    readingResult.classList.add("hidden");
    wordResult.classList.remove("hidden");
    
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            wordResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
});

wordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        getWordReadingBtn.click();
    }
});

birthDateInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        getReadingBtn.click();
    }
});