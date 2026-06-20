document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let currentUser = localStorage.getItem('hakari_user') || null;
    let currentCalculation = null; // Store last calc for saving
    let profitChartInstance = null;

    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

    // --- DOM Elements ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.app-section');
    const authBtn = document.getElementById('nav-auth-btn');
    const authModal = document.getElementById('auth-modal');
    const closeModal = document.querySelector('.close-modal');
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authSwitchLink = document.getElementById('auth-switch-link');
    const authSwitchText = document.getElementById('auth-switch-text');
    const saveBetBtn = document.getElementById('save-bet-btn');

    // --- Initialization ---
    updateAuthUI();

    // --- Navigation Logic ---
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            if (targetId === 'dashboard-section') {
                if (!currentUser) {
                    alert('Please log in to view your dashboard.');
                    authModal.classList.remove('hidden');
                    // switch back to betting
                    document.querySelector('[data-target="betting-section"]').click();
                    return;
                }
                renderDashboard();
            }
        });
    });

    // --- Auth Logic ---
    let isSignup = false;

    authBtn.addEventListener('click', () => {
        if (currentUser) {
            // Logout
            currentUser = null;
            localStorage.removeItem('hakari_user');
            updateAuthUI();
            document.querySelector('[data-target="betting-section"]').click();
        } else {
            authModal.classList.remove('hidden');
        }
    });

    closeModal.addEventListener('click', () => authModal.classList.add('hidden'));

    authSwitchLink.addEventListener('click', (e) => {
        e.preventDefault();
        isSignup = !isSignup;
        authTitle.textContent = isSignup ? 'Create Account' : 'Login';
        authSubmitBtn.textContent = isSignup ? 'Sign Up' : 'Sign In';
        authSwitchText.textContent = isSignup ? 'Already have an account?' : 'Don\'t have an account?';
        authSwitchLink.textContent = isSignup ? 'Sign In' : 'Sign Up';
    });

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        // In a real app we'd verify password. For this demo we just login the email.
        currentUser = email;
        localStorage.setItem('hakari_user', email);
        authModal.classList.add('hidden');
        updateAuthUI();
        if (currentCalculation) {
            saveBetBtn.classList.remove('hidden');
        }
    });

    function updateAuthUI() {
        if (currentUser) {
            authBtn.textContent = 'Logout';
        } else {
            authBtn.textContent = 'Login';
            saveBetBtn.classList.add('hidden');
        }
    }

    // --- Calculator Logic ---
    const calculateBtn = document.getElementById('calculate-split');
    const resultsPanel = document.getElementById('results-panel');

    calculateBtn.addEventListener('click', () => {
        const totalInvestment = parseFloat(document.getElementById('total-investment').value);
        const oddsA = parseFloat(document.getElementById('odds-a').value);
        const oddsB = parseFloat(document.getElementById('odds-b').value);

        if (isNaN(totalInvestment) || isNaN(oddsA) || isNaN(oddsB) || totalInvestment <= 0 || oddsA <= 1 || oddsB <= 1) {
            alert('Please enter valid positive numbers. Odds must be greater than 1.0');
            return;
        }

        const impliedProbA = 1 / oddsA;
        const impliedProbB = 1 / oddsB;
        const totalImpliedProb = impliedProbA + impliedProbB;
        const totalPayout = totalInvestment / totalImpliedProb;
        const stakeA = totalPayout / oddsA;
        const stakeB = totalPayout / oddsB;
        const profit = totalPayout - totalInvestment;
        const roi = (profit / totalInvestment) * 100;

        document.getElementById('stake-a-result').textContent = formatter.format(stakeA);
        document.getElementById('stake-b-result').textContent = formatter.format(stakeB);
        document.getElementById('total-payout').textContent = formatter.format(totalPayout);
        
        const profitEl = document.getElementById('total-profit');
        const profitBox = document.getElementById('profit-container');
        const statusBadge = document.getElementById('arbitrage-status');
        const minOddsBox = document.getElementById('min-odds-box');

        profitEl.textContent = formatter.format(Math.abs(profit));

        if (profit > 0) {
            profitEl.textContent = '+' + formatter.format(profit);
            profitBox.classList.remove('loss');
            statusBadge.textContent = 'Arbitrage Found';
            statusBadge.className = 'status-badge status-profit';
            document.getElementById('roi-percent').textContent = `+${roi.toFixed(2)}% ROI`;
            minOddsBox.classList.add('hidden');
        } else {
            profitEl.textContent = '-' + formatter.format(Math.abs(profit));
            profitBox.classList.add('loss');
            statusBadge.textContent = 'Guaranteed Loss';
            statusBadge.className = 'status-badge status-loss';
            document.getElementById('roi-percent').textContent = `${roi.toFixed(2)}% ROI`;

            const extraCapA = ((totalInvestment - totalPayout) / (oddsA - 1)) + 0.01;
            const extraCapB = ((totalInvestment - totalPayout) / (oddsB - 1)) + 0.01;
            document.getElementById('min-odds-a').textContent = formatter.format(extraCapA);
            document.getElementById('min-odds-b').textContent = formatter.format(extraCapB);
            minOddsBox.classList.remove('hidden');
        }

        resultsPanel.classList.remove('hidden');

        // Store calculation for saving
        currentCalculation = {
            date: new Date().toISOString(),
            type: profit > 0 ? 'Arbitrage Win' : 'Arbitrage Loss',
            investment: totalInvestment,
            profit: profit
        };

        // Only show Place Bet button if the user is logged in AND it's a profitable arbitrage bet
        if (currentUser && profit > 0) {
            saveBetBtn.classList.remove('hidden');
        } else {
            saveBetBtn.classList.add('hidden');
        }
    });

    // --- Save to Dashboard Logic ---
    saveBetBtn.addEventListener('click', () => {
        if (!currentUser || !currentCalculation) return;

        const isSure = confirm('Are you sure you want to place this bet?');
        if (!isSure) return;

        let history = JSON.parse(localStorage.getItem(`history_${currentUser}`) || '[]');
        history.push(currentCalculation);
        localStorage.setItem(`history_${currentUser}`, JSON.stringify(history));

        alert('Bet placed successfully and saved to your dashboard!');
        saveBetBtn.classList.add('hidden'); // Prevent multiple saves
        currentCalculation = null; // Reset
    });

    // --- Dashboard Rendering ---
    function renderDashboard() {
        let history = JSON.parse(localStorage.getItem(`history_${currentUser}`) || '[]');
        
        // Stats
        let totalProfit = 0;
        let wins = 0;
        history.forEach(item => {
            totalProfit += item.profit;
            if (item.profit > 0) wins++;
        });

        const winRate = history.length > 0 ? (wins / history.length) * 100 : 0;

        document.getElementById('dash-total-bets').textContent = history.length;
        document.getElementById('dash-net-profit').textContent = (totalProfit >= 0 ? '+' : '-') + formatter.format(Math.abs(totalProfit));
        document.getElementById('dash-net-profit').style.color = totalProfit >= 0 ? 'var(--success)' : 'var(--danger)';
        document.getElementById('dash-win-rate').textContent = `${winRate.toFixed(1)}%`;

        // History List
        const listEl = document.getElementById('history-list');
        listEl.innerHTML = '';
        [...history].reverse().forEach(item => {
            const dateObj = new Date(item.date);
            const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const profitStr = (item.profit >= 0 ? '+' : '-') + formatter.format(Math.abs(item.profit));
            const colorClass = item.profit >= 0 ? 'win' : 'loss';

            listEl.innerHTML += `
                <li class="history-item">
                    <div class="history-details">
                        <span class="history-type">${item.type}</span>
                        <span class="history-date">${dateStr} • Inv: ${formatter.format(item.investment)}</span>
                    </div>
                    <span class="history-profit ${colorClass}">${profitStr}</span>
                </li>
            `;
        });

        // Chart
        renderChart(history);
    }

    function renderChart(history) {
        const ctx = document.getElementById('profitChart').getContext('2d');
        
        let cumulative = 0;
        const dataPoints = [0]; // Start at 0
        const labels = ['Start'];

        history.forEach((item, index) => {
            cumulative += item.profit;
            dataPoints.push(cumulative);
            labels.push(`Bet ${index + 1}`);
        });

        if (profitChartInstance) {
            profitChartInstance.destroy();
        }

        profitChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cumulative Profit',
                    data: dataPoints,
                    borderColor: '#00f0ff',
                    backgroundColor: 'rgba(0, 240, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#7000ff',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { ticks: { color: '#8b9bb4' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { 
                        ticks: { 
                            color: '#8b9bb4',
                            callback: function(value) { return '₹' + value; }
                        }, 
                        grid: { color: 'rgba(255,255,255,0.05)' } 
                    }
                }
            }
        });
    }
});
