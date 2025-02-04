// Initialize data structure
let userData = JSON.parse(localStorage.getItem('userData')) || {
    salary: 0,
    currency: 'USD',
    transactions: [],
    notifications: [],
    profile: {
        name: '',
        email: ''
    }
};

// Currency symbols
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

// Check if salary is set
function checkSalarySetup() {
    if (userData.salary === 0) {
        document.getElementById('salarySetup').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
    } else {
        document.getElementById('salarySetup').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        updateUI();
    }
}

// Handle salary form submission
document.getElementById('salaryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    userData.salary = parseFloat(document.getElementById('salary').value);
    userData.currency = document.getElementById('currency').value;
    localStorage.setItem('userData', JSON.stringify(userData));
    checkSalarySetup();
});

// Modal functionality
const modal = document.getElementById('transactionModal');
const addTransactionBtn = document.getElementById('addTransactionBtn');
const closeModalBtn = document.querySelector('.close-modal');

// Open modal
addTransactionBtn.addEventListener('click', () => {
    modal.classList.add('show');
    // Set default date to today
    document.getElementById('transactionDate').valueAsDate = new Date();
});

// Close modal
closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('show');
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Close modal when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
    }
});

// Handle recurring checkbox change
document.getElementById('isRecurring').addEventListener('change', function() {
    const recurringFrequency = document.getElementById('recurringFrequency');
    recurringFrequency.disabled = !this.checked;
});

// Handle file input change
document.getElementById('receipt').addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : '';
    document.getElementById('fileName').textContent = fileName;
});

// Convert file to base64
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Schedule recurring transactions
function scheduleRecurringTransaction(transaction) {
    const frequencies = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365
    };

    const nextDate = new Date(transaction.date);
    nextDate.setDate(nextDate.getDate() + frequencies[transaction.recurringFrequency]);
    
    const nextTransaction = {
        ...transaction,
        id: Date.now(),
        date: nextDate.toISOString(),
        createdAt: new Date().toISOString()
    };

    userData.transactions.push(nextTransaction);
}

// Handle expense form submission
document.getElementById('expenseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const transactionDate = document.getElementById('transactionDate').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const isRecurring = document.getElementById('isRecurring').checked;
    const recurringFrequency = isRecurring ? document.getElementById('recurringFrequency').value : null;
    
    // Handle receipt file
    const receiptFile = document.getElementById('receipt').files[0];
    let receiptData = null;
    
    if (receiptFile) {
        try {
            receiptData = await convertFileToBase64(receiptFile);
        } catch (error) {
            console.error('Error processing receipt:', error);
        }
    }

    const transaction = {
        id: Date.now(),
        description,
        amount,
        type,
        category,
        date: transactionDate || new Date().toISOString(),
        paymentMethod,
        isRecurring,
        recurringFrequency,
        receipt: receiptData,
        createdAt: new Date().toISOString()
    };

    userData.transactions.push(transaction);
    
    // Handle recurring transactions
    if (isRecurring) {
        scheduleRecurringTransaction(transaction);
    }
    
    // Add notification
    addNotification(transaction);
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    updateUI();
    
    // Reset form and close modal
    e.target.reset();
    document.getElementById('fileName').textContent = '';
    modal.classList.remove('show');
});

// Add notification
function addNotification(transaction) {
    const notification = {
        id: Date.now(),
        transactionId: transaction.id,
        type: transaction.type,
        description: transaction.description,
        amount: transaction.amount,
        date: new Date().toISOString(),
        read: false
    };

    userData.notifications = userData.notifications || [];
    userData.notifications.unshift(notification);

    // Keep only last 50 notifications
    if (userData.notifications.length > 50) {
        userData.notifications = userData.notifications.slice(0, 50);
    }

    updateNotificationList();
}

// Format time
function formatTime(date) {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationDate.toLocaleDateString();
}

// Update notification badge
function updateNotificationBadge() {
    const unreadCount = (userData.notifications || [])
        .filter(n => !n.read).length;
    
    const badge = document.getElementById('notificationBadge');
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'block' : 'none';
}

