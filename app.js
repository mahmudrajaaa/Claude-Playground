// Gold and Silver Rate Tracker for Chennai
// Data storage and management
//
// ============================================================================
// API SETUP INSTRUCTIONS - Get FREE API Keys for Live Data!
// ============================================================================
//
// This app uses FREE APIs to fetch real-time gold and silver rates.
// Choose one or both options below (100 FREE requests/month each):
//
// OPTION 1: MetalpriceAPI.com (Recommended)
//   1. Sign up at: https://metalpriceapi.com/
//   2. Get your API key from dashboard
//   3. Replace 'YOUR_METALPRICE_API_KEY' on line 87
//
// OPTION 2: Metals.dev
//   1. Sign up at: https://metals.dev/
//   2. Get your API key from dashboard
//   3. Replace 'YOUR_METALSDEV_API_KEY' on line 142
//
// No API keys? No problem! The app will work with sample/cached data.
// ============================================================================

const STORAGE_KEY = 'chennai_metal_rates_history';
const LAST_UPDATE_KEY = 'last_update_timestamp';
const UPDATE_INTERVAL = 3600000; // 1 hour in milliseconds

// Chart instance
let priceChart = null;
let currentChartView = 'both';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Chennai Gold & Silver Rates App initialized');
    initializeApp();
});

async function initializeApp() {
    try {
        // Load historical data from localStorage
        loadHistoricalData();

        // Check if we need to fetch new data
        const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
        const now = Date.now();

        if (!lastUpdate || (now - parseInt(lastUpdate)) > UPDATE_INTERVAL) {
            await fetchCurrentRates();
        } else {
            displayStoredRates();
        }

        // Initialize chart
        initializeChart();

        // Update history table
        updateHistoryTable();

    } catch (error) {
        console.error('Initialization error:', error);
        showAlert('Failed to initialize the application. Please refresh the page.');
    }
}

// Fetch current rates from API
async function fetchCurrentRates() {
    showAlert('Fetching latest rates...', 'info');

    try {
        // Try multiple free data sources
        let rates = await fetchFromMetalpriceAPI();

        if (!rates) {
            rates = await fetchFromMetalsDev();
        }

        if (!rates) {
            // Use fallback/mock data if all APIs fail
            rates = getFallbackRates();
            showAlert('API key not configured or API limit reached. Using cached rates. See console for setup instructions.', 'warning');
        } else {
            hideAlert();
        }

        // Store the rates
        storeRates(rates);

        // Display the rates
        displayRates(rates);

        // Update timestamp
        localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
        updateLastUpdatedTime();

    } catch (error) {
        console.error('Error fetching rates:', error);
        showAlert('Error fetching rates. Please check your API configuration.');
        displayStoredRates();
    }
}

