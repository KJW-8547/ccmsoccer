// CCM Champions League - 6개 학과 축구 토너먼트 로직

const INITIAL_TEAMS = [
    { id: 'elec', name: '전기과', dept: '⚡ 전기과' },
    { id: 'mech', name: '기계과', dept: '⚙️ 기계과' },
    { id: 'ind',  name: '산업설비과', dept: '🔧 산업설비과' },
    { id: 'auto', name: '자동차과', dept: '🚗 자동차과' },
    { id: 'mold', name: '스마트금형과', dept: '🔩 스마트금형과' },
    { id: 'arch', name: '건축토목과', dept: '🏗️ 건축토목과' }
];

// Initial default 6-team bracket data
let matchData = {
    // Round 1: 예선전 (6강)
    'M1': { id: 'M1', round: 1, title: '예선 1경기', team1: '전기과', team2: '기계과', score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M3', nextSlot: 'team2' },
    'M2': { id: 'M2', round: 1, title: '예선 2경기', team1: '산업설비과', team2: '자동차과', score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M4', nextSlot: 'team2' },

    // Round 2: 4강 준결승 (부전승 2팀 배치 + 예선 승자 2팀)
    'M3': { id: 'M3', round: 2, title: '준결승 1경기', team1: '스마트금형과', isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M5', nextSlot: 'team1', loserMatch: 'M6', loserSlot: 'team1' },
    'M4': { id: 'M4', round: 2, title: '준결승 2경기', team1: '건축토목과', isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M5', nextSlot: 'team2', loserMatch: 'M6', loserSlot: 'team2' },

    // Round 3: 결승전 & 3위 결정전
    'M5': { id: 'M5', round: 3, title: '🏆 결승전', isFinal: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null },
    'M6': { id: 'M6', round: 3, title: '🥉 3·4위 결정전', is3rd: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null }
};

let currentEditingMatchId = null;

document.addEventListener('DOMContentLoaded', () => {
    renderTeamChips();
    renderBracket();
    setupEventListeners();
    setupBannerTabs();
});

// Setup Banner Horizontal Tabs to Switch Screens
function setupBannerTabs() {
    const tabs = document.querySelectorAll('.banner-tab');
    const screens = document.querySelectorAll('.screen-view');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetScreenId = tab.getAttribute('data-screen');

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            screens.forEach(screen => {
                screen.classList.remove('active');
                if (screen.id === targetScreenId) {
                    screen.classList.add('active');
                }
            });
        });
    });
}

// Render list of participating departments
function renderTeamChips() {
    const container = document.getElementById('teams-chips');
    if (!container) return;
    container.innerHTML = '';

    const byeTeams = [matchData['M3'].team1, matchData['M4'].team1];

    INITIAL_TEAMS.forEach(team => {
        const isBye = byeTeams.includes(team.name);
        const chip = document.createElement('div');
        chip.className = `team-chip ${isBye ? 'is-bye' : ''}`;
        chip.innerHTML = `
            <span class="dept-icon">${team.dept.split(' ')[0]}</span>
            <span class="chip-name">${team.name}</span>
            ${isBye ? '<span class="bye-pill">4강 직행</span>' : ''}
        `;
        container.appendChild(chip);
    });
}

// Render Tournament Bracket
function renderBracket() {
    const r1 = document.getElementById('round-1-matches');
    const r2 = document.getElementById('round-2-matches');
    const r3 = document.getElementById('round-3-matches');

    if (r1) r1.innerHTML = '';
    if (r2) r2.innerHTML = '';
    if (r3) r3.innerHTML = '';

    Object.values(matchData).forEach(match => {
        const card = createMatchCard(match);

        if (match.round === 1 && r1) r1.appendChild(card);
        else if (match.round === 2 && r2) r2.appendChild(card);
        else if (match.round === 3 && r3) r3.appendChild(card);
    });

    updatePodium();
}

function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = `match-card ${match.isFinal ? 'is-final' : ''} ${match.is3rd ? 'is-3rd' : ''}`;
    
    const team1Text = match.team1 || '미정 (대기중)';
    const team2Text = match.team2 || '미정 (대기중)';

    const score1Text = match.score1 !== null ? match.score1 : '-';
    const score2Text = match.score2 !== null ? match.score2 : '-';

    const isWinner1 = match.winner && match.winner === match.team1;
    const isWinner2 = match.winner && match.winner === match.team2;

    const isPK = match.pk1 !== null && match.pk2 !== null;

    card.innerHTML = `
        <div class="match-card-header">
            <span class="match-code">${match.title}</span>
            <span class="match-id-badge">${match.id}</span>
        </div>
        <div class="teams-container">
            <div class="team-row ${isWinner1 ? 'winner' : ''} ${match.isBye1 ? 'bye-row' : ''}">
                <div class="team-info">
                    <span class="team-name">${team1Text}</span>
                    ${match.isBye1 ? '<span class="bye-tag">부전승</span>' : ''}
                    ${isPK ? `<span class="pk-badge">PK ${match.pk1}</span>` : ''}
                </div>
                <span class="score">${score1Text}</span>
            </div>
            <div class="team-row ${isWinner2 ? 'winner' : ''} ${match.isBye2 ? 'bye-row' : ''}">
                <div class="team-info">
                    <span class="team-name">${team2Text}</span>
                    ${match.isBye2 ? '<span class="bye-tag">부전승</span>' : ''}
                    ${isPK ? `<span class="pk-badge">PK ${match.pk2}</span>` : ''}
                </div>
                <span class="score">${score2Text}</span>
            </div>
        </div>
        <div class="match-card-actions">
            ${(match.team1 && match.team2) ? `<button class="btn-edit-score" onclick="openScoreModal('${match.id}')">✏️ 경기 결과 입력</button>` : '<span class="waiting-text">대진 대기 중</span>'}
        </div>
    `;

    return card;
}

