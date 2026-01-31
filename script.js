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
    return { raw: rawSum, final: reduced };
}

// ==========================================
// 2. DOM ELEMENTS & STATE
// ==========================================

let currentDate = new Date();

let searchFilterLP = null;
let searchFilterDay = null;

const daysContainer = document.getElementById("daysContainer");
const currentMonthText = document.getElementById("currentMonth");
const yearInput = document.getElementById("yearInput");
const luckyNumDisplay = document.getElementById("luckyNumDisplay");

const detailsPanel = document.getElementById("detailsPanel");
const detailsDate = document.getElementById("detailsDate");
const detailsContent = document.querySelector(".details-content");

const inputLP = document.getElementById("searchLP");
const inputDay = document.getElementById("searchDay");
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
    detailsDate.innerText = dateObj.toLocaleDateString('en-US', options);

    const lp = calculateLifePath(day, month, year);
    const dayNum = calculateDayNumber(day);
    const yearReducer = calculateYearReducer(year);
    const hidden = calculateHiddenSum(day, month);

    const isMainMaster = isMasterNumber(lp.final) || isMasterNumber(dayNum);
    const isHiddenMaster = isMasterNumber(hidden.raw) || dayNum === 20;
    
    if(isMainMaster || isHiddenMaster) {
        detailsPanel.classList.add("master-theme");
    } else {
        detailsPanel.classList.remove("master-theme");
    }

    const getMasterClass = (num) => isMasterNumber(num) ? 'text-master' : '';
    const getHiddenClass = (num) => (isMasterNumber(num) || num === 20) ? 'text-master' : '';

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
                <strong>Date Sum</strong> 
                <span class="${getMasterClass(hidden.final)}">${hidden.raw} / ${hidden.final}</span>
                <small>Hidden: Day ${day} + Month ${month}</small>
            </div>

            <div class="detail-item">
                <strong>Year Reducer</strong> 
                <span class="${getMasterClass(yearReducer)}">${yearReducer}</span>
                <small>Reduced from ${year}</small>
            </div>
        </div>
        
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
        
        <div style="line-height: 1.6; color: #555;">
            <p><strong>Daily Energy:</strong></p>
            <p>${dayNum === 20 ? '<b>Special Note:</b> The day 20 is considered a hidden 11.' : 'Analysis complete.'}</p>
        </div>
    `;
}

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth(); 
    const numerologyMonth = month + 1; 

    // Update Header
    const monthName = date.toLocaleString('default', { month: 'long' });
    currentMonthText.innerText = monthName;
    yearInput.value = year; // Sync input with logic

    const lucky = calculateLuckyNumber(numerologyMonth, year);
    luckyNumDisplay.innerText = lucky;
    luckyNumDisplay.className = isMasterNumber(lucky) ? 'text-master' : '';

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
        if (searchFilterLP !== null) {
            if (lp.final === searchFilterLP || lp.base === searchFilterLP) isMatch = true;
            else isMatch = false; 
        }
        if (searchFilterDay !== null) {
            const matchesDay = (dayNum === searchFilterDay || day === searchFilterDay);
            if (searchFilterLP !== null) {
                if (!matchesDay) isMatch = false;
            } else {
                if (matchesDay) isMatch = true;
            }
        }
        if (isMatch) dayCell.classList.add("search-match");

        // --- MASTER THEMES ---
        const isMainMaster = isMasterNumber(lp.final) || isMasterNumber(dayNum) || isMasterNumber(luckyVal);
        const isHiddenMaster = isMasterNumber(hidden.raw) || day === 20;

        if (isMainMaster) dayCell.classList.add("master-main");
        else if (isHiddenMaster) dayCell.classList.add("master-hidden");

        const getMasterClass = (num) => isMasterNumber(num) ? 'text-master' : '';

        dayCell.innerHTML = `
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

// Handle Year Input Typing
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
    searchFilterLP = valLP ? parseInt(valLP) : null;
    searchFilterDay = valDay ? parseInt(valDay) : null;
    renderCalendar(currentDate);
}

inputLP.addEventListener("input", handleSearchUpdate);
inputDay.addEventListener("input", handleSearchUpdate);

