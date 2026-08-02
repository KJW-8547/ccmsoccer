/**
 * 춘천기계공업고등학교 2026학년도 학과별 축구 토너먼트 (CCM Champions League)
 * JavaScript 메인 로직
 */

// 11개 학과/학급 팀 데이터
const INITIAL_TEAMS = [
    { id: 'elec31', name: '전기 3-1', dept: '⚡ 전기과' },
    { id: 'elec32', name: '전기 3-2', dept: '⚡ 전기과' },
    { id: 'mech31', name: '기계 3-1', dept: '⚙️ 기계과' },
    { id: 'mech32', name: '기계 3-2', dept: '⚙️ 기계과' },
    { id: 'mech33', name: '기계 3-3', dept: '⚙️ 기계과' },
    { id: 'ind31',  name: '산업설비 3-1', dept: '🔧 산업설비과' },
    { id: 'auto31', name: '자동차 3-1', dept: '🚗 자동차과' },
    { id: 'auto32', name: '자동차 3-2', dept: '🚗 자동차과' },
    { id: 'mold31', name: '스마트금형 3-1', dept: '🔩 스마트금형과' },
    { id: 'arch31', name: '건축토목 3-1', dept: '🏗️ 건축토목과' },
    { id: 'arch32', name: '건축토목 3-2', dept: '🏗️ 건축토목과' }
];

// 학과별 전력 분석 데이터 (Chart.js 및 Progress Bar 용)
const DEPT_ANALYSIS_DATA = {
    'mech': {
        name: '⚙️ 기계과',
        ovr: 96,
        stats: { att: 96, def: 92, team: 97, mom: 94, tac: 95 },
        quote: '기계과는 유기적인 패스워크와 완벽한 조직력을 바탕으로 중원을 지배하는 전통의 가장 강력한 우승 후보입니다.'
    },
    'elec': {
        name: '⚡ 전기과',
        ovr: 94,
        stats: { att: 93, def: 94, team: 92, mom: 95, tac: 91 },
        quote: '전기과는 폭발적인 전격 공격력과 단단한 수비 밸런스를 모두 갖춘 전천후 피치 위 스타군단입니다.'
    },
    'ind': {
        name: '🔧 산업설비과',
        ovr: 89,
        stats: { att: 87, def: 91, team: 90, mom: 88, tac: 89 },
        quote: '산업설비과는 강력한 피지컬과 높은 몸싸움 승률로 상대를 무력화하는 실속형 파워풀 팀입니다.'
    },
    'auto': {
        name: '🚗 자동차과',
        ovr: 92,
        stats: { att: 95, def: 87, team: 90, mom: 96, tac: 91 },
        quote: '자동차과는 탁월한 가속력과 거침없는 측면 카운터 어택을 구사하는 피치 위의 스피드스터 팀입니다.'
    },
    'mold': {
        name: '🔩 스마트금형과',
        ovr: 90,
        stats: { att: 88, def: 93, team: 91, mom: 89, tac: 90 },
        quote: '스마트금형과는 철통같은 키퍼 선방과 정밀한 수비 조직력으로 상대의 빈틈을 파고드는 단단한 팀입니다.'
    },
    'arch': {
        name: '🏗️ 건축토목과',
        ovr: 91,
        stats: { att: 89, def: 95, team: 89, mom: 91, tac: 92 },
        quote: '건축토목과는 높은 공중볼 경합 성공률과 견고한 중앙 장벽을 자랑하는 통곡의 벽 방어팀입니다.'
    }
};

