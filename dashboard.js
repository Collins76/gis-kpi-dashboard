// Dashboard Main JavaScript
let currentUser = null;
let kpiData = [];

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userStr = localStorage.getItem('gisUser');
    if (!userStr) {
        window.location.href = 'index.html';
        return;
    }

    currentUser = JSON.parse(userStr);
    
    // Display user information
    displayUserInfo();
    
    // Start digital clock
    startDigitalClock();
    
    // Load KPI data
    loadKPIData();
    
    // Initialize filters
    initializeFilters();
    
    // Load initial content
    loadOverviewContent();
});

// Display user information
function displayUserInfo() {
    document.getElementById('userName').textContent = currentUser.fullname;
    document.getElementById('userLocation').textContent = currentUser.location;
    
    // Load and display profile photo if exists
    updateHeaderProfilePhoto();
}

// 🕐 Enhanced Digital Clock with Calendar
let currentCalendarDate = new Date();

function startDigitalClock() {
    function updateClock() {
        const now = new Date();
        // Lagos is UTC+1
        const lagosTime = new Date(now.toLocaleString("en-US", {timeZone: "Africa/Lagos"}));
        
        const hours = String(lagosTime.getHours()).padStart(2, '0');
        const minutes = String(lagosTime.getMinutes()).padStart(2, '0');
        const seconds = String(lagosTime.getSeconds()).padStart(2, '0');
        
        document.getElementById('digitalClock').textContent = `${hours}:${minutes}:${seconds}`;
        
        // Update current date
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            dateElement.textContent = lagosTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// 📅 Calendar Functionality
function toggleCalendar() {
    const calendar = document.getElementById('miniCalendar');
    if (calendar.classList.contains('hidden')) {
        calendar.classList.remove('hidden');
        renderCalendar();
    } else {
        calendar.classList.add('hidden');
    }
}

function renderCalendar() {
    const monthElement = document.getElementById('calendarMonth');
    const daysElement = document.getElementById('calendarDays');
    
    if (!monthElement || !daysElement) return;
    
    const month = currentCalendarDate.getMonth();
    const year = currentCalendarDate.getFullYear();
    
    // Set month/year header
    monthElement.textContent = new Date(year, month).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    let daysHTML = '';
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        daysHTML += '<div class="p-2"></div>';
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = today.getDate() === day && 
                       today.getMonth() === month && 
                       today.getFullYear() === year;
        
        daysHTML += `
            <div class="p-2 rounded cursor-pointer hover:bg-yellow-500 hover:bg-opacity-20 transition-all ${
                isToday ? 'bg-yellow-500 text-black font-bold' : 'text-gray-300 hover:text-white'
            }" onclick="selectCalendarDate(${year}, ${month}, ${day})">
                ${day}
            </div>
        `;
    }
    
    daysElement.innerHTML = daysHTML;
}

function changeMonth(delta) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderCalendar();
}

function goToToday() {
    currentCalendarDate = new Date();
    renderCalendar();
}

function selectCalendarDate(year, month, day) {
    const selectedDate = new Date(year, month, day);
    const dateStr = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    showNotification(`Selected date: ${dateStr}`, 'info');
    toggleCalendar();
}

// Close calendar when clicking outside
document.addEventListener('click', function(e) {
    const calendar = document.getElementById('miniCalendar');
    const clockContainer = e.target.closest('.glow-container');
    
    if (calendar && !calendar.contains(e.target) && !clockContainer) {
        calendar.classList.add('hidden');
    }
});

// Tab Switching
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('tab-active');
    });
    
    // Show selected tab content
    document.getElementById(tabName + 'Content').classList.remove('hidden');
    
    // Add active class to selected tab
    document.getElementById(tabName + 'Tab').classList.add('tab-active');
    
    // Load content based on tab
    switch(tabName) {
        case 'overview':
            loadOverviewContent();
            break;
        case 'roleView':
            loadRoleBasedView();
            break;
        case 'trends':
            loadTrendsContent();
            break;
        case 'tracking':
            loadTrackingContent();
            break;
        case 'map':
            initializeMap();
            break;
        case 'upload':
            // Upload functionality is handled separately
            break;
    }
}

// Load KPI Data
async function loadKPIData() {
    try {
        // Fetch KPI data from API
        const response = await fetch('tables/kpi_data');
        if (response.ok) {
            const data = await response.json();
            kpiData = data.data || [];
        }
    } catch (error) {
        console.log('Loading default KPI data');
        // Use default data for now
        kpiData = getDefaultKPIData();
    }
}

// Get Default KPI Data
function getDefaultKPIData() {
    return [
        {
            role: 'GIS Coordinator',
            parameter: 'Business Growth',
            kpi: 'Develop and implement GIS strategy',
            target: 2,
            achieved: 1,
            status: 'in_progress',
            frequency: 'Annually'
        },
        {
            role: 'GIS Lead',
            parameter: 'Operational Process',
            kpi: 'Complete GIS projects on time',
            target: 100,
            achieved: 85,
            status: 'in_progress',
            frequency: 'Monthly'
        },
        {
            role: 'GIS Specialist',
            parameter: 'People Development',
            kpi: 'Provide technical training',
            target: 4,
            achieved: 3,
            status: 'on_track',
            frequency: 'Quarterly'
        },
        {
            role: 'Geodatabase Specialist',
            parameter: 'Operational Process',
            kpi: 'Database integrity and performance',
            target: 100,
            achieved: 98,
            status: 'completed',
            frequency: 'Weekly'
        },
        {
            role: 'GIS Analyst',
            parameter: 'Business Growth',
            kpi: 'Data integration accuracy',
            target: 100,
            achieved: 95,
            status: 'on_track',
            frequency: 'Monthly'
        }
    ];
}

// Initialize Filters
function initializeFilters() {
    const filters = ['roleFilter', 'levelFilter', 'parameterFilter', 'frequencyFilter', 'locationFilter'];
    
    filters.forEach(filterId => {
        document.getElementById(filterId).addEventListener('change', applyFilters);
    });
}

