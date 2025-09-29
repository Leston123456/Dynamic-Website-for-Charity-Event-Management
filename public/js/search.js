// 搜索页面JavaScript功能

let currentSearchResults = [];
let allCategories = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeSearchPage();
});

// 初始化搜索页面
async function initializeSearchPage() {
    try {
        await loadCategories();
        setupEventListeners();
        
        // 检查URL参数是否有预设搜索条件
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.toString()) {
            setFiltersFromURL(urlParams);
            performSearch();
        }
    } catch (error) {
        console.error('搜索页面初始化失败:', error);
        showError('页面初始化失败，请刷新页面重试');
    }
}

// 加载活动分类
async function loadCategories() {
    try {
        const response = await apiRequest('/categories');
        if (response.success) {
            allCategories = response.data;
            populateCategorySelect(allCategories);
        }
    } catch (error) {
        console.error('加载分类失败:', error);
        // 设置默认分类
        populateCategorySelect([
            { id: 1, name: '慈善晚宴' },
            { id: 2, name: '义跑活动' },
            { id: 3, name: '静默拍卖' },
            { id: 4, name: '音乐会' },
            { id: 5, name: '义卖活动' }
        ]);
    }
}

// 填充分类选择框
function populateCategorySelect(categories) {
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        // 保留"所有分类"选项
        categorySelect.innerHTML = '<option value="">所有分类</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }
}

// 设置事件监听器
function setupEventListeners() {
    const searchForm = document.getElementById('search-form');
    const clearButton = document.getElementById('clear-filters');
    const sortBy = document.getElementById('sort-by');
    const sortOrder = document.getElementById('sort-order');
    
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearchSubmit);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearAllFilters);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', applySorting);
    }
    
    if (sortOrder) {
        sortOrder.addEventListener('change', applySorting);
    }
    
    // 实时搜索（防抖）
    const locationInput = document.getElementById('location');
    if (locationInput) {
        locationInput.addEventListener('input', debounce(function() {
            if (currentSearchResults.length > 0) {
                performSearch();
            }
        }, 500));
    }
}

// 处理搜索表单提交
function handleSearchSubmit(event) {
    event.preventDefault();
    performSearch();
}

// 执行搜索
async function performSearch() {
    const formData = getSearchFormData();
    const resultsContainer = document.getElementById('search-results');
    const loadingElement = document.getElementById('search-loading');
    const noResultsElement = document.getElementById('no-results');
    const sortOptions = document.getElementById('sort-options');
    
    // 显示加载状态
    showLoading('search-loading');
    hideElement(noResultsElement);
    hideElement(sortOptions);
    resultsContainer.innerHTML = '';
    
    try {
        const response = await apiRequest(`/events/search?${buildSearchQuery(formData)}`);
        
        if (response.success) {
            currentSearchResults = response.data;
            displaySearchResults(currentSearchResults);
            updateResultsInfo(currentSearchResults.length, formData);
            showActiveFilters(formData);
            
            if (currentSearchResults.length > 0) {
                showElement(sortOptions);
            } else {
                showElement(noResultsElement);
            }
        }
    } catch (error) {
        console.error('搜索失败:', error);
        displaySearchError('搜索失败，请稍后重试');
    } finally {
        hideLoading('search-loading');
    }
}

// 获取搜索表单数据
function getSearchFormData() {
    return {
        startDate: document.getElementById('start-date').value,
        endDate: document.getElementById('end-date').value,
        location: document.getElementById('location').value.trim(),
        categoryId: document.getElementById('category').value
    };
}

// 构建搜索查询字符串
function buildSearchQuery(data) {
    const params = new URLSearchParams();
    
    Object.entries(data).forEach(([key, value]) => {
        if (value) {
            params.append(key, value);
        }
    });
    
    return params.toString();
}

// 显示搜索结果
function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    
    if (results.length === 0) {
        return;
    }
    
    // 创建结果统计
    const statsHtml = createResultsStats(results);
    
    // 创建结果网格
    const resultsHtml = `
        ${statsHtml}
        <div class="results-grid">
            ${results.map(event => createEventCard(event)).join('')}
        </div>
    `;
    
    container.innerHTML = resultsHtml;
}