// Open Modal to enter score
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
            alert('정규시간이 동점입니다. 승부차기(PK) 점수를 기입해 주세요!');
            return;
        }

        const pk1 = parseInt(pk1Input, 10);
        const pk2 = parseInt(pk2Input, 10);

        if (pk1 === pk2) {
            alert('승부차기(PK) 점수가 동일할 수 없습니다. 승자를 정할 수 있도록 PK 점수를 다르게 기입해 주세요!');
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

    // Propagate Winner to Next Match
    if (match.nextMatch && match.nextSlot) {
        matchData[match.nextMatch][match.nextSlot] = match.winner;
    }

    // Propagate Loser to 3rd Place Match if applicable
    if (match.loserMatch && match.loserSlot) {
        matchData[match.loserMatch][match.loserSlot] = match.loser;
    }

    closeModal();
    renderBracket();
}

// Update Podium Display
function updatePodium() {
    const finalMatch = matchData['M5'];
    const thirdMatch = matchData['M6'];

    const p1 = document.getElementById('place-1');
    const p2 = document.getElementById('place-2');
    const p3 = document.getElementById('place-3');

    if (p1) p1.innerText = finalMatch.winner || '미정';
    if (p2) p2.innerText = finalMatch.loser || '미정';
    if (p3) p3.innerText = thirdMatch.winner || '미정';
}

// Shuffle Bracket Randomly for 6 Departments
function shuffleBracket() {
    if (!confirm('대진표를 무작위로 재배치하시겠습니까? (기존 경기 점수는 초기화됩니다)')) return;

    const teamNames = INITIAL_TEAMS.map(t => t.name).sort(() => Math.random() - 0.5);

    const bye1 = teamNames[0];
    const bye2 = teamNames[1];
    const r1Teams = teamNames.slice(2);

    matchData = {
        'M1': { id: 'M1', round: 1, title: '예선 1경기', team1: r1Teams[0], team2: r1Teams[1], score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M3', nextSlot: 'team2' },
        'M2': { id: 'M2', round: 1, title: '예선 2경기', team1: r1Teams[2], team2: r1Teams[3], score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M4', nextSlot: 'team2' },

        'M3': { id: 'M3', round: 2, title: '준결승 1경기', team1: bye1, isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M5', nextSlot: 'team1', loserMatch: 'M6', loserSlot: 'team1' },
        'M4': { id: 'M4', round: 2, title: '준결승 2경기', team1: bye2, isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M5', nextSlot: 'team2', loserMatch: 'M6', loserSlot: 'team2' },

        'M5': { id: 'M5', round: 3, title: '🏆 결승전', isFinal: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null },
        'M6': { id: 'M6', round: 3, title: '🥉 3·4위 결정전', is3rd: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null }
    };

    renderTeamChips();
    renderBracket();
}

// Reset to Default
function resetBracket() {
    if (!confirm('대진표를 초기 상태로 리셋하시겠습니까?')) return;
    
    matchData = {
        'M1': { id: 'M1', round: 1, title: '예선 1경기', team1: '전기과', team2: '기계과', score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M3', nextSlot: 'team2' },
        'M2': { id: 'M2', round: 1, title: '예선 2경기', team1: '산업설비과', team2: '자동차과', score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M4', nextSlot: 'team2' },

        'M3': { id: 'M3', round: 2, title: '준결승 1경기', team1: '스마트금형과', isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M5', nextSlot: 'team1', loserMatch: 'M6', loserSlot: 'team1' },
        'M4': { id: 'M4', round: 2, title: '준결승 2경기', team1: '건축토목과', isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M5', nextSlot: 'team2', loserMatch: 'M6', loserSlot: 'team2' },

        'M5': { id: 'M5', round: 3, title: '🏆 결승전', isFinal: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null },
        'M6': { id: 'M6', round: 3, title: '🥉 3·4위 결정전', is3rd: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null }
    };

    renderTeamChips();
    renderBracket();
}

function setupEventListeners() {
    document.getElementById('btn-shuffle').addEventListener('click', shuffleBracket);
    document.getElementById('btn-reset').addEventListener('click', resetBracket);
    document.getElementById('btn-print').addEventListener('click', () => window.print());

    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
    document.getElementById('modal-save-btn').addEventListener('click', saveScore);

    // Dynamic PK display when score changes in modal
    document.getElementById('modal-team1-score').addEventListener('input', checkTieAndTogglePK);
    document.getElementById('modal-team2-score').addEventListener('input', checkTieAndTogglePK);
}
