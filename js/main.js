// Excel学习中心主JavaScript文件

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // 当前页面导航高亮
    highlightCurrentNav();

    // 为学习路径卡片添加动画效果
    animatePathCards();

    // 搜索功能（如果有搜索框）
    initSearch();
});

// 高亮当前页面的导航项
function highlightCurrentNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// 学习路径卡片动画
function animatePathCards() {
    const cards = document.querySelectorAll('.path-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// 搜索功能初始化
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchContent, 300));
    }
}

// 搜索内容
function searchContent(query) {
    // 这里可以实现搜索逻辑
    console.log('搜索:', query);
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

// 添加淡入动画类
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.6s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// 教程页面功能
function initTutorialPage() {
    // 为代码块添加复制功能
    document.querySelectorAll('.code-block').forEach(block => {
        addCopyButton(block);
    });

    // 添加滚动到顶部按钮
    addScrollToTop();

    // 目录导航
    initTableOfContents();
}

// 为代码块添加复制按钮
function addCopyButton(block) {
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.textContent = '复制';
    button.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: #217346;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.2s;
    `;

    block.style.position = 'relative';
    block.appendChild(button);

    block.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
    });

    block.addEventListener('mouseleave', () => {
        button.style.opacity = '0';
    });

    button.addEventListener('click', () => {
        const text = block.textContent.replace('复制', '').trim();
        navigator.clipboard.writeText(text).then(() => {
            button.textContent = '已复制!';
            setTimeout(() => {
                button.textContent = '复制';
            }, 2000);
        });
    });
}

// 添加滚动到顶部按钮
function addScrollToTop() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.id = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #217346;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        display: none;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 初始化目录导航
function initTableOfContents() {
    const content = document.querySelector('.tutorial-content');
    if (!content) return;

    const headings = content.querySelectorAll('h2, h3');
    if (headings.length < 2) return;

    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h3>目录</h3><ul></ul>';

    const ul = toc.querySelector('ul');

    headings.forEach(heading => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = heading.textContent;
        link.href = `#${heading.textContent.trim().replace(/\s+/g, '-')}`;
        link.style.cssText = `
            color: #217346;
            text-decoration: none;
            padding: 4px 0;
            display: block;
        `;

        // 添加锚点ID
        heading.id = link.href.substring(link.href.indexOf('#') + 1);

        li.appendChild(link);
        if (heading.tagName === 'H3') {
            li.style.paddingLeft = '20px';
        }
        ul.appendChild(li);
    });

    content.insertBefore(toc, content.firstChild);
}

// 检查是否是教程页面
if (document.querySelector('.tutorial-page')) {
    initTutorialPage();
}