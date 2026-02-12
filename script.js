// ============================================
// ARCANA STUDIO LABS - THE CODEX OF THE WITCH
// COMPLETE VERSION - ALL FIXES APPLIED
// ============================================

// --- CONSTANTS & DATA LIBRARIES ---
const ELEMENTS = [
    { name: 'Wood', color: '#10b981', desc: 'Growth & Vitality' },
    { name: 'Fire', color: '#ef4444', desc: 'Passion & Action' },
    { name: 'Earth', color: '#b45309', desc: 'Stability & Trust' },
    { name: 'Metal', color: '#e5e7eb', desc: 'Logic & Discipline' },
    { name: 'Water', color: '#3b82f6', desc: 'Wisdom & Flow' }
];

const ZODIAC_EASTERN = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
const EASTERN_ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"];

const GEMSTONES = {
    1: "Garnet", 2: "Amethyst", 3: "Aquamarine", 4: "Diamond", 
    5: "Emerald", 6: "Pearl", 7: "Ruby", 8: "Peridot", 9: "Sapphire"
};

const LUCKY_COLORS = {
    1: "Blue, Black", 2: "Yellow, Brown", 3: "Green", 4: "Green",
    5: "Yellow, Brown", 6: "White, Gold", 7: "White, Silver",
    8: "Yellow, Brown", 9: "Red, Pink"
};

const ANIMAL_CURES = {
    Rat: "🐀 Gold Dragon", Ox: "🐂 Jade Pi Yao", Tiger: "🐅 Bronze Tiger", 
    Rabbit: "🐇 Crystal Rabbit", Dragon: "🐉 Gold Dragon", Snake: "🐍 Silver Snake",
    Horse: "🐎 Bronze Horse", Goat: "🐐 Jade Goat", Monkey: "🐒 Crystal Monkey",
    Rooster: "🐓 Gold Rooster", Dog: "🐕 Bronze Dog", Pig: "🐖 Jade Pig"
};

const KUA_DIRECTIONS = {
    1: "North", 2: "Southwest", 3: "East", 4: "Southeast",
    5: "Center", 6: "Northwest", 7: "West", 8: "Northeast", 9: "South"
};

const COMFORT_QUOTES = [
    { min: 0, max: 2, quote: "Even the darkest night will end and the sun will rise. Your stars are realigning." },
    { min: 0, max: 2, quote: "This too shall pass. What is forged in fire becomes unbreakable." },
    { min: 0, max: 2, quote: "The universe hears your struggles. Patience, young soul." },
    { min: 2, max: 3, quote: "You are exactly where you need to be. Trust the journey." },
    { min: 2, max: 3, quote: "Small steps still move you forward. Celebrate your progress." },
    { min: 3, max: 4, quote: "The tide is turning in your favor. Prepare for blessings." },
    { min: 3, max: 4, quote: "Your light is growing brighter. Others are inspired by you." },
    { min: 4, max: 5, quote: "The stars dance in your honor today. Magnificent alignment." },
    { min: 4, max: 5, quote: "You are the architect of your destiny. Today proves your power." },
    { min: 5, max: 6, quote: "Exceptional fortune flows through you. Share your light generously." }
];

// --- STATE MANAGEMENT ---
let isLoading = false;
let currentProphecyTab = 'wealth';
let propheciesData = null;

// ========== UTILITY FUNCTIONS ==========
function setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) {
        if (typeof text === 'string' && text.includes('<')) {
            el.innerHTML = text;
        } else {
            el.innerText = text;
        }
    }
}

function reduceToSingleDigit(num) {
    if (isNaN(num)) return 1;
    let s = num.toString().split('').reduce((a, b) => parseInt(a || 0) + parseInt(b || 0), 0);
    while (s > 9) {
        s = s.toString().split('').reduce((a, b) => parseInt(a || 0) + parseInt(b || 0), 0);
    }
    return s || 1;
}

// ========== DATE DROPDOWN FIXES ==========
function initDateDropdowns() {
    const yearSelect = document.getElementById('dob-year');
    const monthSelect = document.getElementById('dob-month');
    const daySelect = document.getElementById('dob-day');
    
    // Populate years (1900 - current year)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    
    // Update days based on month and year
    function updateDays() {
        const month = parseInt(monthSelect.value);
        const year = parseInt(yearSelect.value);
        
        if (!month || !year) {
            daySelect.innerHTML = '<option value="" disabled selected>Day</option>';
            return;
        }
        
        const daysInMonth = new Date(year, month, 0).getDate();
        const currentDay = parseInt(daySelect.value);
        
        daySelect.innerHTML = '<option value="" disabled selected>Day</option>';
        
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            daySelect.appendChild(option);
        }
        
        // Restore previously selected day if valid
        if (currentDay && currentDay <= daysInMonth) {
            daySelect.value = currentDay;
        }
    }
    
    monthSelect.addEventListener('change', updateDays);
    yearSelect.addEventListener('change', updateDays);
}

