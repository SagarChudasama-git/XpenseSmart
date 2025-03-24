// JavaScript for sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize transaction data from localStorage or set default values
    let transactionData = {
        expense: 0,
        income: 0,
        total: 0
    };

    // Calculate summary from stored transactions
    function calculateSummary() {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        transactionData = transactions.reduce((acc, transaction) => {
            const amount = parseFloat(transaction.amount);
            if (transaction.type === 'expense') {
                acc.expense += amount;
                acc.total -= amount;
            } else {
                acc.income += amount;
                acc.total += amount;
            }
            return acc;
        }, { expense: 0, income: 0, total: 0 });
    }

    // Update summary display
    function updateSummary() {
        calculateSummary();
        document.querySelector('.expense .amount').textContent = `₹${transactionData.expense.toFixed(2)}`;
        document.querySelector('.income .amount').textContent = `₹${transactionData.income.toFixed(2)}`;
        document.querySelector('.total .amount').textContent = `₹${transactionData.total.toFixed(2)}`;
    }

    // Initialize summary display
    updateSummary();

    // Under construction popup handler
    function showUnderConstructionPopup() {
        const popup = document.createElement('div');
        popup.className = 'confirmation-popup under-construction-popup active';
        popup.innerHTML = `
            <div class="confirmation-content">
                <h3><i class="fas fa-tools"></i>Under Construction</h3>
                <p>This feature is currently being developed</p>
                <div class="confirmation-buttons">
                    <button class="cancel-btn">OK</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        popup.querySelector('.cancel-btn').addEventListener('click', () => {
            popup.remove();
        });
    }

    // Add event listeners to sidebar menu items
    document.querySelectorAll('.sidebar-menu a').forEach(menuItem => {
        menuItem.addEventListener('click', (e) => {
            e.preventDefault();
            showUnderConstructionPopup();
        });
    });

    // Function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    // Function to update transaction history
    function updateTransactionHistory() {
        const transactionList = document.getElementById('transactionList');
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        
        // Sort transactions by date (newest first)
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Clear current list
        transactionList.innerHTML = '';

        if (transactions.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'no-transactions';
            emptyState.innerHTML = `
                <div class="empty-state">
                    <p style="text-align: center; margin-top: 70px;">No recent transactions</p>
                </div>
            `;
            transactionList.appendChild(emptyState);
            return;
        }

        // Add transactions to the list
        transactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.className = `transaction-item ${transaction.type}`;
            
            transactionItem.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-category">${transaction.category}</div>
                    <div class="transaction-date">${formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-amount ${transaction.type}">₹${parseFloat(transaction.amount).toFixed(2)}</div>
            `;
            
            transactionList.appendChild(transactionItem);
        });
    }

    // Initialize transaction history
    updateTransactionHistory();

    // Listen for custom event from add-entry page
    window.addEventListener('transaction-added', function(e) {
        const transaction = e.detail;
        if (transaction.type === 'expense') {
            transactionData.expense += parseFloat(transaction.amount);
            transactionData.total -= parseFloat(transaction.amount);
        } else {
            transactionData.income += parseFloat(transaction.amount);
            transactionData.total += parseFloat(transaction.amount);
        }
        updateSummary();
    updateTransactionHistory();
    });

    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    

    // Open sidebar
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open
    });

    // Close sidebar function
    function closeSidebarFunc() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }

    // Close sidebar when clicking the close button
    closeSidebar.addEventListener('click', closeSidebarFunc);

    // Close sidebar when clicking the overlay
    sidebarOverlay.addEventListener('click', closeSidebarFunc);

    // Sidebar action handlers
    document.querySelectorAll('.menu-item.export, .menu-item.delete, .menu-item.reset').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showUnderConstructionPopup();
        });
    });

    

    // Search functionality
    const searchIcon = document.querySelector('.search-icon');
    
    const searchPanel = document.querySelector('.search-panel');
    
    searchIcon.addEventListener('click', function() {
        searchPanel.classList.toggle('active');
        document.body.style.overflow = searchPanel.classList.contains('active') ? 'hidden' : '';
    });

    // Close search panel when clicking outside
    document.addEventListener('click', function(event) {
        if (searchPanel.classList.contains('active') && 
            !event.target.closest('.search-panel') && 
            !event.target.closest('.search-icon')) {
            searchPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close search panel on ESC press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchPanel.classList.contains('active')) {
            searchPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle sidebar toggle and FAB button visibility
const sidebarOverlayElement = document.querySelector('.sidebar-overlay');
    const fab = document.querySelector('.fab');

    if (sidebarOverlay && fab) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (sidebarOverlay.classList.contains('active')) {
                        fab.style.opacity = '0';
                        fab.style.pointerEvents = 'none';
                    } else {
                        fab.style.opacity = '1';
                        fab.style.pointerEvents = 'auto';
                    }
                }
            });
        });

        observer.observe(sidebarOverlay, { attributes: true });
    }

    // FAB button click handler
    const fabButton = document.querySelector('.fab-button');
    if (fabButton) {
        fabButton.addEventListener('click', function() {
            const currentPage = window.location.pathname.split('/').pop();
            let redirectTo = 'add-entry.html';
            
            // Determine redirect based on current page
            switch (currentPage) {
                case 'history.html':
                case 'analysis.html':
                case 'budgets.html':
                case 'index.html':
                    redirectTo = 'add-entry.html';
                    break;
                default:
                    redirectTo = 'index.html';
            }

            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = redirectTo;
            }, 300);
        });
    }
});
