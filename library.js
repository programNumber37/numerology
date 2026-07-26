document.addEventListener("DOMContentLoaded", () => {
    populateNumerology();
    populateChineseAstrology();
});

function formatTextToParagraphs(text) {
    if (!text) return "";
    const sentences = text.split('. ').filter(s => s.trim().length > 0);
    let formattedText = "";
    for (let i = 0; i < sentences.length; i += 3) {
        let chunk = sentences.slice(i, i + 3).join('. ');
        if (!chunk.endsWith('.')) {
            chunk += '.';
        }
        formattedText += `<p>${chunk}</p>`;
    }
    return formattedText;
}

function reduceToSingleDigit(val) {
    let n = parseInt(val, 10);
    while (n > 9) {
        n = n.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    }
    return String(n);
}

function renderTopicQuotes(topicKey, num) {
    if (typeof libraryDatabase === "undefined") return "";
    let quotesHtml = [];

    libraryDatabase.forEach(book => {
        if (!book[topicKey]) return;
        let content = book[topicKey][num];
        if (!content && topicKey === "dayNumbers") {
            const reducedNum = reduceToSingleDigit(num);
            content = book[topicKey][reducedNum];
        }
        if (!content) return;
        let contentHtml = "";

        if (typeof content === "string") {
            if (book.id === "numerology_made_plain") {
                contentHtml = content.split('\n\n').map(p => `<p style="margin-bottom: 12px;">${p}</p>`).join('')
                    .replace(/POSITIVE:/g, '<strong style="color: #27ae60;">POSITIVE:</strong>')
                    .replace(/REVERSE:/g, '<strong>REVERSE:</strong>')
                    .replace(/NEGATIVE:/g, '<strong style="color: #c0392b;">NEGATIVE:</strong>');
            } else if (book.id === "power_of_birthdays_1998") {
                contentHtml = formatTextToParagraphs(content)
                    .replace(/(?:<p>)?\s*•\s*Positive:/g, '</p><p style="margin-top: 16px; margin-bottom: 8px;"><strong style="color: #27ae60;">• Positive:</strong>')
                    .replace(/(?:<p>)?\s*•\s*Negative:/g, '</p><p style="margin-bottom: 8px;"><strong style="color: #c0392b;">• Negative:</strong>');
                if (contentHtml.startsWith('</p>')) contentHtml = contentHtml.substring(4);
            } else {
                contentHtml = formatTextToParagraphs(content);
            }
        } else if (typeof content === "object") {
            if (content.positive !== undefined && content.negative !== undefined) {
                contentHtml = `
                    <p style="margin-bottom: 12px;"><strong style="color: #27ae60;">Positive:</strong> ${content.positive}</p>
                    <p style="margin-bottom: 12px;"><strong style="color: #c0392b;">Negative:</strong> ${content.negative}</p>
                `;
            } else if (content.do !== undefined && content.dont !== undefined) {
                contentHtml = `
                    ${content.keyword ? `<p style="margin-bottom: 8px; font-weight: 700; color: var(--th-primary); text-transform: uppercase; font-size: 0.85em; letter-spacing: 0.05em;">${content.keyword}</p>` : ''}
                    <p style="margin-bottom: 16px;">${content.text || ''}</p>
                    <p style="margin-bottom: 12px;"><strong style="color: #27ae60;">Do:</strong> ${content.do}</p>
                    <p style="margin-bottom: 12px;"><strong style="color: #c0392b;">Don't:</strong> ${content.dont}</p>
                `;
            } else if (content.theme !== undefined) {
                contentHtml = `
                    <p style="margin-bottom: 12px;"><strong>Theme:</strong> ${content.theme}</p>
                    <p style="margin-bottom: 12px;"><strong>Description:</strong> ${content.description}</p>
                    ${content.love ? `<p style="margin-bottom: 12px;"><strong>Love / Relationships:</strong> ${content.love}</p>` : ''}
                    ${content.health ? `<p style="margin-bottom: 12px;"><strong>Health:</strong> ${content.health}</p>` : ''}
                    ${content.career ? `<p style="margin-bottom: 12px;"><strong>Career:</strong> ${content.career}</p>` : ''}
                    ${content.travel ? `<p style="margin-bottom: 12px;"><strong>Travel:</strong> ${content.travel}</p>` : ''}
                `;
            } else {
                contentHtml = Object.entries(content).map(([k, v]) => `
                    <p style="margin-bottom: 12px;"><strong>${k.charAt(0).toUpperCase() + k.slice(1)}:</strong> ${v}</p>
                `).join('');
            }
        }

        const authorTitle = book.year ? `${book.title} (${book.author}, ${book.year})` : `${book.title}`;
        const header = `<p style="font-size: 0.9em; color: var(--th-text-muted); margin-bottom: 12px; font-style: italic;">From ${authorTitle}:</p>`;
        quotesHtml.push(header + contentHtml);
    });

    return quotesHtml.join('<hr style="margin: 24px 0; border: none; border-top: 1px solid var(--th-border);">');
}