// 기본 11개 팀 토너먼트 매핑 데이터
const DEFAULT_MATCH_DATA = {
    // Round 1: 예선전 (3경기 / 6팀)
    'M1': { id: 'M1', round: 1, title: '예선 1경기', team1: '전기 3-1', team2: '기계 3-1', score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M4', nextSlot: 'team2' },
    'M2': { id: 'M2', round: 1, title: '예선 2경기', team1: '기계 3-2', team2: '기계 3-3', score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M5', nextSlot: 'team2' },
    'M3': { id: 'M3', round: 1, title: '예선 3경기', team1: '자동차 3-1', team2: '자동차 3-2', score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M6', nextSlot: 'team2' },

    // Round 2: 8강전 (4경기 / 5개 부전승 팀 + 3개 예선 승자)
    'M4': { id: 'M4', round: 2, title: '8강 1경기', team1: '전기 3-2', isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M8', nextSlot: 'team1' },
    'M5': { id: 'M5', round: 2, title: '8강 2경기', team1: '산업설비 3-1', isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M8', nextSlot: 'team2' },
    'M6': { id: 'M6', round: 2, title: '8강 3경기', team1: '스마트금형 3-1', isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M9', nextSlot: 'team1' },
    'M7': { id: 'M7', round: 2, title: '8강 4경기', team1: '건축토목 3-1', isBye1: true, team2: '건축토목 3-2', isBye2: true, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M9', nextSlot: 'team2' },

    // Round 3: 4강 준결승 (2경기)
    'M8': { id: 'M8', round: 3, title: '준결승 1경기', team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team1', loserMatch: 'M11', loserSlot: 'team1' },
    'M9': { id: 'M9', round: 3, title: '준결승 2경기', team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team2', loserMatch: 'M11', loserSlot: 'team2' },

    // Round 4: 결승전 & 3위 결정전
    'M10': { id: 'M10', round: 4, title: '🏆 결승전', isFinal: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null },
    'M11': { id: 'M11', round: 4, title: '🥉 3·4위 결정전', is3rd: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null }
};

// Global State
let matchData = JSON.parse(JSON.stringify(DEFAULT_MATCH_DATA));
let currentEditingMatchId = null;
let radarChartInstance = null;

// LocalStorage Storage Key
const LOCAL_STORAGE_KEY = 'ccm_tournament_data_2026';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadStateFromLocalStorage();
    renderTeamChips();
    renderBracket();
    initRadarChart();
    setupEventListeners();
    setupSmoothScroll();
});

// Load saved state from LocalStorage
function loadStateFromLocalStorage() {
    try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            matchData = JSON.parse(savedData);
        }
    } catch (e) {
        console.error('LocalStorage load failed:', e);
    }
}

// Save current matchData to LocalStorage
function saveStateToLocalStorage() {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(matchData));
    } catch (e) {
        console.error('LocalStorage save failed:', e);
    }
}

// Render participating team chips
function renderTeamChips() {
    const container = document.getElementById('teams-chips');
    if (!container) return;
    container.innerHTML = '';

    const byeTeams = [
        matchData['M4'].team1,
        matchData['M5'].team1,
        matchData['M6'].team1,
        matchData['M7'].team1,
        matchData['M7'].team2
    ];

    INITIAL_TEAMS.forEach(team => {
        const isBye = byeTeams.includes(team.name);
        const chip = document.createElement('div');
        chip.className = `team-chip ${isBye ? 'is-bye' : ''}`;
        chip.innerHTML = `
            <span class="chip-dept-icon">${team.dept.split(' ')[0]}</span>
            <span class="chip-name">${team.name}</span>
            ${isBye ? '<span class="chip-bye-tag">BYE</span>' : ''}
        `;
        container.appendChild(chip);
    });
}

// Render Tournament Bracket
function renderBracket() {
    const r1 = document.getElementById('round-1-matches');
    const r2 = document.getElementById('round-2-matches');
    const r3 = document.getElementById('round-3-matches');
    const r4 = document.getElementById('round-4-matches');

    if (r1) r1.innerHTML = '';
    if (r2) r2.innerHTML = '';
    if (r3) r3.innerHTML = '';
    if (r4) r4.innerHTML = '';

    Object.values(matchData).forEach(match => {
        const card = createMatchCard(match);

        if (match.round === 1 && r1) r1.appendChild(card);
        else if (match.round === 2 && r2) r2.appendChild(card);
        else if (match.round === 3 && r3) r3.appendChild(card);
        else if (match.round === 4 && r4) r4.appendChild(card);
    });

    updatePodium();
}

// Create Card Element for Match
function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = `match-card ${match.isFinal ? 'is-final' : ''} ${match.is3rd ? 'is-3rd' : ''}`;
    
    const team1Text = match.team1 || '미정 (대기중)';
    const team2Text = match.team2 || '미정 (대기중)';

    const score1Text = match.score1 !== null ? match.score1 : '-';
    const score2Text = match.score2 !== null ? match.score2 : '-';

    const isWinner1 = match.winner && match.winner === match.team1;
    const isWinner2 = match.winner && match.winner === match.team2;

    const isLoser1 = match.loser && match.loser === match.team1;
    const isLoser2 = match.loser && match.loser === match.team2;

    const isPK = match.pk1 !== null && match.pk2 !== null;

    card.innerHTML = `
        <div class="match-card-header">
            <span class="match-code">${match.title}</span>
            <span class="match-id">${match.id}</span>
        </div>
        <div class="teams-container">
            <div class="team-row ${isWinner1 ? 'winner' : ''} ${isLoser1 ? 'loser' : ''} ${match.isBye1 ? 'bye-row' : ''}">
                <div class="team-name-group">
                    <span class="team-name">${team1Text}</span>
                    ${match.isBye1 ? '<span class="bye-badge">BYE</span>' : ''}
                    ${isPK ? `<span class="pk-badge">PK ${match.pk1}</span>` : ''}
                </div>
                <span class="score">${score1Text}</span>
            </div>
            <div class="team-row ${isWinner2 ? 'winner' : ''} ${isLoser2 ? 'loser' : ''} ${match.isBye2 ? 'bye-row' : ''}">
                <div class="team-name-group">
                    <span class="team-name">${team2Text}</span>
                    ${match.isBye2 ? '<span class="bye-badge">BYE</span>' : ''}
                    ${isPK ? `<span class="pk-badge">PK ${match.pk2}</span>` : ''}
                </div>
                <span class="score">${score2Text}</span>
            </div>
        </div>
        <div class="match-actions">
            ${(match.team1 && match.team2) ? `<button class="btn-edit-score" onclick="openScoreModal('${match.id}')">✏️ 결과 입력</button>` : '<span class="waiting-text">대진 대기 중</span>'}
        </div>
    `;

    return card;
}

// Open Score Entry Modal
window.openScoreModal = function(matchId) {
    const match = matchData[matchId];
    if (!match || !match.team1 || !match.team2) return;

    currentEditingMatchId = matchId;
    document.getElementById('modal-match-title').innerText = `${match.title} (${match.id}) 결과 입력`;
    document.getElementById('modal-team1-name').innerText = match.team1;
    document.getElementById('modal-team2-name').innerText = match.team2;
    
    document.getElementById('modal-pk-team1-label').innerText = `${match.team1} (PK)`;
    document.getElementById('modal-pk-team2-label').innerText = `${match.team2} (PK)`;

    const s1 = match.score1 !== null ? match.score1 : 0;
    const s2 = match.score2 !== null ? match.score2 : 0;

    document.getElementById('modal-team1-score').value = s1;
    document.getElementById('modal-team2-score').value = s2;
    
    document.getElementById('modal-team1-pk').value = match.pk1 !== null ? match.pk1 : 0;
    document.getElementById('modal-team2-pk').value = match.pk2 !== null ? match.pk2 : 0;

    checkTieAndTogglePK();

    document.getElementById('match-modal').classList.add('active');
};

// Check if score is tied and display PK inputs
function checkTieAndTogglePK() {
    const s1 = parseInt(document.getElementById('modal-team1-score').value, 10);
    const s2 = parseInt(document.getElementById('modal-team2-score').value, 10);

    const pkContainer = document.getElementById('modal-pk-container');
    if (!isNaN(s1) && !isNaN(s2) && s1 === s2) {
        pkContainer.style.display = 'block';
    } else {
        pkContainer.style.display = 'none';
    }
}

// Close Modal
function closeModal() {
    document.getElementById('match-modal').classList.remove('active');
    currentEditingMatchId = null;
}

// Save Score & Advance Winners
function saveScore() {
    if (!currentEditingMatchId) return;

    const match = matchData[currentEditingMatchId];
    const score1Input = document.getElementById('modal-team1-score').value;
    const score2Input = document.getElementById('modal-team2-score').value;

    if (score1Input === '' || score2Input === '') {
        alert('정규시간 점수를 입력해 주세요!');
        return;
    }

    const score1 = parseInt(score1Input, 10);
    const score2 = parseInt(score2Input, 10);

    if (score1 === score2) {
        const pk1Input = document.getElementById('modal-team1-pk').value;
        const pk2Input = document.getElementById('modal-team2-pk').value;

        if (pk1Input === '' || pk2Input === '') {
            alert('정규시간이 동점입니다. 승부차기(PK) 점수를 입력해 주세요!');
            return;
        }

        const pk1 = parseInt(pk1Input, 10);
        const pk2 = parseInt(pk2Input, 10);

        if (pk1 === pk2) {
            alert('승부차기(PK) 점수가 동일할 수 없습니다. 승자 판가름을 위해 PK 점수를 다르게 입력해 주세요!');
            return;
        }

        match.score1 = score1;
        match.score2 = score2;
        match.pk1 = pk1;
        match.pk2 = pk2;

        if (pk1 > pk2) {
            match.winner = match.team1;
            match.loser = match.team2;
        } else {
            match.winner = match.team2;
            match.loser = match.team1;
        }
    } else {
        match.score1 = score1;
        match.score2 = score2;
        match.pk1 = null;
        match.pk2 = null;

        if (score1 > score2) {
            match.winner = match.team1;
            match.loser = match.team2;
        } else {
            match.winner = match.team2;
            match.loser = match.team1;
        }
    }

    // Advance winner to next match
    if (match.nextMatch && match.nextSlot) {
        matchData[match.nextMatch][match.nextSlot] = match.winner;
    }

    // Advance loser to 3rd place match if applicable
    if (match.loserMatch && match.loserSlot) {
        matchData[match.loserMatch][match.loserSlot] = match.loser;
    }

    saveStateToLocalStorage();
    closeModal();
    renderBracket();
}

// Update Podium Display and Hall of Fame 2026 row
function updatePodium() {
    const finalMatch = matchData['M10'];
    const thirdMatch = matchData['M11'];

    const p1Name = finalMatch.winner || '우승 학과 (결과 대기)';
    const p2Name = finalMatch.loser || '준우승 학과 (결과 대기)';
    const p3Name = thirdMatch.winner || '3위 학과 (결과 대기)';

    document.getElementById('podium-place-1').innerText = p1Name;
    document.getElementById('podium-place-2').innerText = p2Name;
    document.getElementById('podium-place-3').innerText = p3Name;

    // Also update 2026 Hall of Fame table row
    const h1 = document.getElementById('hist-2026-1');
    const h2 = document.getElementById('hist-2026-2');
    const h3 = document.getElementById('hist-2026-3');

    if (h1) h1.innerText = finalMatch.winner || '진행 중 (대기)';
    if (h2) h2.innerText = finalMatch.loser || '진행 중';
    if (h3) h3.innerText = thirdMatch.winner || '진행 중';
}

// Shuffle Bracket Randomly
function shuffleBracket() {
    if (!confirm('대진표를 무작위로 재배치하시겠습니까? (기존 기록은 리셋됩니다)')) return;

    const teamNames = INITIAL_TEAMS.map(t => t.name).sort(() => Math.random() - 0.5);

    const byeTeams = teamNames.slice(0, 5);
    const r1Teams = teamNames.slice(5);

    matchData = {
        'M1': { id: 'M1', round: 1, title: '예선 1경기', team1: r1Teams[0], team2: r1Teams[1], score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M4', nextSlot: 'team2' },
        'M2': { id: 'M2', round: 1, title: '예선 2경기', team1: r1Teams[2], team2: r1Teams[3], score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M5', nextSlot: 'team2' },
        'M3': { id: 'M3', round: 1, title: '예선 3경기', team1: r1Teams[4], team2: r1Teams[5], score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M6', nextSlot: 'team2' },

        'M4': { id: 'M4', round: 2, title: '8강 1경기', team1: byeTeams[0], isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M8', nextSlot: 'team1' },
        'M5': { id: 'M5', round: 2, title: '8강 2경기', team1: byeTeams[1], isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M8', nextSlot: 'team2' },
        'M6': { id: 'M6', round: 2, title: '8강 3경기', team1: byeTeams[2], isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M9', nextSlot: 'team1' },
        'M7': { id: 'M7', round: 2, title: '8강 4경기', team1: byeTeams[3], isBye1: true, team2: byeTeams[4], isBye2: true, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M9', nextSlot: 'team2' },

        'M8': { id: 'M8', round: 3, title: '준결승 1경기', team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team1', loserMatch: 'M11', loserSlot: 'team1' },
        'M9': { id: 'M9', round: 3, title: '준결승 2경기', team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team2', loserMatch: 'M11', loserSlot: 'team2' },

        'M10': { id: 'M10', round: 4, title: '🏆 결승전', isFinal: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null },
        'M11': { id: 'M11', round: 4, title: '🥉 3·4위 결정전', is3rd: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null }
    };

    saveStateToLocalStorage();
    renderTeamChips();
    renderBracket();
}

// Reset Bracket to Default
function resetBracket() {
    if (!confirm('대진표를 초기 상태로 리셋하시겠습니까?')) return;
    
    matchData = JSON.parse(JSON.stringify(DEFAULT_MATCH_DATA));
    saveStateToLocalStorage();
    renderTeamChips();
    renderBracket();
}

// Chart.js Radar Chart Setup
function initRadarChart() {
    const ctx = document.getElementById('powerRadarChart');
    if (!ctx) return;

    const initialData = DEPT_ANALYSIS_DATA['mech'];

    radarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['공격력', '수비력', '조직력', '기세', '전술'],
            datasets: [{
                label: '스쿼드 능력치',
                data: [
                    initialData.stats.att,
                    initialData.stats.def,
                    initialData.stats.team,
                    initialData.stats.mom,
                    initialData.stats.tac
                ],
                backgroundColor: 'rgba(59, 130, 246, 0.25)',
                borderColor: '#3B82F6',
                borderWidth: 2,
                pointBackgroundColor: '#22D3EE',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#3B82F6',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.15)' },
                    grid: { color: 'rgba(255, 255, 255, 0.12)' },
                    pointLabels: {
                        color: '#F8FAFC',
                        font: { family: 'Pretendard', size: 12, weight: '700' }
                    },
                    ticks: {
                        display: false,
                        min: 50,
                        max: 100
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Update Department Analysis view
function updateDepartmentAnalysis(deptKey) {
    const data = DEPT_ANALYSIS_DATA[deptKey];
    if (!data) return;

    document.getElementById('dept-ovr-val').innerText = data.ovr;
    document.getElementById('dept-name-display').innerText = data.name;

    document.getElementById('val-att').innerText = data.stats.att;
    document.getElementById('val-def').innerText = data.stats.def;
    document.getElementById('val-team').innerText = data.stats.team;
    document.getElementById('val-mom').innerText = data.stats.mom;
    document.getElementById('val-tac').innerText = data.stats.tac;

    document.getElementById('bar-att').style.width = `${data.stats.att}%`;
    document.getElementById('bar-def').style.width = `${data.stats.def}%`;
    document.getElementById('bar-team').style.width = `${data.stats.team}%`;
    document.getElementById('bar-mom').style.width = `${data.stats.mom}%`;
    document.getElementById('bar-tac').style.width = `${data.stats.tac}%`;

    document.getElementById('dept-analysis-text').innerText = `"${data.quote}"`;

    if (radarChartInstance) {
        radarChartInstance.data.datasets[0].data = [
            data.stats.att,
            data.stats.def,
            data.stats.team,
            data.stats.mom,
            data.stats.tac
        ];
        radarChartInstance.update();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Action Buttons
    const heroShuffle = document.getElementById('hero-btn-shuffle');
    const heroReset = document.getElementById('hero-btn-reset');
    const bracketShuffle = document.getElementById('bracket-btn-shuffle');
    const bracketReset = document.getElementById('bracket-btn-reset');
    const bracketPrint = document.getElementById('bracket-btn-print');

    if (heroShuffle) heroShuffle.addEventListener('click', shuffleBracket);
    if (heroReset) heroReset.addEventListener('click', resetBracket);
    if (bracketShuffle) bracketShuffle.addEventListener('click', shuffleBracket);
    if (bracketReset) bracketReset.addEventListener('click', resetBracket);
    if (bracketPrint) bracketPrint.addEventListener('click', () => window.print());

    // Modal buttons
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
    document.getElementById('modal-save-btn').addEventListener('click', saveScore);

    document.getElementById('modal-team1-score').addEventListener('input', checkTieAndTogglePK);
    document.getElementById('modal-team2-score').addEventListener('input', checkTieAndTogglePK);

    // Department Dropdown Change
    const deptSelect = document.getElementById('dept-select');
    if (deptSelect) {
        deptSelect.addEventListener('change', (e) => {
            updateDepartmentAnalysis(e.target.value);
        });
    }
}

// Smooth scrolling for navigation links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
