// 首页JavaScript功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initializePage();
});

// 初始化页面
async function initializePage() {
    try {
        // 并行加载所有数据
        await Promise.all([
            loadStatistics(),
            loadOrganizationInfo(),
            loadFeaturedEvents(),
            loadAllEvents()
        ]);
    } catch (error) {
        console.error('页面初始化失败:', error);
        showError('页面加载失败，请刷新页面重试');
    }
}

// 加载统计信息
async function loadStatistics() {
    try {
        const response = await apiRequest('/organizations/statistics');
        if (response.success) {
            updateStatistics(response.data);
        }
    } catch (error) {
        console.error('加载统计信息失败:', error);
        // 设置默认值
        updateStatistics({
            totalEvents: 0,
            totalFunds: 0,
            totalParticipants: 0
        });
    }
}

// 更新统计信息显示
function updateStatistics(stats) {
    const elements = {
        'total-events': stats.totalEvents,
        'total-funds': formatCurrency(stats.totalFunds),
        'total-participants': formatLargeNumber(stats.totalParticipants)
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            // 数字动画效果
            if (typeof value === 'number') {
                animateNumber(element, 0, value, 2000);
            } else {
                element.textContent = value;
            }
        }
    });
}

// 数字动画效果
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

// 加载组织信息
async function loadOrganizationInfo() {
    try {
        const response = await apiRequest('/organizations/info');
        if (response.success) {
            updateOrganizationInfo(response.data);
        }
    } catch (error) {
        console.error('加载组织信息失败:', error);
        // 设置默认组织信息
        updateOrganizationInfo({
            name: '慈善活动管理系统',
            description: '我们致力于为各种慈善活动提供专业的管理平台，连接善心人士与需要帮助的人群。',
            email: 'info@charity.org',
            phone: '1800-CHARITY',
            address: '澳大利亚悉尼市'
        });
    }
}

// 更新组织信息显示
function updateOrganizationInfo(info) {
    const organizationInfoElement = document.getElementById('organization-info');
    if (organizationInfoElement) {
        organizationInfoElement.innerHTML = `
            <p>${info.description}</p>
            ${info.website ? `<p><strong>网站:</strong> <a href="${info.website}" target="_blank">${info.website}</a></p>` : ''}
        `;
    }
    
    // 更新联系信息
    const contactDetailsElement = document.getElementById('contact-details');
    if (contactDetailsElement) {
        contactDetailsElement.innerHTML = `
            <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <span>${info.email}</span>
            </div>
            <div class="contact-item">
                <i class="fas fa-phone"></i>
                <span>${info.phone}</span>
            </div>
            <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${info.address}</span>
            </div>
        `;
    }
}

// 加载精选活动
async function loadFeaturedEvents() {
    try {
        const response = await apiRequest('/events/featured');
        if (response.success) {
            displayFeaturedEvents(response.data);
        }
    } catch (error) {
        console.error('加载精选活动失败:', error);
        displayError('featured-events-grid', '加载精选活动失败');
    }
}

// 显示精选活动
function displayFeaturedEvents(events) {
    const container = document.getElementById('featured-events-grid');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <i class="fas fa-info-circle"></i>
                <p>暂无精选活动</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = events.map(event => createEventCard(event)).join('');
}

// 加载所有活动
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
        console.error('加载所有活动失败:', error);
        displayError('all-events-grid', '加载活动失败');
    } finally {
        hideLoading('loading');
    }
}

// 显示所有活动
function displayAllEvents(events) {
    const container = document.getElementById('all-events-grid');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <i class="fas fa-info-circle"></i>
                <p>暂无活动</p>
            </div>
        `;
        return;
    }
    
    // 过滤掉精选活动（避免重复显示）
    const nonFeaturedEvents = events.filter(event => !event.is_featured);
    
    if (nonFeaturedEvents.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <i class="fas fa-info-circle"></i>
                <p>暂无其他活动</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = nonFeaturedEvents.map(event => createEventCard(event)).join('');
}

// 显示错误信息
function displayError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">重新加载</button>
            </div>
        `;
    }
}

// 联系表单处理
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

// 处理联系表单提交
async function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // 验证表单数据
    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
        showError('请填写所有必填字段');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showError('请输入有效的邮箱地址');
        return;
    }
    
    // 模拟表单提交（实际项目中应该发送到服务器）
    try {
        // 这里可以添加实际的API调用
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
        
        showSuccess('消息发送成功！我们会尽快回复您。');
        event.target.reset();
    } catch (error) {
        showError('发送失败，请稍后重试');
    }
}

// 验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 页面滚动动画
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
    
    // 观察需要动画的元素
    document.querySelectorAll('.stat-item, .event-card, .feature').forEach(el => {
        observer.observe(el);
    });
}

// 在页面加载完成后设置滚动动画
document.addEventListener('DOMContentLoaded', function() {
    // 延迟设置动画，确保内容已加载
    setTimeout(setupScrollAnimations, 1000);
});

// 搜索功能快捷键
document.addEventListener('keydown', function(event) {
    // Ctrl+K 快速跳转到搜索页面
    if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        window.location.href = '/search';
    }
});
