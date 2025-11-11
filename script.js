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
        'reviews-title': 'What Our Customers Say',
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
        'reviews-title': 'ماذا يقول عملاؤنا',
        'offers-title': 'نحن نخدم مؤسستك',
        'offers-subtitle': 'انضم إلى مجتمعنا واكتشف الميزات المتقدمة والدعم الفوري',
        'contact-title': 'تواصل معنا'
    }
};

// Current language state
let currentLang = 'en';

// Automatic language detection (commented out for demo purposes)
// document.addEventListener("DOMContentLoaded", () => {
// const lang = navigator.language || navigator.userLanguage;
// if (lang.startsWith("ar")) {
// setLanguage('ar');
// } else {
// setLanguage('en');
// }
// });

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
    // Update static text elements
    Object.keys(translations[lang]).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = translations[lang][id];
        }
    });
    // Update elements with data attributes
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = lang === 'ar' ? element.getAttribute('data-ar') : element.getAttribute('data-en');
        if (text) {
            element.textContent = text;
        }
    });
    // Update page title
    document.title = translations[lang]['page-title'];
}

document.querySelectorAll('.industry-card').forEach(card => {
    card.addEventListener('click', function () {
        let link = this.querySelector('a').getAttribute('href');
        window.location.href = link;
    });
});

// Language toggle event
document.getElementById('lang-toggle').addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'ar' : 'en');
});

// Smooth scrolling
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

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -30px 0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.industry-card, .solution-card, .review-card, .offer-card, .contact-card').forEach(card => {
    observer.observe(card);
});

// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
mobileMenu?.addEventListener('click', () => {
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'white';
        navLinks.style.flexDirection = 'column';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
        navLinks.style.zIndex = '999';
    }
});

// Demo link handlers
document.querySelectorAll('a[href^="#demo"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const demoType = e.target.href.split('#demo-')[1] || 'general';
        // In a real implementation, this would redirect to specific demo URLs
        // For now, we'll show an alert with the demo type
        const message = currentLang === 'ar'
            ? `سيتم توجيهك إلى العرض التوضيحي لـ ${demoType}`
            : `You will be redirected to the ${demoType} demo`;
        alert(message);
        // Example of how you might redirect to specific demos:
        // window.open(`/demo/${demoType}`, '_blank');
    });
});

// Contact form handlers
document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('contact-link')) {
            const link = card.querySelector('.contact-link');
            if (link) {
                link.click();
            }
        }
    });
});

// Firebase integration for ratings
import { db } from './firebase-config.js';
import { collection, getDocs, orderBy, query, limit } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

async function loadRatings() {
    const q = query(collection(db, 'ratings'), orderBy('timestamp', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    const list = document.getElementById('ratingsList');
    list.innerHTML = '';
    snapshot.forEach(doc => {
        const data = doc.data();
        const item = document.createElement('div');
        item.className = 'rating-item';
        item.innerHTML = `
            <div class="rating-header">
                <h4>${data.name}</h4>
                <div class="stars">${'⭐'.repeat(data.stars)}</div>
            </div>
            ${data.comment ? `<p class="comment">${data.comment}</p>` : ''}
            <div class="rating-details">
                ${data.email ? `<small>Email: ${data.email}</small>` : ''}
                ${data.phone ? `<small>Phone: ${data.phone}</small>` : ''}
            </div>
        `;
        list.appendChild(item);
    });
}

// Load ratings on page load
document.addEventListener('DOMContentLoaded', () => {
    loadRatings();
    setLanguage('en');
});
