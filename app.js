// 3학년 학급 대항 축구 토너먼트 앱 로직

const INITIAL_TEAMS = [
    { id: 'elec31', name: '전기 3-1', dept: '⚡ 전기' },
    { id: 'elec32', name: '전기 3-2', dept: '⚡ 전기' },
    { id: 'mech31', name: '기계 3-1', dept: '⚙️ 기계' },
    { id: 'mech32', name: '기계 3-2', dept: '⚙️ 기계' },
    { id: 'mech33', name: '기계 3-3', dept: '⚙️ 기계' },
    { id: 'ind31',  name: '산업설비 3-1', dept: '🔧 산업설비' },
    { id: 'auto31', name: '자동차 3-1', dept: '🚗 자동차' },
    { id: 'auto32', name: '자동차 3-2', dept: '🚗 자동차' },
    { id: 'mold31', name: '스마트금형 3-1', dept: '🔩 스마트금형' },
    { id: 'arch31', name: '건축토목 3-1', dept: '🏗️ 건축토목' },
    { id: 'arch32', name: '건축토목 3-2', dept: '🏗️ 건축토목' }
];

// Initial default bracket mapping
// Round 1 (예선전): 3 matches between 6 teams. 5 teams BYE directly to Round 2 (8강).
let matchData = {
    // Round 1: 예선전
    'M1': { id: 'M1', round: 1, title: '예선 1경기', team1: '전기 3-1', team2: '기계 3-1', score1: null, score2: null, winner: null, nextMatch: 'M4', nextSlot: 'team2' },
    'M2': { id: 'M2', round: 1, title: '예선 2경기', team1: '기계 3-2', team2: '기계 3-3', score1: null, score2: null, winner: null, nextMatch: 'M5', nextSlot: 'team2' },
    'M3': { id: 'M3', round: 1, title: '예선 3경기', team1: '자동차 3-1', team2: '자동차 3-2', score1: null, score2: null, winner: null, nextMatch: 'M6', nextSlot: 'team2' },

    // Round 2: 8강전 (5개 부전승 팀 배치 + 3개 예선 승리 팀)
    'M4': { id: 'M4', round: 2, title: '8강 1경기', team1: '전기 3-2', isBye1: true, team2: null, score1: null, score2: null, winner: null, nextMatch: 'M8', nextSlot: 'team1' },
    'M5': { id: 'M5', round: 2, title: '8강 2경기', team1: '산업설비 3-1', isBye1: true, team2: null, score1: null, score2: null, winner: null, nextMatch: 'M8', nextSlot: 'team2' },
    'M6': { id: 'M6', round: 2, title: '8강 3경기', team1: '스마트금형 3-1', isBye1: true, team2: null, score1: null, score2: null, winner: null, nextMatch: 'M9', nextSlot: 'team1' },
    'M7': { id: 'M7', round: 2, title: '8강 4경기', team1: '건축토목 3-1', isBye1: true, team2: '건축토목 3-2', isBye2: true, score1: null, score2: null, winner: null, nextMatch: 'M9', nextSlot: 'team2' },

    // Round 3: 4강전 (준결승)
    'M8': { id: 'M8', round: 3, title: '준결승 1경기', team1: null, team2: null, score1: null, score2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team1', loserMatch: 'M11', loserSlot: 'team1' },
    'M9': { id: 'M9', round: 3, title: '준결승 2경기', team1: null, team2: null, score1: null, score2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team2', loserMatch: 'M11', loserSlot: 'team2' },

    // Round 4: 결승전 & 3위 결정전
    'M10': { id: 'M10', round: 4, title: '🏆 결승전', isFinal: true, team1: null, team2: null, score1: null, score2: null, winner: null, loser: null },
    'M11': { id: 'M11', round: 4, title: '🥉 3·4위 결정전', is3rd: true, team1: null, team2: null, score1: null, score2: null, winner: null, loser: null }
};

let currentEditingMatchId = null;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    renderTeamChips();
    renderBracket();
    setupEventListeners();
});

// Render list of participating teams
function renderTeamChips() {
    const container = document.getElementById('teams-chips');
    container.innerHTML = '';

    const byeTeamNames = ['전기 3-2', '산업설비 3-1', '스마트금형 3-1', '건축토목 3-1', '건축토목 3-2'];

    INITIAL_TEAMS.forEach(team => {
        const isBye = byeTeamNames.includes(team.name);
        const chip = document.createElement('div');
        chip.className = `team-chip ${isBye ? 'is-bye' : ''}`;
        chip.innerHTML = `
            <span class="dept-icon">${team.dept.split(' ')[0]}</span>
            <span>${team.name}</span>
            ${isBye ? '<span style="font-size:0.7rem; color:var(--bye-text); margin-left:4px;">(부전승)</span>' : ''}
        `;
        container.appendChild(chip);
    });
}

