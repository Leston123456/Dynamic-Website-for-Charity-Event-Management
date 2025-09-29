// 活动详情页面JavaScript功能

let currentEvent = null;
let eventId = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeEventDetailsPage();
});

// 初始化活动详情页面
function initializeEventDetailsPage() {
    // 从URL获取活动ID
    eventId = getEventIdFromURL();
    
    if (!eventId) {
        showError('无效的活动ID');
        return;
    }
    
    // 加载活动详情
    loadEventDetails(eventId);
    
    // 设置事件监听器
    setupEventListeners();
}

// 从URL获取活动ID
function getEventIdFromURL() {
    const path = window.location.pathname;
    const match = path.match(/\/event\/(\d+)/);
    return match ? parseInt(match[1]) : null;
}

// 加载活动详情
async function loadEventDetails(id) {
    try {
        showLoading();
        const response = await apiRequest(`/events/${id}`);
        
        if (response.success) {
            currentEvent = response.data;
            displayEventDetails(currentEvent);
            loadRelatedEvents();
        } else {
            showError(response.message || '活动不存在');
        }
    } catch (error) {
        console.error('加载活动详情失败:', error);
        showError('加载活动详情失败，请稍后重试');
    }
}

// 显示活动详情
function displayEventDetails(event) {
    hideLoading();
    showContent();
    
    // 更新页面标题
    document.title = `${event.name} - 慈善活动管理系统`;
    
    // 更新面包屑
    updateBreadcrumb(event.name);
    
    // 更新活动状态徽章
    updateEventBadges(event);
    
    // 更新基本信息
    updateBasicInfo(event);
    
    // 更新活动内容
    updateEventContent(event);
    
    // 更新侧边栏
    updateSidebar(event);
    
    // 更新组织信息
    updateOrganizationInfo(event);
}

// 更新面包屑
function updateBreadcrumb(eventName) {
    const breadcrumbElement = document.getElementById('breadcrumb-event-name');
    if (breadcrumbElement) {
        breadcrumbElement.textContent = eventName.length > 30 ? 
            eventName.substring(0, 30) + '...' : eventName;
    }
}

// 更新活动徽章
function updateEventBadges(event) {
    const statusBadge = document.getElementById('event-status-badge');
    const featuredBadge = document.getElementById('event-featured-badge');
    
    if (statusBadge) {
        statusBadge.textContent = getEventStatusText(event.event_status);
        statusBadge.className = `event-status ${event.event_status}`;
    }
    
    if (featuredBadge && event.is_featured) {
        featuredBadge.style.display = 'block';
    }
}

