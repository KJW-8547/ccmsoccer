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

// 학과별 6대 능력치 및 3대 핵심 선수 (FW, MF, DF) 데이터 맵
const DEPT_ANALYSIS_DATA = {
    'mech': {
        name: '⚙️ 기계과',
        subName: 'CATHEDRAL OF MECHANICAL ENGINEERING',
        ovr: 96,
        stats: { att: 96, def: 92, team: 97, mom: 94, tac: 95, phy: 94 },
        quote: '기계과는 정교한 톱니바퀴 패스워크와 완벽한 조직력으로 피치를 지배하는 우승 0순위 팀입니다.',
        players: [
            {
                pos: 'FW',
                name: '정엔진',
                ovr: 96,
                role: '주장 · 박스 안 타겟 스트라이커',
                feature: '상대 수비 라인을 무너뜨리는 정밀한 박스 안 슈팅 및 골 결정력',
                miniStats: { PAC: 92, SHO: 97, PAS: 89, DRI: 93, DEF: 45, PHY: 90 }
            },
            {
                pos: 'MF',
                name: '이기계',
                ovr: 97,
                role: '에이스 · 중원 플레이메이커',
                feature: '중원 터빈 마스터! 360도 탈압박과 송곳 킬패스 전개 능력이 독보적',
                miniStats: { PAC: 90, SHO: 91, PAS: 98, DRI: 96, DEF: 78, PHY: 85 }
            },
            {
                pos: 'DF',
                name: '최기어',
                ovr: 93,
                role: '센터백 · 수비 라인 리더',
                feature: '오프사이드 트랩 기어 조율 및 살신성인 육탄 방어로 상대를 봉쇄',
                miniStats: { PAC: 85, SHO: 55, PAS: 84, DRI: 80, DEF: 96, PHY: 94 }
            }
        ]
    },
    'elec': {
        name: '⚡ 전기과',
        subName: 'LIGHTNING SPEED ELECTRIC POWER',
        ovr: 94,
        stats: { att: 93, def: 94, team: 92, mom: 95, tac: 91, phy: 93 },
        quote: '전기과는 번개 같은 전격 속공과 수비 밸런스를 갖춘 전천후 피치 위 스타군단입니다.',
        players: [
            {
                pos: 'FW',
                name: '김전기',
                ovr: 95,
                role: '스피드스터 · 윈도우 스나이퍼',
                feature: '번개 같은 초스피드 침투와 벼락같은 아웃사이드 중거리 궤적 슈팅',
                miniStats: { PAC: 97, SHO: 95, PAS: 86, DRI: 92, DEF: 40, PHY: 88 }
            },
            {
                pos: 'MF',
                name: '박주전',
                ovr: 93,
                role: '중앙 미드필더 · 딥라이잉 딥러너',
                feature: '넓은 시야로 경기 템포를 전기 신호처럼 빠르게 조율하고 전진 패스 전달',
                miniStats: { PAC: 88, SHO: 85, PAS: 95, DRI: 90, DEF: 82, PHY: 86 }
            },
            {
                pos: 'DF',
                name: '이고압',
                ovr: 94,
                role: '스토퍼 · 초고압 대인마크',
                feature: '상대 에이스 공격수의 동선을 사전에 완벽히 차단하는 초고압 대인 마크 수비',
                miniStats: { PAC: 86, SHO: 50, PAS: 80, DRI: 78, DEF: 95, PHY: 95 }
            }
        ]
    },
    'ind': {
        name: '🔧 산업설비과',
        subName: 'HEAVY INDUSTRIAL POWERHOUSE',
        ovr: 89,
        stats: { att: 87, def: 91, team: 90, mom: 88, tac: 89, phy: 96 },
        quote: '산업설비과는 압도적인 피지컬과 무한 체력으로 상대를 거칠게 압박하는 체력왕 팀입니다.',
        players: [
            {
                pos: 'FW',
                name: '한설비',
                ovr: 88,
                role: '타겟형 공격수 · 공중볼 경합가',
                feature: '공중볼 타겟형 스트라이커, 헤더 경합 승률이 높고 피지컬 싸움에 특화',
                miniStats: { PAC: 82, SHO: 88, PAS: 78, DRI: 80, DEF: 50, PHY: 96 }
            },
            {
                pos: 'MF',
                name: '김배관',
                ovr: 89,
                role: '박스투박스 · 중원 탱크',
                feature: '왕성한 활동량으로 중원을 쓸어담는 무한 파워 엔진 역할을 수행',
                miniStats: { PAC: 86, SHO: 82, PAS: 87, DRI: 84, DEF: 88, PHY: 94 }
            },
            {
                pos: 'DF',
                name: '박용접',
                ovr: 92,
                role: '센터백 · 래핑 락 다운',
                feature: '상대 에이스 공격수를 빈틈없는 용접 수비로 밀착 마크하여 꽁꽁 묶음',
                miniStats: { PAC: 83, SHO: 45, PAS: 80, DRI: 75, DEF: 94, PHY: 97 }
            }
        ]
    },
    'auto': {
        name: '🚗 자동차과',
        subName: 'HIGH SPEED AUTO TURBO RUSH',
        ovr: 93,
        stats: { att: 95, def: 87, team: 90, mom: 96, tac: 91, phy: 90 },
        quote: '자동차과는 폭발적인 가속력과 거침없는 측면 역습으로 수비를 파괴하는 스피드스터 팀입니다.',
        players: [
            {
                pos: 'FW',
                name: '최속도',
                ovr: 95,
                role: '카운터 윙포워드 · 터보 라인브레이커',
                feature: '100m 11초대 치고 달리기 스피드로 수비 뒷공간을 순식간에 초토화',
                miniStats: { PAC: 99, SHO: 92, PAS: 85, DRI: 94, DEF: 38, PHY: 85 }
            },
            {
                pos: 'MF',
                name: '윤드라이브',
                ovr: 92,
                role: '측면 미드필더 · 얼리크로스 장인',
                feature: '좌우 측면으로 빠르게 전환하는 칼날 얼리크로스 전담 공급기',
                miniStats: { PAC: 93, SHO: 84, PAS: 93, DRI: 91, DEF: 72, PHY: 82 }
            },
            {
                pos: 'DF',
                name: '강브레이크',
                ovr: 89,
                role: '풀백 · 슬라이딩 태클러',
                feature: '상대 역습 시 단숨에 거리를 줄여 정확한 슬라이딩 태클로 제동',
                miniStats: { PAC: 91, SHO: 52, PAS: 81, DRI: 82, DEF: 90, PHY: 88 }
            }
        ]
    },
    'mold': {
        name: '🔩 스마트금형과',
        subName: 'HIGH PRECISION SMART MOLD',
        ovr: 90,
        stats: { att: 88, def: 93, team: 91, mom: 89, tac: 90, phy: 91 },
        quote: '스마트금형과는 짠물 수비와 슈퍼 세이브 수문장을 중심으로 한 정밀 축구 팀입니다.',
        players: [
            {
                pos: 'FW',
                name: '임금형',
                ovr: 89,
                role: '정밀 원샷 핀포인트 포워드',
                feature: '원샷 원킬! 단 한 번의 찬스에서도 그물망 구석을 파고드는 슈팅',
                miniStats: { PAC: 86, SHO: 92, PAS: 81, DRI: 86, DEF: 42, PHY: 86 }
            },
            {
                pos: 'MF',
                name: '서스마트',
                ovr: 90,
                role: '수비형 미드필더 · 인터셉터',
                feature: '길목을 사전에 예측하여 끊어내는 정밀 패스 차단 능력 보유',
                miniStats: { PAC: 84, SHO: 78, PAS: 88, DRI: 85, DEF: 91, PHY: 89 }
            },
            {
                pos: 'DF',
                name: '정수문 (GK)',
                ovr: 94,
                role: '수문장 · 승부차기 PK 마스터',
                feature: '반응속도 95! 승부차기 PK 방어율 80% 이상의 신들린 슈퍼 세이빙',
                miniStats: { DIV: 95, REF: 96, HAN: 92, POS: 94, KIC: 88, SPD: 75 }
            }
        ]
    },
    'arch': {
        name: '🏗️ 건축토목과',
        subName: 'SOLID CIVIL ENGINEERING WALL',
        ovr: 91,
        stats: { att: 89, def: 95, team: 89, mom: 91, tac: 92, phy: 95 },
        quote: '건축토목과는 철근 구조물처럼 단단한 백포 라인과 거대한 피지컬로 골문을 지키는 통곡의 벽입니다.',
        players: [
            {
                pos: 'FW',
                name: '강건축',
                ovr: 90,
                role: '포스트 포워드 · 공간 창출가',
                feature: '피지컬을 활용한 포스트 플레이로 2선 침투 공격수에게 슈팅 공간 마련',
                miniStats: { PAC: 84, SHO: 89, PAS: 83, DRI: 81, DEF: 48, PHY: 95 }
            },
            {
                pos: 'MF',
                name: '송시공',
                ovr: 90,
                role: '앵커미드필더 · 밸런서',
                feature: '공수 전환 시 중간 교량 역할을 수행하며 강한 킥력을 갖춘 세트피스 키커',
                miniStats: { PAC: 83, SHO: 87, PAS: 90, DRI: 83, DEF: 86, PHY: 90 }
            },
            {
                pos: 'DF',
                name: '조토목',
                ovr: 95,
                role: '통곡의 벽 · 190cm 거구 타워',
                feature: '통곡의 장벽! 압도적인 키와 헤딩력으로 상대의 모든 롱볼을 상쇄',
                miniStats: { PAC: 82, SHO: 45, PAS: 80, DRI: 74, DEF: 97, PHY: 98 }
            }
        ]
    }
};

