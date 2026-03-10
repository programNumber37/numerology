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
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const lp = calculateLifePath(day, month, year);
    const dayNum = calculateDayNumber(day);
    const yearReducer = calculateYearReducer(year);
    const hidden = calculateHiddenSum(day, month, year);
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
                    <strong>Year:</strong> ${year} &rarr; ${sumDigits(year)}<br>
                    <strong>Total:</strong> ${isMasterNumber(day) ? day : sumDigits(day)} + ${isMasterNumber(month) ? month : sumDigits(month)} + ${sumDigits(year)} = ${lp.base} &rarr; <strong>${lp.final}</strong>
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
                        <small>${month} + ${hidden.reducedYear1}</small>
                    </div>
                    <div class="hidden-energy-box">
                        <strong>Day + Month + Year</strong>
                        <span class="${getMasterClass(hidden.dmy.final)}">${hidden.dmy.raw} / ${hidden.dmy.final}</span>
                        <small>${day} + ${month} + ${hidden.reducedYear1}</small>
                    </div>
                </div>

                <div class="detail-calculation">
                    The <strong>Hidden Energy</strong> reveals underlying numerological influences. This system calculates three components without reducing the day or month, but reducing the year by one step (${year} &rarr; ${hidden.reducedYear1}).<br><br>
                    1. <strong>Day + Month:</strong> ${day} + ${month} = ${hidden.dm.raw} &rarr; <strong>${hidden.dm.final}</strong><br>
                    2. <strong>Month + Year:</strong> ${month} + ${hidden.reducedYear1} = ${hidden.my.raw} &rarr; <strong>${hidden.my.final}</strong><br>
                    3. <strong>Full Hidden Sum:</strong> ${day} + ${month} + ${hidden.reducedYear1} = ${hidden.dmy.raw} &rarr; <strong>${hidden.dmy.final}</strong><br>
                    ${hidden.visual === 33 ? '<br><b>Special Note:</b> Visual 33 detected (Day ' + day + ' and Month ' + month + ').' : ''}
                </div>
            </div>
        </div>
        
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
        
        <div style="line-height: 1.6; color: #555;">
            <p><strong>Daily Insights:</strong></p>
            <p>${dayNum === 20 ? '<b>Special Note:</b> The day 20 is considered a hidden 11.<br>' : ''}</p>
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

        let highestMaster = 0;
        [lp.final, dayNum, luckyVal, hidden.raw, hidden.visual].forEach(num => {
            if (num === 33 && highestMaster < 33) highestMaster = 33;
            else if (num === 22 && highestMaster < 22) highestMaster = 22;
            else if ((num === 11 || num === 20) && highestMaster < 11) highestMaster = 11;
        });
        if (day === 20 && highestMaster < 11) highestMaster = 11;

        if (highestMaster === 33) {
            dayCell.classList.add("master-33-cell");
        } else if (highestMaster === 22) {
            dayCell.classList.add("master-22-cell");
        } else if (highestMaster === 11) {
            dayCell.classList.add("master-11-cell");
        }

        const getMasterClass = (num) => {
            if (num === 33) return 'text-master-33';
            return isMasterNumber(num) ? 'text-master' : '';
        };

        dayCell.innerHTML = `
            ${emojiArray.length > 0 ? `<div class="${emojiClass}">${dayEmojis}</div>` : ''}
            <div class="cell-date">${displayDate}</div>
            <div class="cell-lp ${getMasterClass(lp.final)}">${lp.final}</div>
            <div class="cell-primary-day">${day}</div>
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
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            detailsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
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
        const all = [lp.base, lp.final, day, dayNum, hidden.raw, hidden.final, hidden.visual, lucky];
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