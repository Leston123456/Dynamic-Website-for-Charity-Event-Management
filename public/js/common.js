// 通用JavaScript功能

// API基础URL
const API_BASE_URL = '/api';

// 通用API请求函数
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
        console.error('API请求错误:', error);
        throw error;
    }
}

// 显示加载状态
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('show');
    }
}

// 隐藏加载状态
function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('show');
    }
}

// 显示错误消息
function showError(message, containerId = null) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-error';
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
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
    
    // 3秒后自动隐藏
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// 显示成功消息
function showSuccess(message, containerId = null) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
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
    
    // 3秒后自动隐藏
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('zh-CN', options);
}

// 格式化简短日期
function formatShortDate(dateString) {
    const date = new Date(dateString);
    const options = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('zh-CN', options);
}

// 格式化金额
function formatCurrency(amount) {
    if (amount === 0) return '免费';
    return `¥${parseFloat(amount).toLocaleString('zh-CN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;
}

// 格式化大数字
function formatLargeNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString('zh-CN');
}

// 获取事件状态文本
function getEventStatusText(status) {
    const statusMap = {
        'upcoming': '即将开始',
        'ongoing': '进行中',
        'past': '已结束'
    };
    return statusMap[status] || status;
}

// 创建活动卡片HTML
function createEventCard(event) {
    const progressPercentage = event.progress_percentage || 0;
    const statusText = getEventStatusText(event.event_status);
    
    return `
        <div class="event-card" onclick="goToEventDetails(${event.id})">
            <div class="event-image">
                <i class="fas fa-heart"></i>
                ${event.is_featured ? '<span class="event-featured">精选</span>' : ''}
                <span class="event-status ${event.event_status}">${statusText}</span>
            </div>
            <div class="event-content">
                <div class="event-category">${event.category_name}</div>
                <h3 class="event-title">${event.name}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-details">
                    <span class="event-date">
                        <i class="fas fa-calendar"></i>
                        ${formatShortDate(event.event_date)}
                    </span>
                    <span class="event-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${event.location}
                    </span>
                </div>
                <div class="event-progress">
                    <div class="progress-info">
                        <span>筹款进度</span>
                        <span>${progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(progressPercentage, 100)}%"></div>
                    </div>
                    <div class="progress-info">
                        <span>${formatCurrency(event.current_amount)}</span>
                        <span>目标: ${formatCurrency(event.goal_amount)}</span>
                    </div>
                </div>
                <div class="event-organization">
                    <i class="fas fa-users"></i>
                    ${event.organization_name}
                </div>
                <div class="event-price">
                    参与费用: ${formatCurrency(event.ticket_price)}
                </div>
            </div>
        </div>
    `;
}

// 跳转到活动详情页面
function goToEventDetails(eventId) {
    window.location.href = `/event/${eventId}`;
}

// 平滑滚动到指定元素
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 防抖函数
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

// 节流函数
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

// 移动端导航菜单切换
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 点击菜单项时关闭移动菜单
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
    
    // 平滑滚动到锚点
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
    
    // 导航栏滚动效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动时隐藏导航栏
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动时显示导航栏
            navbar.style.transform = 'translateY(0)';
        }
        
        // 添加背景模糊效果
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

// 全局错误处理
window.addEventListener('error', function(event) {
    console.error('页面错误:', event.error);
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('未处理的Promise拒绝:', event.reason);
    event.preventDefault();
});
