const getReadingBtn = document.getElementById("getReadingBtn");
const birthDateInput = document.getElementById("birthDate");
const readingResult = document.getElementById("readingResult");
const readingEmpty = document.getElementById("readingEmpty");
const readingGrid = document.getElementById("readingGrid");
const readingQuotes = document.getElementById("readingQuotes");

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
    const hidden = calculateHiddenSum(day, month);

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
            <strong>Date Sum (Hidden)</strong> 
            <span class="${getMasterClass(hidden.final)}">${hidden.raw} / ${hidden.final}</span>
            <small>Day ${day} + Month ${month} ${hidden.visual === 33 ? '(Visual: ' + hidden.visual + ')' : ''}</small>
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
});
