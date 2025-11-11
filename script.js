// script.js

// Language translations
const translations = {
    en: {
        'page-title': 'AI Solutions - Transform Your Business',
        'logo-text': 'AI Solutions',
        'nav-home': 'Home',
        'nav-solutions': 'Solutions',
        'nav-contact': 'Contact',
        'free-demo-text': 'Free Demo',
        'hero-title': 'Transform Your Business with AI',
        'hero-subtitle': 'Ready-to-integrate practical solutions for your commercial or educational platforms',
        'explore-text': 'Try Free Demo',
        'industries-title': 'Industries We Serve',
        'solutions-title': 'Our AI Solutions',
        'offers-title': 'We serve your organization',
        'offers-subtitle': 'Join our community and unlock premium features and priority support',
        'contact-title': 'Connect With Us'
    },
    ar: {
        'nav-home': 'الرئيسية',
        'nav-solutions': 'الحلول',
        'nav-contact': 'التواصل',
        'free-demo-text': ' تجربة مجانية',
        "hero-title": 'ادمج الذكاء الاصطناعي في أعمالك',
        'hero-subtitle': 'ذكاء أسرع.. وقت أقل.. أرباح أكثر',
        'explore-text': 'تجربة مجانية',
        'industries-title': 'القطاعات التي نخدمها',
        'solutions-title': 'حلولنا للذكاء الاصطناعي',
        'offers-title': 'نحن نخدم مؤسستك',
        'offers-subtitle': 'انضم إلى مجتمعنا واكتشف الميزات المتقدمة والدعم الفوري',
        'contact-title': 'تواصل معنا'
    }
};

// Current language state
let currentLang = 'en';

// Language switching function
function setLanguage(lang) {
    currentLang = lang;
    const html = document.getElementById('html-root');
    const langToggle = document.getElementById('lang-toggle');
    if (lang === 'ar') {
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'ar');
        langToggle.textContent = 'English';
        document.body.style.fontFamily = 'Cairo, Tajawal, -apple-system, BlinkMacSystemFont, sans-serif';
    } else {
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', 'en');
        langToggle.textContent = 'العربية';
        document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    }
    Object.keys(translations[lang]).forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = translations[lang][id];
    });
    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    });
    document.title = translations[lang]['page-title'];
}

// Industry card click
document.querySelectorAll('.industry-card').forEach(card => {
    card.addEventListener('click', () => {
        const link = card.querySelector('a');
        if (link) window.location.href = link.getAttribute('href');
    });
});

// Language toggle
document.getElementById('lang-toggle').addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'ar' : 'en');
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Header shadow on scroll
window.addEventListener('scroll', () => {
    document.querySelector('header').style.boxShadow = window.scrollY > 100 ? '0 2px 10px rgba(0,0,0,0.1)' : 'none';
});

// Animation observer
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.industry-card, .solution-card, .offer-card, .contact-card').forEach(el => observer.observe(el));

// Mobile menu
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
mobileMenu?.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';
    navLinks.style.cssText = isOpen ? 'display: none;' : `
        display: flex; position: absolute; top: 100%; left: 0; right: 0;
        background: white; flex-direction: column; padding: 1rem;
        box-shadow: 0 5px 10px rgba(0,0,0,0.1); z-index: 999;
    `;
});

// Contact card click
document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('click', e => {
        if (!e.target.classList.contains('contact-link')) {
            card.querySelector('.contact-link')?.click();
        }
    });
});

// === FIREBASE RATINGS LOADER (DEBUG ENABLED) ===
import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

async function loadRatings() {
    console.log('[DEBUG] Starting loadRatings...');
    const ratingsList = document.getElementById('ratingsList');
    if (!ratingsList) {
        console.error('[ERROR] #ratingsList element not found in DOM');
        return;
    }

    try {
        console.log('[DEBUG] Querying collection: ratings');
        const q = query(collection(db, 'ratings'), orderBy('timestamp', 'desc'), limit(10));
        const snapshot = await getDocs(q);

        console.log(`[DEBUG] Query returned ${snapshot.size} documents`);

        if (snapshot.empty) {
            ratingsList.innerHTML = '<p style="text-align:center;color:#888;">No ratings yet. Be the first!</p>';
            return;
        }

        ratingsList.innerHTML = ''; // Clear loader

        snapshot.forEach((docSnap, index) => {
            const data = docSnap.data();
            console.log(`[DEBUG] Doc ${index + 1}:`, data);

            const item = document.createElement('div');
            item.className = 'rating-item';

            // Format timestamp
            let timeStr = 'Unknown time';
            if (data.timestamp && typeof data.timestamp.toDate === 'function') {
                timeStr = data.timestamp.toDate().toLocaleString();
            } else if (data.timestamp) {
                timeStr = new Date(data.timestamp).toLocaleString();
            }

            item.innerHTML = `
                <div class="rating-header">
                    <h4>${escapeHtml(data.name || 'Anonymous')}</h4>
                    <div class="stars">${'⭐'.repeat(data.stars || 0)}</div>
                </div>
                ${data.comment ? `<p class="comment">${escapeHtml(data.comment)}</p>` : ''}
                <div class="rating-details">
                    ${data.email ? `<small>Email: ${escapeHtml(data.email)}</small>` : ''}
                    ${data.phone ? `<small>Phone: ${escapeHtml(data.phone)}</small>` : ''}
                    <small style="color:#666; display:block; margin-top:4px;">${timeStr}</small>
                </div>
            `;
            ratingsList.appendChild(item);
        });

    } catch (error) {
        console.error('[FIREBASE ERROR]', error);
        ratingsList.innerHTML = `<p style="color:red; text-align:center;">Error loading ratings: ${error.message}</p>`;
    }
}

// Safe HTML escape
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('[INIT] DOM loaded, initializing...');
    setLanguage('en');
    loadRatings();
});