// 11개 팀 대진 매핑 데이터 (장소 및 경기 시간 상세 탑재)
const DEFAULT_MATCH_DATA = {
    // Round 1: 예선전 (3경기 / 6팀)
    'M1': { id: 'M1', round: 1, title: '예선 1경기', location: '📍 A구역', time: '⏰ 09:30', team1: '전기 3-1', team2: '기계 3-1', score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M4', nextSlot: 'team2' },
    'M2': { id: 'M2', round: 1, title: '예선 2경기', location: '📍 B구역', time: '⏰ 09:30', team1: '기계 3-2', team2: '기계 3-3', score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M5', nextSlot: 'team2' },
    'M3': { id: 'M3', round: 1, title: '예선 3경기', location: '📍 A구역', time: '⏰ 10:45', team1: '자동차 3-1', team2: '자동차 3-2', score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M6', nextSlot: 'team2' },

    // Round 2: 8강전 (4경기 / 5개 부전승 팀 + 3개 예선 승자)
    'M4': { id: 'M4', round: 2, title: '8강 1경기', location: '📍 A구역', time: '⏰ 12:00', team1: '전기 3-2', isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M8', nextSlot: 'team1' },
    'M5': { id: 'M5', round: 2, title: '8강 2경기', location: '📍 B구역', time: '⏰ 12:00', team1: '산업설비 3-1', isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M8', nextSlot: 'team2' },
    'M6': { id: 'M6', round: 2, title: '8강 3경기', location: '📍 A구역', time: '⏰ 13:15', team1: '스마트금형 3-1', isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M9', nextSlot: 'team1' },
    'M7': { id: 'M7', round: 2, title: '8강 4경기', location: '📍 B구역', time: '⏰ 13:15', team1: '건축토목 3-1', isBye1: true, team2: '건축토목 3-2', isBye2: true, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M9', nextSlot: 'team2' },

    // Round 3: 4강 준결승 (2경기)
    'M8': { id: 'M8', round: 3, title: '준결승 1경기', location: '📍 A구역', time: '⏰ 14:45', team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team1', loserMatch: 'M11', loserSlot: 'team1' },
    'M9': { id: 'M9', round: 3, title: '준결승 2경기', location: '📍 B구역', time: '⏰ 14:45', team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team2', loserMatch: 'M11', loserSlot: 'team2' },

    // Round 4: 결승전 & 3위 결정전
    'M10': { id: 'M10', round: 4, title: '🏆 결승전', location: '📍 메인 A구역', time: '⏰ 17:00', isFinal: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null },
    'M11': { id: 'M11', round: 4, title: '🥉 3·4위전', location: '📍 B구역', time: '⏰ 16:00', is3rd: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null }
};

// Global State
let matchData = JSON.parse(JSON.stringify(DEFAULT_MATCH_DATA));
let currentEditingMatchId = null;
let radarChartInstance = null;
let currentSelectedDeptKey = 'mech';

const LOCAL_STORAGE_KEY = 'ccm_tournament_data_2026';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadStateFromLocalStorage();
    renderTeamChips();
    renderBracket();
    setupDeptTabs();
    updateDepartmentDetail('mech');
    setupEventListeners();
    setupSmoothScroll();
});

// Load state from LocalStorage
function loadStateFromLocalStorage() {
    try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            matchData = JSON.parse(savedData);
        }
    } catch (e) {
        console.error('LocalStorage load error:', e);
    }
}

// Save state to LocalStorage
function saveStateToLocalStorage() {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(matchData));
    } catch (e) {
        console.error('LocalStorage save error:', e);
    }
}

// Render Team Chips
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
            ${isBye ? '<span class="chip-bye-tag">BYE ⚡</span>' : ''}
        `;
        container.appendChild(chip);
    });
}

// Render Tournament Bracket with Connected Round Lines & High-Contrast Cards
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

// Create Card Element with Location, Time & Sharp Winner/Loser contrast
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
            <div class="match-time-loc">
                <span class="loc-tag">${match.location}</span>
                <span class="time-tag">${match.time}</span>
            </div>
        </div>
        <div class="teams-container">
            <div class="team-row ${isWinner1 ? 'winner' : ''} ${isLoser1 ? 'loser' : ''} ${match.isBye1 ? 'bye-row' : ''}">
                <div class="team-name-group">
                    <span class="team-name">${team1Text}</span>
                    ${match.isBye1 ? '<span class="bye-badge">BYE ⚡</span>' : ''}
                    ${isWinner1 ? '<span class="win-status-badge">진출 🟢</span>' : ''}
                    ${isLoser1 ? '<span class="lose-status-badge">탈락 🔴</span>' : ''}
                    ${isPK ? `<span class="pk-badge">PK ${match.pk1}</span>` : ''}
                </div>
                <span class="score">${score1Text}</span>
            </div>
            <div class="team-row ${isWinner2 ? 'winner' : ''} ${isLoser2 ? 'loser' : ''} ${match.isBye2 ? 'bye-row' : ''}">
                <div class="team-name-group">
                    <span class="team-name">${team2Text}</span>
                    ${match.isBye2 ? '<span class="bye-badge">BYE ⚡</span>' : ''}
                    ${isWinner2 ? '<span class="win-status-badge">진출 🟢</span>' : ''}
                    ${isLoser2 ? '<span class="lose-status-badge">탈락 🔴</span>' : ''}
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

// Check Tie and toggle PK inputs
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

// Save Score & Propagate Winners/Losers
function saveScore() {
    if (!currentEditingMatchId) return;

    const match = matchData[currentEditingMatchId];
    const score1Input = document.getElementById('modal-team1-score').value;
    const score2Input = document.getElementById('modal-team2-score').value;

    if (score1Input === '' || score2Input === '') {
        alert('정규시간 점수를 기입해 주세요!');
        return;
    }

    const score1 = parseInt(score1Input, 10);
    const score2 = parseInt(score2Input, 10);

    if (score1 === score2) {
        const pk1Input = document.getElementById('modal-team1-pk').value;
        const pk2Input = document.getElementById('modal-team2-pk').value;

        if (pk1Input === '' || pk2Input === '') {
            alert('정규시간이 동점입니다. 승부차기(PK) 스코어를 기입해 주세요!');
            return;
        }

        const pk1 = parseInt(pk1Input, 10);
        const pk2 = parseInt(pk2Input, 10);

        if (pk1 === pk2) {
            alert('승부차기(PK) 점수는 동일할 수 없습니다. 승자를 판가름하기 위해 PK 점수를 다르게 기입하세요!');
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

    // Advance winner
    if (match.nextMatch && match.nextSlot) {
        matchData[match.nextMatch][match.nextSlot] = match.winner;
    }

    // Advance loser to 3rd place match
    if (match.loserMatch && match.loserSlot) {
        matchData[match.loserMatch][match.loserSlot] = match.loser;
    }

    saveStateToLocalStorage();
    closeModal();
    renderBracket();
}

// Update Podium & Hall of Fame table
function updatePodium() {
    const finalMatch = matchData['M10'];
    const thirdMatch = matchData['M11'];

    const p1Name = finalMatch.winner || '우승 학과 (결과 대기)';
    const p2Name = finalMatch.loser || '준우승 학과 (결과 대기)';
    const p3Name = thirdMatch.winner || '3위 학과 (결과 대기)';

    const el1 = document.getElementById('podium-place-1');
    const el2 = document.getElementById('podium-place-2');
    const el3 = document.getElementById('podium-place-3');

    if (el1) el1.innerText = p1Name;
    if (el2) el2.innerText = p2Name;
    if (el3) el3.innerText = p3Name;

    const h1 = document.getElementById('hist-2026-1');
    const h2 = document.getElementById('hist-2026-2');
    const h3 = document.getElementById('hist-2026-3');

    if (h1) h1.innerText = finalMatch.winner || '진행 중 (대기)';
    if (h2) h2.innerText = finalMatch.loser || '진행 중';
    if (h3) h3.innerText = thirdMatch.winner || '진행 중';
}

// Shuffle Bracket
function shuffleBracket() {
    if (!confirm('대진표를 무작위로 재배치하시겠습니까? (기존 경기 점수는 초기화됩니다)')) return;

    const teamNames = INITIAL_TEAMS.map(t => t.name).sort(() => Math.random() - 0.5);

    const byeTeams = teamNames.slice(0, 5);
    const r1Teams = teamNames.slice(5);

    matchData = {
        'M1': { id: 'M1', round: 1, title: '예선 1경기', location: '📍 A구역', time: '⏰ 09:30', team1: r1Teams[0], team2: r1Teams[1], score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M4', nextSlot: 'team2' },
        'M2': { id: 'M2', round: 1, title: '예선 2경기', location: '📍 B구역', time: '⏰ 09:30', team1: r1Teams[2], team2: r1Teams[3], score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M5', nextSlot: 'team2' },
        'M3': { id: 'M3', round: 1, title: '예선 3경기', location: '📍 A구역', time: '⏰ 10:45', team1: r1Teams[4], team2: r1Teams[5], score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M6', nextSlot: 'team2' },

        'M4': { id: 'M4', round: 2, title: '8강 1경기', location: '📍 A구역', time: '⏰ 12:00', team1: byeTeams[0], isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M8', nextSlot: 'team1' },
        'M5': { id: 'M5', round: 2, title: '8강 2경기', location: '📍 B구역', time: '⏰ 12:00', team1: byeTeams[1], isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M8', nextSlot: 'team2' },
        'M6': { id: 'M6', round: 2, title: '8강 3경기', location: '📍 A구역', time: '⏰ 13:15', team1: byeTeams[2], isBye1: true, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M9', nextSlot: 'team1' },
        'M7': { id: 'M7', round: 2, title: '8강 4경기', location: '📍 B구역', time: '⏰ 13:15', team1: byeTeams[3], isBye1: true, team2: byeTeams[4], isBye2: true, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M9', nextSlot: 'team2' },

        'M8': { id: 'M8', round: 3, title: '준결승 1경기', location: '📍 A구역', time: '⏰ 14:45', team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team1', loserMatch: 'M11', loserSlot: 'team1' },
        'M9': { id: 'M9', round: 3, title: '준결승 2경기', location: '📍 B구역', time: '⏰ 14:45', team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null, nextMatch: 'M10', nextSlot: 'team2', loserMatch: 'M11', loserSlot: 'team2' },

        'M10': { id: 'M10', round: 4, title: '🏆 결승전', location: '📍 메인 A구역', time: '⏰ 17:00', isFinal: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null },
        'M11': { id: 'M11', round: 4, title: '🥉 3·4위전', location: '📍 B구역', time: '⏰ 16:00', is3rd: true, team1: null, team2: null, score1: null, score2: null, pk1: null, pk2: null, winner: null, loser: null }
    };

    saveStateToLocalStorage();
    renderTeamChips();
    renderBracket();
}

// Reset Bracket
function resetBracket() {
    if (!confirm('대진표를 초기 상태로 리셋하시겠습니까?')) return;
    
    matchData = JSON.parse(JSON.stringify(DEFAULT_MATCH_DATA));
    saveStateToLocalStorage();
    renderTeamChips();
    renderBracket();
}

// Department Selector Tabs Setup
function setupDeptTabs() {
    const tabs = document.querySelectorAll('.dept-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const deptKey = tab.getAttribute('data-dept');
            updateDepartmentDetail(deptKey);
        });
    });
}

// Render Single Selected Department's 6-Attribute Hexagon Radar Chart & Key Players
function updateDepartmentDetail(deptKey) {
    const data = DEPT_ANALYSIS_DATA[deptKey];
    if (!data) return;

    currentSelectedDeptKey = deptKey;

    // Headings & OVR
    document.getElementById('dept-name-heading').innerText = `${data.name} 전력 분석`;
    document.getElementById('dept-ovr-val').innerText = data.ovr;
    document.getElementById('dept-analysis-text').innerText = `"${data.quote}"`;
    document.getElementById('dept-player-dept-name').innerText = data.name;

    // Progress Bars & Numeric Stats
    document.getElementById('val-att').innerText = data.stats.att;
    document.getElementById('val-def').innerText = data.stats.def;
    document.getElementById('val-team').innerText = data.stats.team;
    document.getElementById('val-mom').innerText = data.stats.mom;
    document.getElementById('val-tac').innerText = data.stats.tac;
    document.getElementById('val-phy').innerText = data.stats.phy;

    document.getElementById('bar-att').style.width = `${data.stats.att}%`;
    document.getElementById('bar-def').style.width = `${data.stats.def}%`;
    document.getElementById('bar-team').style.width = `${data.stats.team}%`;
    document.getElementById('bar-mom').style.width = `${data.stats.mom}%`;
    document.getElementById('bar-tac').style.width = `${data.stats.tac}%`;
    document.getElementById('bar-phy').style.width = `${data.stats.phy}%`;

    // Render 6-Attribute Hexagon Radar Chart
    renderHexagonChart(data.stats);

    // Render 3 Key Players (FW, MF, DF)
    renderKeyPlayerCards(data.players);
}

// Render Hexagon Radar Chart using Chart.js
function renderHexagonChart(stats) {
    const ctx = document.getElementById('powerRadarChart');
    if (!ctx) return;

    const chartData = [
        stats.att,
        stats.def,
        stats.team,
        stats.mom,
        stats.tac,
        stats.phy
    ];

    if (radarChartInstance) {
        radarChartInstance.data.datasets[0].data = chartData;
        radarChartInstance.update();
        return;
    }

    radarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['공격력 (ATT)', '수비력 (DEF)', '조직력 (TEAM)', '기세 (MOM)', '전술 (TAC)', '피지컬 (PHY)'],
            datasets: [{
                label: '능력치',
                data: chartData,
                backgroundColor: 'rgba(0, 229, 255, 0.25)',
                borderColor: '#00E5FF',
                borderWidth: 3,
                pointBackgroundColor: '#00FF66',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#00E5FF',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
                    grid: { color: 'rgba(255, 255, 255, 0.15)' },
                    pointLabels: {
                        color: '#00E5FF',
                        font: { family: 'Pretendard', size: 12, weight: '900' }
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

// Render Player Cards for FW, MF, DF
function renderKeyPlayerCards(players) {
    const container = document.getElementById('dept-players-grid');
    if (!container) return;
    container.innerHTML = '';

    players.forEach(player => {
        const card = document.createElement('div');
        card.className = `eafc-card card-${player.pos.toLowerCase()}`;

        const miniStatHTML = Object.entries(player.miniStats)
            .map(([key, val]) => `<div class="stat-mini"><span>${key}</span><strong>${val}</strong></div>`)
            .join('');

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-header-top">
                    <span class="card-ovr">${player.ovr}</span>
                    <span class="card-pos pos-${player.pos.toLowerCase()}">${player.pos}</span>
                </div>
                <div class="card-avatar">
                    <div class="avatar-circle">${player.pos === 'FW' ? '⚽' : player.pos === 'MF' ? '🎯' : '🛡️'}</div>
                </div>
                <div class="card-info">
                    <h3 class="player-name">${player.name}</h3>
                    <span class="player-role-tag">${player.role}</span>
                </div>
                <div class="player-stats-mini">
                    ${miniStatHTML}
                </div>
                <div class="player-feature-box">
                    <span class="feature-label">⚡ 플레이 특징:</span>
                    <p class="feature-desc">${player.feature}</p>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Setup Global Event Listeners
function setupEventListeners() {
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

    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
    document.getElementById('modal-save-btn').addEventListener('click', saveScore);

    document.getElementById('modal-team1-score').addEventListener('input', checkTieAndTogglePK);
    document.getElementById('modal-team2-score').addEventListener('input', checkTieAndTogglePK);
}

// Smooth scroll
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