btnClear.addEventListener("click", () => {
    inputLP.value = "";
    inputDay.value = "";
    searchResultsList.innerHTML = ""; // Clear list
    handleSearchUpdate();
});

// ==========================================
// 5. FIND MATCHES ("SHOW LIST") LOGIC
// ==========================================

btnShowList.addEventListener("click", () => {
    // 1. Validate inputs
    if (searchFilterLP === null && searchFilterDay === null) {
        searchResultsList.innerHTML = "<p style='color:red; font-size:0.8rem;'>Please enter criteria first.</p>";
        return;
    }

    searchResultsList.innerHTML = "<p style='font-size:0.8rem; color:#888;'>Searching...</p>";

    // 2. Helper to check specific date
    function checkDateMatch(d) {
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

        const lp = calculateLifePath(day, month, year);
        const dayNum = calculateDayNumber(day);

        // Check LP
        let lpMatch = true;
        if (searchFilterLP !== null) {
            lpMatch = (lp.final === searchFilterLP || lp.base === searchFilterLP);
        }

        // Check Day
        let dayMatch = true;
        if (searchFilterDay !== null) {
            dayMatch = (dayNum === searchFilterDay || day === searchFilterDay);
        }

        return lpMatch && dayMatch;
    }

    // 3. Search Logic
    const pastMatches = [];
    const futureMatches = [];
    const limit = 5;
    const maxDaysScan = 5000; // Safety break (approx 13 years)

    // A. Find Past (Scan backwards from yesterday)
    let tempDate = new Date();
    tempDate.setDate(tempDate.getDate() - 1); 
    
    for(let i=0; i<maxDaysScan; i++) {
        if (pastMatches.length >= limit) break;
        if (checkDateMatch(tempDate)) {
            pastMatches.push(new Date(tempDate));
        }
        tempDate.setDate(tempDate.getDate() - 1);
    }

    // B. Find Future (Scan forwards from today)
    tempDate = new Date();
    for(let i=0; i<maxDaysScan; i++) {
        if (futureMatches.length >= limit) break;
        if (checkDateMatch(tempDate)) {
            futureMatches.push(new Date(tempDate));
        }
        tempDate.setDate(tempDate.getDate() + 1);
    }

    // 4. Render Results
    searchResultsList.innerHTML = ""; // Clear loading

    // Render Past
    if(pastMatches.length > 0) {
        const header = document.createElement("div");
        header.className = "result-header";
        header.innerText = "Previous Dates";
        searchResultsList.appendChild(header);

        pastMatches.forEach(date => createResultItem(date, "result-past"));
    }

    // Render Future
    if(futureMatches.length > 0) {
        const header = document.createElement("div");
        header.className = "result-header";
        header.innerText = "Upcoming Dates";
        searchResultsList.appendChild(header);

        futureMatches.forEach(date => createResultItem(date, "result-future"));
    }

    if(pastMatches.length === 0 && futureMatches.length === 0) {
        searchResultsList.innerHTML = "<p style='font-size:0.8rem;'>No matches found nearby.</p>";
    }
});

function createResultItem(date, className) {
    const div = document.createElement("div");
    div.className = `result-item ${className}`;
    
    // Format: "Wed, Jan 15, 2026"
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    div.innerText = date.toLocaleDateString('en-US', options);

    // On Click -> Go to that month
    div.addEventListener("click", () => {
        currentDate = new Date(date);
        renderCalendar(currentDate);
        // Highlight logic requires DOM to be ready, so we wait a tick
        setTimeout(() => {
            const targetStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
            const cell = document.querySelector(`.day-cell[data-date='${targetStr}']`);
            if(cell) selectDay(cell, targetStr, date.getDate(), date.getMonth()+1, date.getFullYear());
        }, 50);
    });

    searchResultsList.appendChild(div);
}

// ==========================================
// 6. KEYBOARD NAVIGATION
// ==========================================

document.addEventListener("keydown", (e) => {
    
    // Year Navigation: ALT + Left/Right
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

    // Month Navigation: CTRL + Left/Right
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

    // Grid Navigation
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