// ========== FORM VALIDATION ==========
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const dobMonth = document.getElementById('dob-month').value;
    const dobDay = document.getElementById('dob-day').value;
    const dobYear = document.getElementById('dob-year').value;
    const tob = document.getElementById('tob').value;
    const gender = document.getElementById('gender').value;
    const relationship = document.getElementById('relationship').value;
    const country = document.getElementById('country').value;
    const timezone = document.getElementById('timezone').value;
    const career = document.getElementById('career').value;
    
    const isComplete = name && dobMonth && dobDay && dobYear && tob && gender && relationship && country && timezone && career;
    
    const invokeBtn = document.getElementById('invokeBtn');
    const formWarning = document.getElementById('form-warning');
    
    if (isComplete) {
        invokeBtn.disabled = false;
        invokeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        invokeBtn.innerHTML = '<i class="fas fa-crystal-ball"></i><span>FORGE YOUR DESTINY</span>';
        formWarning.innerHTML = '✨ Your cosmic identity is complete. Forge your reading.';
        formWarning.classList.remove('text-amber-400/70');
        formWarning.classList.add('text-emerald-400/70');
    } else {
        invokeBtn.disabled = true;
        invokeBtn.classList.add('opacity-50', 'cursor-not-allowed');
        invokeBtn.innerHTML = '<i class="fas fa-crystal-ball"></i><span>COMPLETE YOUR CELESTIAL IDENTITY</span>';
        formWarning.innerHTML = '⚠️ All fields required to forge your reading';
        formWarning.classList.remove('text-emerald-400/70');
        formWarning.classList.add('text-amber-400/70');
    }
    
    return isComplete;
}

// ========== TAB SWITCHING - FIXED ==========
window.switchProphecyTab = function(tab) {
    if (!propheciesData) {
        console.log("No prophecy data yet");
        return;
    }
    
    currentProphecyTab = tab;
    
    const tabs = ['wealth', 'career', 'health', 'love'];
    tabs.forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (el) {
            if (t === tab) {
                el.classList.add('active', 'text-amber-400', 'border-amber-500/30');
                el.classList.remove('text-slate-400', 'border-transparent');
            } else {
                el.classList.remove('active', 'text-amber-400', 'border-amber-500/30');
                el.classList.add('text-slate-400', 'border-transparent');
            }
        }
    });
    
    updateProphecyDisplay();
};

function updateProphecyDisplay() {
    if (!propheciesData) return;
    
    const prophecy = propheciesData[currentProphecyTab];
    const titles = {
        wealth: { icon: 'fa-coins', title: 'Wealth Prophecy' },
        career: { icon: 'fa-briefcase', title: 'Career Prophecy' },
        health: { icon: 'fa-heartbeat', title: 'Health Prophecy' },
        love: { icon: 'fa-heart', title: 'Love Prophecy' }
    };
    
    const iconEl = document.getElementById('prophecy-icon');
    const titleEl = document.getElementById('prophecy-title');
    const prophecyEl = document.getElementById('main-prophecy');
    
    if (iconEl) iconEl.className = `fas ${titles[currentProphecyTab].icon}`;
    if (titleEl) titleEl.innerText = titles[currentProphecyTab].title;
    if (prophecyEl) prophecyEl.innerHTML = `<span class="text-amber-400 font-bold">"${prophecy}"</span>`;
}

// ========== KUA NUMBER ==========
function calculateKua(year, gender) {
    if (year < 1900) year = 1900;
    if (year > 2099) year = 2099;
    
    let lastTwo = year % 100;
    let sum = lastTwo.toString().split('').reduce((a, b) => parseInt(a || 0) + parseInt(b || 0), 0);
    while (sum > 9) {
        sum = sum.toString().split('').reduce((a, b) => parseInt(a || 0) + parseInt(b || 0), 0);
    }
    
    let kua;
    if (gender === 'male') {
        kua = year >= 2000 ? 9 - sum : 10 - sum;
    } else {
        kua = year >= 2000 ? 6 + sum : 5 + sum;
    }
    
    if (kua > 9) {
        kua = kua.toString().split('').reduce((a, b) => parseInt(a || 0) + parseInt(b || 0), 0);
    }
    
    return kua === 0 ? 9 : kua;
}

function getKuaDirection(kua) {
    return KUA_DIRECTIONS[kua] || "North";
}

function getElementFromKua(kua) {
    const elements = ["Water", "Earth", "Wood", "Wood", "Earth", "Metal", "Metal", "Earth", "Fire"];
    return elements[kua - 1] || "Earth";
}

// ========== WU XING ELEMENTS ==========
function calculateWuXing(year, month, day, hour, gender) {
    const yearStem = (year - 4) % 10;
    const monthStem = (yearStem * 2 + month) % 10;
    const dayStem = Math.abs(year + month + day) % 10;
    const hourStem = (dayStem * 2 + Math.floor(hour / 2)) % 10;
    
    const stemElements = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
    const elementCounts = [1, 1, 1, 1, 1];
    
    if (yearStem >= 0) elementCounts[stemElements[yearStem]] += 2;
    if (monthStem >= 0) elementCounts[stemElements[monthStem]] += 3;
    if (dayStem >= 0) elementCounts[stemElements[dayStem]] += 4;
    if (hourStem >= 0) elementCounts[stemElements[hourStem]] += 1;
    
    if (gender === 'male') {
        elementCounts[1] += 1;
    } else {
        elementCounts[4] += 1;
    }
    
    const max = Math.max(...elementCounts);
    const min = Math.min(...elementCounts);
    const range = max - min || 1;
    
    return elementCounts.map(count => 30 + Math.floor((count - min) / range * 50));
}

