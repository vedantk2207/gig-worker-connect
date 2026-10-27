// ============================================================
// GigCoop — Client Helper, i18n, API & Auth Controller
// ============================================================
const SUPPORTED_LANGS = ['en', 'hi'];
let currentLang = localStorage.getItem('gigcoop_lang') || 'en';
let translations = {};

async function loadTranslations(lang) {
  try {
    const res = await fetch(`/locales/${lang}.json`);
    if (!res.ok) throw new Error('Lang not found');
    translations = await res.json();
  } catch {
    try {
      const res = await fetch('/locales/en.json');
      translations = await res.json();
    } catch {
      translations = {};
    }
  }
}

function t(key) {
  return translations[key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) el.textContent = translations[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key]) el.placeholder = translations[key];
  });
}

async function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('gigcoop_lang', lang);
  await loadTranslations(lang);
  applyTranslations();
  document.documentElement.lang = lang;
}

// ============================================================
// Auth System
// ============================================================
const Auth = {
  getToken: () => localStorage.getItem('gigcoop_token') || 'mock_token_priya',
  getUser: () => {
    const userStr = localStorage.getItem('gigcoop_user');
    if (!userStr && window.MOCK_DATA) {
      // Default to demo customer Priya
      const defaultUser = window.MOCK_DATA.users[0];
      localStorage.setItem('gigcoop_user', JSON.stringify(defaultUser));
      localStorage.setItem('gigcoop_token', 'mock_token_priya');
      return defaultUser;
    }
    return JSON.parse(userStr || 'null');
  },
  setAuth: (token, user) => {
    localStorage.setItem('gigcoop_token', token);
    localStorage.setItem('gigcoop_user', JSON.stringify(user));
  },
  switchDemoRole: (role) => {
    if (!window.MOCK_DATA) return;
    const user = window.MOCK_DATA.users.find(u => u.role === role) || window.MOCK_DATA.users[0];
    Auth.setAuth(`mock_token_${role}`, user);
    showToast(`Switched to demo role: ${user.name} (${user.role.toUpperCase()})`, 'success');
    setTimeout(() => {
      if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('login') || window.location.pathname.includes('register')) {
        window.location.href = `/dashboard-${user.role}.html`;
      } else {
        window.location.reload();
      }
    }, 600);
  },
  logout: () => {
    localStorage.removeItem('gigcoop_token');
    localStorage.removeItem('gigcoop_user');
    showToast('Logged out successfully', 'info');
    setTimeout(() => window.location.href = '/login.html', 500);
  },
  isLoggedIn: () => !!localStorage.getItem('gigcoop_token'),
  headers: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${Auth.getToken()}`
  })
};

// ============================================================
// Booking Persistent Storage Helper
// ============================================================
const BookingHelper = {
  getAll: () => {
    try {
      const stored = JSON.parse(localStorage.getItem('gigcoop_bookings') || '[]');
      return stored;
    } catch {
      return [];
    }
  },
  save: (booking) => {
    try {
      const stored = BookingHelper.getAll();
      // Avoid duplicates
      const filtered = stored.filter(b => b._id !== booking._id);
      filtered.unshift(booking);
      localStorage.setItem('gigcoop_bookings', JSON.stringify(filtered));
    } catch (e) {
      console.warn('BookingHelper save error', e);
    }
  },
  getLatest: () => {
    const all = BookingHelper.getAll();
    return all.length > 0 ? all[0] : null;
  }
};

// ============================================================
// API Caller with Graceful Fallback Engine
// ============================================================
const API_BASE = '/api';

async function api(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: Auth.headers(),
      ...options
    });
    if (res.ok) {
      const json = await res.json();
      if (endpoint.startsWith('/bookings') && method === 'POST' && json.data) {
        BookingHelper.save(json.data);
      }
      return json;
    }
  } catch (err) {
    console.warn(`Network/API unreachable for ${endpoint}, using client fallback.`);
  }

  // Graceful Mock Fallbacks
  return handleMockFallback(endpoint, options);
}

function handleMockFallback(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const md = window.MOCK_DATA || {};

  // Services
  if (endpoint.startsWith('/services') && method === 'GET') {
    if (endpoint.includes('/price-estimate')) {
      const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
      const cat = urlParams.get('category') || 'cleaning';
      const prices = {
        cleaning: { min: 450, fair: 950, max: 1800 },
        electrical: { min: 350, fair: 650, max: 1500 },
        plumbing: { min: 400, fair: 750, max: 1600 },
        tutoring: { min: 500, fair: 800, max: 2000 },
        pest_control: { min: 600, fair: 1100, max: 2500 }
      };
      return { success: true, data: prices[cat] || { min: 400, fair: 800, max: 1800 } };
    }
    if (endpoint.includes('/ai-match')) {
      return { success: true, data: md.services || [] };
    }
    return { success: true, data: md.services || [] };
  }

  // Bookings
  if (endpoint.startsWith('/bookings') && method === 'GET') {
    const localBookings = BookingHelper.getAll();
    const seedBookings = md.bookings || [];
    return { success: true, data: [...localBookings, ...seedBookings] };
  }
  if (endpoint.startsWith('/bookings') && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const allSvc = md.services || [];
    const matchedService = allSvc.find(s => s._id === body.serviceId) || allSvc[0] || {
      _id: 'svc_1',
      title: 'Home Deep Cleaning & Sanitization',
      category: 'cleaning',
      basePrice: 1299,
      provider: {
        name: 'Sunita Devi',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80',
        averageRating: 4.95,
        phone: '+91 98222 33445'
      }
    };

    const newBk = {
      _id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      service: matchedService,
      customer: Auth.getUser() || { name: 'Priya Sharma', phone: '+91 98765 43210' },
      provider: matchedService.provider || {
        name: 'Sunita Devi',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80',
        averageRating: 4.95,
        phone: '+91 98222 33445'
      },
      scheduledDate: body.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: body.scheduledTime || '10:00 AM - 12:00 PM',
      address: body.address || { street: 'Flat 402, Green Meadows Residency' },
      totalAmount: matchedService.basePrice || 1299,
      platformFee: Math.round((matchedService.basePrice || 1299) * 0.1),
      providerEarnings: Math.round((matchedService.basePrice || 1299) * 0.9),
      equityPointsAwarded: Math.floor((matchedService.basePrice || 1299) / 100) * 5,
      status: 'confirmed',
      notes: body.notes || '',
      createdAt: new Date().toISOString()
    };

    BookingHelper.save(newBk);
    if (md.bookings) md.bookings.unshift(newBk);
    return { success: true, data: newBk };
  }

  // Group Bookings
  if (endpoint.startsWith('/group-bookings') && method === 'GET') {
    return { success: true, data: md.groupBookings || [] };
  }
  if (endpoint.startsWith('/group-bookings') && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const newGb = {
      _id: 'gb_' + Date.now(),
      shareableLink: 'deal-' + Math.random().toString(36).substr(2, 6),
      societyName: body.societyName || 'Green Meadows',
      service: md.services.find(s => s._id === body.serviceId) || md.services[0],
      scheduledDate: body.scheduledDate,
      scheduledTime: body.scheduledTime,
      basePrice: body.basePrice || 1299,
      currentCount: 1,
      maxParticipants: 15,
      status: 'open',
      initiator: Auth.getUser(),
      participants: [{ user: Auth.getUser(), apartment: body.apartment || 'Flat 101' }]
    };
    if (md.groupBookings) md.groupBookings.unshift(newGb);
    return { success: true, data: newGb, joinLink: `/group-booking.html?code=${newGb.shareableLink}` };
  }

  // Voting
  if (endpoint.startsWith('/voting') && method === 'GET') {
    return { success: true, data: md.votingProposals || [] };
  }
  if (endpoint.includes('/vote') && method === 'POST') {
    return { success: true, message: 'Vote recorded with equity weighting.' };
  }

  // Subscriptions
  if (endpoint.startsWith('/subscriptions') && method === 'GET') {
    return {
      success: true,
      data: [
        {
          _id: 'sub_1',
          plan: { name: 'standard', price: 3999, billingCycle: 'monthly' },
          status: 'active',
          nextServiceDate: '2026-09-07',
          nextBillingDate: '2026-09-20'
        }
      ]
    };
  }

  // Equity
  if (endpoint.startsWith('/equity')) {
    return {
      success: true,
      data: {
        myPoints: 480,
        myPercentage: '3.2000',
        totalProviders: 142,
        ledger: [
          { points: 50, type: 'earned', description: 'Cooperative booking bonus #bk_102', createdAt: '2026-08-28' },
          { points: 100, type: 'earned', description: 'Monthly service excellence reward', createdAt: '2026-08-01' }
        ],
        leaderboard: [
          { name: 'Sunita Devi', equityPoints: 650, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80' },
          { name: 'Rajesh Kumar', equityPoints: 480, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80' },
          { name: 'Deepa Nair', equityPoints: 420, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80' },
          { name: 'Amit Patel', equityPoints: 340, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&q=80' }
        ]
      }
    };
  }

  // Referral
  if (endpoint.startsWith('/referral')) {
    const user = Auth.getUser() || {};
    return {
      success: true,
      data: {
        referralCode: user.referralCode || 'PRIYA88',
        stats: { totalReferrals: 6, successfulBookings: 4, totalEarned: 200, walletBalance: user.walletBalance || 250 },
        referrals: [
          { referee: { name: 'Karan Mehra' }, status: 'rewarded', rewardAmount: 50, createdAt: '2026-08-15' },
          { referee: { name: 'Dr. Anand Saxena' }, status: 'booked', rewardAmount: 50, createdAt: '2026-08-20' },
          { referee: { name: 'Kavita Menon' }, status: 'rewarded', rewardAmount: 50, createdAt: '2026-08-22' }
        ]
      }
    };
  }

  // Admin
  if (endpoint.startsWith('/admin/stats')) {
    return {
      success: true,
      data: { users: 1840, providers: 240, bookings: 3820, services: 48, revenue: 148500 }
    };
  }

  return { success: true, message: 'Action processed successfully' };
}

// ============================================================
// Toast Notification
// ============================================================
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || '✨'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================
// Navbar Auth State Update & Active Tab Highlighting
// ============================================================
function updateNavbar() {
  const user = Auth.getUser();
  const loginBtn = document.getElementById('nav-login');
  const regBtn = document.getElementById('nav-register');

  if (loginBtn) {
    if (user && user.name) {
      const firstName = user.name.split(' ')[0];
      const roleBadge = user.role === 'provider' ? '⚡ Provider' : (user.role === 'admin' ? '🛡️ Admin' : '👤 Resident');
      loginBtn.innerHTML = `<span>📊</span> ${firstName} (${roleBadge})`;
      loginBtn.href = `/dashboard-${user.role}.html`;
      loginBtn.classList.remove('btn-ghost');
      loginBtn.classList.add('btn-outline');
      if (regBtn) regBtn.style.display = 'none';
    } else {
      loginBtn.textContent = 'Login';
      loginBtn.href = '/login.html';
      if (regBtn) regBtn.style.display = 'inline-flex';
    }
  }

  // Highlight active desktop link
  const currentPath = window.location.pathname.toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (
      (href === '/' && (currentPath === '/' || currentPath.endsWith('index.html'))) ||
      (href !== '/' && currentPath.endsWith(href)) ||
      (href.length > 2 && currentPath.includes(href.replace('.html', '')))
    ) {
      a.classList.add('active');
    }
  });
}

// ============================================================
// Global Floating Persona Switcher Dock
// ============================================================
function initPersonaDock() {
  if (document.getElementById('persona-dock')) return;

  const user = Auth.getUser() || { name: 'Priya Sharma', role: 'customer' };
  const roleLabels = {
    customer: '👤 Priya (Resident)',
    provider: '⚡ Rajesh (Worker-Owner)',
    admin: '🛡️ Board Admin (Governance)'
  };

  const dock = document.createElement('div');
  dock.id = 'persona-dock';
  dock.className = 'persona-dock';
  dock.innerHTML = `
    <button class="persona-dock-btn" id="persona-dock-toggle" title="Switch Demo Persona">
      <span class="persona-dock-pulse"></span>
      <span style="font-size:0.75rem; color:var(--text-muted);">Persona:</span>
      <span id="dock-active-label" style="color:var(--primary-light);">${roleLabels[user.role] || user.name}</span>
      <span style="font-size:0.7rem; opacity:0.7;">▾</span>
    </button>
    <div class="persona-dock-menu" id="persona-dock-menu">
      <div class="flex-between" style="margin-bottom:8px;">
        <span class="persona-dock-title">Active Test Persona</span>
        <span class="badge badge-success" style="font-size:0.65rem;">🟢 localhost:5000</span>
      </div>
      <div class="persona-option ${user.role === 'customer' ? 'active' : ''}" onclick="Auth.switchDemoRole('customer')">
        <span style="font-size:1.3rem;">👤</span>
        <div>
          <div style="font-weight:700; font-size:0.88rem;">Priya Sharma</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">Customer & Resident (Green Meadows)</div>
        </div>
      </div>
      <div class="persona-option ${user.role === 'provider' ? 'active' : ''}" onclick="Auth.switchDemoRole('provider')">
        <span style="font-size:1.3rem;">⚡</span>
        <div>
          <div style="font-weight:700; font-size:0.88rem;">Rajesh Kumar</div>
          <div style="font-size:0.75rem; color:var(--gold);">Worker-Owner (Powai Electrical Guild)</div>
        </div>
      </div>
      <div class="persona-option ${user.role === 'admin' ? 'active' : ''}" onclick="Auth.switchDemoRole('admin')">
        <span style="font-size:1.3rem;">🛡️</span>
        <div>
          <div style="font-weight:700; font-size:0.88rem;">Coop Board Admin</div>
          <div style="font-size:0.75rem; color:var(--accent);">Governance & Verification Audit</div>
        </div>
      </div>
      <div style="display:flex; gap:8px; margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.06);">
        <a href="/dashboard-${user.role}.html" class="btn btn-primary btn-sm" style="flex:1; justify-content:center; font-size:0.8rem;">
          📊 Open ${user.role.toUpperCase()} Dashboard
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(dock);

  const toggleBtn = document.getElementById('persona-dock-toggle');
  const menu = document.getElementById('persona-dock-menu');
  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!dock.contains(e.target)) menu.classList.remove('open');
    });
  }
}