function populateNumerology() {
    const container = document.getElementById("numerologyEntriesContainer");
    if (!container) return;

    container.innerHTML = "";

    // ═══════════════════════════════════════════════════════════
    // CORE NUMBERS GROUP
    // ═══════════════════════════════════════════════════════════
    const coreGroup = document.createElement("div");
    coreGroup.className = "lib-category-group open";
    coreGroup.setAttribute("data-group", "");
    coreGroup.innerHTML = `
        <div class="lib-category-header" onclick="toggleGroup(this)">
            <p class="lib-category-label">Core Numbers (1–9)</p>
            <span class="lib-category-chevron">▼</span>
        </div>
        <div class="lib-category-body" id="coreNumbersBody"></div>
    `;
    container.appendChild(coreGroup);

    const coreBody = document.getElementById("coreNumbersBody");
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];



    numbers.forEach(num => {
        const bodyContent = renderTopicQuotes("coreNumbers", num);
        if (!bodyContent) return;

        const entryHtml = `
            <div class="lib-entry" data-entry>
                <div class="lib-entry-header" onclick="toggleEntry(this)">
                    <div class="lib-entry-left">
                        <div class="lib-entry-num">${num}</div>
                        <div>
                            <p class="lib-entry-title">Number ${num}</p>
                        </div>
                    </div>
                    <span class="lib-entry-chevron">▼</span>
                </div>
                <div class="lib-entry-body">
                    ${bodyContent}
                </div>
            </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = entryHtml.trim();
        coreBody.appendChild(tempDiv.firstChild);
    });

    // ═══════════════════════════════════════════════════════════
    // DAY NUMBERS GROUP
    // ═══════════════════════════════════════════════════════════
    const dayNumbersGroup = document.createElement("div");
    dayNumbersGroup.className = "lib-category-group";
    dayNumbersGroup.setAttribute("data-group", "");
    dayNumbersGroup.innerHTML = `
        <div class="lib-category-header" onclick="toggleGroup(this)">
            <p class="lib-category-label">Day Numbers (1–31)</p>
            <span class="lib-category-chevron">▼</span>
        </div>
        <div class="lib-category-body" id="dayNumbersBody"></div>
    `;
    container.appendChild(dayNumbersGroup);

    const dayNumbersBody = document.getElementById("dayNumbersBody");
    const dayNumbers = Array.from({ length: 31 }, (_, i) => i + 1);

    dayNumbers.forEach(num => {
        const bodyContent = renderTopicQuotes("dayNumbers", num);
        if (!bodyContent) return;

        const entryHtml = `
            <div class="lib-entry" data-entry>
                <div class="lib-entry-header" onclick="toggleEntry(this)">
                    <div class="lib-entry-left">
                        <div class="lib-entry-num">${num}</div>
                        <div>
                            <p class="lib-entry-title">Day Number ${num}</p>
                        </div>
                    </div>
                    <span class="lib-entry-chevron">▼</span>
                </div>
                <div class="lib-entry-body">
                    ${bodyContent}
                </div>
            </div>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = entryHtml.trim();
        dayNumbersBody.appendChild(tempDiv.firstChild);
    });

    // ═══════════════════════════════════════════════════════════
    // PERSONAL YEARS GROUP
    // ═══════════════════════════════════════════════════════════
    const personalYearsGroup = document.createElement("div");
    personalYearsGroup.className = "lib-category-group";
    personalYearsGroup.setAttribute("data-group", "");
    personalYearsGroup.innerHTML = `
        <div class="lib-category-header" onclick="toggleGroup(this)">
            <p class="lib-category-label">Personal Years (1–9, 11, 22)</p>
            <span class="lib-category-chevron">▼</span>
        </div>
        <div class="lib-category-body" id="personalYearsBody"></div>
    `;
    container.appendChild(personalYearsGroup);

    const personalYearsBody = document.getElementById("personalYearsBody");
    const introBook = typeof libraryDatabase !== "undefined" && libraryDatabase.find(b => b.personalYearsIntro);

    if (introBook && introBook.personalYearsIntro) {
        const introData = introBook.personalYearsIntro;
        const introHtml = `
            <div class="lib-entry" data-entry>
                <div class="lib-entry-header" onclick="toggleEntry(this)">
                    <div class="lib-entry-left">
                        <div class="lib-entry-num" style="font-size: 0.75rem;">EXP</div>
                        <div>
                            <p class="lib-entry-title">${introData.title}</p>
                        </div>
                    </div>
                    <span class="lib-entry-chevron">▼</span>
                </div>
                <div class="lib-entry-body">
                    <p style="font-size: 0.9em; color: var(--th-text-muted); margin-bottom: 12px; font-style: italic;">From ${introBook.title} (${introBook.author}, ${introBook.year}):</p>
                    ${introData.text}
                </div>
            </div>
        `;
        const introDiv = document.createElement('div');
        introDiv.innerHTML = introHtml.trim();
        personalYearsBody.appendChild(introDiv.firstChild);
    }

    const personalYearsNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22];
    
    personalYearsNums.forEach(num => {
        const bodyContent = renderTopicQuotes("personalYears", num);
        if (!bodyContent) return;

        const title = `The ${num} Personal Year`;
        const entryHtml = `
            <div class="lib-entry" data-entry>
                <div class="lib-entry-header" onclick="toggleEntry(this)">
                    <div class="lib-entry-left">
                        <div class="lib-entry-num">${num}</div>
                        <div>
                            <p class="lib-entry-title">${title}</p>
                        </div>
                    </div>
                    <span class="lib-entry-chevron">▼</span>
                </div>
                <div class="lib-entry-body">
                    ${bodyContent}
                </div>
            </div>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = entryHtml.trim();
        personalYearsBody.appendChild(tempDiv.firstChild);
    });

    // ═══════════════════════════════════════════════════════════
    // PERSONAL MONTHS GROUP
    // ═══════════════════════════════════════════════════════════
    const personalMonthsGroup = document.createElement("div");
    personalMonthsGroup.className = "lib-category-group";
    personalMonthsGroup.setAttribute("data-group", "");
    personalMonthsGroup.innerHTML = `
        <div class="lib-category-header" onclick="toggleGroup(this)">
            <p class="lib-category-label">Personal Months (1–9)</p>
            <span class="lib-category-chevron">▼</span>
        </div>
        <div class="lib-category-body" id="personalMonthsBody"></div>
    `;
    container.appendChild(personalMonthsGroup);

    const personalMonthsBody = document.getElementById("personalMonthsBody");
    const monthsIntroBook = typeof libraryDatabase !== "undefined" && libraryDatabase.find(b => b.personalMonthsIntro);

    if (monthsIntroBook && monthsIntroBook.personalMonthsIntro) {
        const introData = monthsIntroBook.personalMonthsIntro;
        const introHtml = `
            <div class="lib-entry" data-entry>
                <div class="lib-entry-header" onclick="toggleEntry(this)">
                    <div class="lib-entry-left">
                        <div class="lib-entry-num" style="font-size: 0.75rem;">EXP</div>
                        <div>
                            <p class="lib-entry-title">${introData.title}</p>
                        </div>
                    </div>
                    <span class="lib-entry-chevron">▼</span>
                </div>
                <div class="lib-entry-body">
                    <p style="font-size: 0.9em; color: var(--th-text-muted); margin-bottom: 12px; font-style: italic;">From ${monthsIntroBook.title} (${monthsIntroBook.author}, ${monthsIntroBook.year}):</p>
                    ${introData.text}
                </div>
            </div>
        `;
        const introDiv = document.createElement('div');
        introDiv.innerHTML = introHtml.trim();
        personalMonthsBody.appendChild(introDiv.firstChild);
    }

    const personalMonthsNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    personalMonthsNums.forEach(num => {
        const bodyContent = renderTopicQuotes("personalMonths", num);
        if (!bodyContent) return;

        const title = `The ${num} Personal Month`;
        const entryHtml = `
            <div class="lib-entry" data-entry>
                <div class="lib-entry-header" onclick="toggleEntry(this)">
                    <div class="lib-entry-left">
                        <div class="lib-entry-num">${num}</div>
                        <div>
                            <p class="lib-entry-title">${title}</p>
                        </div>
                    </div>
                    <span class="lib-entry-chevron">▼</span>
                </div>
                <div class="lib-entry-body">
                    ${bodyContent}
                </div>
            </div>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = entryHtml.trim();
        personalMonthsBody.appendChild(tempDiv.firstChild);
    });

    // ═══════════════════════════════════════════════════════════
    // TERMINOLOGY GROUP
    // ═══════════════════════════════════════════════════════════
    const terminologyGroup = document.createElement("div");
    terminologyGroup.className = "lib-category-group";
    terminologyGroup.setAttribute("data-group", "");
    terminologyGroup.innerHTML = `
        <div class="lib-category-header" onclick="toggleGroup(this)">
            <p class="lib-category-label">Terminology</p>
            <span class="lib-category-chevron">▼</span>
        </div>
        <div class="lib-category-body" id="terminologyBody"></div>
    `;
    container.appendChild(terminologyGroup);

    const terminologyBody = document.getElementById("terminologyBody");

    const terms = [
        { id: "lifepathnumber", title: "Life Path Number", abbr: "LPN" },
        { id: "daynumber", title: "Day Number", abbr: "DN" },
        { id: "masternumber", title: "Master Number", abbr: "MN" },
        { id: "personalyear", title: "Personal Year", abbr: "PY" },
        { id: "luckynumber", title: "Lucky Number", abbr: "LN" },
        { id: "hiddennumber", title: "Hidden Number", abbr: "HN" },
        { id: "reductionofnumbers", title: "Reduction of Numbers", abbr: "RN" }
    ];

    terms.forEach(term => {
        const entryHtml = `
            <div class="lib-entry" data-entry>
                <div class="lib-entry-header" onclick="toggleEntry(this)">
                    <div class="lib-entry-left">
                        <div class="lib-entry-num" style="font-size:0.75rem;">${term.abbr}</div>
                        <div>
                            <p class="lib-entry-title">${term.title}</p>
                        </div>
                    </div>
                    <span class="lib-entry-chevron">▼</span>
                </div>
                <div class="lib-entry-body">
                    <p>Placeholder explanation for ${term.title}. You can add the full text here later.</p>
                </div>
            </div>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = entryHtml.trim();
        terminologyBody.appendChild(tempDiv.firstChild);
    });

    // ═══════════════════════════════════════════════════════════
    // NUMBER COMPATIBILITY GROUP
    // ═══════════════════════════════════════════════════════════
    const compatibilityGroup = document.createElement("div");
    compatibilityGroup.className = "lib-category-group";
    compatibilityGroup.setAttribute("data-group", "");
    compatibilityGroup.innerHTML = `
        <div class="lib-category-header" onclick="toggleGroup(this)">
            <p class="lib-category-label">Number Compatibility</p>
            <span class="lib-category-chevron">▼</span>
        </div>
        <div class="lib-category-body" id="compatibilityBody"></div>
    `;
    container.appendChild(compatibilityGroup);

    const compatibilityBody = document.getElementById("compatibilityBody");

    const compatibilityData = [
        { "number": 1, "planet": "Sun", "friendly": [1, 2, 7, 8, 11, 28], "neutral": [3, 4, 5, 6, 22, 33], "enemy": [9] },
        { "number": 2, "planet": "Moon", "friendly": [1, 3, 8], "neutral": [2, 4, 5, 6, 7, 11, 22, 33], "enemy": [9] },
        { "number": 3, "planet": "Jupiter", "friendly": [2, 3, 5, 6, 7, 8, 11, 33], "neutral": [1, 7, 9, 22], "enemy": [4] },
        { "number": 4, "planet": "Rahu", "friendly": [2, 4, 6, 7, 8, 9], "neutral": [1, 11, 22, 33], "enemy": [3, 5] },
        { "number": 5, "planet": "Mercury", "friendly": [3, 5, 7, 8, 9, 33], "neutral": [1, 2, 11], "enemy": [4, 6, 22] },
        { "number": 6, "planet": "Venus", "friendly": [3, 4, 8, 9, 22], "neutral": [1, 2, 6, 11, 33], "enemy": [5, 7] },
        { "number": 7, "planet": "Ketu", "friendly": [1, 4, 5, 11, 22], "neutral": [2, 3, 7, 33], "enemy": [6, 8, 9] },
        { "number": 8, "planet": "Saturn", "friendly": [1, 2, 3, 4, 5, 6, 22, 33], "neutral": [9, 11], "enemy": [7, 8] },
        { "number": 9, "planet": "Mars", "friendly": [4, 5, 6], "neutral": [3, 8], "enemy": [1, 2, 7, 9, 11, 22, 33] }
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
        9: "Mars",
        11: "Master Number",
        22: "Master Number",
        33: "Master Number",
        28: "Wealth"
    };

    const createBadgesHTML = (list, relationType, sourceNum) => {
        if (!list || list.length === 0) return `<span style="font-size: 0.85rem; color: var(--th-text-muted); font-style: italic;">None</span>`;
        return list.map(n => {
            const planet = planetMap[n] || "Unknown";
            return `<span class="rd-number-badge rd-number-badge--${relationType}" title="Number ${n} (${planet}): ${relationType.charAt(0).toUpperCase() + relationType.slice(1)} relationship with Number ${sourceNum}">
                ${n}
            </span>`;
        }).join('');
    };

    compatibilityData.forEach(data => {
        const entryHtml = `
            <div class="lib-entry" data-entry>
                <div class="lib-entry-header" onclick="toggleEntry(this)">
                    <div class="lib-entry-left">
                        <div class="lib-entry-num">${data.number}</div>
                        <div>
                            <p class="lib-entry-title">Number ${data.number} Compatibility</p>
                        </div>
                    </div>
                    <span class="lib-entry-chevron">▼</span>
                </div>
                <div class="lib-entry-body" style="padding-top: 20px;">
                    <div class="rd-compatibility-card rd-compatibility-card--day" style="margin: 0; box-shadow: none; border: 1px solid var(--th-border);">
                        <div class="rd-comp-header">
                            <div class="rd-comp-title-group">
                                <span class="rd-comp-type">Number</span>
                                <span class="rd-comp-number">${data.number}</span>
                            </div>
                            <span class="rd-comp-planet-badge">Ruling: ${data.planet}</span>
                        </div>
                        
                        <div class="rd-comp-group">
                            <span class="rd-comp-group-title">Friendly (Goes Well)</span>
                            <div class="rd-comp-badges">
                                ${createBadgesHTML(data.friendly, "friendly", data.number)}
                            </div>
                        </div>
                        
                        <div class="rd-comp-group">
                            <span class="rd-comp-group-title">Neutral</span>
                            <div class="rd-comp-badges">
                                ${createBadgesHTML(data.neutral, "neutral", data.number)}
                            </div>
                        </div>
                        
                        <div class="rd-comp-group">
                            <span class="rd-comp-group-title">Enemy (Avoid/Caution)</span>
                            <div class="rd-comp-badges">
                                ${createBadgesHTML(data.enemy, "enemy", data.number)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = entryHtml.trim();
        compatibilityBody.appendChild(tempDiv.firstChild);
    });

    // ═══════════════════════════════════════════════════════════
    // HISTORY GROUP
    // ═══════════════════════════════════════════════════════════
    const historyGroup = document.createElement("div");
    historyGroup.className = "lib-category-group";
    historyGroup.setAttribute("data-group", "");
    historyGroup.innerHTML = `
        <div class="lib-category-header" onclick="toggleGroup(this)">
            <p class="lib-category-label">History</p>
            <span class="lib-category-chevron">▼</span>
        </div>
        <div class="lib-category-body" id="historyBody"></div>
    `;
    container.appendChild(historyGroup);

    const historyBody = document.getElementById("historyBody");

    const historyItems = [
        { id: "pythagoras", title: "Pythagoras", abbr: "PYT" },
        { id: "bible", title: "Bible", abbr: "BIB" },
        { id: "kabbalah", title: "Kabbalah", abbr: "KAB" }
    ];

    historyItems.forEach(item => {
        const entryHtml = `
            <div class="lib-entry" data-entry>
                <div class="lib-entry-header" onclick="toggleEntry(this)">
                    <div class="lib-entry-left">
                        <div class="lib-entry-num" style="font-size:0.75rem;">${item.abbr}</div>
                        <div>
                            <p class="lib-entry-title">${item.title}</p>
                        </div>
                    </div>
                    <span class="lib-entry-chevron">▼</span>
                </div>
                <div class="lib-entry-body">
                    <p>Placeholder explanation for ${item.title}. You can add the full text here later.</p>
                </div>
            </div>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = entryHtml.trim();
        historyBody.appendChild(tempDiv.firstChild);
    });

    // ═══════════════════════════════════════════════════════════
    // SOURCES GROUP
    // ═══════════════════════════════════════════════════════════
    const sourcesGroup = document.createElement("div");
    sourcesGroup.className = "lib-category-group";
    sourcesGroup.setAttribute("data-group", "");
    sourcesGroup.innerHTML = `
        <div class="lib-category-header" onclick="toggleGroup(this)">
            <p class="lib-category-label">Sources</p>
            <span class="lib-category-chevron">▼</span>
        </div>
        <div class="lib-category-body" id="sourcesBody"></div>
    `;
    container.appendChild(sourcesGroup);

    const sourcesBody = document.getElementById("sourcesBody");

    const entryHtml = `
        <div class="lib-entry" data-entry>
            <div class="lib-entry-header" onclick="toggleEntry(this)">
                <div class="lib-entry-left">
                    <div class="lib-entry-num" style="font-size:0.75rem;">SRC</div>
                    <div>
                        <p class="lib-entry-title">Books & References</p>
                    </div>
                </div>
                <span class="lib-entry-chevron">▼</span>
            </div>
            <div class="lib-entry-body">
                <p>Placeholder for your sources. You can add the list of books used for information here later.</p>
            </div>
        </div>
    `;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = entryHtml.trim();
    sourcesBody.appendChild(tempDiv.firstChild);
}

function populateChineseAstrology() {
    const container = document.getElementById("chineseEntriesContainer");
    if (!container) return;

    container.innerHTML = "";

    // ═══════════════════════════════════════════════════════════
    // THE ZODIAC RACE & HISTORY
    // ═══════════════════════════════════════════════════════════
    const historyGroup = document.createElement("div");
    historyGroup.className = "lib-category-group open";
    historyGroup.setAttribute("data-group", "");
    historyGroup.innerHTML = `
        <div class="lib-category-header" onclick="toggleGroup(this)">
            <p class="lib-category-label">The Great Zodiac Race & History</p>
            <span class="lib-category-chevron">▼</span>
        </div>
        <div class="lib-category-body" id="chineseHistoryBody"></div>
    `;
    container.appendChild(historyGroup);

    const historyBody = document.getElementById("chineseHistoryBody");

    const historyEntryHtml = `
        <div class="lib-entry" data-entry>
            <div class="lib-entry-header" onclick="toggleEntry(this)">
                <div class="lib-entry-left">
                    <div class="lib-entry-num" style="font-size:0.75rem;">HIS</div>
                    <div>
                        <p class="lib-entry-title">Origins of the Zodiac</p>
                    </div>
                </div>
                <span class="lib-entry-chevron">▼</span>
            </div>
            <div class="lib-entry-body">
                <p>Placeholder for the history of the Zodiacs and the Great Race. You can add the full text here later.</p>
            </div>
        </div>
    `;
    const tempHistDiv = document.createElement('div');
    tempHistDiv.innerHTML = historyEntryHtml.trim();
    historyBody.appendChild(tempHistDiv.firstChild);

    // ═══════════════════════════════════════════════════════════
    // ZODIAC ANIMALS GROUP
    // ═══════════════════════════════════════════════════════════
    const zodiacGroup = document.createElement("div");
    zodiacGroup.className = "lib-category-group open";
    zodiacGroup.setAttribute("data-group", "");
    zodiacGroup.innerHTML = `
        <div class="lib-category-header" onclick="toggleGroup(this)">
            <p class="lib-category-label">Zodiac Animals</p>
            <span class="lib-category-chevron">▼</span>
        </div>
        <div class="lib-category-body" id="chineseZodiacBody"></div>
    `;
    container.appendChild(zodiacGroup);

    const zodiacBody = document.getElementById("chineseZodiacBody");

    // We assume chineseSignDatabase is available globally
    if (typeof chineseSignDatabase !== "undefined") {
        const signs = Object.keys(chineseSignDatabase);

        signs.forEach(sign => {
            const data = chineseSignDatabase[sign];
            const formattedPersonality = formatTextToParagraphs(data.personality);
            const formattedChild = formatTextToParagraphs(data.child);
            const abbr = sign.substring(0, 3).toUpperCase();

            // Types
            let typesHtml = `<h4 style="margin-top:24px; margin-bottom:8px; font-size:0.9rem; color:var(--th-text-primary);">Five Elements Types</h4>`;
            if (data.types) {
                for (const [elem, txt] of Object.entries(data.types)) {
                    typesHtml += `
                        <div style="margin-bottom:12px;">
                            <strong style="color:var(--th-text-primary); font-size:0.85rem;">${elem} ${sign}</strong>
                            ${formatTextToParagraphs(txt)}
                        </div>
                    `;
                }
            }

            // Yearly Fares
            let faresHtml = `<h4 style="margin-top:24px; margin-bottom:8px; font-size:0.9rem; color:var(--th-text-primary);">Yearly Fares</h4>`;
            if (data.yearly_fares) {
                for (const [animal, txt] of Object.entries(data.yearly_fares)) {
                    faresHtml += `
                        <div style="margin-bottom:12px;">
                            <strong style="color:var(--th-text-primary); font-size:0.85rem;">Year of the ${animal}</strong>
                            <div style="font-size:0.85em; opacity:0.9; line-height:1.6; margin-top:4px;">${txt}</div>
                        </div>
                    `;
                }
            }

            const entryHtml = `
                <div class="lib-entry" data-entry>
                    <div class="lib-entry-header" onclick="toggleEntry(this)">
                        <div class="lib-entry-left">
                            <div class="lib-entry-num" style="font-size:0.70rem;">${abbr}</div>
                            <div>
                                <p class="lib-entry-title">${sign}</p>
                            </div>
                        </div>
                        <span class="lib-entry-chevron">▼</span>
                    </div>
                    <div class="lib-entry-body">
                        <div style="width:100%; height:160px; background:var(--th-surface-hover); border-radius:12px; margin-bottom:16px; display:flex; align-items:center; justify-content:center; color:var(--th-text-muted); font-size:0.85rem; border:1px dashed rgba(255,255,255,0.1);">
                            [ Image Placeholder: ${sign} ]
                        </div>
                        <div style="margin-bottom:20px; font-size:0.9em; opacity:0.9; line-height:1.6;">
                            ${data.stats}
                        </div>
                        <h4 style="margin-bottom:8px; font-size:0.9rem; color:var(--th-text-primary);">Personality</h4>
                        ${formattedPersonality}

                        <h4 style="margin-top:24px; margin-bottom:8px; font-size:0.9rem; color:var(--th-text-primary);">The ${sign} Child</h4>
                        ${formattedChild}

                        ${typesHtml}

                        ${faresHtml}
                    </div>
                </div>
            `;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = entryHtml.trim();
            zodiacBody.appendChild(tempDiv.firstChild);
        });
    }
}