function renderElements(strengths) {
    const container = document.getElementById('element-bars');
    if (!container) return;
    
    container.innerHTML = '';
    
    ELEMENTS.forEach((el, i) => {
        const strength = strengths[i] || 50;
        container.innerHTML += `
            <div class="element-row group">
                <div class="flex justify-between text-[11px] mb-1">
                    <span class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full" style="background: ${el.color}"></span>
                        <span class="text-white">${el.name}</span>
                        <span class="text-[9px] text-slate-500">${el.desc}</span>
                    </span>
                    <span class="text-amber-400 font-bold">${strength}%</span>
                </div>
                <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div class="element-bar h-full rounded-full relative" 
                         style="width: ${strength}%; background: ${el.color}; box-shadow: 0 0 10px ${el.color}40">
                    </div>
                </div>
            </div>
        `;
    });
}

// ========== ZODIAC ==========
function getWesternZodiac(month, day) {
    const dates = [
        { sign: "Capricorn", start: 1222, end: 119 },
        { sign: "Aquarius", start: 120, end: 218 },
        { sign: "Pisces", start: 219, end: 320 },
        { sign: "Aries", start: 321, end: 419 },
        { sign: "Taurus", start: 420, end: 520 },
        { sign: "Gemini", start: 521, end: 620 },
        { sign: "Cancer", start: 621, end: 722 },
        { sign: "Leo", start: 723, end: 822 },
        { sign: "Virgo", start: 823, end: 922 },
        { sign: "Libra", start: 923, end: 1022 },
        { sign: "Scorpio", start: 1023, end: 1121 },
        { sign: "Sagittarius", start: 1122, end: 1221 }
    ];
    
    const dateNum = month * 100 + day;
    
    for (let d of dates) {
        if (d.sign === "Capricorn") {
            if (dateNum >= d.start || dateNum <= d.end) return d.sign;
        } else {
            if (dateNum >= d.start && dateNum <= d.end) return d.sign;
        }
    }
    return "Capricorn";
}

function getEasternZodiac(year) {
    return ZODIAC_EASTERN[(year - 4) % 12];
}

// ========== LUCKY NUMBER ==========
function calculateLuckyNumber(py, day, kua) {
    return reduceToSingleDigit(py + day + kua);
}

// ========== FOUR PILLARS ==========
function calculateFourPillars(year, month, day, hour) {
    const stems = ["Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"];
    const branches = ["Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"];
    
    const yearStemIdx = (year - 4) % 10;
    const yearBranchIdx = (year - 4) % 12;
    const monthStemIdx = (yearStemIdx * 2 + month) % 10;
    const monthBranchIdx = (month + 1) % 12;
    const dayOffset = Math.abs(year + month + day) % 60;
    const dayStemIdx = dayOffset % 10;
    const dayBranchIdx = dayOffset % 12;
    const hourBranchIdx = Math.floor((hour + 1) / 2) % 12;
    const hourStemIdx = (dayStemIdx * 2 + hourBranchIdx) % 10;
    
    return {
        year: `${stems[yearStemIdx]} ${branches[yearBranchIdx]}`,
        month: `${stems[monthStemIdx]} ${branches[monthBranchIdx]}`,
        day: `${stems[dayStemIdx]} ${branches[dayBranchIdx]}`,
        hour: `${stems[hourStemIdx]} ${branches[hourBranchIdx]}`
    };
}

// ========== FORTUNE SCORE ==========
function calculateFortuneScore(py, kua, day, seed) {
    let score = 3;
    if (py === 1 || py === 3 || py === 5 || py === 7 || py === 9) score += 0.5;
    if (py === 2 || py === 4 || py === 6 || py === 8) score -= 0.2;
    if (kua === 1 || kua === 3 || kua === 4 || kua === 9) score += 0.3;
    if (kua === 2 || kua === 5 || kua === 8) score += 0.1;
    if (day % 7 === 0) score += 0.4;
    if (day % 5 === 0) score += 0.2;
    score += (seed % 10) / 20;
    score = Math.max(1, Math.min(5, score));
    return Math.round(score * 2) / 2;
}

function renderStarRating(score) {
    const stars = [1, 2, 3, 4, 5];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 !== 0;
    
    stars.forEach(star => {
        const starEl = document.getElementById(`star-${star}`);
        if (starEl) {
            if (star <= fullStars) {
                starEl.innerHTML = '<i class="fas fa-star"></i>';
                starEl.classList.add('filled');
            } else if (star === fullStars + 1 && hasHalfStar) {
                starEl.innerHTML = '<i class="fas fa-star-half-alt"></i>';
                starEl.classList.add('filled');
            } else {
                starEl.innerHTML = '<i class="far fa-star"></i>';
                starEl.classList.remove('filled');
            }
        }
    });
    
    let label = '';
    if (score >= 4.5) label = 'Exceptional ✨';
    else if (score >= 3.5) label = 'Fortunate 🌟';
    else if (score >= 2.5) label = 'Balanced ⚖️';
    else if (score >= 1.5) label = 'Challenging 🌧️';
    else label = 'Difficult ⚡';
    
    setElementText('fortune-label', `${score.toFixed(1)} Stars - ${label}`);
}