// 更新基本信息
function updateBasicInfo(event) {
    const elements = {
        'event-category': event.category_name,
        'event-title': event.name,
        'event-organization': event.organization_name,
        'event-date': formatDate(event.event_date),
        'event-location': event.location,
        'event-price': formatCurrency(event.ticket_price)
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// 更新活动内容
function updateEventContent(event) {
    // 活动描述
    const descriptionElement = document.getElementById('event-description');
    if (descriptionElement) {
        // 将换行符转换为段落
        const paragraphs = event.full_description.split('\n\n');
        descriptionElement.innerHTML = paragraphs
            .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
            .join('');
    }
    
    // 活动地址
    const addressElement = document.getElementById('event-address');
    const addressSection = document.getElementById('event-address-section');
    if (addressElement && event.address) {
        addressElement.textContent = event.address;
    } else if (addressSection && !event.address) {
        addressSection.style.display = 'none';
    }
}

// 更新侧边栏
function updateSidebar(event) {
    // 筹款进度
    updateFundraisingProgress(event);
    
    // 参与信息
    updateParticipationInfo(event);
    
    // 时间信息
    updateTimeInfo(event);
    
    // 注册信息
    updateRegistrationInfo(event);
}

// 更新筹款进度
function updateFundraisingProgress(event) {
    const currentAmount = parseFloat(event.current_amount) || 0;
    const goalAmount = parseFloat(event.goal_amount) || 0;
    const percentage = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
    
    document.getElementById('current-amount').textContent = formatCurrency(currentAmount);
    document.getElementById('goal-amount').textContent = formatCurrency(goalAmount);
    document.getElementById('progress-percentage').textContent = `${percentage.toFixed(1)}%`;
    
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${Math.min(percentage, 100)}%`;
    }
}

// 更新参与信息
function updateParticipationInfo(event) {
    const currentParticipants = parseInt(event.current_participants) || 0;
    const maxParticipants = parseInt(event.max_participants) || 0;
    
    document.getElementById('current-participants').textContent = currentParticipants;
    
    const maxParticipantsStat = document.getElementById('max-participants-stat');
    const maxParticipantsElement = document.getElementById('max-participants');
    
    if (maxParticipants > 0) {
        maxParticipantsElement.textContent = maxParticipants;
    } else {
        maxParticipantsStat.style.display = 'none';
    }
}

// 更新时间信息
function updateTimeInfo(event) {
    document.getElementById('start-time').textContent = formatDate(event.event_date);
    
    const endTimeItem = document.getElementById('end-time-item');
    const endTimeElement = document.getElementById('end-time');
    if (event.end_date) {
        endTimeElement.textContent = formatDate(event.end_date);
    } else {
        endTimeItem.style.display = 'none';
    }
    
    const deadlineItem = document.getElementById('deadline-item');
    const deadlineElement = document.getElementById('registration-deadline');
    if (event.registration_deadline) {
        deadlineElement.textContent = formatDate(event.registration_deadline);
    } else {
        deadlineItem.style.display = 'none';
    }
}

// 更新注册信息
function updateRegistrationInfo(event) {
    document.getElementById('participation-price').textContent = formatCurrency(event.ticket_price);
    
    const registerBtn = document.getElementById('register-btn');
    const now = new Date();
    const eventDate = new Date(event.event_date);
    const deadline = event.registration_deadline ? new Date(event.registration_deadline) : null;
    
    // 检查是否可以注册
    let canRegister = true;
    let buttonText = '立即参与';
    
    if (event.event_status === 'past') {
        canRegister = false;
        buttonText = '活动已结束';
    } else if (deadline && now > deadline) {
        canRegister = false;
        buttonText = '报名已截止';
    } else if (event.max_participants && event.current_participants >= event.max_participants) {
        canRegister = false;
        buttonText = '人数已满';
    }
    
    if (registerBtn) {
        registerBtn.textContent = buttonText;
        registerBtn.disabled = !canRegister;
        
        if (!canRegister) {
            registerBtn.classList.add('disabled');
            registerBtn.style.backgroundColor = var('--gray-color');
        }
    }
}

// 更新组织信息
function updateOrganizationInfo(event) {
    const organizationInfo = document.getElementById('organization-info');
    if (!organizationInfo) return;
    
    let infoHTML = `
        <div class="org-detail">
            <i class="fas fa-building"></i>
            <span>${event.organization_name}</span>
        </div>
    `;
    
    if (event.organization_description) {
        infoHTML += `
            <div class="org-detail">
                <i class="fas fa-info-circle"></i>
                <span>${event.organization_description}</span>
            </div>
        `;
    }
    
    if (event.organization_email) {
        infoHTML += `
            <div class="org-detail">
                <i class="fas fa-envelope"></i>
                <a href="mailto:${event.organization_email}">${event.organization_email}</a>
            </div>
        `;
    }
    
    if (event.organization_phone) {
        infoHTML += `
            <div class="org-detail">
                <i class="fas fa-phone"></i>
                <a href="tel:${event.organization_phone}">${event.organization_phone}</a>
            </div>
        `;
    }
    
    if (event.organization_website) {
        infoHTML += `
            <div class="org-detail">
                <i class="fas fa-globe"></i>
                <a href="${event.organization_website}" target="_blank">${event.organization_website}</a>
            </div>
        `;
    }
    
    organizationInfo.innerHTML = infoHTML;
}

// 加载相关活动
async function loadRelatedEvents() {
    if (!currentEvent) return;
    
    try {
        // 根据分类或地点获取相关活动
        const params = new URLSearchParams();
        if (currentEvent.category_id) {
            params.append('categoryId', currentEvent.category_id);
        }
        
        const response = await apiRequest(`/events/search?${params.toString()}`);
        
        if (response.success && response.data.length > 1) {
            // 过滤掉当前活动并限制数量
            const relatedEvents = response.data
                .filter(event => event.id !== currentEvent.id)
                .slice(0, 3);
            
            if (relatedEvents.length > 0) {
                displayRelatedEvents(relatedEvents);
            }
        }
    } catch (error) {
        console.error('加载相关活动失败:', error);
    }
}

// 显示相关活动
function displayRelatedEvents(events) {
    const relatedEventsSection = document.getElementById('related-events');
    const relatedEventsGrid = document.getElementById('related-events-grid');
    
    if (relatedEventsSection && relatedEventsGrid) {
        relatedEventsGrid.innerHTML = events.map(event => createEventCard(event)).join('');
        relatedEventsSection.style.display = 'block';
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 注册按钮
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', openRegistrationModal);
    }
    
    // 模态框关闭
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

// 显示加载状态
function showLoading() {
    document.getElementById('loading-container').style.display = 'flex';
    document.getElementById('error-container').style.display = 'none';
    document.getElementById('event-details-content').style.display = 'none';
}

// 隐藏加载状态
function hideLoading() {
    document.getElementById('loading-container').style.display = 'none';
}

// 显示内容
function showContent() {
    document.getElementById('event-details-content').style.display = 'block';
}

// 显示错误
function showError(message) {
    hideLoading();
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-container').style.display = 'flex';
    document.getElementById('event-details-content').style.display = 'none';
}

// 重新加载
function retryLoad() {
    if (eventId) {
        loadEventDetails(eventId);
    }
}

// 返回上一页
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/';
    }
}

// 打开地图
function openMap() {
    if (currentEvent && currentEvent.address) {
        const query = encodeURIComponent(`${currentEvent.address}, ${currentEvent.location}`);
        const mapUrl = `https://www.google.com/maps/search/${query}`;
        window.open(mapUrl, '_blank');
    }
}

// 打开注册模态框
function openRegistrationModal() {
    const modal = document.getElementById('registration-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('registration-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// 分享活动
function shareEvent(platform) {
    if (!currentEvent) return;
    
    const url = window.location.href;
    const title = `${currentEvent.name} - 慈善活动`;
    const description = currentEvent.description;
    
    let shareUrl;
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        default:
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// 复制链接
function copyLink() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showSuccess('链接已复制到剪贴板');
        }).catch(() => {
            fallbackCopyTextToClipboard(url);
        });
    } else {
        fallbackCopyTextToClipboard(url);
    }
}

// 备用复制方法
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showSuccess('链接已复制到剪贴板');
    } catch (err) {
        console.error('复制失败:', err);
        showError('复制失败，请手动复制链接');
    }
    
    document.body.removeChild(textArea);
}

// 页面离开前的清理
window.addEventListener('beforeunload', function() {
    // 清理定时器或其他资源
    document.body.style.overflow = 'auto';
});

// 处理浏览器返回按钮
window.addEventListener('popstate', function(event) {
    // 如果有模态框打开，先关闭模态框
    const modal = document.getElementById('registration-modal');
    if (modal && modal.classList.contains('show')) {
        closeModal();
        event.preventDefault();
    }
});