// 创建结果统计
function createResultsStats(results) {
    const totalEvents = results.length;
    const totalFunds = results.reduce((sum, event) => sum + parseFloat(event.current_amount), 0);
    const avgProgress = results.reduce((sum, event) => sum + parseFloat(event.progress_percentage || 0), 0) / totalEvents;
    const freeEvents = results.filter(event => parseFloat(event.ticket_price) === 0).length;
    
    return `
        <div class="results-stats">
            <h4>搜索统计</h4>
            <div class="stats-grid">
                <div class="stat-item">
                    <h4>${totalEvents}</h4>
                    <p>找到活动</p>
                </div>
                <div class="stat-item">
                    <h4>${formatCurrency(totalFunds)}</h4>
                    <p>已筹资金</p>
                </div>
                <div class="stat-item">
                    <h4>${avgProgress.toFixed(1)}%</h4>
                    <p>平均进度</p>
                </div>
                <div class="stat-item">
                    <h4>${freeEvents}</h4>
                    <p>免费活动</p>
                </div>
            </div>
        </div>
    `;
}

// 更新结果信息
function updateResultsInfo(count, filters) {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        let message = `找到 ${count} 个活动`;
        
        const activeFilters = [];
        if (filters.startDate || filters.endDate) {
            if (filters.startDate && filters.endDate) {
                activeFilters.push(`日期: ${filters.startDate} 至 ${filters.endDate}`);
            } else if (filters.startDate) {
                activeFilters.push(`开始日期: ${filters.startDate}`);
            } else {
                activeFilters.push(`结束日期: ${filters.endDate}`);
            }
        }
        
        if (filters.location) {
            activeFilters.push(`地点: ${filters.location}`);
        }
        
        if (filters.categoryId) {
            const category = allCategories.find(c => c.id == filters.categoryId);
            if (category) {
                activeFilters.push(`分类: ${category.name}`);
            }
        }
        
        if (activeFilters.length > 0) {
            message += ` (${activeFilters.join(', ')})`;
        }
        
        resultsCount.textContent = message;
    }
}

// 显示活跃筛选器
function showActiveFilters(filters) {
    const activeFilters = [];
    
    if (filters.startDate) {
        activeFilters.push({
            type: 'startDate',
            label: `开始日期: ${formatDate(filters.startDate)}`,
            value: filters.startDate
        });
    }
    
    if (filters.endDate) {
        activeFilters.push({
            type: 'endDate',
            label: `结束日期: ${formatDate(filters.endDate)}`,
            value: filters.endDate
        });
    }
    
    if (filters.location) {
        activeFilters.push({
            type: 'location',
            label: `地点: ${filters.location}`,
            value: filters.location
        });
    }
    
    if (filters.categoryId) {
        const category = allCategories.find(c => c.id == filters.categoryId);
        if (category) {
            activeFilters.push({
                type: 'categoryId',
                label: `分类: ${category.name}`,
                value: filters.categoryId
            });
        }
    }
    
    if (activeFilters.length > 0) {
        const filtersHtml = `
            <div class="active-filters">
                <h4>当前筛选条件:</h4>
                <div class="filter-tags">
                    ${activeFilters.map(filter => `
                        <span class="filter-tag">
                            ${filter.label}
                            <button class="remove-filter" onclick="removeFilter('${filter.type}')" title="移除筛选条件">
                                <i class="fas fa-times"></i>
                            </button>
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
        
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.insertAdjacentHTML('afterbegin', filtersHtml);
    }
}

// 移除特定筛选条件
function removeFilter(filterType) {
    const elements = {
        startDate: document.getElementById('start-date'),
        endDate: document.getElementById('end-date'),
        location: document.getElementById('location'),
        categoryId: document.getElementById('category')
    };
    
    if (elements[filterType]) {
        elements[filterType].value = '';
        performSearch();
    }
}