function renderComfortQuote(score) {
    const quoteEl = document.getElementById('comfort-quote');
    if (!quoteEl) return;
    
    const quoteData = COMFORT_QUOTES.find(q => score >= q.min && score <= q.max) || 
                    COMFORT_QUOTES[Math.floor(Math.random() * COMFORT_QUOTES.length)];
    
    const quoteDiv = quoteEl.querySelector('.comfort-quote-text');
    if (quoteDiv) {
        quoteDiv.innerHTML = `"${quoteData.quote}"`;
    }
}

// ========== PROPHECIES ==========
function generateAllProphecies(seed, py, animal, direction, relationship, career, kua) {
    const wealthProphecies = [
        `A financial opportunity from the ${direction} will manifest within 3 months.`,
        `Your wealth luck peaks during ${getLuckyMonth(py)}.`,
        `Unexpected inheritance or gift may arrive.`,
        `Business partnerships formed in ${direction} prove lucrative.`,
        `Your Personal Year ${py} indicates steady financial growth.`
    ];
    
    const careerProphecies = [
        `Career advancement comes through ${direction}-facing opportunities.`,
        `A mentor figure will guide your professional growth.`,
        `${py === 1 || py === 9 ? 'Major promotion' : 'Career expansion'} indicated.`,
        `Your skills in ${career} will be recognized.`,
        `Networking during ${getLuckyHour(animal)} hours brings valuable connections.`
    ];
    
    const healthProphecies = [
        `Focus on ${getHealthElement(kua)} health.`,
        `The ${getAnimalElement(animal)} element affects your ${getBodyPart(animal)}.`,
        `Personal Year ${py} suggests ${py < 5 ? 'building immunity' : 'stress management'}.`,
        `Your dominant ${ELEMENTS[seed % 5].name} element needs balance.`,
        `Mental health: The ${animal} year brings emotional sensitivity.`
    ];
    
    let loveProphecies;
    switch(relationship) {
        case 'single':
            loveProphecies = [
                `A ${direction}-directional romance appears in ${getLoveMonth(py)}.`,
                `Your soulmate may be a ${getCompatibleAnimal(animal)} sign.`,
                `The ${getCurrentMoonPhase()} moon activates your 5th house.`,
                `Travel to the ${direction} increases chances of meeting someone special.`,
                `Your ${getElementFromKua(kua)} energy attracts admirers.`
            ];
            break;
        case 'dating':
            loveProphecies = [
                `Your relationship deepens. Consider a ${direction}-facing location for your next date.`,
                `Communication improves when wearing ${getLoveColor(kua)}.`,
                `Commitment discussions favored during ${getLuckyMonth(py)}.`,
                `${getCompatibleAnimal(animal)} energy strengthens your bond.`,
                `Past relationship patterns heal. Your Personal Year ${py} brings emotional clarity.`
            ];
            break;
        case 'engaged':
            loveProphecies = [
                `Wedding planning favored. Choose ${getLoveColor(kua)}-toned elements.`,
                `Your union is blessed by ${getElementFromKua(kua)} energy.`,
                `Financial alignment strengthens before marriage.`,
                `Family blessings flow from the ${getFamilyDirection(kua)} direction.`,
                `Your ${animal} and partner's ${getPartnerAnimal(animal)} signs create powerful synergy.`
            ];
            break;
        case 'married':
            loveProphecies = [
                `Renew your vows or celebrate milestones.`,
                `Shared goals in ${career} will strengthen your bond.`,
                `Children or family expansion favored under ${getElementFromKua(kua)} element.`,
                `Travel together to ${getRomanticDestination(animal)} rekindles passion.`,
                `Financial security in marriage grows.`
            ];
            break;
        case 'divorced':
            loveProphecies = [
                `Healing and new beginnings. The ${direction} offers fresh romantic prospects.`,
                `Self-love is your priority. ${getLoveColor(kua)} colors restore your heart chakra.`,
                `Legal matters resolve favorably.`,
                `A ${getCompatibleAnimal(animal)} friend may become something more.`,
                `Your independence attracts quality partners.`
            ];
            break;
        case 'widowed':
            loveProphecies = [
                `Spiritual signs from beyond bring comfort.`,
                `Honor your past while opening to new possibilities.`,
                `Your loved one wants you to find happiness.`,
                `Creative expression heals grief.`,
                `A kindred spirit enters your life. Trust divine timing.`
            ];
            break;
        default:
            loveProphecies = [
                `Clarity comes from the ${direction}.`,
                `Set boundaries. Your ${animal} energy needs protection.`,
                `A decision by ${getLuckyMonth(py)} will bring resolution.`,
                `Communication with ${getCompatibleAnimal(animal)} energy helps.`,
                `Focus on self-worth. Your Personal Year ${py} builds inner strength.`
            ];
    }

    return {
        wealth: wealthProphecies[seed % wealthProphecies.length],
        career: careerProphecies[seed % careerProphecies.length],
        health: healthProphecies[seed % healthProphecies.length],
        love: loveProphecies[seed % loveProphecies.length]
    };
}

