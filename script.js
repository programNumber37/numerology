// ==========================================
// 2. DOM ELEMENTS, STATE
// ==========================================

let currentDate = new Date();

let searchFilterLP = null;
let searchFilterDay = null;
let searchFilterAny = null;

const daysContainer = document.getElementById("daysContainer");
const currentMonthText = document.getElementById("currentMonth");
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
const searchResultsList = document.getElementById("searchResultsList");


// ==========================================
// 3. UI FUNCTIONS
// ==========================================

function updateDetailsPanel(dateStr, day, month, year) {
    detailsPanel.classList.remove("hidden");

    const dateObj = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const lp = calculateLifePath(day, month, year);
    const dayNum = calculateDayNumber(day);
    const yearReducer = calculateYearReducer(year);
    const hidden = calculateHiddenSum(day, month);
    const luckyVal = calculateLuckyNumber(month, year);

    const allEnergiesForEmojis = [day, dayNum, lp.base, lp.final, hidden.raw, hidden.final, hidden.visual, luckyVal];
    const emojiArray = getEmojis(allEnergiesForEmojis);
    const dayEmojis = emojiArray.join(' ');

    detailsDate.innerHTML = `${dateObj.toLocaleDateString('en-US', options)} <span class="detail-emoji">${dayEmojis}</span>`;

    const isThirtyThree = lp.final === 33 || dayNum === 33 || hidden.visual === 33 || hidden.raw === 33;
    const isMainMaster = isMasterNumber(lp.final) || isMasterNumber(dayNum);
    const isHiddenMaster = isMasterNumber(hidden.raw) || dayNum === 20 || isMasterNumber(hidden.visual);

    detailsPanel.classList.remove("master-theme", "master-33-theme");

    if (isThirtyThree) {
        detailsPanel.classList.add("master-33-theme");
    } else if (isMainMaster || isHiddenMaster) {
        detailsPanel.classList.add("master-theme");
    }

    const getMasterClass = (num) => {
        if (num === 33) return 'text-master-33';
        return isMasterNumber(num) ? 'text-master' : '';
    };

    const getHiddenClass = (num) => {
        if (num === 33) return 'text-master-33';
        return (isMasterNumber(num) || num === 20) ? 'text-master' : '';
    };

    // --- NEW: Fetch Random Quote Logic ---
    // Look at all unique energies for the day
    const activeEnergies = [...new Set(allEnergiesForEmojis)];
    let availableQuotes = [];

    // Gather all quotes that match today's numbers
    activeEnergies.forEach(energy => {
        if (energyQuotes[energy]) {
            // Tag each quote with the energy it belongs to so we can display it on the badge
            const quotesWithEnergy = energyQuotes[energy].map(q => ({ ...q, energyRef: energy }));
            availableQuotes = availableQuotes.concat(quotesWithEnergy);
        }
    });

    let quoteHTML = '';
    if (availableQuotes.length > 0) {
        // Pick one randomly
        const randomIdx = Math.floor(Math.random() * availableQuotes.length);
        const selectedQuote = availableQuotes[randomIdx];

        quoteHTML = `
            <div class="tweet-card">
                <div class="tweet-header">
                    <span class="tweet-author">${selectedQuote.author}</span>
                    <span class="tweet-energy-badge">${selectedQuote.energyRef} Energy</span>
                </div>
                <p class="tweet-text">"${selectedQuote.text}"</p>
            </div>
        `;
    }

    detailsContent.innerHTML = `
        <div class="detail-grid">
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
                <strong>Date Sum (Hidden)</strong> 
                <span class="${getMasterClass(hidden.final)}">${hidden.raw} / ${hidden.final}</span>
                <small>Day ${day} + Month ${month} ${hidden.visual === 33 ? '(Visual: ' + hidden.visual + ')' : ''}</small>
            </div>

            <div class="detail-item">
                <strong>Year Reducer</strong> 
                <span class="${getMasterClass(yearReducer)}">${yearReducer}</span>
                <small>Reduced from ${year}</small>
            </div>
        </div>
        
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
        
        <div style="line-height: 1.6; color: #555;">
            <p><strong>Daily Insights:</strong></p>
            <p>${dayNum === 20 ? '<b>Special Note:</b> The day 20 is considered a hidden 11.<br>' : ''}</p>
            <p>${hidden.visual === 33 ? '<b>Special Note:</b> Visual 33 detected (Day ' + day + ' and Month ' + month + ').<br>' : ''}</p>
            ${quoteHTML} </div>
    `;
}

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const numerologyMonth = month + 1;

    // Update Header
    const monthName = date.toLocaleString('default', { month: 'long' });
    currentMonthText.innerText = monthName;
    yearInput.value = year;

    const lucky = calculateLuckyNumber(numerologyMonth, year);
    luckyNumDisplay.innerText = lucky;
    luckyNumDisplay.className = isMasterNumber(lucky) ? (lucky === 33 ? 'text-master-33' : 'text-master') : '';

    daysContainer.innerHTML = "";

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
        const hidden = calculateHiddenSum(day, numerologyMonth);
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
            const allEnergies = [lp.base, lp.final, day, dayNum, hidden.raw, hidden.final, hidden.visual, luckyVal];
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
        const allEnergiesForEmojis = [day, dayNum, lp.base, lp.final, hidden.raw, hidden.final, hidden.visual];
        const emojiArray = getEmojis(allEnergiesForEmojis);
        const dayEmojis = emojiArray.join('');

        // If more than 2 emojis, add the small-emojis class
        const emojiClass = emojiArray.length > 2 ? "cell-emoji small-emojis" : "cell-emoji";

        const isThirtyThree = lp.final === 33 || dayNum === 33 || hidden.visual === 33 || hidden.raw === 33;
        const isMainMaster = isMasterNumber(lp.final) || isMasterNumber(dayNum) || isMasterNumber(luckyVal);
        const isHiddenMaster = isMasterNumber(hidden.raw) || day === 20 || isMasterNumber(hidden.visual);

        if (isThirtyThree) {
            dayCell.classList.add("master-33");
        } else if (isMainMaster) {
            dayCell.classList.add("master-main");
        } else if (isHiddenMaster) {
            dayCell.classList.add("master-hidden");
        }

        const getMasterClass = (num) => {
            if (num === 33) return 'text-master-33';
            return isMasterNumber(num) ? 'text-master' : '';
        };

        dayCell.innerHTML = `
            ${emojiArray.length > 0 ? `<div class="${emojiClass}">${dayEmojis}</div>` : ''}
            <div class="cell-date">${displayDate}</div>
            <div class="cell-lp ${getMasterClass(lp.final)}">${lp.final}</div>
            <div class="cell-day-num">D: <span class="${getMasterClass(dayNum)}">${dayNum}</span></div>
        `;

        dayCell.addEventListener("click", () => selectDay(dayCell, dateString, day, numerologyMonth, year));
        dayCell.addEventListener("keydown", (e) => {
            if (e.key === "Enter") selectDay(dayCell, dateString, day, numerologyMonth, year);
        });

        daysContainer.appendChild(dayCell);
    }
}

