// Get user data from localStorage
let userData = JSON.parse(localStorage.getItem('userData')) || {
    salary: 0,
    currency: 'USD',
    transactions: [],
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

// Initialize profile page
function initializeProfile() {
    console.log('Initializing profile with userData:', userData);
    
    // Set existing profile data if available
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const userCurrency = document.getElementById('userCurrency');
    const userSalary = document.getElementById('userSalary');

    if (userData.profile) {
        profileName.value = userData.profile.name || '';
        profileEmail.value = userData.profile.email || '';
    }

    // Display currency and salary
    userCurrency.textContent = userData.currency;
    userSalary.textContent = `${currencySymbols[userData.currency]}${userData.salary.toFixed(2)}`;

    // Update statistics
    updateStatistics();
}

// Update statistics
function updateStatistics() {
    const expenses = userData.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const income = userData.salary + userData.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const monthsActive = calculateMonthsActive();
    const avgExpenses = monthsActive > 0 ? expenses / monthsActive : 0;

    document.getElementById('totalExpenses').textContent = 
        `${currencySymbols[userData.currency]}${expenses.toFixed(2)}`;
    document.getElementById('totalIncome').textContent = 
        `${currencySymbols[userData.currency]}${income.toFixed(2)}`;
    document.getElementById('avgExpenses').textContent = 
        `${currencySymbols[userData.currency]}${avgExpenses.toFixed(2)}`;
}

// Calculate months active
function calculateMonthsActive() {
    if (userData.transactions.length === 0) return 0;

    const dates = userData.transactions.map(t => new Date(t.date));
    const firstDate = new Date(Math.min(...dates));
    const lastDate = new Date(Math.max(...dates));

    const months = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
        (lastDate.getMonth() - firstDate.getMonth()) + 1;

    return months || 1; // Return at least 1 month if calculation results in 0
}

// Validate email function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle profile form submission
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('profileName').value.trim();
    const email = document.getElementById('profileEmail').value.trim();

    // Validate name
    if (name.length < 2) {
        showNotification('Name must be at least 2 characters long', true);
        return;
    }

    // Validate email
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', true);
        return;
    }

    try {
        // Update userData
        userData.profile = {
            name: name,
            email: email
        };

        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));

        // Show success message
        showNotification('Profile updated successfully!');

        // Update display
        updateStatistics();
    } catch (error) {
        console.error('Error saving profile:', error);
        showNotification('Error saving profile. Please try again.', true);
    }
});

// Show notification function
function showNotification(message, isError = false) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification${isError ? ' error' : ''}`;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeProfile);