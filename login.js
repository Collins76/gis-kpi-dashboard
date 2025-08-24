// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    // Check if user is already logged in
    const currentUser = localStorage.getItem('gisUser');
    if (currentUser) {
        // Redirect to dashboard if already logged in
        window.location.href = 'dashboard.html';
    }

    // Handle login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const fullname = document.getElementById('fullname').value;
        const location = document.getElementById('location').value;

        // Validate Gmail account
        if (!email.endsWith('@gmail.com')) {
            showNotification('Please use a valid Gmail account', 'error');
            return;
        }

        // Create user object
        const user = {
            email: email,
            fullname: fullname,
            location: location,
            loginTime: new Date().toISOString(),
            sessionId: generateSessionId()
        };

        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalContent = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
        submitButton.disabled = true;

        // Simulate authentication process
        setTimeout(async () => {
            try {
                // Save user to localStorage
                localStorage.setItem('gisUser', JSON.stringify(user));

                // Send notification to admin (simulated)
                await sendAdminNotification(user);

                // Show success message
                showNotification('Login successful! Redirecting...', 'success');

                // Redirect to dashboard after short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);

            } catch (error) {
                console.error('Login error:', error);
                showNotification('Login failed. Please try again.', 'error');
                
                // Reset button
                submitButton.innerHTML = originalContent;
                submitButton.disabled = false;
            }
        }, 1500);
    });
});

// Generate unique session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Send notification to admin (simulated)
async function sendAdminNotification(user) {
    // In a real application, this would send an email to gis.team015@gmail.com
    // For now, we'll log the notification
    const notification = {
        to: 'gis.team015@gmail.com',
        subject: 'New GIS Dashboard Login',
        body: `
            User Login Notification:
            - Name: ${user.fullname}
            - Email: ${user.email}
            - Location: ${user.location}
            - Login Time: ${new Date(user.loginTime).toLocaleString()}
            - Session ID: ${user.sessionId}
        `
    };
    
    console.log('Admin notification:', notification);
    
    // Store notification in localStorage for demo purposes
    const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    
    return Promise.resolve();
}

// Show notification toast
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(n => n.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all transform translate-x-0 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Email validation
document.getElementById('email')?.addEventListener('input', function(e) {
    const email = e.target.value;
    const emailError = document.getElementById('emailError');
    
    if (email && !email.endsWith('@gmail.com')) {
        e.target.classList.add('border-red-500');
        if (!emailError) {
            const error = document.createElement('p');
            error.id = 'emailError';
            error.className = 'text-red-400 text-xs mt-1';
            error.textContent = 'Please enter a valid Gmail address';
            e.target.parentElement.appendChild(error);
        }
    } else {
        e.target.classList.remove('border-red-500');
        if (emailError) {
            emailError.remove();
        }
    }
});