// 应用排序
function applySorting() {
    if (currentSearchResults.length === 0) return;
    
    const sortBy = document.getElementById('sort-by').value;
    const sortOrder = document.getElementById('sort-order').value;
    
    const sortedResults = [...currentSearchResults].sort((a, b) => {
        let valueA, valueB;
        
        switch (sortBy) {
            case 'date':
                valueA = new Date(a.event_date);
                valueB = new Date(b.event_date);
                break;
            case 'progress':
                valueA = parseFloat(a.progress_percentage || 0);
                valueB = parseFloat(b.progress_percentage || 0);
                break;
            case 'price':
                valueA = parseFloat(a.ticket_price);
                valueB = parseFloat(b.ticket_price);
                break;
            case 'name':
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
                break;
            default:
                return 0;
        }
        
        if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    
    displaySearchResults(sortedResults);
}

// 清空所有筛选条件
function clearAllFilters() {
    document.getElementById('search-form').reset();
    document.getElementById('search-results').innerHTML = `
        <div class="welcome-message">
            <div class="welcome-content">
                <i class="fas fa-search"></i>
                <h3>欢迎使用搜索功能</h3>
                <p>请使用上方的筛选条件来查找您感兴趣的慈善活动。您可以按日期、地点或活动分类进行筛选。</p>
                <div class="search-tips">
                    <h4>搜索小贴士:</h4>
                    <ul>
                        <li><i class="fas fa-lightbulb"></i> 可以同时使用多个筛选条件</li>
                        <li><i class="fas fa-lightbulb"></i> 地点搜索支持模糊匹配</li>
                        <li><i class="fas fa-lightbulb"></i> 留空所有条件将显示所有活动</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    document.getElementById('results-count').textContent = '请使用上方筛选条件搜索活动';
    hideElement(document.getElementById('sort-options'));
    hideElement(document.getElementById('no-results'));
    currentSearchResults = [];
    
    // 清空URL参数
    window.history.replaceState({}, document.title, window.location.pathname);
}

// 快速搜索
function quickSearch(startDate, location, categoryId) {
    // 设置表单值
    if (startDate) document.getElementById('start-date').value = startDate;
    if (location) document.getElementById('location').value = location;
    if (categoryId) document.getElementById('category').value = categoryId;
    
    // 执行搜索
    performSearch();
    
    // 滚动到结果区域
    document.getElementById('search-results').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// 显示搜索错误
function displaySearchError(message) {
    const container = document.getElementById('search-results');
    container.innerHTML = `
        <div class="search-status error">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>搜索出错</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="performSearch()">重试</button>
        </div>
    `;
}

// 从URL参数设置筛选条件
function setFiltersFromURL(urlParams) {
    const startDate = urlParams.get('startDate');
    const endDate = urlParams.get('endDate');
    const location = urlParams.get('location');
    const categoryId = urlParams.get('categoryId');
    
    if (startDate) document.getElementById('start-date').value = startDate;
    if (endDate) document.getElementById('end-date').value = endDate;
    if (location) document.getElementById('location').value = location;
    if (categoryId) document.getElementById('category').value = categoryId;
}

// 显示元素
function showElement(element) {
    if (element) {
        element.style.display = 'block';
    }
}

// 隐藏元素
function hideElement(element) {
    if (element) {
        element.style.display = 'none';
    }
}

// 键盘快捷键
document.addEventListener('keydown', function(event) {
    // Enter键执行搜索
    if (event.key === 'Enter' && event.target.tagName !== 'BUTTON') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.closest('.search-form')) {
            event.preventDefault();
            performSearch();
        }
    }
    
    // Esc键清空搜索
    if (event.key === 'Escape') {
        clearAllFilters();
    }
});

// 页面离开前保存搜索状态
window.addEventListener('beforeunload', function() {
    const formData = getSearchFormData();
    const hasFilters = Object.values(formData).some(value => value);
    
    if (hasFilters) {
        const searchQuery = buildSearchQuery(formData);
        const newUrl = `${window.location.pathname}?${searchQuery}`;
        window.history.replaceState({}, document.title, newUrl);
    }
});
