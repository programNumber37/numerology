// ==========================================
// 1. NUMEROLOGY LOGIC FUNCTIONS
// ==========================================

function isMasterNumber(num) {
    return [11, 22, 33].includes(num);
}

function sumDigits(num) {
    return String(num)
        .split('')
        .reduce((acc, curr) => acc + parseInt(curr), 0);
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

// Search State
let searchFilterLP = null;
let searchFilterDay = null;

const daysContainer = document.getElementById("daysContainer");
const currentMonthYear = document.getElementById("currentMonthYear");
const luckyNumDisplay = document.getElementById("luckyNumDisplay");

// Detail Panel Elements
const detailsPanel = document.getElementById("detailsPanel");
const detailsDate = document.getElementById("detailsDate");
const detailsContent = document.querySelector(".details-content");

// Search Inputs
const inputLP = document.getElementById("searchLP");
const inputDay = document.getElementById("searchDay");
const btnClear = document.getElementById("clearSearch");

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

    const monthName = date.toLocaleString('default', { month: 'long' });
    currentMonthYear.innerText = `${monthName} ${year}`;

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

        // Calculations
        const lp = calculateLifePath(day, numerologyMonth, year);
        const dayNum = calculateDayNumber(day);
        const hidden = calculateHiddenSum(day, numerologyMonth);
        const luckyVal = calculateLuckyNumber(numerologyMonth, year); 

        // --- SEARCH CHECK (UPDATED) ---
        let isMatch = false;
        
        // 1. Check Life Path Input
        if (searchFilterLP !== null) {
            // Match Final (e.g., 1) OR Base (e.g., 37)
            const matchesLP = (lp.final === searchFilterLP) || (lp.base === searchFilterLP);
            if (matchesLP) isMatch = true;
            else isMatch = false; // Reset if LP fails but Day hasn't been checked yet
        }

        // 2. Check Day Input
        if (searchFilterDay !== null) {
            // Match Reduced Day (e.g. 4) OR Raw Day (e.g. 31)
            const matchesDay = (dayNum === searchFilterDay) || (day === searchFilterDay);

            if (searchFilterLP !== null) {
                // If LP input exists, BOTH must match
                if (!matchesDay) isMatch = false;
            } else {
                // Only Day input exists
                if (matchesDay) isMatch = true;
            }
        }

        if (isMatch) {
            dayCell.classList.add("search-match");
        }

        // --- MASTER NUMBER LOGIC ---
        const isMainMaster = isMasterNumber(lp.final) || isMasterNumber(dayNum) || isMasterNumber(luckyVal);
        const isHiddenMaster = isMasterNumber(hidden.raw) || day === 20;

        if (isMainMaster) {
            dayCell.classList.add("master-main");
        } else if (isHiddenMaster) {
            dayCell.classList.add("master-hidden");
        }

        const getMasterClass = (num) => isMasterNumber(num) ? 'text-master' : '';

        dayCell.innerHTML = `
            <div class="cell-date">${displayDate}</div>
            
            <div class="cell-lp ${getMasterClass(lp.final)}">
                ${lp.final}
            </div>
            
            <div class="cell-day-num">
                D: <span class="${getMasterClass(dayNum)}">${dayNum}</span>
            </div>
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
// 4. INPUT & SEARCH LOGIC
// ==========================================

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
    handleSearchUpdate();
});

// ==========================================
// 5. KEYBOARD NAVIGATION
// ==========================================

document.addEventListener("keydown", (e) => {
    
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
// 6. MAIN LISTENERS
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