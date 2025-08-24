// Charts Configuration and Initialization
let categoryChart = null;
let trendChart = null;
let comparisonChart = null;

// Initialize all charts
function initializeCharts() {
    initializeCategoryChart();
    initializeTrendChart();
    initializePerformanceGauge();
    initializeRoleDistributionChart();
    animateStatistics();
}

// Initialize Category Chart
function initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Business Growth', 'People Development', 'Operational Process', 'Customer', 'Internal Business'],
            datasets: [{
                data: [8, 5, 7, 3, 2],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',  // Blue
                    'rgba(16, 185, 129, 0.8)',  // Green
                    'rgba(245, 158, 11, 0.8)',  // Yellow
                    'rgba(139, 92, 246, 0.8)',  // Purple
                    'rgba(239, 68, 68, 0.8)'    // Red
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
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
                        color: '#fff',
                        padding: 15,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return label + ': ' + value + ' KPIs (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Initialize Trend Chart
function initializeTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (trendChart) {
        trendChart.destroy();
    }
    
    // Generate mock data for the last 6 months
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Completed',
                    data: [12, 15, 18, 20, 22, 18],
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'In Progress',
                    data: [8, 7, 6, 5, 4, 5],
                    borderColor: 'rgba(245, 158, 11, 1)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'At Risk',
                    data: [5, 3, 1, 0, 1, 2],
                    borderColor: 'rgba(239, 68, 68, 1)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#fff',
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    ticks: {
                        color: '#9ca3af'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    ticks: {
                        color: '#9ca3af',
                        stepSize: 5
                    }
                }
            }
        }
    });
}

// Initialize Comparison Chart
function initializeComparisonChart() {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (comparisonChart) {
        comparisonChart.destroy();
    }
    
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['GIS Coordinator', 'GIS Lead', 'GIS Specialist', 'Geodatabase Specialist', 'GIS Analyst'],
            datasets: [
                {
                    label: 'Target',
                    data: [5, 5, 5, 5, 5],
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Achieved',
                    data: [4, 4, 3, 5, 4],
                    backgroundColor: 'rgba(16, 185, 129, 0.5)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#fff',
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y || 0;
                            return label + ': ' + value + ' KPIs';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    ticks: {
                        color: '#9ca3af',
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    ticks: {
                        color: '#9ca3af',
                        stepSize: 1
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Create Performance Gauge Chart
function createGaugeChart(elementId, value, maxValue = 100) {
    const ctx = document.getElementById(elementId);
    if (!ctx) return;
    
    const percentage = (value / maxValue) * 100;
    let color;
    
    if (percentage >= 80) {
        color = 'rgba(16, 185, 129, 0.8)'; // Green
    } else if (percentage >= 60) {
        color = 'rgba(245, 158, 11, 0.8)'; // Yellow
    } else {
        color = 'rgba(239, 68, 68, 0.8)'; // Red
    }
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [value, maxValue - value],
                backgroundColor: [color, 'rgba(75, 85, 99, 0.3)'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            rotation: -90,
            circumference: 180,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

// Update charts with filtered data
function updateChartsWithFilters(filteredData) {
    // Recalculate data based on filters
    const categoryData = {};
    const roleData = {};
    
    filteredData.forEach(item => {
        // Category data
        if (!categoryData[item.parameter]) {
            categoryData[item.parameter] = 0;
        }
        categoryData[item.parameter]++;
        
        // Role data
        if (!roleData[item.role]) {
            roleData[item.role] = { target: 0, achieved: 0 };
        }
        roleData[item.role].target += item.target || 0;
        roleData[item.role].achieved += item.achieved || 0;
    });
    
    // Update category chart
    if (categoryChart) {
        categoryChart.data.datasets[0].data = Object.values(categoryData);
        categoryChart.update();
    }
    
    // Update comparison chart if visible
    if (comparisonChart) {
        const roles = Object.keys(roleData);
        comparisonChart.data.labels = roles;
        comparisonChart.data.datasets[0].data = roles.map(r => roleData[r].target);
        comparisonChart.data.datasets[1].data = roles.map(r => roleData[r].achieved);
        comparisonChart.update();
    }
}

// 🎯 Performance Gauge Chart
let performanceGauge = null;
let roleDistributionChart = null;

function initializePerformanceGauge() {
    const ctx = document.getElementById('performanceGauge');
    if (!ctx) return;
    
    if (performanceGauge) {
        performanceGauge.destroy();
    }
    
    performanceGauge = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [84, 16],
                backgroundColor: [
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(75, 85, 99, 0.3)'
                ],
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            rotation: -90,
            circumference: 180,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    });
}

// 👥 Role Distribution Chart
function initializeRoleDistributionChart() {
    const ctx = document.getElementById('roleDistributionChart');
    if (!ctx) return;
    
    if (roleDistributionChart) {
        roleDistributionChart.destroy();
    }
    
    roleDistributionChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Coordinator', 'Lead', 'Specialist', 'DB Specialist', 'Analyst'],
            datasets: [{
                data: [5, 5, 5, 5, 5],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.6)',
                    'rgba(16, 185, 129, 0.6)',
                    'rgba(245, 158, 11, 0.6)',
                    'rgba(139, 92, 246, 0.6)',
                    'rgba(239, 68, 68, 0.6)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// 📊 Animate Statistics
function animateStatistics() {
    const stats = [
        { id: 'avgCompletionRate', target: 72, suffix: '%' },
        { id: 'onTimeDelivery', target: 89, suffix: '%' },
        { id: 'teamEfficiency', target: 84, suffix: '%' },
        { id: 'qualityScore', target: 91, suffix: '%' }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            animateValue(element, 0, stat.target, 2000, stat.suffix);
        }
    });
}

// Animate value function
function animateValue(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * easeOutQuad(progress));
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Easing function
function easeOutQuad(t) {
    return t * (2 - t);
}

// Toggle Chart Type
function toggleChartType(chartName) {
    switch(chartName) {
        case 'category':
            if (categoryChart.config.type === 'doughnut') {
                // Switch to bar chart
                categoryChart.config.type = 'bar';
                categoryChart.config.options.plugins.legend.display = false;
                categoryChart.config.options.scales = {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#9ca3af' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#9ca3af' }
                    }
                };
            } else {
                // Switch back to doughnut
                categoryChart.config.type = 'doughnut';
                categoryChart.config.options.plugins.legend.display = true;
                delete categoryChart.config.options.scales;
            }
            categoryChart.update();
            break;
        case 'trend':
            if (trendChart.config.type === 'line') {
                // Switch to bar chart
                trendChart.config.type = 'bar';
            } else {
                // Switch back to line
                trendChart.config.type = 'line';
            }
            trendChart.update();
            break;
    }
}

// Refresh Weather
function refreshWeather() {
    if (typeof loadWeatherForecast === 'function') {
        loadWeatherForecast();
        showNotification('Weather data refreshed', 'success');
    }
}

// Real-time Updates (simulated)
setInterval(() => {
    // Update statistics with slight variations
    const stats = [
        { id: 'avgCompletionRate', base: 72 },
        { id: 'onTimeDelivery', base: 89 },
        { id: 'teamEfficiency', base: 84 },
        { id: 'qualityScore', base: 91 }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
            const newValue = Math.max(0, Math.min(100, stat.base + variation));
            element.textContent = newValue + '%';
        }
    });
}, 30000); // Update every 30 seconds

// Export functions
window.initializeCharts = initializeCharts;
window.initializeComparisonChart = initializeComparisonChart;
window.updateChartsWithFilters = updateChartsWithFilters;
window.toggleChartType = toggleChartType;
window.refreshWeather = refreshWeather;