// ============================================================
// Mobile Navigation Drawer
// ============================================================
function initMobileNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const container = navbar.querySelector('.container');
  if (!container || container.querySelector('.nav-toggle')) return;

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'nav-toggle';
  toggleBtn.id = 'nav-toggle';
  toggleBtn.setAttribute('aria-label', 'Toggle Navigation');
  toggleBtn.innerHTML = '☰';

  const actions = container.querySelector('.nav-actions');
  if (actions) actions.appendChild(toggleBtn);
  else container.appendChild(toggleBtn);

  let drawer = document.getElementById('mobile-nav-drawer');
  if (!drawer) {
    const user = Auth.getUser() || { role: 'customer' };
    const currentPath = window.location.pathname.toLowerCase();
    drawer = document.createElement('div');
    drawer.id = 'mobile-nav-drawer';
    drawer.className = 'mobile-nav-drawer';
    drawer.innerHTML = `
      <a href="/" ${currentPath === '/' || currentPath.endsWith('index.html') ? 'class="active"' : ''}>🏠 Home</a>
      <a href="/services.html" ${currentPath.includes('service') ? 'class="active"' : ''}>🔍 Browse Services</a>
      <a href="/group-booking.html" ${currentPath.includes('group') ? 'class="active"' : ''}>🏢 Group Booking (-30%)</a>
      <a href="/voting.html" ${currentPath.includes('voting') ? 'class="active"' : ''}>🗳️ Democratic Governance</a>
      <a href="/subscriptions.html" ${currentPath.includes('sub') ? 'class="active"' : ''}>📦 Home Maintenance Plans</a>
      <a href="/equity.html" ${currentPath.includes('equity') ? 'class="active"' : ''}>💎 Worker Equity & Stake</a>
      <a href="/referral.html" ${currentPath.includes('referral') ? 'class="active"' : ''}>🎁 Refer & Earn ₹50</a>
      <div style="height:1px; background:var(--border); margin:4px 0;"></div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm" onclick="window.location.href='/dashboard-${user.role}.html'" style="flex:1; justify-content:center;">📊 Open Dashboard</button>
        <button class="btn btn-outline btn-sm" onclick="Auth.logout()">Logout</button>
      </div>
    `;
    navbar.parentNode.insertBefore(drawer, navbar.nextSibling);
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    drawer.classList.toggle('open');
    toggleBtn.innerHTML = drawer.classList.contains('open') ? '✕' : '☰';
  });

  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      drawer.classList.remove('open');
      toggleBtn.innerHTML = '☰';
    }
  });
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  await loadTranslations(currentLang);
  applyTranslations();
  updateNavbar();
  initPersonaDock();
  initMobileNav();

  const langSelector = document.getElementById('lang-selector');
  if (langSelector) {
    langSelector.value = currentLang;
    langSelector.addEventListener('change', (e) => setLanguage(e.target.value));
  }
});

// Expose globals
window.t = t;
window.Auth = Auth;
window.api = api;
window.showToast = showToast;
window.setLanguage = setLanguage;
window.updateNavbar = updateNavbar;