// Apply Filters
function applyFilters() {
    const roleFilter = document.getElementById('roleFilter').value;
    const levelFilter = document.getElementById('levelFilter').value;
    const parameterFilter = document.getElementById('parameterFilter').value;
    const frequencyFilter = document.getElementById('frequencyFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    
    // Filter logic will be applied to the displayed data
    console.log('Filters applied:', {
        role: roleFilter,
        level: levelFilter,
        parameter: parameterFilter,
        frequency: frequencyFilter,
        location: locationFilter
    });
    
    // Refresh current view with filters
    const activeTab = document.querySelector('.tab-active').id.replace('Tab', '');
    switchTab(activeTab);
}

// Load Overview Content
function loadOverviewContent() {
    // Initialize charts
    if (typeof initializeCharts === 'function') {
        initializeCharts();
    }
    
    // Load weather forecast
    if (typeof loadWeatherForecast === 'function') {
        loadWeatherForecast();
    }
}

// Load Role-Based View
function loadRoleBasedView() {
    const content = document.getElementById('roleBasedContent');
    
    const roles = ['GIS Coordinator', 'GIS Lead', 'GIS Specialist', 'Geodatabase Specialist', 'GIS Analyst'];
    
    let html = '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">';
    
    roles.forEach(role => {
        const roleKPIs = kpiData.filter(kpi => kpi.role === role);
        const completed = roleKPIs.filter(kpi => kpi.status === 'completed').length;
        const total = roleKPIs.length || 5;
        const percentage = Math.round((completed / total) * 100);
        
        html += `
            <div class="bg-gray-700 rounded-lg p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-white font-semibold text-lg">${role}</h3>
                    <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded">${total} KPIs</span>
                </div>
                
                <div class="mb-4">
                    <div class="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Overall Progress</span>
                        <span>${percentage}%</span>
                    </div>
                    <div class="w-full bg-gray-600 rounded-full h-3">
                        <div class="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                </div>
                
                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-green-400"><i class="fas fa-check-circle mr-1"></i>Completed</span>
                        <span class="text-white">${completed}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-yellow-400"><i class="fas fa-spinner mr-1"></i>In Progress</span>
                        <span class="text-white">${total - completed}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
}

// Load Trends Content
function loadTrendsContent() {
    if (typeof initializeComparisonChart === 'function') {
        initializeComparisonChart();
    }
}

// Load Tracking Content - Updated to use expanded KPI data and filtering
function loadTrackingContent() {
    try {
        // Get expanded KPI data
        const allKpiData = getExpandedKPIData();
        
        // Initialize status dropdown with all available statuses
        initializeStatusDropdown(allKpiData);
        
        // Display all KPIs initially
        displayKpiTrackingTable(allKpiData);
        
        // Clear any existing filter selections
        document.getElementById('roleFilterTracking').value = '';
        document.getElementById('statusFilterTracking').value = '';
        
    } catch (error) {
        console.error('Error loading tracking content:', error);
        // Fallback to old method if there's an error
        loadTrackingContentFallback();
    }
}

// Initialize Status Dropdown with all available statuses
function initializeStatusDropdown(allKpiData) {
    const statusDropdown = document.getElementById('statusFilterTracking');
    if (!statusDropdown) return;
    
    // Get unique statuses from all KPI data
    const allStatuses = [...new Set(allKpiData.map(kpi => kpi.status))].filter(s => s);
    
    // Clear and rebuild options
    statusDropdown.innerHTML = '<option value="" style="background: #0a0a0a; color: white;">All Status</option>';
    
    allStatuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        option.style.background = '#0a0a0a';
        option.style.color = 'white';
        statusDropdown.appendChild(option);
    });
}

// Fallback function for backward compatibility
function loadTrackingContentFallback() {
    const content = document.getElementById('kpiTrackingTable');
    
    let html = `
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-300">
                <thead class="text-xs uppercase bg-gray-700">
                    <tr>
                        <th class="px-4 py-3">Status</th>
                        <th class="px-4 py-3">Role</th>
                        <th class="px-4 py-3">KPI</th>
                        <th class="px-4 py-3">Parameter</th>
                        <th class="px-4 py-3">Target</th>
                        <th class="px-4 py-3">Achieved</th>
                        <th class="px-4 py-3">Progress</th>
                        <th class="px-4 py-3">Frequency</th>
                        <th class="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    kpiData.forEach((kpi, index) => {
        const progress = Math.round((kpi.achieved / kpi.target) * 100);
        const statusColor = kpi.status === 'completed' ? 'green' : 
                           kpi.status === 'on_track' ? 'yellow' : 'red';
        
        html += `
            <tr class="border-b border-gray-700 hover:bg-gray-700">
                <td class="px-4 py-3">
                    <span class="status-indicator status-${statusColor}"></span>
                    ${kpi.status.replace('_', ' ').toUpperCase()}
                </td>
                <td class="px-4 py-3">${kpi.role}</td>
                <td class="px-4 py-3">${kpi.kpi}</td>
                <td class="px-4 py-3">
                    <span class="bg-blue-500 bg-opacity-20 text-blue-400 px-2 py-1 rounded text-xs">
                        ${kpi.parameter}
                    </span>
                </td>
                <td class="px-4 py-3">${kpi.target}</td>
                <td class="px-4 py-3">${kpi.achieved}</td>
                <td class="px-4 py-3">
                    <div class="w-24 bg-gray-600 rounded-full h-2">
                        <div class="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style="width: ${progress}%"></div>
                    </div>
                    <span class="text-xs">${progress}%</span>
                </td>
                <td class="px-4 py-3">${kpi.frequency}</td>
                <td class="px-4 py-3">
                    <button onclick="editKPI(${index})" class="text-blue-400 hover:text-blue-300 mr-2">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="viewKPIDetails(${index})" class="text-green-400 hover:text-green-300">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    content.innerHTML = html;
}

// 📊 KPI REPORT MODAL FUNCTIONALITY

let selectedKpi = null;

// Open KPI Report Modal
function openKpiReportModal() {
    // Set current date and time
    const now = new Date();
    document.getElementById('reportDate').value = now.toISOString().split('T')[0];
    document.getElementById('reportTime').value = now.toTimeString().slice(0, 5);
    
    // Set reporter info if user is logged in
    if (currentUser) {
        document.getElementById('reporterName').value = currentUser.fullname;
        document.getElementById('reporterLocation').value = currentUser.location;
    }
    
    // Show modal
    document.getElementById('kpiReportModal').classList.remove('hidden');
}

// Close KPI Report Modal
function closeKpiReportModal() {
    document.getElementById('kpiReportModal').classList.add('hidden');
    document.getElementById('kpiReportForm').reset();
    document.getElementById('progressDetailsSection').classList.add('hidden');
    selectedKpi = null;
}

// Load KPIs based on selected role
async function loadRoleKpis() {
    const role = document.getElementById('reporterRole').value;
    const container = document.getElementById('roleKpisList');
    
    if (!role) {
        container.innerHTML = '<p class="text-gray-400 text-center py-8">Please select your role first to see available KPIs</p>';
        return;
    }
    
    try {
        console.log('🎭 Loading KPIs for role:', role);
        
        // Get KPIs from local data instead of API
        let allKpis = [];
        
        // Try to get from API first, then fallback to local data
        try {
            const response = await fetch(`tables/kpi_master?role=${encodeURIComponent(role)}`);
            if (response.ok) {
                const data = await response.json();
                allKpis = data.data || [];
                console.log('📊 Loaded KPIs from API:', allKpis.length);
            }
        } catch (apiError) {
            console.log('⚠️ API not available, using local KPI data');
        }
        
        // If no data from API, use local expanded data
        if (allKpis.length === 0) {
            console.log('📈 Using local expanded KPI data');
            allKpis = getExpandedKPIData();
        }
        
        // Filter KPIs for the selected role
        const roleKpis = allKpis.filter(kpi => kpi.role === role);
        console.log(`🎯 Filtered KPIs for "${role}":`, roleKpis.length);
        
        if (roleKpis.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center py-8">No KPIs found for this role</p>';
            return;
        }
        
        let html = '';
        roleKpis.forEach((kpi, index) => {
            const progress = kpi.current_value && kpi.target ? 
                Math.round((kpi.current_value / parseFloat(kpi.target)) * 100) : 0;
            
            html += `
                <div class="location-card p-4 cursor-pointer" onclick="selectKpi('${kpi.id}', ${index})" data-kpi-id="${kpi.id}">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                            <h5 class="text-white font-bold font-orbitron text-lg mb-2">${kpi.role_kpi}</h5>
                            <div class="flex items-center space-x-4 text-sm text-gray-400">
                                <span><i class="fas fa-tag mr-1"></i>${kpi.parameter}</span>
                                <span><i class="fas fa-calendar mr-1"></i>${kpi.frequency}</span>
                                <span><i class="fas fa-percentage mr-1"></i>${kpi.weight}% weight</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold font-orbitron ${
                                kpi.status === 'Completed' ? 'text-green-400' :
                                kpi.status === 'On Track' ? 'text-blue-400' :
                                kpi.status === 'At Risk' ? 'text-red-400' :
                                'text-yellow-400'
                            }">${progress}%</div>
                            <div class="text-xs text-gray-500">Progress</div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <div class="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Target: ${kpi.target} ${kpi.target_type}</span>
                            <span>Current: ${kpi.current_value || 0}</span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="h-2 rounded-full bg-gradient-to-r ${
                                progress >= 80 ? 'from-green-500 to-green-400' :
                                progress >= 60 ? 'from-yellow-500 to-yellow-400' :
                                'from-red-500 to-red-400'
                            }" style="width: ${Math.min(progress, 100)}%"></div>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center text-xs">
                        <span class="px-2 py-1 rounded text-white ${
                            kpi.status === 'Completed' ? 'bg-green-500' :
                            kpi.status === 'On Track' ? 'bg-blue-500' :
                            kpi.status === 'At Risk' ? 'bg-red-500' :
                            'bg-yellow-500'
                        }">${kpi.status || 'Not Started'}</span>
                        <span class="text-gray-500">Due: ${new Date(kpi.due_date).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('❌ Error loading KPIs:', error);
        container.innerHTML = '<p class="text-red-400 text-center py-8">Error loading KPIs. Please try again.</p>';
        
        // Attempt to load local data as final fallback
        try {
            console.log('🔄 Attempting fallback with local data...');
            const allKpis = getExpandedKPIData();
            const roleKpis = allKpis.filter(kpi => kpi.role === role);
            
            if (roleKpis.length > 0) {
                console.log('✅ Fallback successful, loaded KPIs:', roleKpis.length);
                // Use the same display logic
                let html = '';
                roleKpis.forEach((kpi, index) => {
                    const progress = kpi.current_value && kpi.target ? 
                        Math.round((kpi.current_value / parseFloat(kpi.target)) * 100) : 0;
                    
                    html += `
                        <div class="location-card p-4 cursor-pointer" onclick="selectKpi('${kpi.id}', ${index})" data-kpi-id="${kpi.id}">
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex-1">
                                    <h5 class="text-white font-bold font-orbitron text-lg mb-2">${kpi.role_kpi}</h5>
                                    <div class="flex items-center space-x-4 text-sm text-gray-400">
                                        <span><i class="fas fa-tag mr-1"></i>${kpi.parameter}</span>
                                        <span><i class="fas fa-calendar mr-1"></i>${kpi.frequency}</span>
                                        <span><i class="fas fa-percentage mr-1"></i>${kpi.weight}% weight</span>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold font-orbitron ${
                                        kpi.status === 'Completed' ? 'text-green-400' :
                                        kpi.status === 'On Track' ? 'text-blue-400' :
                                        kpi.status === 'At Risk' ? 'text-red-400' :
                                        'text-yellow-400'
                                    }">${progress}%</div>
                                    <div class="text-xs text-gray-500">Progress</div>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <div class="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Target: ${kpi.target} ${kpi.target_type}</span>
                                    <span>Current: ${kpi.current_value || 0}</span>
                                </div>
                                <div class="w-full bg-gray-700 rounded-full h-2">
                                    <div class="h-2 rounded-full bg-gradient-to-r ${
                                        progress >= 80 ? 'from-green-500 to-green-400' :
                                        progress >= 60 ? 'from-yellow-500 to-yellow-400' :
                                        'from-red-500 to-red-400'
                                    }" style="width: ${Math.min(progress, 100)}%"></div>
                                </div>
                            </div>
                            
                            <div class="flex justify-between items-center text-xs">
                                <span class="px-2 py-1 rounded text-white ${
                                    kpi.status === 'Completed' ? 'bg-green-500' :
                                    kpi.status === 'On Track' ? 'bg-blue-500' :
                                    kpi.status === 'At Risk' ? 'bg-red-500' :
                                    'bg-yellow-500'
                                }">${kpi.status || 'Not Started'}</span>
                                <span class="text-gray-500">Due: ${new Date(kpi.due_date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    `;
                });
                
                container.innerHTML = html;
            }
        } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError);
        }
    }
}

