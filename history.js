// Load user data
const userData = JSON.parse(localStorage.getItem('userData')) || {
    transactions: []
};

// Currency symbols mapping
const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹'
};

// Category emojis mapping
const categoryEmojis = {
    food: '🍽️',
    transportation: '🚗',
    utilities: '💡',
    shopping: '🛍️',
    entertainment: '🎮',
    healthcare: '⚕️',
    education: '📚',
    other: '📝',
    income: '💰',
    salary: '💵',
    investment: '📈',
    gift: '🎁'
};

// Payment method emojis
const paymentEmojis = {
    cash: '💵',
    credit: '💳',
    debit: '🏧',
    upi: '📱',
    bank: '🏦'
};

// Populate month filter
function populateMonthFilter() {
    const months = [...new Set(userData.transactions.map(t => {
        const date = new Date(t.date);
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
    }))].sort((a, b) => {
        const [monthA, yearA] = a.split('/');
        const [monthB, yearB] = b.split('/');
        return yearB - yearA || monthB - monthA;
    });

    const monthFilter = document.getElementById('monthFilter');
    monthFilter.innerHTML = '<option value="all">All Months</option>';
    
    months.forEach(month => {
        const [monthNum, year] = month.split('/');
        const monthName = new Date(year, monthNum - 1).toLocaleString('default', { month: 'long' });
        const option = document.createElement('option');
        option.value = month;
        option.textContent = `${monthName} ${year}`;
        monthFilter.appendChild(option);
    });
}

// Filter and sort transactions
function filterAndSortTransactions() {
    const monthFilter = document.getElementById('monthFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;

    let filteredTransactions = userData.transactions.filter(transaction => {
        const date = new Date(transaction.date);
        const transactionMonth = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        const monthMatch = monthFilter === 'all' || transactionMonth === monthFilter;
        const typeMatch = typeFilter === 'all' || transaction.type === typeFilter;
        const categoryMatch = categoryFilter === 'all' || transaction.category === categoryFilter;

        return monthMatch && typeMatch && categoryMatch;
    });

    // Apply sorting
    switch(sortFilter) {
        case 'newest':
            filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            filteredTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'highest':
            filteredTransactions.sort((a, b) => b.amount - a.amount);
            break;
        case 'lowest':
            filteredTransactions.sort((a, b) => a.amount - b.amount);
            break;
    }

    return filteredTransactions;
}

// Format date in a more readable way
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Display transactions
function displayTransactions() {
    const filteredTransactions = filterAndSortTransactions();
    const historyList = document.getElementById('historyList');

    if (filteredTransactions.length === 0) {
        historyList.innerHTML = `
            <div class="no-transactions">
                <div style="font-size: 3rem; margin-bottom: 10px;">📝</div>
                <div>No transactions found</div>
                <div style="font-size: 0.9rem; color: #888; margin-top: 5px;">Try adjusting your filters</div>
            </div>`;
        return;
    }

    // Generate HTML for transactions
    historyList.innerHTML = filteredTransactions.map(transaction => `
        <div class="transaction-item ${transaction.type}">
            <div class="transaction-info">
                <div class="transaction-header">
                    <div class="transaction-left">
                        <span class="category-emoji">
                            ${transaction.type === 'income' ? '💰' : categoryEmojis[transaction.category] || '📝'}
                        </span>
                        <div class="transaction-description">
                            ${transaction.description}
                            <div class="transaction-date">${formatDate(transaction.date)}</div>
                        </div>
                    </div>
                    <span class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'expense' ? '-' : '+'}${currencySymbols[userData.currency]}${transaction.amount.toFixed(2)}
                    </span>
                </div>
                <div class="transaction-details">
                    <span class="transaction-category">
                        ${categoryEmojis[transaction.category] || '📝'} ${transaction.category}
                    </span>
                    <span class="transaction-payment">
                        ${paymentEmojis[transaction.paymentMethod] || '💳'} ${transaction.paymentMethod}
                    </span>
                    ${transaction.isRecurring ? 
                        `<span class="transaction-recurring">🔄 ${transaction.recurringFrequency}</span>` : ''}
                </div>
                ${transaction.receipt ? 
                    `<div class="transaction-receipt">
                        <a href="${transaction.receipt}" target="_blank" class="receipt-link">
                            <i class="fas fa-receipt"></i> View Receipt
                        </a>
                    </div>` : ''}
            </div>
        </div>
    `).join('');

    // Update summary
    updateSummary(filteredTransactions);
}

// Update summary section
function updateSummary(transactions) {
    const summary = document.createElement('div');
    summary.className = 'history-summary';

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    summary.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">Total Income</span>
            <span class="summary-amount income">+${currencySymbols[userData.currency]}${totalIncome.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Total Expenses</span>
            <span class="summary-amount expense">-${currencySymbols[userData.currency]}${totalExpenses.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Balance</span>
            <span class="summary-amount ${balance >= 0 ? 'income' : 'expense'}">
                ${balance >= 0 ? '+' : '-'}${currencySymbols[userData.currency]}${Math.abs(balance).toFixed(2)}
            </span>
        </div>
    `;

    // Remove existing summary if present
    const existingSummary = document.querySelector('.history-summary');
    if (existingSummary) {
        existingSummary.remove();
    }

    const filtersDiv = document.querySelector('.filters');
    filtersDiv.after(summary);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    populateMonthFilter();
    displayTransactions();

    // Add event listeners for filters
    document.getElementById('monthFilter').addEventListener('change', displayTransactions);
    document.getElementById('typeFilter').addEventListener('change', displayTransactions);
    document.getElementById('categoryFilter').addEventListener('change', displayTransactions);
    document.getElementById('sortFilter').addEventListener('change', displayTransactions);
});