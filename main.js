/**
 * Excel Learn - 2026 交互功能
 * 包含：主题切换、图表初始化、滚动动画、导航交互等
 */

// ===================================
// 主题管理（强制浅色模式）
// ===================================
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.themeIcon = this.themeToggle?.querySelector('.theme-icon');
    // 强制默认浅色模式
    this.currentTheme = 'light';

    this.init();
  }

  init() {
    // 清除 localStorage 中的深色模式
    localStorage.setItem('theme', 'light');
    this.applyTheme('light');
    this.themeToggle?.addEventListener('click', () => this.toggleTheme());
  }

  getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return 'light';
  }

  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (this.themeIcon) this.themeIcon.textContent = '☀️';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (this.themeIcon) this.themeIcon.textContent = '🌙';
    }

    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  rerenderMermaid() {
    if (typeof mermaid !== 'undefined') {
      document.querySelectorAll('.mermaid').forEach((element, index) => {
        element.removeAttribute('data-processed');
        element.setAttribute('id', `mermaid-${index}`);
      });
      mermaid.init();
    }
  }
}

// ===================================
// 导航栏交互
// ===================================
class NavbarManager {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-menu a');

    this.init();
  }

  init() {
    // 滚动效果
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    // 移动端菜单
    this.mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());

    // 平滑滚动
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target) && this.navMenu?.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.navbar?.classList.add('scrolled');
    } else {
      this.navbar?.classList.remove('scrolled');
    }
  }

  toggleMobileMenu() {
    this.navMenu?.classList.toggle('active');
    this.mobileMenuBtn?.classList.toggle('active');
  }

  closeMobileMenu() {
    this.navMenu?.classList.remove('active');
    this.mobileMenuBtn?.classList.remove('active');
  }

  handleNavClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        this.closeMobileMenu();
      }
    }
  }
}

// ===================================
// 滚动动画（Intersection Observer）
// ===================================
class ScrollAnimation {
  constructor() {
    this.elements = document.querySelectorAll('.card, .excel-card, .ai-card, .security-item');
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    this.elements.forEach(el => observer.observe(el));
  }
}

// ===================================
// Mermaid 图表初始化
// ===================================
class MermaidInitializer {
  constructor() {
    this.init();
  }

  init() {
    console.log('Mermaid 已加载');
  }

  rerenderMermaid() {
    if (typeof mermaid === 'undefined') return;

    document.querySelectorAll('.mermaid').forEach((el, index) => {
      el.removeAttribute('data-processed');
      el.setAttribute('id', `mermaid-${Date.now()}-${index}`);
    });

    mermaid.initialize({
      startOnLoad: true,
      theme: this.getMermaidTheme(),
      securityLevel: 'loose'
    });
  }

  getMermaidTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                   window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDark ? 'dark' : 'default';
  }
}

// ===================================
// Chart.js 图表初始化（Excel 主题）
// ===================================
class ChartInitializer {
  constructor() {
    this.charts = [];
    this.init();
  }