// ========== LUCKY HOURS - FIXED ==========
function calculateLuckyHours(py, day, kua, date, animalSign, timezone) {
    const kuaHourMap = {
        1: { start: 7, end: 9, quality: "Excellent" },
        2: { start: 9, end: 11, quality: "Good" },
        3: { start: 11, end: 13, quality: "Excellent" },
        4: { start: 13, end: 15, quality: "Good" },
        6: { start: 15, end: 17, quality: "Excellent" },
        7: { start: 17, end: 19, quality: "Good" },
        8: { start: 19, end: 21, quality: "Excellent" },
        9: { start: 21, end: 23, quality: "Good" }
    };
    
    const kuaHour = kuaHourMap[kua] || { start: 9, end: 11, quality: "Good" };
    
    const now = new Date();
    const localOffset = -now.getTimezoneOffset() / 60;
    const offsetDiff = timezone - localOffset;
    
    function toLocalTime(utcHour) {
        let localHour = utcHour + offsetDiff;
        while (localHour < 0) localHour += 24;
        while (localHour >= 24) localHour -= 24;
        return localHour;
    }
    
    function formatTime(hour) {
        const h = Math.floor(hour);
        const m = Math.round((hour - h) * 60);
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
    }
    
    const pyHour = (py * 2) % 8 + 13;
    
    const animalHours = {
        Rat: [23, 1], Ox: [1, 3], Tiger: [3, 5], Rabbit: [5, 7],
        Dragon: [7, 9], Snake: [9, 11], Horse: [11, 13], Goat: [13, 15],
        Monkey: [15, 17], Rooster: [17, 19], Dog: [19, 21], Pig: [21, 23]
    };
    
    const animalHour = animalHours[animalSign] || [9, 11];
    
    return [
        {
            period: "🌅 Morning",
            timeDisplay: `${formatTime(toLocalTime(kuaHour.start))} - ${formatTime(toLocalTime(kuaHour.end))}`,
            quality: kuaHour.quality,
            element: getElementFromKua(kua),
            advice: "Best for important meetings and decisions"
        },
        {
            period: "☀️ Afternoon",
            timeDisplay: `${formatTime(toLocalTime(pyHour))} - ${formatTime(toLocalTime(pyHour + 2))}`,
            quality: py % 2 === 0 ? "Excellent" : "Good",
            element: EASTERN_ELEMENTS[(py - 1) % 5],
            advice: "Ideal for creative work and problem-solving"
        },
        {
            period: "🌙 Evening",
            timeDisplay: `${formatTime(toLocalTime(animalHour[0]))} - ${formatTime(toLocalTime(animalHour[0] + 2))}`,
            quality: "Excellent",
            element: getAnimalElement(animalSign),
            advice: "Perfect for networking, social connections, and romance"
        }
    ];
}

function renderLuckyHours(hours, timezone) {
    const display = document.getElementById('personal-lucky-hours');
    if (!display) return;
    
    display.innerHTML = '';
    
    hours.forEach((hour) => {
        const qualityClass = hour.quality === 'Excellent' ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400 border-amber-500/30';
        const bgClass = hour.quality === 'Excellent' ? 'bg-emerald-500/5' : 'bg-amber-500/5';
        
        let elementColor = 'blue';
        if (hour.element === 'Wood') elementColor = 'emerald';
        else if (hour.element === 'Fire') elementColor = 'red';
        else if (hour.element === 'Earth') elementColor = 'amber';
        else if (hour.element === 'Metal') elementColor = 'gray';
        else elementColor = 'blue';
        
        display.innerHTML += `
            <div class="lucky-hour-badge ${bgClass} p-4 rounded-xl border ${qualityClass} hover:border-opacity-100 transition-all">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs text-slate-400 uppercase tracking-wider">${hour.period}</span>
                    <span class="text-[9px] px-2 py-0.5 rounded-full ${hour.quality === 'Excellent' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}">${hour.quality}</span>
                </div>
                <span class="block text-lg font-bold text-white mb-1">${hour.timeDisplay}</span>
                <div class="flex flex-col gap-1">
                    <div class="flex justify-between items-center">
                        <span class="text-[10px] text-slate-500">Element: <span class="text-${elementColor}-400">${hour.element}</span></span>
                        <span class="text-[9px] text-slate-500">UTC${timezone >= 0 ? '+' : ''}${timezone}</span>
                    </div>
                    <span class="text-[9px] text-slate-400"><i class="fas fa-star text-amber-500/60"></i> ${hour.advice}</span>
                </div>
            </div>
        `;
    });
}

