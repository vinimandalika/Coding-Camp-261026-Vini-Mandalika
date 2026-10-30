/* ========================================
   Pinky Budget ♡ — JavaScript
   little savings, lovely beginnings.
   ======================================== */

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Main app initialization
function initApp() {
    loadTheme();
    updateCurrentDate();
    loadTransactions();
    updateAllDisplays();
    setupEventListeners();
    initChart();
}

// ========================================
// DATA MANAGEMENT
// ========================================

// Get transactions from localStorage
function getTransactions() {
    const transactions = localStorage.getItem('pinkyBudgetTransactions');
    return transactions ? JSON.parse(transactions) : [];
}

// Save transactions to localStorage
function saveTransactions(transactions) {
    localStorage.setItem('pinkyBudgetTransactions', JSON.stringify(transactions));
}

// Add new transaction
function addTransaction(name, amount, category) {
    const transactions = getTransactions();
    const newTransaction = {
        id: Date.now(),
        name: name,
        amount: parseFloat(amount),
        category: category,
        date: new Date().toISOString()
    };
    transactions.push(newTransaction);
    saveTransactions(transactions);
    return newTransaction;
}

// Delete transaction
function deleteTransaction(id) {
    const transactions = getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    saveTransactions(filtered);
}

// ========================================
// CALCULATIONS
// ========================================

// Calculate total expenses
function calculateTotal() {
    const transactions = getTransactions();
    return transactions.reduce((sum, t) => sum + t.amount, 0);
}

// Calculate monthly total
function calculateMonthlyTotal() {
    const transactions = getTransactions();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

// Calculate category totals
function calculateCategoryTotals() {
    const transactions = getTransactions();
    const categories = {
        'Food': 0,
        'Transport': 0,
        'Fun': 0
    };
    
    transactions.forEach(t => {
        if (categories.hasOwnProperty(t.category)) {
            categories[t.category] += t.amount;
        }
    });
    
    return categories;
}

// Calculate monthly category totals
function calculateMonthlyCategoryTotals() {
    const transactions = getTransactions();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const categories = {
        'Food': 0,
        'Transport': 0,
        'Fun': 0
    };
    
    transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        })
        .forEach(t => {
            if (categories.hasOwnProperty(t.category)) {
                categories[t.category] += t.amount;
            }
        });
    
    return categories;
}

// ========================================
// DISPLAY UPDATES
// ========================================

// Format currency to Indonesian Rupiah
function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Update all displays
function updateAllDisplays() {
    updateTotalDisplay();
    updateMonthlyDisplay();
    updateRecentTransactions();
    updateAllTransactions();
    updateChart();
    updateMonthlySummary();
}

// Update total expenses display
function updateTotalDisplay() {
    const total = calculateTotal();
    const totalElement = document.getElementById('totalAmount');
    if (totalElement) {
        totalElement.textContent = formatCurrency(total);
    }
}

// Update monthly expenses display
function updateMonthlyDisplay() {
    const monthlyTotal = calculateMonthlyTotal();
    const monthlyElement = document.getElementById('monthlyAmount');
    if (monthlyElement) {
        monthlyElement.textContent = formatCurrency(monthlyTotal);
    }
}