// Render the Tournament Bracket
function renderBracket() {
    const r1 = document.getElementById('round-1-matches');
    const r2 = document.getElementById('round-2-matches');
    const r3 = document.getElementById('round-3-matches');
    const r4 = document.getElementById('round-4-matches');

    r1.innerHTML = '';
    r2.innerHTML = '';
    r3.innerHTML = '';
    r4.innerHTML = '';

    Object.values(matchData).forEach(match => {
        const card = createMatchCard(match);

        if (match.round === 1) r1.appendChild(card);
        else if (match.round === 2) r2.appendChild(card);
        else if (match.round === 3) r3.appendChild(card);
        else if (match.round === 4) r4.appendChild(card);
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

    card.innerHTML = `
        <div class="match-header">
            <span class="match-code">${match.title}</span>
            <span>${match.id}</span>
        </div>
        <div class="teams-container">
            <div class="team-row ${isWinner1 ? 'winner' : ''} ${match.isBye1 ? 'bye-row' : ''}">
                <div class="team-name-group">
                    <span class="team-name">${team1Text}</span>
                    ${match.isBye1 ? '<span class="bye-tag">부전승</span>' : ''}
                </div>
                <span class="score">${score1Text}</span>
            </div>
            <div class="team-row ${isWinner2 ? 'winner' : ''} ${match.isBye2 ? 'bye-row' : ''}">
                <div class="team-name-group">
                    <span class="team-name">${team2Text}</span>
                    ${match.isBye2 ? '<span class="bye-tag">부전승</span>' : ''}
                </div>
                <span class="score">${score2Text}</span>
            </div>
        </div>
        <div class="match-actions">
            ${(match.team1 && match.team2) ? `<button class="btn-edit-score" onclick="openScoreModal('${match.id}')">✏️ 경기 결과 입력</button>` : '<span style="font-size:0.75rem; color:var(--text-dim);">대진 대기 중</span>'}
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
    document.getElementById('modal-team1-score').value = match.score1 !== null ? match.score1 : 0;
    document.getElementById('modal-team2-score').value = match.score2 !== null ? match.score2 : 0;
    document.getElementById('modal-is-pk').checked = false;
    document.getElementById('modal-pk-detail').style.display = 'none';

    document.getElementById('match-modal').classList.add('active');
};

function closeModal() {
    document.getElementById('match-modal').classList.remove('active');
    currentEditingMatchId = null;
}

// Save Score & Advance Winners
function saveScore() {
    if (!currentEditingMatchId) return;

    const match = matchData[currentEditingMatchId];
    const score1 = parseInt(document.getElementById('modal-team1-score').value, 10) || 0;
    const score2 = parseInt(document.getElementById('modal-team2-score').value, 10) || 0;

    if (score1 === score2) {
        alert('토너먼트는 동점으로 종료될 수 없습니다. 승부차기(PK) 결과를 포함해 승자를 결정해주세요!');
        return;
    }

    match.score1 = score1;
    match.score2 = score2;

    if (score1 > score2) {
        match.winner = match.team1;
        match.loser = match.team2;
    } else {
        match.winner = match.team2;
        match.loser = match.team1;
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
    const finalMatch = matchData['M10'];
    const thirdMatch = matchData['M11'];

    document.getElementById('place-1').innerText = finalMatch.winner || '미정';
    document.getElementById('place-2').innerText = finalMatch.loser || '미정';
    document.getElementById('place-3').innerText = thirdMatch.winner || '미정';
}

// Shuffle Bracket Randomly
function shuffleBracket() {
    if (!confirm('대진표를 무작위로 재배치하시겠습니까? (기존 점수는 초기화됩니다)')) return;

    // Shuffle 11 team names
    const teamNames = INITIAL_TEAMS.map(t => t.name).sort(() => Math.random() - 0.5);

    // Pick 5 teams for BYE
    const byeTeams = teamNames.slice(0, 5);
    const round1Teams = teamNames.slice(5);

    // Reset matchData
    matchData = {
        'M1': { id: 'M1', round: 1, title: '예선 1경기', team1: round1Teams[0], team2: round1Teams[1], score1: null, score2: null, winner: null, nextMatch: 'M4', nextSlot: 'team2' },
        'M2': { id: 'M2', round: 1, title: '예선 2경기', team1: round1Teams[2], team2: round1Teams[3], score1: null, score2: null, winner: null, nextMatch: 'M5', nextSlot: 'team2' },
        'M3': { id: 'M3', round: 1, title: '예선 3경기', team1: round1Teams[4], team2: round1Teams[5], score1: null, score2: null, winner: null, nextMatch: 'M6', nextSlot: 'team2' },

        'M4': { id: 'M4', round: 2, title: '8강 1경기', team1: byeTeams[0], isBye1: true, team2: null, score1: null, score2: null, winner: null, nextMatch: 'M8', nextSlot: 'team1' },
        'M5': { id: 'M5', round: 2, title: '8강 2경기', team1: byeTeams[1], isBye1: true, team2: null, score1: null, score2: null, winner: null, nextMatch: 'M8', nextSlot: 'team2' },
        'M6': { id: 'M6', round: 2, title: '8강 3경기', team1: byeTeams[2], isBye1: true, team2: null, score1: null, score2: null, winner: null, nextMatch: 'M9', nextSlot: 'team1' },
        'M7': { id: 'M7', round: 2, title: '8강 4경기', team1: byeTeams[3], isBye1: true, team2: byeTeams[4], isBye2: true, score1: null, score2: null, winner: null, nextMatch: 'M9', nextSlot: 'team2' },

        'M8': { id: 'M8', round: 3, title: '준결승 1경기', team1: null, team2: null, score1: null, score2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team1', loserMatch: 'M11', loserSlot: 'team1' },
        'M9': { id: 'M9', round: 3, title: '준결승 2경기', team1: null, team2: null, score1: null, score2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team2', loserMatch: 'M11', loserSlot: 'team2' },

        'M10': { id: 'M10', round: 4, title: '🏆 결승전', isFinal: true, team1: null, team2: null, score1: null, score2: null, winner: null, loser: null },
        'M11': { id: 'M11', round: 4, title: '🥉 3·4위 결정전', is3rd: true, team1: null, team2: null, score1: null, score2: null, winner: null, loser: null }
    };

    renderBracket();
}

// Reset to Default
function resetBracket() {
    if (!confirm('대진표를 초기 상태로 리셋하시겠습니까?')) return;
    
    matchData = {
        'M1': { id: 'M1', round: 1, title: '예선 1경기', team1: '전기 3-1', team2: '기계 3-1', score1: null, score2: null, winner: null, nextMatch: 'M4', nextSlot: 'team2' },
        'M2': { id: 'M2', round: 1, title: '예선 2경기', team1: '기계 3-2', team2: '기계 3-3', score1: null, score2: null, winner: null, nextMatch: 'M5', nextSlot: 'team2' },
        'M3': { id: 'M3', round: 1, title: '예선 3경기', team1: '자동차 3-1', team2: '자동차 3-2', score1: null, score2: null, winner: null, nextMatch: 'M6', nextSlot: 'team2' },

        'M4': { id: 'M4', round: 2, title: '8강 1경기', team1: '전기 3-2', isBye1: true, team2: null, score1: null, score2: null, winner: null, nextMatch: 'M8', nextSlot: 'team1' },
        'M5': { id: 'M5', round: 2, title: '8강 2경기', team1: '산업설비 3-1', isBye1: true, team2: null, score1: null, score2: null, winner: null, nextMatch: 'M8', nextSlot: 'team2' },
        'M6': { id: 'M6', round: 2, title: '8강 3경기', team1: '스마트금형 3-1', isBye1: true, team2: null, score1: null, score2: null, winner: null, nextMatch: 'M9', nextSlot: 'team1' },
        'M7': { id: 'M7', round: 2, title: '8강 4경기', team1: '건축토목 3-1', isBye1: true, team2: '건축토목 3-2', isBye2: true, score1: null, score2: null, winner: null, nextMatch: 'M9', nextSlot: 'team2' },

        'M8': { id: 'M8', round: 3, title: '준결승 1경기', team1: null, team2: null, score1: null, score2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team1', loserMatch: 'M11', loserSlot: 'team1' },
        'M9': { id: 'M9', round: 3, title: '준결승 2경기', team1: null, team2: null, score1: null, score2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team2', loserMatch: 'M11', loserSlot: 'team2' },

        'M10': { id: 'M10', round: 4, title: '🏆 결승전', isFinal: true, team1: null, team2: null, score1: null, score2: null, winner: null, loser: null },
        'M11': { id: 'M11', round: 4, title: '🥉 3·4위 결정전', is3rd: true, team1: null, team2: null, score1: null, score2: null, winner: null, loser: null }
    };

    renderBracket();
}

function setupEventListeners() {
    document.getElementById('btn-shuffle').addEventListener('click', shuffleBracket);
    document.getElementById('btn-reset').addEventListener('click', resetBracket);
    document.getElementById('btn-print').addEventListener('click', () => window.print());

    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
    document.getElementById('modal-save-btn').addEventListener('click', saveScore);

    document.getElementById('modal-is-pk').addEventListener('change', (e) => {
        document.getElementById('modal-pk-detail').style.display = e.target.checked ? 'block' : 'none';
    });
}