// ========== HELPER FUNCTIONS ==========
function getRelationshipLabel(rel) {
    const labels = {
        single: "Single & Seeking",
        dating: "Dating / In Love",
        engaged: "Engaged",
        married: "Married",
        divorced: "Divorced",
        widowed: "Widowed",
        complicated: "It's Complicated"
    };
    return labels[rel] || rel;
}

function getLuckyMonth(py) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[(py - 1) % 12];
}

function getLoveMonth(py) {
    const months = ["May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March", "April"];
    return months[(py - 1) % 12];
}

function getLoveColor(kua) {
    const colors = ["Blue", "Yellow", "Green", "Green", "Yellow", "White", "White", "Yellow", "Red"];
    return colors[kua - 1] || "Gold";
}

function getCompatibleAnimal(animal) {
    const compatibility = {
        Rat: "Ox, Dragon, Monkey", Ox: "Rat, Snake, Rooster",
        Tiger: "Horse, Dog", Rabbit: "Goat, Dog, Pig",
        Dragon: "Rat, Monkey, Rooster", Snake: "Ox, Rooster",
        Horse: "Tiger, Goat", Goat: "Rabbit, Horse, Pig",
        Monkey: "Rat, Dragon", Rooster: "Ox, Dragon, Snake",
        Dog: "Tiger, Rabbit", Pig: "Rabbit, Goat"
    };
    return compatibility[animal] || animal;
}

function getPartnerAnimal(animal) {
    const partners = {
        Rat: "Ox", Ox: "Rat", Tiger: "Horse", Rabbit: "Goat",
        Dragon: "Monkey", Snake: "Rooster", Horse: "Tiger",
        Goat: "Rabbit", Monkey: "Dragon", Rooster: "Snake",
        Dog: "Tiger", Pig: "Rabbit"
    };
    return partners[animal] || animal;
}

function getAnimalElement(animal) {
    const elements = {
        Rat: "Water", Ox: "Earth", Tiger: "Wood", Rabbit: "Wood",
        Dragon: "Earth", Snake: "Fire", Horse: "Fire", Goat: "Earth",
        Monkey: "Metal", Rooster: "Metal", Dog: "Earth", Pig: "Water"
    };
    return elements[animal] || "Earth";
}

function getBodyPart(animal) {
    const parts = {
        Rat: "kidneys and bladder", Ox: "spleen and stomach",
        Tiger: "liver and eyes", Rabbit: "liver and nerves",
        Dragon: "stomach and muscles", Snake: "heart and blood",
        Horse: "heart and spine", Goat: "spleen and digestion",
        Monkey: "lungs and large intestine", Rooster: "lungs and skin",
        Dog: "stomach and bones", Pig: "kidneys and reproductive system"
    };
    return parts[animal] || "immune system";
}

function getHealthElement(kua) {
    const elements = ["Water", "Earth", "Wood", "Wood", "Earth", "Metal", "Metal", "Earth", "Fire"];
    return elements[kua - 1] || "Earth";
}

function getFamilyDirection(kua) {
    const dirs = ["North", "Southwest", "East", "Southeast", "Center", "Northwest", "West", "Northeast", "South"];
    return dirs[kua - 1] || "Center";
}

function getRomanticDestination(animal) {
    const destinations = {
        Rat: "Venice", Ox: "Kyoto", Tiger: "Bali", Rabbit: "Paris",
        Dragon: "Santorini", Snake: "Marrakech", Horse: "Tuscany",
        Goat: "Swiss Alps", Monkey: "Hong Kong", Rooster: "Prague",
        Dog: "London", Pig: "Hawaii"
    };
    return destinations[animal] || "a tropical beach";
}

function getLuckyHour(animal) {
    const hours = {
        Rat: "23:00-01:00", Ox: "01:00-03:00", Tiger: "03:00-05:00",
        Rabbit: "05:00-07:00", Dragon: "07:00-09:00", Snake: "09:00-11:00",
        Horse: "11:00-13:00", Goat: "13:00-15:00", Monkey: "15:00-17:00",
        Rooster: "17:00-19:00", Dog: "19:00-21:00", Pig: "21:00-23:00"
    };
    return hours[animal] || "09:00-11:00";
}