// Select KPI for reporting
function selectKpi(kpiId, index) {
    // Remove previous selections
    document.querySelectorAll('[data-kpi-id]').forEach(el => {
        el.classList.remove('ring-2', 'ring-yellow-500');
    });
    
    // Highlight selected KPI
    const selectedElement = document.querySelector(`[data-kpi-id="${kpiId}"]`);
    if (selectedElement) {
        selectedElement.classList.add('ring-2', 'ring-yellow-500');
    }
    
    selectedKpi = kpiId;
    
    // Show progress details section
    document.getElementById('progressDetailsSection').classList.remove('hidden');
    
    // Scroll to progress section
    document.getElementById('progressDetailsSection').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// Handle KPI Report Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const kpiReportForm = document.getElementById('kpiReportForm');
    if (kpiReportForm) {
        kpiReportForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!selectedKpi) {
                showNotification('Please select a KPI to update', 'error');
                return;
            }
            
            const formData = {
                kpi_id: selectedKpi,
                reported_by: document.getElementById('reporterName').value,
                role: document.getElementById('reporterRole').value,
                location: document.getElementById('reporterLocation').value,
                report_date: document.getElementById('reportDate').value,
                report_time: document.getElementById('reportTime').value,
                report_type: document.getElementById('reportType').value,
                current_achievement: parseFloat(document.getElementById('currentAchievement').value) || 0,
                progress_percentage: parseInt(document.getElementById('progressPercentage').value) || 0,
                status: document.getElementById('progressStatus').value,
                next_review_date: document.getElementById('nextReviewDate').value,
                comments: document.getElementById('progressComments').value,
                tracking_date: new Date().toISOString()
            };
            
            try {
                // Submit to tracking table
                const response = await fetch('tables/kpi_tracking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    // Update the master KPI record
                    await updateMasterKpi(selectedKpi, formData);
                    
                    showNotification('KPI progress report submitted successfully!', 'success');
                    closeKpiReportModal();
                    
                    // Refresh tracking table if visible
                    if (!document.getElementById('trackingContent').classList.contains('hidden')) {
                        loadTrackingContent();
                    }
                } else {
                    throw new Error('Failed to submit report');
                }
                
            } catch (error) {
                console.error('Error submitting report:', error);
                showNotification('Failed to submit report. Please try again.', 'error');
            }
        });
    }
});