// Update current date display
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Create transaction item HTML
function createTransactionHTML(transaction) {
    return `
        <div class="transaction-item" data-id="${transaction.id}">
            <div class="transaction-info">
                <div class="transaction-name">${escapeHtml(transaction.name)}</div>
                <div class="transaction-category">${transaction.category}</div>
            </div>
            <div class="transaction-amount">${formatCurrency(transaction.amount)}</div>
            <button class="btn btn-delete" onclick="handleDeleteTransaction(${transaction.id})">Delete</button>
        </div>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Update recent transactions (last 5)
function updateRecentTransactions() {
    const transactions = getTransactions();
    const recentContainer = document.getElementById('recentTransactions');
    
    if (!recentContainer) return;
    
    if (transactions.length === 0) {
        recentContainer.innerHTML = `
            <div class="empty-state">
                <p>Your transaction history will appear here. Start tracking! ✨</p>
            </div>
        `;
        return;
    }
    
    const recent = transactions.slice(-5).reverse();
    recentContainer.innerHTML = recent.map(t => createTransactionHTML(t)).join('');
}

// Update all transactions with sorting
function updateAllTransactions() {
    const transactions = getTransactions();
    const allContainer = document.getElementById('allTransactions');
    
    if (!allContainer) return;
    
    if (transactions.length === 0) {
        allContainer.innerHTML = `
            <div class="empty-state">
                <p>No transactions yet. Add your first expense to get started! 🎀</p>
            </div>
        `;
        return;
    }
    
    const sorted = sortTransactions(transactions);
    allContainer.innerHTML = sorted.map(t => createTransactionHTML(t)).join('');
}

// Sort transactions based on selected option
function sortTransactions(transactions) {
    const sortOption = document.getElementById('sortSelect')?.value || 'newest';
    const sorted = [...transactions];
    
    switch (sortOption) {
        case 'newest':
            return sorted.reverse();
        case 'oldest':
            return sorted;
        case 'highest':
            return sorted.sort((a, b) => b.amount - a.amount);
        case 'lowest':
            return sorted.sort((a, b) => a.amount - b.amount);
        default:
            return sorted;
    }
}

// ========================================
// CHART MANAGEMENT
// ========================================

let spendingChart = null;

// Initialize chart
function initChart() {
    const ctx = document.getElementById('spendingChart');
    if (!ctx) return;
    
    spendingChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Food', 'Transport', 'Fun'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    '#F4A6C1',  // Rose pink
                    '#F8BBD0',  // Pastel pink
                    '#FCE4EC'   // Soft pink
                ],
                borderColor: '#FFFFFF',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: "'Segoe UI', 'Arial', sans-serif"
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return label + ': ' + formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Update chart with current data
function updateChart() {
    if (!spendingChart) return;
    
    const categories = calculateCategoryTotals();
    const chartData = [
        categories['Food'],
        categories['Transport'],
        categories['Fun']
    ];
    
    const hasData = chartData.some(val => val > 0);
    const chartContainer = document.getElementById('spendingChart');
    const emptyState = document.getElementById('chartEmptyState');
    
    if (chartContainer && emptyState) {
        if (hasData) {
            chartContainer.style.display = 'block';
            emptyState.style.display = 'none';
        } else {
            chartContainer.style.display = 'none';
            emptyState.style.display = 'block';
        }
    }
    
    spendingChart.data.datasets[0].data = chartData;
    spendingChart.update();
}

// ========================================
// MONTHLY SUMMARY
// ========================================

// Update monthly summary page
function updateMonthlySummary() {
    const monthNameElement = document.getElementById('monthName');
    if (monthNameElement) {
        const now = new Date();
        const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        monthNameElement.textContent = monthName;
    }
    
    const monthlyTotal = calculateMonthlyTotal();
    const monthlySummaryTotalElement = document.getElementById('monthlySummaryTotal');
    if (monthlySummaryTotalElement) {
        monthlySummaryTotalElement.textContent = formatCurrency(monthlyTotal);
    }
    
    const categories = calculateMonthlyCategoryTotals();
    
    const monthlyFoodElement = document.getElementById('monthlyFood');
    if (monthlyFoodElement) {
        monthlyFoodElement.textContent = formatCurrency(categories['Food']);
    }
    
    const monthlyTransportElement = document.getElementById('monthlyTransport');
    if (monthlyTransportElement) {
        monthlyTransportElement.textContent = formatCurrency(categories['Transport']);
    }
    
    const monthlyFunElement = document.getElementById('monthlyFun');
    if (monthlyFunElement) {
        monthlyFunElement.textContent = formatCurrency(categories['Fun']);
    }
}

// ========================================
// FORM HANDLING
// ========================================

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('itemName');
    const amountInput = document.getElementById('amount');
    const categoryInput = document.getElementById('category');
    
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    
    // Validation
    if (!name) {
        showValidationMessage('Please enter an item name! 💗', 'error');
        return;
    }
    
    if (!amount || amount <= 0) {
        showValidationMessage('Please enter a valid amount! 💗', 'error');
        return;
    }
    
    if (!category) {
        showValidationMessage('Please select a category! 💗', 'error');
        return;
    }
    
    // Add transaction
    addTransaction(name, amount, category);
    
    // Reset form
    nameInput.value = '';
    amountInput.value = '';
    categoryInput.value = '';
    
    // Show success message
    showValidationMessage('Expense added successfully! ✨', 'success');
    
    // Update displays
    updateAllDisplays();
}

// Show validation message
function showValidationMessage(message, type) {
    const messageElement = document.getElementById('validationMessage');
    if (!messageElement) return;
    
    messageElement.textContent = message;
    messageElement.className = `validation-message ${type} show`;
    
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 3000);
}

// Handle transaction deletion
function handleDeleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction? 💔')) {
        deleteTransaction(id);
        updateAllDisplays();
    }
}

// Make handleDeleteTransaction globally accessible
window.handleDeleteTransaction = handleDeleteTransaction;

// ========================================
// NAVIGATION
// ========================================

// Handle page navigation
function navigateToPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(`${pageName}-page`);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Update nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });
    
    // Close mobile menu
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
    }
}

// ========================================
// THEME MANAGEMENT
// ========================================

// Load theme from localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('pinkyBudgetTheme') || 'light';
    applyTheme(savedTheme);
}

// Apply theme
function applyTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    
    if (theme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.checked = true;
        if (themeLabel) themeLabel.textContent = 'Dark Mode 🌙';
    } else {
        body.removeAttribute('data-theme');
        if (themeToggle) themeToggle.checked = false;
        if (themeLabel) themeLabel.textContent = 'Light Mode 🌸';
    }
    
    localStorage.setItem('pinkyBudgetTheme', theme);
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Form submission
    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.dataset.page;
            navigateToPage(pageName);
        });
    });
    
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', updateAllTransactions);
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

// ========================================
// INITIAL DATA LOAD
// ========================================

function loadTransactions() {
    // Transactions are already loaded via getTransactions()
    // This function exists for clarity and future enhancements
}