// Fetch from MetalpriceAPI.com (Free tier - 100 requests/month)
async function fetchFromMetalpriceAPI() {
    try {
        // Sign up at https://metalpriceapi.com/ for a FREE API key
        // Free tier: 100 requests/month, no credit card required
        const API_KEY = 'YOUR_METALPRICE_API_KEY'; // Replace with your API key

        if (API_KEY === 'YOUR_METALPRICE_API_KEY') {
            console.log('MetalpriceAPI key not configured. Sign up at https://metalpriceapi.com/');
            return null;
        }

        // Fetch latest rates - base is USD, we get XAU (gold), XAG (silver), and INR
        const response = await fetch(`https://api.metalpriceapi.com/v1/latest?api_key=${API_KEY}&base=USD&currencies=XAU,XAG,INR`);

        if (!response.ok) {
            throw new Error(`MetalpriceAPI request failed: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.rates) {
            // MetalpriceAPI returns rates where:
            // XAU = troy ounces of gold per USD
            // XAG = troy ounces of silver per USD
            // INR = Indian Rupees per USD

            // Calculate price per troy ounce in USD
            const goldPricePerOzUSD = 1 / data.rates.XAU;
            const silverPricePerOzUSD = 1 / data.rates.XAG;

            // Convert to INR
            const goldPricePerOzINR = goldPricePerOzUSD * data.rates.INR;
            const silverPricePerOzINR = silverPricePerOzUSD * data.rates.INR;

            // Convert troy ounce to grams (1 troy oz = 31.1035 grams)
            const goldPricePerGram = goldPricePerOzINR / 31.1035;
            const silverPricePerGram = silverPricePerOzINR / 31.1035;

            return {
                gold24k: Math.round(goldPricePerGram),
                gold22k: Math.round(goldPricePerGram * 0.916), // 22K is 91.6% pure
                silver: Math.round(silverPricePerGram),
                timestamp: Date.now(),
                source: 'MetalpriceAPI.com'
            };
        }

        return null;
    } catch (error) {
        console.error('MetalpriceAPI error:', error);
        return null;
    }
}

// Fetch from Metals.dev (Free tier - 100 requests/month)
async function fetchFromMetalsDev() {
    try {
        // Sign up at https://metals.dev/ for a FREE API key
        // Free tier: 100 requests/month, no credit card required
        const API_KEY = 'YOUR_METALSDEV_API_KEY'; // Replace with your API key

        if (API_KEY === 'YOUR_METALSDEV_API_KEY') {
            console.log('Metals.dev key not configured. Sign up at https://metals.dev/');
            return null;
        }

        // Fetch latest rates in INR per gram
        const response = await fetch(`https://api.metals.dev/v1/latest?api_key=${API_KEY}&currency=INR&unit=g`);

        if (!response.ok) {
            throw new Error(`Metals.dev request failed: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.metals) {
            // Metals.dev returns prices per gram in the specified currency (INR)
            const goldPricePerGram = data.metals.gold || 0;
            const silverPricePerGram = data.metals.silver || 0;

            return {
                gold24k: Math.round(goldPricePerGram),
                gold22k: Math.round(goldPricePerGram * 0.916), // 22K is 91.6% pure
                silver: Math.round(silverPricePerGram),
                timestamp: Date.now(),
                source: 'Metals.dev'
            };
        }

        return null;
    } catch (error) {
        console.error('Metals.dev error:', error);
        return null;
    }
}

// Fallback rates based on typical Chennai market rates (approximate)
function getFallbackRates() {
    // Get previous rates if available
    const history = getHistoryFromStorage();

    if (history.length > 0) {
        // Return most recent stored rate
        return history[history.length - 1];
    }

    // Default fallback rates (approximate Chennai rates as of recent data)
    // These should be updated periodically
    return {
        gold24k: 6850,  // Approximate rate per gram
        gold22k: 6275,  // Approximate rate per gram
        silver: 85,     // Approximate rate per gram
        timestamp: Date.now(),
        source: 'Fallback (Approximate)'
    };
}

// Store rates in localStorage
function storeRates(rates) {
    const history = getHistoryFromStorage();

    // Add today's rate
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = history.findIndex(r => r.date === today);

    const rateEntry = {
        date: today,
        gold24k: rates.gold24k,
        gold22k: rates.gold22k,
        silver: rates.silver,
        timestamp: rates.timestamp
    };

    if (existingIndex >= 0) {
        // Update existing entry for today
        history[existingIndex] = rateEntry;
    } else {
        // Add new entry
        history.push(rateEntry);
    }

    // Keep only last 30 days
    const trimmedHistory = history.slice(-30);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
}

// Get history from localStorage
function getHistoryFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading history:', error);
        return [];
    }
}

// Display rates on the page
function displayRates(rates) {
    document.getElementById('gold24kPrice').textContent = `₹${rates.gold24k.toLocaleString()}`;
    document.getElementById('gold22kPrice').textContent = `₹${rates.gold22k.toLocaleString()}`;
    document.getElementById('silverPrice').textContent = `₹${rates.silver.toLocaleString()}`;

    // Calculate and display change from previous day
    displayRateChanges(rates);
}

// Display stored rates
function displayStoredRates() {
    const history = getHistoryFromStorage();
    if (history.length > 0) {
        const latestRates = history[history.length - 1];
        displayRates(latestRates);
    }
}

// Display rate changes
function displayRateChanges(currentRates) {
    const history = getHistoryFromStorage();

    if (history.length < 2) {
        // Not enough data to compare
        return;
    }

    const previousRates = history[history.length - 2];

    displayChange('gold24kChange', currentRates.gold24k, previousRates.gold24k);
    displayChange('gold22kChange', currentRates.gold22k, previousRates.gold22k);
    displayChange('silverChange', currentRates.silver, previousRates.silver);
}

function displayChange(elementId, currentPrice, previousPrice) {
    const change = currentPrice - previousPrice;
    const changePercent = ((change / previousPrice) * 100).toFixed(2);
    const element = document.getElementById(elementId);

    if (change > 0) {
        element.textContent = `↑ ₹${change.toFixed(0)} (+${changePercent}%)`;
        element.className = 'change positive';
    } else if (change < 0) {
        element.textContent = `↓ ₹${Math.abs(change).toFixed(0)} (${changePercent}%)`;
        element.className = 'change negative';
    } else {
        element.textContent = '→ No change';
        element.className = 'change neutral';
    }
}

// Initialize chart
function initializeChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');

    const history = getHistoryFromStorage();
    const last7Days = history.slice(-7);

    const labels = last7Days.map(r => {
        const date = new Date(r.date);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    });

    const goldData = last7Days.map(r => r.gold24k);
    const silverData = last7Days.map(r => r.silver);

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Gold 24K (₹/g)',
                    data: goldData,
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    hidden: false
                },
                {
                    label: 'Silver (₹/g)',
                    data: silverData,
                    borderColor: '#C0C0C0',
                    backgroundColor: 'rgba(192, 192, 192, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1',
                    hidden: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#eaeaea',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#FFD700',
                    bodyColor: '#eaeaea',
                    borderColor: '#FFD700',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: '#FFD700',
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: {
                        color: '#C0C0C0',
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                },
                x: {
                    ticks: {
                        color: '#b0b0b0'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Change chart view
function changeChartView(view) {
    currentChartView = view;

    if (!priceChart) return;

    if (view === 'gold') {
        priceChart.data.datasets[0].hidden = false; // Gold
        priceChart.data.datasets[1].hidden = true;  // Silver
    } else if (view === 'silver') {
        priceChart.data.datasets[0].hidden = true;  // Gold
        priceChart.data.datasets[1].hidden = false; // Silver
    } else {
        priceChart.data.datasets[0].hidden = false; // Gold
        priceChart.data.datasets[1].hidden = false; // Silver
    }

    priceChart.update();
}

// Update history table
function updateHistoryTable() {
    const history = getHistoryFromStorage();
    const tbody = document.getElementById('historyTableBody');

    if (history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="loading">No historical data available</td></tr>';
        return;
    }

    // Show last 7 days in reverse order (most recent first)
    const recentHistory = history.slice(-7).reverse();

    tbody.innerHTML = recentHistory.map(rate => {
        const date = new Date(rate.date);
        const formattedDate = date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <tr>
                <td>${formattedDate}</td>
                <td>₹${rate.gold24k.toLocaleString()}</td>
                <td>₹${rate.gold22k.toLocaleString()}</td>
                <td>₹${rate.silver.toLocaleString()}</td>
            </tr>
        `;
    }).join('');
}

// Load historical data on page load
function loadHistoricalData() {
    const history = getHistoryFromStorage();

    // If no history exists, create sample historical data
    if (history.length === 0) {
        createSampleHistory();
    }
}

// Create sample historical data for demo purposes
function createSampleHistory() {
    const sampleData = [];
    const today = new Date();

    // Create 7 days of sample data
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Generate realistic-looking data with small variations
        const baseGold24k = 6850;
        const variation = (Math.random() - 0.5) * 100;

        sampleData.push({
            date: date.toISOString().split('T')[0],
            gold24k: Math.round(baseGold24k + variation),
            gold22k: Math.round((baseGold24k + variation) * 0.916),
            silver: Math.round(85 + (Math.random() - 0.5) * 5),
            timestamp: date.getTime()
        });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
}

// Update last updated time display
function updateLastUpdatedTime() {
    const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
    if (lastUpdate) {
        const date = new Date(parseInt(lastUpdate));
        const formattedTime = date.toLocaleString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('lastUpdated').textContent = formattedTime;
    }
}

// Refresh data manually
async function refreshData() {
    const btn = document.querySelector('.btn-refresh');
    btn.disabled = true;
    btn.textContent = '🔄 Refreshing...';

    await fetchCurrentRates();

    // Update chart and table
    if (priceChart) {
        priceChart.destroy();
    }
    initializeChart();
    updateHistoryTable();

    btn.disabled = false;
    btn.textContent = '🔄 Refresh Data';
}

// Show alert message
function showAlert(message, type = 'error') {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = 'alert show';

    if (type === 'info') {
        alert.style.background = 'rgba(33, 150, 243, 0.2)';
        alert.style.borderLeftColor = '#2196F3';
    } else if (type === 'warning') {
        alert.style.background = 'rgba(255, 152, 0, 0.2)';
        alert.style.borderLeftColor = '#FF9800';
    }
}

// Hide alert message
function hideAlert() {
    const alert = document.getElementById('alert');
    alert.classList.remove('show');
}

// Auto-update every hour
setInterval(async () => {
    const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
    const now = Date.now();

    if (!lastUpdate || (now - parseInt(lastUpdate)) > UPDATE_INTERVAL) {
        await fetchCurrentRates();
        if (priceChart) {
            priceChart.destroy();
        }
        initializeChart();
        updateHistoryTable();
    }
}, UPDATE_INTERVAL);