// Update Master KPI record
async function updateMasterKpi(kpiId, reportData) {
    try {
        await fetch(`tables/kpi_master/${kpiId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                current_value: reportData.current_achievement,
                status: reportData.status
            })
        });
    } catch (error) {
        console.error('Error updating master KPI:', error);
    }
}

// Enhanced Filter KPIs by Role in Tracking Tab
async function filterKpisByRole() {
    console.log('🔍 Starting KPI filtering...');
    const role = document.getElementById('roleFilterTracking').value;
    const status = document.getElementById('statusFilterTracking').value;
    
    console.log('🎯 Filter parameters:', { role, status });
    
    try {
        // Get all KPI data first
        let filteredData = [];
        
        // Load KPI data from API or use default data
        try {
            const response = await fetch('tables/kpi_master');
            if (response.ok) {
                const data = await response.json();
                filteredData = data.data || [];
                console.log('📊 Loaded KPI data from API:', filteredData.length);
            }
        } catch (apiError) {
            console.log('⚠️ API not available, using default KPI data');
            filteredData = getDefaultKPIData();
        }
        
        // If no data, use expanded default data
        if (filteredData.length === 0) {
            console.log('📈 Using expanded default KPI data');
            filteredData = getExpandedKPIData();
        }
        
        console.log('📋 Total KPIs before filtering:', filteredData.length);
        
        // Apply role filter
        if (role) {
            const beforeCount = filteredData.length;
            filteredData = filteredData.filter(kpi => kpi.role === role);
            console.log(`🎭 Role filter "${role}": ${beforeCount} → ${filteredData.length} KPIs`);
        }
        
        // Apply status filter
        if (status) {
            const beforeCount = filteredData.length;
            filteredData = filteredData.filter(kpi => kpi.status === status);
            console.log(`📊 Status filter "${status}": ${beforeCount} → ${filteredData.length} KPIs`);
        }
        
        console.log('✅ Final filtered KPIs:', filteredData.length);
        
        // Update status dropdown based on available data
        updateStatusDropdown(filteredData);
        
        // Display filtered results
        displayKpiTrackingTable(filteredData);
        
        // Show filter results notification
        const filterCount = filteredData.length;
        if (role || status) {
            const filterText = [role, status].filter(f => f).join(' + ');
            showNotification(`Found ${filterCount} KPIs matching "${filterText}"`, 'info');
            console.log(`🎉 Filter applied successfully: ${filterCount} results`);
        }
        
    } catch (error) {
        console.error('❌ Error filtering KPIs:', error);
        showNotification('Error filtering KPIs', 'error');
    }
}

// Get Expanded Default KPI Data with all roles - Aligned with Excel Sheet
function getExpandedKPIData() {
    const kpiData = [
        // GIS Coordinator KPIs (Comprehensive Set)
        {
            id: 'kpi_coord_1',
            role: 'GIS Coordinator',
            parameter: 'Business Growth',
            role_kpi: 'Develop and implement comprehensive GIS strategy',
            measurement_metric: 'Number of strategic initiatives implemented',
            data_source: 'Project Management Dashboard',
            weight: 20,
            target: '5',
            target_type: 'Number',
            frequency: 'Annually',
            current_value: 3,
            status: 'In Progress',
            location: 'CHQ',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_coord_2',
            role: 'GIS Coordinator',
            parameter: 'Business Growth',
            role_kpi: 'Full integration of GIS data for 100% network asset accuracy',
            measurement_metric: 'Percentage Achieved / Planned',
            data_source: 'GDB Folders',
            weight: 20,
            target: '100',
            target_type: 'Percentage',
            frequency: 'Monthly',
            current_value: 85,
            status: 'On Track',
            location: 'CHQ',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_coord_3',
            role: 'GIS Coordinator',
            parameter: 'People Development',
            role_kpi: 'Provide technical training to GIS team members',
            measurement_metric: 'Training sessions conducted per quarter',
            data_source: 'Training Reports',
            weight: 15,
            target: '4',
            target_type: 'Number',
            frequency: 'Quarterly',
            current_value: 3,
            status: 'On Track',
            location: 'CHQ',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_coord_4',
            role: 'GIS Coordinator',
            parameter: 'Operational Process',
            role_kpi: 'Establish GIS data governance and quality standards',
            measurement_metric: 'Number of standards documents created',
            data_source: 'Quality Management System',
            weight: 15,
            target: '8',
            target_type: 'Number',
            frequency: 'Annually',
            current_value: 6,
            status: 'On Track',
            location: 'CHQ',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_coord_5',
            role: 'GIS Coordinator',
            parameter: 'Customer',
            role_kpi: 'Stakeholder satisfaction with GIS services',
            measurement_metric: 'Satisfaction survey score',
            data_source: 'Customer Feedback System',
            weight: 10,
            target: '85',
            target_type: 'Percentage',
            frequency: 'Quarterly',
            current_value: 78,
            status: 'At Risk',
            location: 'CHQ',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_coord_6',
            role: 'GIS Coordinator',
            parameter: 'Business Growth',
            role_kpi: 'GIS technology adoption across business units',
            measurement_metric: 'Number of BUs using GIS solutions',
            data_source: 'Usage Analytics',
            weight: 20,
            target: '7',
            target_type: 'Number',
            frequency: 'Monthly',
            current_value: 5,
            status: 'In Progress',
            location: 'CHQ',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        
        // GIS Lead KPIs (Comprehensive Set)
        {
            id: 'kpi_lead_1',
            role: 'GIS Lead',
            parameter: 'Operational Process',
            role_kpi: 'Complete 100% of GIS projects within agreed timelines',
            measurement_metric: 'Projects completed on time / Total projects × 100',
            data_source: 'GIS Project Dashboard',
            weight: 20,
            target: '100',
            target_type: 'Percentage',
            frequency: 'Monthly',
            current_value: 92,
            status: 'On Track',
            location: 'Ikeja BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_lead_2',
            role: 'GIS Lead',
            parameter: 'People Development',
            role_kpi: 'Provide technical training to specialists and analysts',
            measurement_metric: 'Training sessions per quarter',
            data_source: 'Training Reports',
            weight: 15,
            target: '4',
            target_type: 'Number',
            frequency: 'Quarterly',
            current_value: 2,
            status: 'In Progress',
            location: 'Ikeja BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_lead_3',
            role: 'GIS Lead',
            parameter: 'Operational Process',
            role_kpi: 'Ensure accuracy and quality of GIS data deliverables',
            measurement_metric: 'Quality score improvement percentage',
            data_source: 'GIS Quality Control Log',
            weight: 20,
            target: '95',
            target_type: 'Percentage',
            frequency: 'Monthly',
            current_value: 88,
            status: 'On Track',
            location: 'Ikeja BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_lead_4',
            role: 'GIS Lead',
            parameter: 'Business Growth',
            role_kpi: 'Lead GIS digital transformation initiatives',
            measurement_metric: 'Number of digitization projects completed',
            data_source: 'Digital Transformation Dashboard',
            weight: 15,
            target: '6',
            target_type: 'Number',
            frequency: 'Quarterly',
            current_value: 4,
            status: 'On Track',
            location: 'Ikeja BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_lead_5',
            role: 'GIS Lead',
            parameter: 'Customer',
            role_kpi: 'Stakeholder engagement and communication',
            measurement_metric: 'Number of stakeholder meetings conducted',
            data_source: 'Meeting Records',
            weight: 10,
            target: '24',
            target_type: 'Number',
            frequency: 'Monthly',
            current_value: 18,
            status: 'On Track',
            location: 'Ikeja BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_lead_6',
            role: 'GIS Lead',
            parameter: 'Operational Process',
            role_kpi: 'Team productivity and efficiency optimization',
            measurement_metric: 'Team productivity score',
            data_source: 'Performance Management System',
            weight: 20,
            target: '90',
            target_type: 'Percentage',
            frequency: 'Monthly',
            current_value: 85,
            status: 'On Track',
            location: 'Ikeja BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        
        // GIS Specialist KPIs (Comprehensive Set)
        {
            id: 'kpi_spec_1',
            role: 'GIS Specialist',
            parameter: 'Operational Process',
            role_kpi: 'Complete assigned GIS projects within agreed timelines',
            measurement_metric: 'Projects completed on time / Total projects × 100',
            data_source: 'GIS Project Dashboard',
            weight: 25,
            target: '95',
            target_type: 'Percentage',
            frequency: 'Monthly',
            current_value: 88,
            status: 'On Track',
            location: 'Oshodi BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_spec_2',
            role: 'GIS Specialist',
            parameter: 'Operational Process',
            role_kpi: 'Resolve GIS technical issues within 24 hours',
            measurement_metric: 'Issues resolved within 24hrs / Total issues × 100',
            data_source: 'Issue Tracking System',
            weight: 20,
            target: '95',
            target_type: 'Percentage',
            frequency: 'Weekly',
            current_value: 92,
            status: 'On Track',
            location: 'Oshodi BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_spec_3',
            role: 'GIS Specialist',
            parameter: 'Business Growth',
            role_kpi: 'GIS data collection and validation accuracy',
            measurement_metric: 'Data accuracy percentage',
            data_source: 'Data Quality Reports',
            weight: 20,
            target: '98',
            target_type: 'Percentage',
            frequency: 'Monthly',
            current_value: 96,
            status: 'On Track',
            location: 'Oshodi BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_spec_4',
            role: 'GIS Specialist',
            parameter: 'People Development',
            role_kpi: 'Technical skill development and certification',
            measurement_metric: 'Number of certifications obtained',
            data_source: 'Training Records',
            weight: 15,
            target: '2',
            target_type: 'Number',
            frequency: 'Annually',
            current_value: 1,
            status: 'In Progress',
            location: 'Oshodi BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_spec_5',
            role: 'GIS Specialist',
            parameter: 'Customer',
            role_kpi: 'Field survey completion rate',
            measurement_metric: 'Surveys completed / Surveys planned × 100',
            data_source: 'Field Survey Dashboard',
            weight: 20,
            target: '100',
            target_type: 'Percentage',
            frequency: 'Monthly',
            current_value: 87,
            status: 'At Risk',
            location: 'Oshodi BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        
        // Geodatabase Specialist KPIs (Comprehensive Set)
        {
            id: 'kpi_db_1',
            role: 'Geodatabase Specialist',
            parameter: 'Operational Process',
            role_kpi: 'Ensure integrity and performance of enterprise geodatabase',
            measurement_metric: 'Database uptime percentage',
            data_source: 'Database Monitoring Tools',
            weight: 25,
            target: '99.9',
            target_type: 'Percentage',
            frequency: 'Daily',
            current_value: 99.8,
            status: 'On Track',
            location: 'CHQ',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_db_2',
            role: 'Geodatabase Specialist',
            parameter: 'People Development',
            role_kpi: 'Provide technical training to GIS Analysts',
            measurement_metric: 'Training hours per quarter',
            data_source: 'Training Reports',
            weight: 15,
            target: '20',
            target_type: 'Number',
            frequency: 'Quarterly',
            current_value: 16,
            status: 'On Track',
            location: 'CHQ',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_db_3',
            role: 'Geodatabase Specialist',
            parameter: 'Business Growth',
            role_kpi: 'Database optimization and performance tuning',
            measurement_metric: 'Query response time improvement',
            data_source: 'Performance Analytics',
            weight: 20,
            target: '30',
            target_type: 'Percentage',
            frequency: 'Monthly',
            current_value: 25,
            status: 'On Track',
            location: 'CHQ',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_db_4',
            role: 'Geodatabase Specialist',
            parameter: 'Operational Process',
            role_kpi: 'Data backup and recovery procedures',
            measurement_metric: 'Successful backup completion rate',
            data_source: 'Backup Monitoring System',
            weight: 20,
            target: '100',
            target_type: 'Percentage',
            frequency: 'Daily',
            current_value: 100,
            status: 'Completed',
            location: 'CHQ',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_db_5',
            role: 'Geodatabase Specialist',
            parameter: 'Customer',
            role_kpi: 'Database user support and issue resolution',
            measurement_metric: 'Average issue resolution time (hours)',
            data_source: 'Help Desk System',
            weight: 20,
            target: '4',
            target_type: 'Number',
            frequency: 'Daily',
            current_value: 3,
            status: 'On Track',
            location: 'CHQ',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        
        // GIS Analyst KPIs
        {
            id: 'kpi_analyst_1',
            role: 'GIS Analyst',
            parameter: 'Operational Process',
            role_kpi: 'Capture and integrate spatial data within 2 business days',
            measurement_metric: 'Data integrated within 2 days / Total data × 100',
            data_source: 'Work Request Tracker',
            weight: 20,
            target: '100',
            target_type: 'Percentage',
            frequency: 'Weekly',
            current_value: 92,
            status: 'On Track',
            location: 'Ikorodu BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_analyst_2',
            role: 'GIS Analyst',
            parameter: 'Operational Process',
            role_kpi: 'Perform quality assurance on incoming GIS data',
            measurement_metric: 'Average of 30 data errors corrected per month',
            data_source: 'Data Quality Reports',
            weight: 15,
            target: '30',
            target_type: 'Number',
            frequency: 'Monthly',
            current_value: 28,
            status: 'On Track',
            location: 'Ikorodu BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_analyst_3',
            role: 'GIS Analyst',
            parameter: 'Business Growth',
            role_kpi: 'Generate accurate spatial analysis reports',
            measurement_metric: 'Reports delivered on time / Total reports × 100',
            data_source: 'Report Tracking System',
            weight: 20,
            target: '95',
            target_type: 'Percentage',
            frequency: 'Monthly',
            current_value: 90,
            status: 'On Track',
            location: 'Ikorodu BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_analyst_4',
            role: 'GIS Analyst',
            parameter: 'Customer',
            role_kpi: 'Support field data collection activities',
            measurement_metric: 'Field data collection completion rate',
            data_source: 'Field Survey Dashboard',
            weight: 20,
            target: '100',
            target_type: 'Percentage',
            frequency: 'Weekly',
            current_value: 95,
            status: 'On Track',
            location: 'Ikorodu BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_analyst_5',
            role: 'GIS Analyst',
            parameter: 'People Development',
            role_kpi: 'Continuous learning and skill development',
            measurement_metric: 'Training courses completed per year',
            data_source: 'Learning Management System',
            weight: 15,
            target: '4',
            target_type: 'Number',
            frequency: 'Annually',
            current_value: 2,
            status: 'In Progress',
            location: 'Ikorodu BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        },
        {
            id: 'kpi_analyst_6',
            role: 'GIS Analyst',
            parameter: 'Operational Process',
            role_kpi: 'Map production and cartographic services',
            measurement_metric: 'Maps produced per month',
            data_source: 'Map Production Log',
            weight: 10,
            target: '15',
            target_type: 'Number',
            frequency: 'Monthly',
            current_value: 12,
            status: 'At Risk',
            location: 'Ikorodu BU',
            start_date: '2025-01-01',
            due_date: '2025-12-31'
        }
    ];
    
    console.log('📊 Generated expanded KPI data:', kpiData.length, 'KPIs');
    console.log('🎭 Roles distribution:', [...new Set(kpiData.map(k => k.role))]);
    console.log('📈 Status distribution:', [...new Set(kpiData.map(k => k.status))]);
    
    return kpiData;
}

// Update Status Dropdown based on filtered data
function updateStatusDropdown(filteredData) {
    const statusDropdown = document.getElementById('statusFilterTracking');
    if (!statusDropdown) return;
    
    const currentValue = statusDropdown.value;
    
    // Get unique statuses from filtered data
    const availableStatuses = [...new Set(filteredData.map(kpi => kpi.status))].filter(s => s);
    
    // Clear and rebuild options with enhanced styling
    statusDropdown.innerHTML = '<option value="" style="background: #0a0a0a; color: white;">All Status</option>';
    
    // Add status count information to options
    availableStatuses.forEach(status => {
        const count = filteredData.filter(kpi => kpi.status === status).length;
        const option = document.createElement('option');
        option.value = status;
        option.textContent = `${status} (${count})`;
        option.style.background = '#0a0a0a';
        option.style.color = 'white';
        statusDropdown.appendChild(option);
    });
    
    // Restore previous value if still valid
    if (availableStatuses.includes(currentValue)) {
        statusDropdown.value = currentValue;
    }
    
    // Show informational message if no statuses available
    if (availableStatuses.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No status data available';
        option.style.background = '#0a0a0a';
        option.style.color = '#666';
        option.disabled = true;
        statusDropdown.appendChild(option);
    }
}

// Reset Tracking Filters
function resetTrackingFilters() {
    document.getElementById('roleFilterTracking').value = '';
    document.getElementById('statusFilterTracking').value = '';
    loadTrackingContent();
}

// Export KPI Data
function exportKpiData() {
    // Implementation for exporting KPI data to CSV/Excel
    showNotification('Export functionality will be implemented', 'info');
}

// Update the existing functions
function editKPI(index) {
    openKpiReportModal();
    // Pre-populate with existing data if needed
}

function viewKPIDetails(index) {
    const kpi = kpiData[index];
    if (!kpi) return;
    
    // Show detailed view (could be a modal or expanded row)
    alert(`KPI Details:\n\nRole: ${kpi.role}\nKPI: ${kpi.kpi}\nTarget: ${kpi.target}\nAchieved: ${kpi.achieved}\nStatus: ${kpi.status}`);
}

// Enhanced display function for tracking table
function displayKpiTrackingTable(data) {
    const content = document.getElementById('kpiTrackingTable');
    
    let html = `
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-300">
                <thead class="text-xs uppercase bg-gradient-to-r from-gray-800 to-gray-700 text-yellow-400">
                    <tr>
                        <th class="px-6 py-4 font-orbitron">Status</th>
                        <th class="px-6 py-4 font-orbitron">Role</th>
                        <th class="px-6 py-4 font-orbitron">KPI Description</th>
                        <th class="px-6 py-4 font-orbitron">Parameter</th>
                        <th class="px-6 py-4 font-orbitron">Target</th>
                        <th class="px-6 py-4 font-orbitron">Current</th>
                        <th class="px-6 py-4 font-orbitron">Progress</th>
                        <th class="px-6 py-4 font-orbitron">Frequency</th>
                        <th class="px-6 py-4 font-orbitron">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-gradient-to-b from-gray-800 to-gray-900">
    `;
    
    data.forEach((kpi, index) => {
        const progress = kpi.current_value && kpi.target ? 
            Math.round((kpi.current_value / parseFloat(kpi.target)) * 100) : 0;
        
        const statusColor = kpi.status === 'Completed' ? 'green' : 
                           kpi.status === 'On Track' ? 'blue' : 
                           kpi.status === 'At Risk' ? 'red' : 'yellow';
        
        html += `
            <tr class="border-b border-gray-700 hover:bg-gray-700 transition-all duration-300">
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <span class="status-indicator status-${statusColor} mr-2"></span>
                        <span class="font-semibold text-${statusColor}-400">${kpi.status || 'Not Started'}</span>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-semibold text-white">${kpi.role}</div>
                    <div class="text-xs text-gray-400">${kpi.location}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="max-w-xs">
                        <div class="font-medium text-white truncate" title="${kpi.role_kpi}">${kpi.role_kpi}</div>
                        <div class="text-xs text-gray-400">${kpi.measurement_metric}</div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        kpi.parameter === 'Business Growth' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                        kpi.parameter === 'People Development' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                        kpi.parameter === 'Operational Process' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                        kpi.parameter === 'Customer' ? 'bg-purple-500 bg-opacity-20 text-purple-400' :
                        'bg-red-500 bg-opacity-20 text-red-400'
                    }">${kpi.parameter}</span>
                </td>
                <td class="px-6 py-4">
                    <div class="font-bold text-white font-orbitron">${kpi.target}</div>
                    <div class="text-xs text-gray-400">${kpi.target_type}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-bold text-yellow-400 font-orbitron">${kpi.current_value || 0}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center space-x-2">
                        <div class="w-20 bg-gray-600 rounded-full h-2">
                            <div class="h-2 rounded-full bg-gradient-to-r ${
                                progress >= 80 ? 'from-green-500 to-green-400' :
                                progress >= 60 ? 'from-yellow-500 to-yellow-400' :
                                'from-red-500 to-red-400'
                            }" style="width: ${Math.min(progress, 100)}%"></div>
                        </div>
                        <span class="text-sm font-orbitron text-white">${progress}%</span>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="text-gray-300">${kpi.frequency}</span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex space-x-2">
                        <button onclick="editKPI(${index})" class="text-blue-400 hover:text-blue-300 transition-colors" title="Update Progress">
                            <i class="fas fa-chart-line text-lg"></i>
                        </button>
                        <button onclick="viewKPIDetails(${index})" class="text-green-400 hover:text-green-300 transition-colors" title="View Details">
                            <i class="fas fa-eye text-lg"></i>
                        </button>
                        <button onclick="viewKpiHistory('${kpi.id}')" class="text-purple-400 hover:text-purple-300 transition-colors" title="View History">
                            <i class="fas fa-history text-lg"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        
        ${data.length === 0 ? `
            <div class="text-center py-12">
                <i class="fas fa-clipboard-list text-6xl text-gray-600 mb-4"></i>
                <p class="text-gray-400 text-lg">No KPIs found matching the current filters</p>
                <button onclick="resetTrackingFilters()" class="mt-4 glow-button">
                    <i class="fas fa-undo mr-2"></i>Reset Filters
                </button>
            </div>
        ` : ''}
    `;
    
    content.innerHTML = html;
}

// View KPI History
async function viewKpiHistory(kpiId) {
    try {
        const response = await fetch(`tables/kpi_tracking?kpi_id=${kpiId}`);
        const data = await response.json();
        const history = data.data || [];
        
        if (history.length === 0) {
            showNotification('No tracking history found for this KPI', 'info');
            return;
        }
        
        // Display history in a modal or separate view
        console.log('KPI History:', history);
        showNotification(`Found ${history.length} tracking records`, 'success');
        
    } catch (error) {
        console.error('Error loading KPI history:', error);
        showNotification('Error loading KPI history', 'error');
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('gisUser');
        window.location.href = 'index.html';
    }
}

// Make functions globally available
window.switchTab = switchTab;
window.logout = logout;
window.editKPI = editKPI;
window.viewKPIDetails = viewKPIDetails;

// Calendar functions
window.toggleCalendar = toggleCalendar;
window.changeMonth = changeMonth;
window.goToToday = goToToday;
window.selectCalendarDate = selectCalendarDate;

// KPI Report functions
window.openKpiReportModal = openKpiReportModal;
window.closeKpiReportModal = closeKpiReportModal;
window.loadRoleKpis = loadRoleKpis;
window.selectKpi = selectKpi;
window.filterKpisByRole = filterKpisByRole;
window.getExpandedKPIData = getExpandedKPIData;
window.resetTrackingFilters = resetTrackingFilters;
window.exportKpiData = exportKpiData;
window.viewKpiHistory = viewKpiHistory;

// 🎛️ Advanced Filter Management
function saveFilterPreset() {
    const filters = {
        role: document.getElementById('roleFilter').value,
        parameter: document.getElementById('parameterFilter').value,
        frequency: document.getElementById('frequencyFilter').value,
        location: document.getElementById('locationFilter').value,
        status: document.getElementById('statusFilter').value,
        timestamp: new Date().toISOString()
    };
    
    const presetName = prompt('Enter a name for this filter preset:');
    if (presetName) {
        const presets = JSON.parse(localStorage.getItem('gis_filter_presets') || '{}');
        presets[presetName] = filters;
        localStorage.setItem('gis_filter_presets', JSON.stringify(presets));
        showNotification(`Filter preset "${presetName}" saved successfully`, 'success');
    }
}

function loadFilterPreset() {
    const presets = JSON.parse(localStorage.getItem('gis_filter_presets') || '{}');
    const presetNames = Object.keys(presets);
    
    if (presetNames.length === 0) {
        showNotification('No filter presets found', 'info');
        return;
    }
    
    const presetName = prompt(`Available presets:\n${presetNames.join('\n')}\n\nEnter preset name to load:`);
    if (presetName && presets[presetName]) {
        const filters = presets[presetName];
        
        document.getElementById('roleFilter').value = filters.role || '';
        document.getElementById('parameterFilter').value = filters.parameter || '';
        document.getElementById('frequencyFilter').value = filters.frequency || '';
        document.getElementById('locationFilter').value = filters.location || '';
        document.getElementById('statusFilter').value = filters.status || '';
        
        applyFilters();
        showNotification(`Filter preset "${presetName}" loaded successfully`, 'success');
    }
}

function resetAllFilters() {
    document.getElementById('roleFilter').value = '';
    document.getElementById('parameterFilter').value = '';
    document.getElementById('frequencyFilter').value = '';
    document.getElementById('locationFilter').value = '';
    document.getElementById('statusFilter').value = '';
    
    applyFilters();
    showNotification('All filters reset', 'info');
}

// Enhanced Apply Filters
function applyFilters() {
    const roleFilter = document.getElementById('roleFilter').value;
    const parameterFilter = document.getElementById('parameterFilter').value;
    const frequencyFilter = document.getElementById('frequencyFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    // Count active filters
    const activeFilters = [roleFilter, parameterFilter, frequencyFilter, locationFilter, statusFilter].filter(f => f).length;
    
    if (activeFilters > 0) {
        showNotification(`${activeFilters} filter(s) applied`, 'info');
    }
    
    // Apply filters to current view
    const activeTab = document.querySelector('.tab-active').id.replace('Tab', '');
    switchTab(activeTab);
}

// Filter functions
window.saveFilterPreset = saveFilterPreset;
window.loadFilterPreset = loadFilterPreset;
window.resetAllFilters = resetAllFilters;

// 👤 Enhanced User Profile Functions
function showUserProfile() {
    if (!currentUser) return;
    
    // Create enhanced user profile modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="glow-modal w-full max-w-md p-6 m-4">
            <div class="text-center mb-6">
                <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl overflow-hidden" style="animation: pulseGlow 2s ease infinite;">
                    ${getUserProfilePhoto() || '<i class="fas fa-user-tie text-white text-3xl"></i>'}
                </div>
                <h3 class="text-2xl font-bold text-white font-orbitron glow-text-blue mb-2">${currentUser.fullname}</h3>
                <p class="text-yellow-400 font-rajdhani text-lg">
                    <i class="fas fa-map-marker-alt mr-2"></i>${currentUser.location}
                </p>
            </div>
            
            <div class="space-y-4">
                <div class="glow-container p-4">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400">Email:</span>
                        <span class="text-white font-semibold">${currentUser.email}</span>
                    </div>
                </div>
                <div class="glow-container p-4">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400">Login Time:</span>
                        <span class="text-white font-semibold">${new Date(currentUser.loginTime).toLocaleString()}</span>
                    </div>
                </div>
                <div class="glow-container p-4">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400">Session Status:</span>
                        <span class="text-green-400 font-semibold">
                            <i class="fas fa-circle mr-1"></i>Active
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="flex space-x-4 mt-6">
                <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-all">
                    <i class="fas fa-times mr-2"></i>Close
                </button>
                <button onclick="editProfile()" class="glow-button flex-1">
                    <i class="fas fa-edit mr-2"></i>Edit Profile
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function editProfile() {
    // Close the current profile modal first
    const existingModal = document.querySelector('.fixed.inset-0');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create enhanced edit profile modal with photo upload
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="glow-modal w-full max-w-lg p-6 m-4 max-h-[90vh] overflow-y-auto">
            <div class="text-center mb-6">
                <h3 class="text-2xl font-bold text-white font-orbitron glow-text-blue mb-4">
                    <i class="fas fa-user-edit mr-2"></i>Edit Profile
                </h3>
                
                <!-- Profile Photo Section -->
                <div class="mb-6">
                    <div class="relative inline-block">
                        <div id="currentProfilePhoto" class="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl overflow-hidden" style="animation: pulseGlow 2s ease infinite;">
                            ${getUserProfilePhoto() || '<i class="fas fa-user-tie text-white text-4xl"></i>'}
                        </div>
                        <button type="button" onclick="triggerPhotoUpload()" class="absolute bottom-2 right-2 w-10 h-10 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all shadow-lg" style="animation: pulseGlow 1.5s ease infinite;">
                            <i class="fas fa-camera text-black text-sm"></i>
                        </button>
                    </div>
                    <input type="file" id="profilePhotoInput" accept="image/*" style="display: none;" onchange="handleProfilePhotoUpload(event)">
                    <p class="text-gray-400 text-sm mt-2">Click the camera icon to upload your profile photo</p>
                </div>
            </div>
            
            <!-- Profile Information Form -->
            <div class="space-y-4">
                <div class="glow-container p-4">
                    <label class="block text-gray-400 text-sm mb-2">Full Name</label>
                    <input type="text" id="editFullName" value="${currentUser.fullname}" 
                           class="glow-input w-full" style="background: #000000 !important; color: white !important;">
                </div>
                
                <div class="glow-container p-4">
                    <label class="block text-gray-400 text-sm mb-2">Email Address</label>
                    <input type="email" id="editEmail" value="${currentUser.email}" 
                           class="glow-input w-full" style="background: #000000 !important; color: white !important;" readonly>
                    <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div class="glow-container p-4">
                    <label class="block text-gray-400 text-sm mb-2">Location</label>
                    <select id="editLocation" class="glow-input w-full" style="background: #000000 !important; color: white !important;">
                        <option value="CHQ" ${currentUser.location === 'CHQ' ? 'selected' : ''}>CHQ</option>
                        <option value="Akowonjo BU" ${currentUser.location === 'Akowonjo BU' ? 'selected' : ''}>Akowonjo BU</option>
                        <option value="Abule Egba BU" ${currentUser.location === 'Abule Egba BU' ? 'selected' : ''}>Abule Egba BU</option>
                        <option value="Ikeja BU" ${currentUser.location === 'Ikeja BU' ? 'selected' : ''}>Ikeja BU</option>
                        <option value="Ikorodu BU" ${currentUser.location === 'Ikorodu BU' ? 'selected' : ''}>Ikorodu BU</option>
                        <option value="Oshodi BU" ${currentUser.location === 'Oshodi BU' ? 'selected' : ''}>Oshodi BU</option>
                        <option value="Shomolu BU" ${currentUser.location === 'Shomolu BU' ? 'selected' : ''}>Shomolu BU</option>
                    </select>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex space-x-4 mt-6">
                <button onclick="cancelEditProfile()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-all">
                    <i class="fas fa-times mr-2"></i>Cancel
                </button>
                <button onclick="saveProfileChanges()" class="glow-button flex-1">
                    <i class="fas fa-save mr-2"></i>Save Changes
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            cancelEditProfile();
        }
    });
}

// 🗺️ Enhanced Map Functions
function toggleMapView(type) {
    const buttons = document.querySelectorAll('[onclick^="toggleMapView"]');
    buttons.forEach(btn => {
        btn.classList.remove('bg-yellow-500', 'bg-blue-500', 'bg-green-500');
        btn.classList.add('bg-gray-600');
    });
    
    event.target.classList.remove('bg-gray-600');
    event.target.classList.add(
        type === 'satellite' ? 'bg-blue-500' : 'bg-green-500'
    );
    
    showNotification(`Switched to ${type} view`, 'info');
}

function refreshMapData() {
    showNotification('Refreshing map data...', 'info');
    
    // Simulate data refresh
    setTimeout(() => {
        showNotification('Map data refreshed successfully', 'success');
        
        // Update statistics with slight variations
        const stats = document.querySelectorAll('.map-stat-card .font-orbitron');
        stats.forEach(stat => {
            const currentValue = parseInt(stat.textContent);
            if (!isNaN(currentValue) && currentValue < 100) {
                const variation = Math.floor(Math.random() * 3) - 1; // -1 to +1
                stat.textContent = Math.max(0, currentValue + variation) + (stat.textContent.includes('%') ? '%' : '');
            }
        });
    }, 1500);
}

// Update map.js to set selected location name
function viewOnGoogleMaps(locationId) {
    const location = locationData.find(l => l.id === locationId);
    if (!location || !location.actualLat || !location.actualLng) {
        showNotification('Please configure address first', 'error');
        return;
    }
    
    // Update selected location name
    const nameElement = document.getElementById('selectedLocationName');
    if (nameElement) {
        nameElement.textContent = location.fullName;
    }
    
    // Show map container
    document.getElementById('locationCardsGrid').style.display = 'none';
    document.getElementById('mapContainer').classList.remove('hidden');
    
    // Initialize Google Map for this location
    initGoogleMapForLocation(location);
}

// 📸 Profile Photo Management Functions
function triggerPhotoUpload() {
    document.getElementById('profilePhotoInput').click();
}

function handleProfilePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size must be less than 5MB', 'error');
        return;
    }
    
    // Read and display the image
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Update the preview in the modal
        const photoContainer = document.getElementById('currentProfilePhoto');
        if (photoContainer) {
            photoContainer.innerHTML = `<img src="${imageData}" alt="Profile Photo" class="w-full h-full object-cover rounded-full">`;
        }
        
        // Store the image data temporarily for saving
        window.tempProfilePhoto = imageData;
        
        showNotification('Photo uploaded successfully! Click "Save Changes" to apply.', 'success');
    };
    
    reader.readAsDataURL(file);
}

function getUserProfilePhoto() {
    const profilePhoto = localStorage.getItem(`profilePhoto_${currentUser.email}`);
    return profilePhoto ? `<img src="${profilePhoto}" alt="Profile Photo" class="w-full h-full object-cover rounded-full">` : null;
}

function saveProfilePhoto(imageData) {
    localStorage.setItem(`profilePhoto_${currentUser.email}`, imageData);
}

function cancelEditProfile() {
    // Remove temporary photo data
    delete window.tempProfilePhoto;
    
    // Close the modal
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
}

function saveProfileChanges() {
    const fullName = document.getElementById('editFullName').value.trim();
    const location = document.getElementById('editLocation').value;
    
    // Validate inputs
    if (!fullName) {
        showNotification('Please enter your full name', 'error');
        return;
    }
    
    // Update user data
    currentUser.fullname = fullName;
    currentUser.location = location;
    
    // Save profile photo if uploaded
    if (window.tempProfilePhoto) {
        saveProfilePhoto(window.tempProfilePhoto);
        delete window.tempProfilePhoto;
    }
    
    // Update BOTH localStorage keys to ensure persistence
    localStorage.setItem('gisUser', JSON.stringify(currentUser));  // This is the key the login system uses
    localStorage.setItem('currentUser', JSON.stringify(currentUser));  // Keep this for compatibility
    
    // Update UI
    updateProfileUI();
    
    // Close modal
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
    
    // Show success message and brief redirect notification
    showNotification('Profile updated successfully!', 'success');
    
    // Optional: Brief redirect to refresh the page and show updated profile
    setTimeout(() => {
        showNotification('Refreshing dashboard...', 'info');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }, 1500);
}

function updateProfileUI() {
    // Update header profile card
    const userName = document.getElementById('userName');
    const userLocation = document.getElementById('userLocation');
    
    if (userName) userName.textContent = currentUser.fullname;
    if (userLocation) userLocation.textContent = currentUser.location;
    
    // Update profile photo in header if exists
    updateHeaderProfilePhoto();
}

function updateHeaderProfilePhoto() {
    const profilePhoto = getUserProfilePhoto();
    const profileCard = document.querySelector('.user-profile-card .w-12.h-12');
    
    if (profileCard && profilePhoto) {
        profileCard.innerHTML = profilePhoto.replace('w-full h-full', 'w-full h-full');
        profileCard.classList.remove('bg-gradient-to-br', 'from-blue-500', 'to-purple-600');
    }
}

// Export new functions
window.showUserProfile = showUserProfile;
window.editProfile = editProfile;
window.toggleMapView = toggleMapView;
window.refreshMapData = refreshMapData;
window.triggerPhotoUpload = triggerPhotoUpload;
window.handleProfilePhotoUpload = handleProfilePhotoUpload;
window.cancelEditProfile = cancelEditProfile;
window.saveProfileChanges = saveProfileChanges;