function selectDay(cell, dateStr, day, month, year) {
    document.querySelectorAll(".day-cell.selected").forEach(el => el.classList.remove("selected"));
    cell.classList.add("selected");
    cell.focus();
    updateDetailsPanel(dateStr, day, month, year);
}

// ==========================================
// 4. YEAR & INPUT LOGIC
// ==========================================

yearInput.addEventListener("change", (e) => {
    const newYear = parseInt(e.target.value);
    if (!isNaN(newYear)) {
        currentDate.setFullYear(newYear);
        renderCalendar(currentDate);
    }
});

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

btnClear.addEventListener("click", () => {
    inputLP.value = "";
    inputDay.value = "";
    inputAny.value = "";
    searchResultsList.innerHTML = "";
    handleSearchUpdate();
});

// ==========================================
// 5. FIND MATCHES ("SHOW LIST") LOGIC
// ==========================================

btnShowList.addEventListener("click", () => {
    if (searchFilterLP === null && searchFilterDay === null && searchFilterAny === null) {
        searchResultsList.innerHTML = "<p style='color:red; font-size:0.8rem;'>Please enter criteria first.</p>";
        return;
    }

    searchResultsList.innerHTML = "<p style='font-size:0.8rem; color:#888;'>Searching...</p>";

    function checkDateMatch(d) {
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

        const lp = calculateLifePath(day, month, year);
        const dayNum = calculateDayNumber(day);
        const hidden = calculateHiddenSum(day, month);

        let lpMatch = searchFilterLP !== null ? (lp.final === searchFilterLP || lp.base === searchFilterLP) : true;
        let dayMatch = searchFilterDay !== null ? (dayNum === searchFilterDay || day === searchFilterDay) : true;

        let match = true;
        if (searchFilterLP !== null || searchFilterDay !== null) match = lpMatch && dayMatch;

        if (searchFilterAny !== null) {
            const lucky = calculateLuckyNumber(month, year);
            const all = [lp.base, lp.final, day, dayNum, hidden.raw, hidden.final, hidden.visual, lucky];
            match = all.includes(searchFilterAny);
        }

        return match && (searchFilterLP !== null || searchFilterDay !== null || searchFilterAny !== null);
    }

    const pastMatches = [];
    const futureMatches = [];
    const limit = 5;
    const maxDaysScan = 5000;

    // Find Past
    let tempDate = new Date();
    tempDate.setDate(tempDate.getDate() - 1);

    for (let i = 0; i < maxDaysScan; i++) {
        if (pastMatches.length >= limit) break;
        if (checkDateMatch(tempDate)) pastMatches.push(new Date(tempDate));
        tempDate.setDate(tempDate.getDate() - 1);
    }

    // Find Future
    tempDate = new Date();
    for (let i = 0; i < maxDaysScan; i++) {
        if (futureMatches.length >= limit) break;
        if (checkDateMatch(tempDate)) futureMatches.push(new Date(tempDate));
        tempDate.setDate(tempDate.getDate() + 1);
    }

    searchResultsList.innerHTML = "";

    if (pastMatches.length > 0) {
        const header = document.createElement("div");
        header.className = "result-header";
        header.innerText = "Previous Dates";
        searchResultsList.appendChild(header);
        pastMatches.forEach(date => createResultItem(date, "result-past"));
    }

    if (futureMatches.length > 0) {
        const header = document.createElement("div");
        header.className = "result-header";
        header.innerText = "Upcoming Dates";
        searchResultsList.appendChild(header);
        futureMatches.forEach(date => createResultItem(date, "result-future"));
    }

    if (pastMatches.length === 0 && futureMatches.length === 0) {
        searchResultsList.innerHTML = "<p style='font-size:0.8rem;'>No matches found nearby.</p>";
    }
});

function createResultItem(date, className) {
    const div = document.createElement("div");
    div.className = `result-item ${className}`;

    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    div.innerText = date.toLocaleDateString('en-US', options);

    div.addEventListener("click", () => {
        currentDate = new Date(date);
        renderCalendar(currentDate);
        setTimeout(() => {
            const targetStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const cell = document.querySelector(`.day-cell[data-date='${targetStr}']`);
            if (cell) selectDay(cell, targetStr, date.getDate(), date.getMonth() + 1, date.getFullYear());
        }, 50);
    });

    searchResultsList.appendChild(div);
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