document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.app-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Calculator Logic
    const calculateBtn = document.getElementById('calculate-split');
    const resultsPanel = document.getElementById('results-panel');
    
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    calculateBtn.addEventListener('click', () => {
        const totalInvestment = parseFloat(document.getElementById('total-investment').value);
        const oddsA = parseFloat(document.getElementById('odds-a').value);
        const oddsB = parseFloat(document.getElementById('odds-b').value);

        if (isNaN(totalInvestment) || isNaN(oddsA) || isNaN(oddsB) || totalInvestment <= 0 || oddsA <= 1 || oddsB <= 1) {
            alert('Please enter valid positive numbers. Odds must be greater than 1.0');
            return;
        }

        // Arbitrage Math
        // Implied probabilities
        const impliedProbA = 1 / oddsA;
        const impliedProbB = 1 / oddsB;
        const totalImpliedProb = impliedProbA + impliedProbB;

        // Guaranteed Payout
        const totalPayout = totalInvestment / totalImpliedProb;
        
        // Stakes required to guarantee equal payout
        const stakeA = totalPayout / oddsA;
        const stakeB = totalPayout / oddsB;

        // Profit
        const profit = totalPayout - totalInvestment;
        const roi = (profit / totalInvestment) * 100;

        // Update UI
        document.getElementById('stake-a-result').textContent = formatter.format(stakeA);
        document.getElementById('stake-b-result').textContent = formatter.format(stakeB);
        document.getElementById('total-payout').textContent = formatter.format(totalPayout);
        
        const profitEl = document.getElementById('total-profit');
        const profitBox = document.getElementById('profit-container');
        const statusBadge = document.getElementById('arbitrage-status');
        const minOddsBox = document.getElementById('min-odds-box');

        profitEl.textContent = formatter.format(Math.abs(profit));

        if (profit > 0) {
            // Arbitrage opportunity!
            profitEl.textContent = '+' + formatter.format(profit);
            profitBox.classList.remove('loss');
            statusBadge.textContent = 'Arbitrage Found';
            statusBadge.className = 'status-badge status-profit';
            document.getElementById('roi-percent').textContent = `+${roi.toFixed(2)}% ROI`;
            minOddsBox.classList.add('hidden');
        } else {
            // Guaranteed Loss — calculate minimum odds needed on each side
            profitEl.textContent = '-' + formatter.format(Math.abs(profit));
            profitBox.classList.add('loss');
            statusBadge.textContent = 'Guaranteed Loss';
            statusBadge.className = 'status-badge status-loss';
            document.getElementById('roi-percent').textContent = `${roi.toFixed(2)}% ROI`;

            // Math: for breakeven, impliedA + impliedB = 1
            // Keep oddsB fixed → minOddsA = oddsB / (oddsB - 1)
            // Keep oddsA fixed → minOddsB = oddsA / (oddsA - 1)
            // Add a tiny buffer (0.001) to guarantee PROFIT, not just breakeven
            const minOddsA = (oddsB / (oddsB - 1)) + 0.001;
            const minOddsB = (oddsA / (oddsA - 1)) + 0.001;

            document.getElementById('min-odds-a').textContent = minOddsA.toFixed(3);
            document.getElementById('min-odds-b').textContent = minOddsB.toFixed(3);
            minOddsBox.classList.remove('hidden');
        }

        resultsPanel.classList.remove('hidden');
    });
});