function getCurrentMoonPhase() {
    const phases = ["New", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full", "Waning Gibbous", "Last Quarter", "Waning Crescent"];
    const date = new Date();
    const phase = Math.floor((date.getDate() % 28) / 3.5) % 8;
    return phases[phase];
}

function getShichenAdvice(hour) {
    const periods = [
        { name: "Zi (Rat)", time: "23:00-01:00", advice: "Rest and recharge. Your subconscious is active." },
        { name: "Chou (Ox)", time: "01:00-03:00", advice: "Focus on stability. Good time for planning." },
        { name: "Yin (Tiger)", time: "03:00-05:00", advice: "Take action. Your energy is rising." },
        { name: "Mao (Rabbit)", time: "05:00-07:00", advice: "Be gentle with yourself and others." },
        { name: "Chen (Dragon)", time: "07:00-09:00", advice: "Power hour! Make important decisions." },
        { name: "Si (Snake)", time: "09:00-11:00", advice: "Strategic planning is favored." },
        { name: "Wu (Horse)", time: "11:00-13:00", advice: "High energy. Tackle challenging tasks." },
        { name: "Wei (Goat)", time: "13:00-15:00", advice: "Seek harmony in communications." },
        { name: "Shen (Monkey)", time: "15:00-17:00", advice: "Innovative ideas flow freely." },
        { name: "You (Rooster)", time: "17:00-19:00", advice: "Clarity and precision are heightened." },
        { name: "Xu (Dog)", time: "19:00-21:00", advice: "Protect your energy. Set boundaries." },
        { name: "Hai (Pig)", time: "21:00-23:00", advice: "Abundance mindset. Count blessings." }
    ];
    
    const idx = Math.floor(hour / 2) % 12;
    const period = periods[idx];
    
    return `<span class="text-amber-400 font-medium">${period.name} Hour (${period.time})</span><br><span class="text-sm text-slate-300">${period.advice}</span>`;
}

function getMoonPhase() {
    try {
        const date = new Date();
        const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
        const lunarCycle = 29.530588853;
        
        const msSince = date - knownNewMoon;
        const daysSince = msSince / (1000 * 60 * 60 * 24);
        const phase = (daysSince % lunarCycle) / lunarCycle;
        
        let phaseName;
        if (phase < 0.03) phaseName = "New Moon";
        else if (phase < 0.24) phaseName = "Waxing Crescent";
        else if (phase < 0.26) phaseName = "First Quarter";
        else if (phase < 0.49) phaseName = "Waxing Gibbous";
        else if (phase < 0.53) phaseName = "Full Moon";
        else if (phase < 0.74) phaseName = "Waning Gibbous";
        else if (phase < 0.76) phaseName = "Last Quarter";
        else phaseName = "Waning Crescent";
        
        const illumination = phase < 0.5 ? phase * 200 : (1 - phase) * 200;
        
        setElementText('moon-display', phaseName);
        setElementText('moon-illumination', `🌗 ${Math.round(illumination)}% Illuminated`);
        
        const daysToFull = phase < 0.5 ? (0.5 - phase) * lunarCycle : (1.5 - phase) * lunarCycle;
        const nextPhase = phase < 0.5 ? "Full Moon" : "New Moon";
        setElementText('moon-desc', `${nextPhase} in ${Math.round(daysToFull)} days`);
    } catch (e) {
        console.log("Moon phase calculation error:", e);
    }
}

function saveToLocalStorage(data) {
    try {
        localStorage.setItem('zenith_last_calculation', JSON.stringify(data));
    } catch (e) {
        console.log('Storage not available');
    }
}

function loadFromStorage() {
    try {
        const saved = localStorage.getItem('zenith_last_calculation');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.name) document.getElementById('name').value = data.name;
            if (data.dob) {
                const [year, month, day] = data.dob.split('-');
                document.getElementById('dob-year').value = parseInt(year);
                document.getElementById('dob-month').value = parseInt(month);
                
                // Trigger day population
                const monthEvent = new Event('change');
                document.getElementById('dob-month').dispatchEvent(monthEvent);
                
                // Set day after days are populated
                setTimeout(() => {
                    document.getElementById('dob-day').value = parseInt(day);
                }, 50);
            }
            if (data.tob) document.getElementById('tob').value = data.tob;
            if (data.gender) document.getElementById('gender').value = data.gender;
            if (data.relationship) document.getElementById('relationship').value = data.relationship;
            if (data.timezone) document.getElementById('timezone').value = data.timezone;
            if (data.career) document.getElementById('career').value = data.career;
        }
        validateForm();
    } catch (e) {
        console.log('Error loading from storage');
    }
}