// Update notification list
function updateNotificationList() {
    const notificationList = document.getElementById('notificationList');
    const notifications = userData.notifications || [];

    if (notifications.length === 0) {
        notificationList.innerHTML = `
            <div class="notification-empty">
                <p>No notifications yet</p>
            </div>
        `;
        return;
    }

    notificationList.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.type}" data-id="${notification.id}">
            <i class="fas fa-${notification.type === 'expense' ? 'arrow-down' : 'arrow-up'}"></i>
            <div class="notification-content">
                <div class="notification-title">
                    ${notification.type === 'expense' ? 'Expense' : 'Income'}: ${notification.description}
                </div>
                <div class="notification-amount">
                    ${currencySymbols[userData.currency]}${notification.amount.toFixed(2)}
                </div>
                <div class="notification-time">${formatTime(notification.date)}</div>
            </div>
        </div>
    `).join('');
}

// Toggle notification panel
document.getElementById('notificationIcon').addEventListener('click', () => {
    const panel = document.getElementById('notificationPanel');
    panel.classList.toggle('show');
    
    // Mark all as read when panel is opened
    if (panel.classList.contains('show')) {
        userData.notifications = userData.notifications.map(n => ({...n, read: true}));
        localStorage.setItem('userData', JSON.stringify(userData));
        updateNotificationBadge();
    }
});

// Clear all notifications
document.getElementById('clearNotifications').addEventListener('click', () => {
    userData.notifications = [];
    localStorage.setItem('userData', JSON.stringify(userData));
    updateNotificationList();
    updateNotificationBadge();
    
    const panel = document.getElementById('notificationPanel');
    panel.classList.remove('show');
});

// Close notification panel when clicking outside
document.addEventListener('click', (e) => {
    const panel = document.getElementById('notificationPanel');
    const icon = document.getElementById('notificationIcon');
    
    if (!panel.contains(e.target) && !icon.contains(e.target)) {
        panel.classList.remove('show');
    }
});

// Update balance display
function updateBalance() {
    const balance = calculateBalance();
    const totalExpenses = calculateTotalExpenses();
    const totalProfit = calculateTotalProfit();
    
    document.getElementById('balanceAmount').textContent = 
        `${currencySymbols[userData.currency]}${balance.toFixed(2)}`;
    
    document.getElementById('totalExpenses').textContent = 
        `${currencySymbols[userData.currency]}${totalExpenses.toFixed(2)}`;
    
    document.getElementById('totalProfit').textContent = 
        `${currencySymbols[userData.currency]}${totalProfit.toFixed(2)}`;
}

// Calculate current balance
function calculateBalance() {
    const income = userData.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = userData.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return userData.salary + income - expenses;
}

// Calculate total expenses
function calculateTotalExpenses() {
    return userData.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
}

// Calculate total profit
function calculateTotalProfit() {
    const totalIncome = userData.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = calculateTotalExpenses();
    return (totalIncome + userData.salary) - totalExpenses;
}

// Update transactions list
function updateTransactionsList() {
    const transactionsList = document.getElementById('transactionsList');
    
    // Sort transactions by date (newest first) and time
    const transactions = [...userData.transactions].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    }).slice(0, 5); // Only show last 5 transactions

    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p class="no-transactions">No transactions yet 📝</p>';
        return;
    }

    // Generate HTML for transactions
    transactionsList.innerHTML = transactions.map(transaction => `
        <div class="transaction-item ${transaction.type}">
            <div class="transaction-info">
                <div class="transaction-header">
                    <div class="transaction-left">
                        <span class="category-emoji">
                            ${transaction.type === 'income' ? '💰' : categoryEmojis[transaction.category] || '📝'}
                        </span>
                        <span class="transaction-description">${transaction.description}</span>
                    </div>
                    <span class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'expense' ? '-' : '+'}${currencySymbols[userData.currency]}${transaction.amount.toFixed(2)}
                    </span>
                </div>
                <div class="transaction-details">
                    <span class="transaction-category">
                        ${transaction.category}
                    </span>
                    <span class="transaction-date">
                        ${formatDate(transaction.date)} ${isToday(transaction.date) ? '(Today)' : ''}
                    </span>
                    <span class="transaction-payment">
                        ${paymentEmojis[transaction.paymentMethod] || '💳'} ${transaction.paymentMethod}
                    </span>
                    ${transaction.isRecurring ? 
                        `<span class="transaction-recurring">🔄 ${transaction.recurringFrequency}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Format date in a more readable way
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Check if date is today
function isToday(dateString) {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
}

// Update monthly summary
function updateMonthlySummary() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Filter transactions for current month
    const monthTransactions = userData.transactions.filter(transaction => {
        const transDate = new Date(transaction.date);
        return transDate.getMonth() === currentMonth && 
               transDate.getFullYear() === currentYear;
    });

    // Calculate monthly income and expenses
    const monthlyIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    // Calculate budget usage percentage
    const budgetUsagePercentage = monthlyIncome > 0 
        ? Math.min((monthlyExpenses / monthlyIncome) * 100, 100)
        : 0;

    // Calculate savings
    const monthlySavings = monthlyIncome - monthlyExpenses;

    // Update UI
    document.getElementById('budgetProgress').style.width = `${budgetUsagePercentage}%`;
    document.getElementById('budgetPercentage').textContent = `${Math.round(budgetUsagePercentage)}%`;
    document.getElementById('monthSavings').textContent = 
        `${currencySymbols[userData.currency]}${monthlySavings.toFixed(2)}`;

    // Update progress bar color based on usage
    const progressBar = document.getElementById('budgetProgress');
    if (budgetUsagePercentage < 50) {
        progressBar.style.background = '#4CAF50'; // Green
    } else if (budgetUsagePercentage < 80) {
        progressBar.style.background = '#FFA726'; // Orange
    } else {
        progressBar.style.background = '#EF5350'; // Red
    }
}

// Update all UI elements
function updateUI() {
    updateBalance();
    updateTransactionsList();
    updateNotificationBadge();
    updateMonthlySummary();
}

// Initialize page
checkSalarySetup();
updateTransactionsList();
updateNotificationList();