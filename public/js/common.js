// Common JavaScript functionality

// API base URL
const API_BASE_URL = '/api';

// Common API request function
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Show loading state
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('show');
    }
}

// Hide loading state
function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('show');
    }
}

// Show error message
function showError(message, containerId = null) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-error';
    alertDiv.innerHTML = `
        <span class="alert-symbol">⚠</span>
        ${message}
    `;
    
    if (containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
        }
    } else {
        document.body.insertBefore(alertDiv, document.body.firstChild);
    }
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Show success message
function showSuccess(message, containerId = null) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.innerHTML = `
        <span class="alert-symbol">✓</span>
        ${message}
    `;
    
    if (containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
        }
    } else {
        document.body.insertBefore(alertDiv, document.body.firstChild);
    }
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Format short date
function formatShortDate(dateString) {
    const date = new Date(dateString);
    const options = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Format currency
function formatCurrency(amount) {
    if (amount === 0) return 'Free';
    return `$${parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;
}

// Format large numbers
function formatLargeNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString('en-US');
}

// Get event status text
function getEventStatusText(status) {
    const statusMap = {
        'upcoming': 'Upcoming',
        'ongoing': 'Ongoing',
        'past': 'Past'
    };
    return statusMap[status] || status;
}

// Create event card HTML
function createEventCard(event) {
    const progressPercentage = event.progress_percentage || 0;
    const statusText = getEventStatusText(event.event_status);
    
    return `
        <div class="event-card" onclick="goToEventDetails(${event.id})">
            <div class="event-image">
                <span class="event-icon">♥</span>
                ${event.is_featured ? '<span class="event-featured">Featured</span>' : ''}
                <span class="event-status ${event.event_status}">${statusText}</span>
            </div>
            <div class="event-content">
                <div class="event-category">${event.category_name}</div>
                <h3 class="event-title">${event.name}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-details">
                    <span class="event-date">
                        <span class="event-symbol">📅</span>
                        ${formatShortDate(event.event_date)}
                    </span>
                    <span class="event-location">
                        <span class="event-symbol">📍</span>
                        ${event.location}
                    </span>
                </div>
                <div class="event-progress">
                    <div class="progress-info">
                        <span>Fundraising Progress</span>
                        <span>${progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progressPercentage, 100)}%"></div>
                    </div>
                    <div class="progress-info">
                        <span>${formatCurrency(event.current_amount)}</span>
                        <span>Goal: ${formatCurrency(event.goal_amount)}</span>
                    </div>
                </div>
                <div class="event-organization">
                    <span class="event-symbol">👥</span>
                    ${event.organization_name}
                </div>
                <div class="event-price">
                    Participation Fee: ${formatCurrency(event.ticket_price)}
                </div>
            </div>
        </div>
    `;
}

// Navigate to event details page
function goToEventDetails(eventId) {
    window.location.href = `/event/${eventId}`;
}

// Smooth scroll to specified element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Mobile navigation menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking menu items
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
    
    // Smooth scroll to anchor
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navigation bar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Hide navigation bar when scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Show navigation bar when scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add background blur effect
        if (scrollTop > 50) {
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        } else {
            navbar.style.backdropFilter = 'none';
            navbar.style.backgroundColor = '#ffffff';
        }
        
        lastScrollTop = scrollTop;
    }, 100));
});

// Global error handling
window.addEventListener('error', function(event) {
    console.error('Page error:', event.error);
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise rejection:', event.reason);
    event.preventDefault();
});