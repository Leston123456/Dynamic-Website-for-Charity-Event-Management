// Homepage JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    initializePage();
});

// Initialize page
async function initializePage() {
    try {
        // Load all data in parallel
        await Promise.all([
            loadStatistics(),
            loadOrganizationInfo(),
            loadFeaturedEvents(),
            loadAllEvents()
        ]);
    } catch (error) {
        console.error('Page initialization failed:', error);
        showError('Page loading failed, please refresh and try again');
    }
}

// Load statistics
async function loadStatistics() {
    try {
        const response = await apiRequest('/organizations/statistics');
        if (response.success) {
            updateStatistics(response.data);
        }
    } catch (error) {
        console.error('Failed to load statistics:', error);
        // Set default values
        updateStatistics({
            totalEvents: 0,
            totalFunds: 0,
            totalParticipants: 0
        });
    }
}

// Update statistics display
function updateStatistics(stats) {
    const elements = {
        'total-events': stats.totalEvents,
        'total-funds': formatCurrency(stats.totalFunds),
        'total-participants': formatLargeNumber(stats.totalParticipants)
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            // Number animation effect
            if (typeof value === 'number') {
                animateNumber(element, 0, value, 2000);
            } else {
                element.textContent = value;
            }
        }
    });
}

// Number animation effect
function animateNumber(element, start, end, duration) {
    if (start === end) {
        element.textContent = end;
        return;
    }
    
    const range = end - start;
    const minTimer = 50;
    const stepTime = Math.abs(Math.floor(duration / range));
    const timer = Math.max(stepTime, minTimer);
    
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    
    function run() {
        const now = new Date().getTime();
        const remaining = Math.max((endTime - now) / duration, 0);
        const value = Math.round(end - (remaining * range));
        
        element.textContent = formatLargeNumber(value);
        
        if (value === end) {
            clearInterval(timer);
        }
    }
    
    const timer = setInterval(run, stepTime);
    run();
}

// Load organization info
async function loadOrganizationInfo() {
    try {
        const response = await apiRequest('/organizations/info');
        if (response.success) {
            updateOrganizationInfo(response.data);
        }
    } catch (error) {
        console.error('Failed to load organization info:', error);
        // Set default organization info
        updateOrganizationInfo({
            name: 'Charity Event Management System',
            description: 'We are committed to providing professional management platforms for various charity events, connecting caring people with those in need.',
            email: 'info@charity.org',
            phone: '1800-CHARITY',
            address: 'Sydney, Australia'
        });
    }
}

// Update organization info display
function updateOrganizationInfo(info) {
    const organizationInfoElement = document.getElementById('organization-info');
    if (organizationInfoElement) {
        organizationInfoElement.innerHTML = `
            <p>${info.description}</p>
            ${info.website ? `<p><strong>Website:</strong> <a href="${info.website}" target="_blank">${info.website}</a></p>` : ''}
        `;
    }
    
    // Update contact info
    const contactDetailsElement = document.getElementById('contact-details');
    if (contactDetailsElement) {
        contactDetailsElement.innerHTML = `
            <div class="contact-item">
                <span class="contact-symbol">@</span>
                <span>${info.email}</span>
            </div>
            <div class="contact-item">
                <span class="contact-symbol">☎</span>
                <span>${info.phone}</span>
            </div>
            <div class="contact-item">
                <span class="contact-symbol">📍</span>
                <span>${info.address}</span>
            </div>
        `;
    }
}

// Load featured events
async function loadFeaturedEvents() {
    try {
        const response = await apiRequest('/events/featured');
        if (response.success) {
            displayFeaturedEvents(response.data);
        }
    } catch (error) {
        console.error('Failed to load featured events:', error);
        displayError('featured-events-grid', 'Failed to load featured events');
    }
}

// Display featured events
function displayFeaturedEvents(events) {
    const container = document.getElementById('featured-events-grid');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <span class="no-events-icon">ℹ</span>
                <p>No featured events available</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = events.map(event => createEventCard(event)).join('');
}

// Load all events
async function loadAllEvents() {
    const container = document.getElementById('all-events-grid');
    if (!container) return;
    
    showLoading('loading');
    
    try {
        const response = await apiRequest('/events');
        if (response.success) {
            displayAllEvents(response.data);
        }
    } catch (error) {
        console.error('Failed to load all events:', error);
        displayError('all-events-grid', 'Failed to load events');
    } finally {
        hideLoading('loading');
    }
}

// Display all events
function displayAllEvents(events) {
    const container = document.getElementById('all-events-grid');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <span class="no-events-icon">ℹ</span>
                <p>No events available</p>
            </div>
        `;
        return;
    }
    
    // Filter out featured events (avoid duplicate display)
    const nonFeaturedEvents = events.filter(event => !event.is_featured);
    
    if (nonFeaturedEvents.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <span class="no-events-icon">ℹ</span>
                <p>No other events available</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = nonFeaturedEvents.map(event => createEventCard(event)).join('');
}

// Display error message
function displayError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <span class="error-icon">⚠</span>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Reload</button>
            </div>
        `;
    }
}

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

// Handle contact form submission
async function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Validate form data
    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
        showError('Please fill in all required fields');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Simulate form submission (in real project should send to server)
    try {
        // Add actual API call here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        showSuccess('Message sent successfully! We will get back to you soon.');
        event.target.reset();
    } catch (error) {
        showError('Failed to send message, please try again later');
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Page scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that need animation
    document.querySelectorAll('.stat-item, .event-card, .feature').forEach(el => {
        observer.observe(el);
    });
}

// Set up scroll animations after page loads
document.addEventListener('DOMContentLoaded', function() {
    // Delay setting up animations to ensure content is loaded
    setTimeout(setupScrollAnimations, 1000);
});

// Search function shortcut keys
document.addEventListener('keydown', function(event) {
    // Ctrl+K to quickly navigate to search page
    if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        window.location.href = '/search';
    }
});