  init() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js library not loaded');
      return;
    }

    this.initSalesChart();
    this.initPieChart();

    this.observeThemeChange();
  }

  getChartColors() {
    return {
      excelGreen: '#107c41',
      excelGreenLight: '#21a366',
      excelGreenDark: '#0b5a32',
      blue: '#2b88d8',
      orange: '#d83b01',
      purple: '#8b5cf6',
      red: '#ef4444',
      teal: '#14b8a6',
      text: '#374151',
      grid: '#e5e7eb'
    };
  }

  initSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    const colors = this.getChartColors();

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'],
        datasets: [{
          label: '2025 年销售额',
          data: [120, 150, 180, 220, 200, 250, 280, 300, 320, 350, 380, 420],
          borderColor: colors.excelGreen,
          backgroundColor: 'rgba(16, 124, 65, 0.1)',
          tension: 0.4,
          fill: true
        }, {
          label: '2026 年销售额',
          data: [180, 200, 240, 280, 320, 380, 420, 450, 480, 520, 560, 600],
          borderColor: colors.blue,
          backgroundColor: 'rgba(43, 136, 216, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: colors.text }
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: colors.grid },
            ticks: { 
              color: colors.text,
              callback: (value) => '¥' + value + 'K'
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: colors.text }
          }
        }
      }
    });
  }

  initPieChart() {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;

    const colors = this.getChartColors();

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['电子产品', '办公用品', '家具', '服务', '其他'],
        datasets: [{
          data: [35, 25, 20, 15, 5],
          backgroundColor: [
            colors.excelGreen,
            colors.excelGreenLight,
            colors.blue,
            colors.purple,
            colors.orange
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: colors.text }
          }
        }
      }
    });
  }

  observeThemeChange() {
    const observer = new MutationObserver(() => {
      this.charts.forEach(chart => chart.destroy());
      this.charts = [];
      setTimeout(() => this.init(), 100);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }
}

// ===================================
// 交互式流程图
// ===================================
class InteractiveFlowchart {
  constructor() {
    this.steps = document.querySelectorAll('.flowchart-step');
    this.detailEl = document.getElementById('flowchartDetail');

    this.init();
  }

  init() {
    if (!this.steps.length || !this.detailEl) return;

    const stepDetails = [
      {
        title: '读取文件头',
        content: '验证 PDF 版本标识，确保文件格式正确。'
      },
      {
        title: '定位文件尾',
        content: '从文件末尾回溯查找 startxref 标记。'
      },
      {
        title: '解析 XRef',
        content: '读取交叉引用表，构建对象位置索引。'
      },
      {
        title: '加载 Catalog',
        content: '获取文档根对象，这是 PDF 解析的入口点。'
      },
      {
        title: '遍历 Pages',
        content: '从 Pages 树根开始，递归遍历所有页面节点。'
      }
    ];

    this.steps.forEach((step, index) => {
      step.addEventListener('click', () => {
        this.steps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');

        const detail = stepDetails[index];
        if (detail) {
          this.detailEl.innerHTML = `
            <h4>${detail.title}</h4>
            <p>${detail.content}</p>
          `;
        }
      });
    });
  }
}

// ===================================
// 代码块复制和折叠功能
// ===================================
class CodeBlockCopy {
  constructor() {
    this.codeBlocks = document.querySelectorAll('.code-block');

    this.init();
  }

  init() {
    this.codeBlocks.forEach(block => {
      const pre = block.querySelector('pre');
      if (!pre) return;

      // 添加折叠按钮到标题
      const header = block.querySelector('h3, h4');
      if (header) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'collapse-btn';
        toggleBtn.textContent = '▼ 折叠';
        toggleBtn.style.cssText = `
          float: right;
          padding: 4px 8px;
          font-size: 12px;
          cursor: pointer;
          border: 1px solid #e1dfdd;
          border-radius: 4px;
          background: #f3f2f1;
          color: #586069;
        `;

        toggleBtn.addEventListener('click', () => {
          pre.classList.toggle('collapsed');
          toggleBtn.textContent = pre.classList.contains('collapsed') ? '▶ 展开' : '▼ 折叠';
        });

        header.appendChild(toggleBtn);
      }

      // 添加复制按钮
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = '复制';
      copyBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 4px;
        color: inherit;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
      `;

      copyBtn.addEventListener('click', () => this.copyCode(pre, copyBtn));

      pre.style.position = 'relative';
      pre.appendChild(copyBtn);

      copyBtn.addEventListener('mouseenter', () => {
        copyBtn.style.background = 'rgba(255,255,255,0.3)';
      });

      copyBtn.addEventListener('mouseleave', () => {
        copyBtn.style.background = 'rgba(255,255,255,0.2)';
      });
    });
  }

  async copyCode(pre, button) {
    const code = pre.querySelector('code')?.textContent || pre.textContent;

    try {
      await navigator.clipboard.writeText(code);
      button.textContent = '已复制!';
      button.style.background = 'rgba(16, 185, 129, 0.3)';

      setTimeout(() => {
        button.textContent = '复制';
        button.style.background = 'rgba(255,255,255,0.2)';
      }, 2000);
    } catch (err) {
      button.textContent = '复制失败';
      console.error('复制失败:', err);
    }
  }
}

// ===================================
// 平滑滚动到目标元素
// ===================================
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }
}

// ===================================
// 性能优化：防抖和节流
// ===================================
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

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===================================
// 初始化所有功能
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  if (document.readyState === 'complete') {
    initializeAll();
  } else {
    window.addEventListener('load', initializeAll);
  }
});

function initializeAll() {
  console.log('🚀 Excel Learn 初始化中...');

  new ThemeManager();
  new NavbarManager();
  new ScrollAnimation();
  new MermaidInitializer();
  new ChartInitializer();
  new InteractiveFlowchart();
  new CodeBlockCopy();
  new SmoothScroll();

  console.log('✅ Excel Learn 初始化完成');
}

// ===================================
// 键盘导航支持（无障碍）
// ===================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const navMenu = document.querySelector('.nav-menu');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    navMenu?.classList.remove('active');
    mobileBtn?.classList.remove('active');
  }

  if (e.altKey) {
    switch(e.key) {
      case '1':
        document.querySelector('#intro')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case '2':
        document.querySelector('#basics')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case '3':
        document.querySelector('#functions')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case '4':
        document.querySelector('#visualization')?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }
});

// ===================================
// 页面可见性变化处理
// ===================================
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.title = '💤 Excel Learn - 等待返回...';
  } else {
    document.title = 'Excel 完全指南 | 2026 版';
  }
});