// ========== MAIN CALCULATION ==========
window.calculateOracle = function() {
    if (!validateForm()) {
        alert("Please complete all fields to forge your cosmic identity.");
        return;
    }

    const invokeBtn = document.getElementById('invokeBtn');
    const nameInput = document.getElementById('name').value.trim();
    
    const dobMonth = document.getElementById('dob-month').value.padStart(2, '0');
    const dobDay = document.getElementById('dob-day').value.padStart(2, '0');
    const dobYear = document.getElementById('dob-year').value;
    const dobInput = `${dobYear}-${dobMonth}-${dobDay}`;
    
    const tobInput = document.getElementById('tob').value;
    const gender = document.getElementById('gender').value;
    const relationship = document.getElementById('relationship').value;
    const timezone = parseFloat(document.getElementById('timezone').value) || 0;
    const career = document.getElementById('career').value;

    invokeBtn.disabled = true;
    invokeBtn.innerHTML = '<span class="spinner"></span> Forging your destiny...';

    try {
        const birthDate = new Date(dobInput);
        const birthYear = birthDate.getFullYear();
        const birthMonth = birthDate.getMonth() + 1;
        const birthDay = birthDate.getDate();
        const timeParts = tobInput.split(':');
        const birthHour = parseInt(timeParts[0]) || 12;
        const today = new Date();
        const currentHour = today.getHours();
        const seed = Math.abs((birthYear * birthMonth * birthDay + nameInput.length) % 97) || 1;

        // Personal Year
        const pyRaw = birthDay + birthMonth + 2026;
        const py = reduceToSingleDigit(pyRaw);
        setElementText('res-py', py);
        
        const startOfYear = new Date(today.getFullYear(), 0, 0);
        const diff = today - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const yearProgress = (dayOfYear / 365) * 100;
        const pyProgress = document.getElementById('py-progress');
        if (pyProgress) pyProgress.style.width = `${Math.min(100, yearProgress)}%`;
        
        const pyElement = EASTERN_ELEMENTS[(py - 1) % 5];
        setElementText('res-py-element', `Element: <span class="text-amber-400">${pyElement}</span>`);

        // Kua Number
        const kua = calculateKua(birthYear, gender);
        const luckyDir = getKuaDirection(kua);
        setElementText('res-dir', luckyDir);

        // Wu Xing Elements
        const elementStrengths = calculateWuXing(birthYear, birthMonth, birthDay, birthHour, gender);
        renderElements(elementStrengths);
        const dominantIdx = elementStrengths.indexOf(Math.max(...elementStrengths));
        setElementText('dominant-element', `${ELEMENTS[dominantIdx].name} Dominant`);

        // Zodiac
        setElementText('res-western', getWesternZodiac(birthMonth, birthDay));
        const easternSign = getEasternZodiac(birthYear);
        setElementText('res-eastern', easternSign);

        // Lucky Number
        const luckyNumber = calculateLuckyNumber(py, birthDay, kua);
        setElementText('res-num', luckyNumber);

        // Personal Gem
        setElementText('res-gem', GEMSTONES[py] || "Jade");

        // Lucky Color
        let displayKua = kua;
        if (kua === 5) {
            displayKua = gender === 'male' ? 2 : 8;
        }
        setElementText('res-color', LUCKY_COLORS[displayKua] || "Gold, Yellow");

        // Lucky Animal Ornament
        setElementText('res-animal', ANIMAL_CURES[easternSign] || "Jade Pi Yao");

        // Four Pillars
        const pillars = calculateFourPillars(birthYear, birthMonth, birthDay, birthHour);
        setElementText('pillar-year', pillars.year);
        setElementText('pillar-month', pillars.month);
        setElementText('pillar-day', pillars.day);
        setElementText('pillar-hour', pillars.hour);

        // Fortune Meter
        const fortuneScore = calculateFortuneScore(py, kua, birthDay, seed);
        renderStarRating(fortuneScore);
        renderComfortQuote(fortuneScore);

        // Prophecies
        propheciesData = generateAllProphecies(seed, py, easternSign, luckyDir, relationship, career, kua);
        
        // Set initial prophecy display
        currentProphecyTab = 'wealth';
        updateProphecyDisplay();
        window.switchProphecyTab('wealth');

        // Shichen Advice
        setElementText('res-advice', getShichenAdvice(currentHour));

        // Lucky Hours
        const luckyHours = calculateLuckyHours(py, birthDay, kua, today, easternSign, timezone);
        renderLuckyHours(luckyHours, timezone);

        // Relationship Status
        setElementText('relationship-display', `💖 Relationship: <span class="text-amber-400">${getRelationshipLabel(relationship)}</span>`);

        // Timezone Display
        const timezoneDisplay = document.getElementById('timezone-display');
        if (timezoneDisplay) {
            const tzOption = document.querySelector(`#timezone option[value="${timezone}"]`);
            const tzText = tzOption ? tzOption.textContent.split(')')[0] + ')' : `UTC${timezone >= 0 ? '+' : ''}${timezone}`;
            timezoneDisplay.innerHTML = `<i class="fas fa-globe"></i> ${tzText}`;
        }

        document.getElementById('results').classList.remove('hidden');
        
        setTimeout(() => {
            window.scrollTo({ 
                top: document.getElementById('results').offsetTop - 20, 
                behavior: 'smooth' 
            });
        }, 100);
        
        saveToLocalStorage({
            name: nameInput,
            dob: dobInput,
            tob: tobInput,
            gender: gender,
            relationship: relationship,
            timezone: timezone,
            career: career
        });
        
    } catch (error) {
        console.error("Calculation error:", error);
        alert("An error occurred during calculation. Please try again.");
    }

    invokeBtn.disabled = false;
    invokeBtn.innerHTML = '<i class="fas fa-crystal-ball"></i><span>FORGE YOUR DESTINY</span>';
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log("Arcana Studio Labs initialized - All fixes applied");
    
    // Initialize date dropdowns
    initDateDropdowns();
    
    // Form validation listeners
    const inputs = ['name', 'dob-month', 'dob-day', 'dob-year', 'tob', 'gender', 'relationship', 'country', 'timezone', 'career'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', validateForm);
            el.addEventListener('keyup', validateForm);
            el.addEventListener('input', validateForm);
        }
    });
    
    // Moon phase
    getMoonPhase();
    setInterval(getMoonPhase, 60000);
    
    // Load saved data
    setTimeout(() => {
        loadFromStorage();
    }, 100);
});