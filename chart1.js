// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('DOM Content Loaded');
        
        // Function to get transactions from localStorage
        function getTransactions() {
            const userDataStr = localStorage.getItem('userData');
            console.log('Raw userData from localStorage:', userDataStr);
            
            if (!userDataStr) {
                console.log('No userData found, using sample data');
                return [
                    { type: 'income', amount: 1000, date: new Date().toISOString() },
                    { type: 'expense', amount: 500, date: new Date().toISOString() }
                ];
            }
            
            try {
                const userData = JSON.parse(userDataStr);
                console.log('Parsed userData:', userData);
                return userData.transactions || [];
            } catch (e) {
                console.error('Error parsing userData:', e);
                return [];
            }
        }

        // Function to calculate totals
        function calculateTotals() {
            const transactions = getTransactions();
            const userData = JSON.parse(localStorage.getItem('userData')) || { salary: 0 };
            let totalExpenses = 0;
            let totalIncome = userData.salary || 0; // Include salary in total income

            transactions.forEach(transaction => {
                const amount = parseFloat(transaction.amount) || 0;
                if (transaction.type === 'expense') {
                    totalExpenses += amount;
                } else if (transaction.type === 'income') {
                    totalIncome += amount;
                }
            });

            const result = {
                expenses: totalExpenses || 0,
                income: totalIncome || 0,
                profit: (totalIncome - totalExpenses) || 0
            };
            console.log('Calculated totals:', result);
            return result;
        }

        // Function to group transactions by month
        function groupTransactionsByMonth() {
            const transactions = getTransactions();
            const userData = JSON.parse(localStorage.getItem('userData')) || { salary: 0 };
            const monthlyData = {};
            const currentDate = new Date();
            
            // Initialize last 6 months with zero values
            for (let i = 0; i < 6; i++) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                monthlyData[monthYear] = {
                    expenses: 0,
                    income: i === 0 ? userData.salary : 0 // Add salary only to current month
                };
            }

            transactions.forEach(transaction => {
                const date = new Date(transaction.date || new Date());
                const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                
                if (!monthlyData[monthYear]) {
                    monthlyData[monthYear] = {
                        expenses: 0,
                        income: 0
                    };
                }

                const amount = parseFloat(transaction.amount) || 0;
                if (transaction.type === 'expense') {
                    monthlyData[monthYear].expenses += amount;
                } else if (transaction.type === 'income') {
                    monthlyData[monthYear].income += amount;
                }
            });

            console.log('Monthly data:', monthlyData);
            return monthlyData;
        }

        // Initialize charts
        function initializeCharts() {
            console.log('Initializing charts...');
            
            // Get canvas elements
            const doughnutCtx = document.getElementById('doughnut');
            const profitCtx = document.getElementById('profitChart');
            const expensesCtx = document.getElementById('expensesChart');

            console.log('Canvas elements:', {
                doughnut: doughnutCtx,
                profit: profitCtx,
                expenses: expensesCtx
            });

            if (!doughnutCtx || !profitCtx || !expensesCtx) {
                throw new Error('One or more canvas elements not found');
            }

            // Clear any existing charts
            Chart.helpers.each(Chart.instances, function(instance) {
                instance.destroy();
            });

            const totals = calculateTotals();
            const monthlyData = groupTransactionsByMonth();
            const months = Object.keys(monthlyData).sort();

            // Doughnut Chart
            new Chart(doughnutCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Expenses', 'Profit'],
                    datasets: [{
                        data: [totals.expenses || 0, totals.profit || 0],
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(75, 192, 192)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const userData = JSON.parse(localStorage.getItem('userData')) || { currency: 'USD' };
                                    const currencySymbol = {
                                        USD: '$',
                                        EUR: '€',
                                        GBP: '£',
                                        INR: '₹'
                                    }[userData.currency] || '$';
                                    
                                    return ` ${context.label}: ${currencySymbol}${context.raw.toFixed(2)}`;
                                }
                            }
                        }
                    }
                }
            });

            // Monthly Profit Chart
            const profits = months.map(month => 
                (monthlyData[month].income || 0) - (monthlyData[month].expenses || 0)
            );
            
            const userData = JSON.parse(localStorage.getItem('userData')) || { currency: 'USD' };
            const currencySymbol = {
                USD: '$',
                EUR: '€',
                GBP: '£',
                INR: '₹'
            }[userData.currency] || '$';

            new Chart(profitCtx, {
                type: 'line',
                data: {
                    labels: months.map(month => {
                        const [year, monthNum] = month.split('-');
                        return `${new Date(year, monthNum - 1).toLocaleString('default', { month: 'short' })} ${year}`;
                    }),
                    datasets: [{
                        label: 'Monthly Profit',
                        data: profits,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Profit: ${currencySymbol}${context.raw.toFixed(2)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return currencySymbol + value.toFixed(2);
                                }
                            }
                        }
                    }
                }
            });

            // Monthly Expenses Chart
            const monthlyExpenses = months.map(month => monthlyData[month].expenses || 0);
            
            new Chart(expensesCtx, {
                type: 'line',
                data: {
                    labels: months.map(month => {
                        const [year, monthNum] = month.split('-');
                        return `${new Date(year, monthNum - 1).toLocaleString('default', { month: 'short' })} ${year}`;
                    }),
                    datasets: [{
                        label: 'Monthly Expenses',
                        data: monthlyExpenses,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Expenses: ${currencySymbol}${context.raw.toFixed(2)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return currencySymbol + value.toFixed(2);
                                }
                            }
                        }
                    }
                }
            });

            console.log('Charts initialized successfully');
        }

        // Initialize all charts
        initializeCharts();

    } catch (error) {
        console.error('Error initializing charts:', error);
        // Display error message on the page
        const chartsContainer = document.querySelector('.charts-container');
        if (chartsContainer) {
            chartsContainer.innerHTML = `
                <div style="text-align: center; color: red; padding: 20px;">
                    <h3>Error loading charts</h3>
                    <p>Please try refreshing the page. If the problem persists, check the console for more details.</p>
                    <p>Error details: ${error.message}</p>
                </div>
            `;
        }
    }
});