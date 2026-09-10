/**
 * Firebase Ratings Display
 * 
 * Fetches and renders client testimonials from Firestore.
 * Usage in any HTML file:
 *   <div id="ratings-display"></div>
 *   <script type="module" src="/shared/firebase-ratings.js"></script>
 */

const firebaseConfig = {
  apiKey: 'AIzaSyAXofkSy3vfz7GuTgj6-S-rK2rsnUQp_J0',
  authDomain: 'ai-playground-ratings.firebaseapp.com',
  projectId: 'ai-playground-ratings',
  storageBucket: 'ai-playground-ratings.firebasestorage.app',
  messagingSenderId: '112573912701',
  appId: '1:112573912701:web:b381d9c41871025f49c314',
};

let db = null;

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(function(w) { return w[0]; }).join('').substring(0, 2).toUpperCase();
}

function getAvatarColor(name) {
  var colors = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#f97316'];
  var hash = 0;
  for (var i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function renderStarsFilled(count) {
  var html = '<span class="rating-stars" aria-label="' + count + ' out of 5 stars">';
  for (var i = 1; i <= 5; i++) {
    if (i <= count) {
      html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>';
    } else {
      html += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>';
    }
  }
  html += '</span>';
  return html;
}

function renderEmailSVG() {
  return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
}

function renderPhoneSVG() {
  return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
}

async function initFirebase() {
  if (db) return db;
  
  var appModule = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js');
  var firestoreModule = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js');
  
  var app;
  try {
    app = appModule.initializeApp(firebaseConfig);
  } catch (e) {
    if (e.code === 'app/duplicate-app') {
      app = appModule.initializeApp(firebaseConfig, 'ratings-secondary');
    } else {
      throw e;
    }
  }
  
  db = firestoreModule.getFirestore(app);
  
  window._rCol = firestoreModule.collection;
  window._rQuery = firestoreModule.query;
  window._rOrderBy = firestoreModule.orderBy;
  window._rLimit = firestoreModule.limit;
  window._rGetDocs = firestoreModule.getDocs;
  
  return db;
}

async function renderRatings(containerId, options) {
  options = options || {};
  var container = document.getElementById(containerId);
  if (!container) {
    console.warn('[Ratings] Container #' + containerId + ' not found');
    return;
  }

  var maxRatings = options.limit || 6;

  try {
    await initFirebase();

    var q = window._rQuery(
      window._rCol(db, 'ratings'),
      window._rOrderBy('timestamp', 'desc'),
      window._rLimit(maxRatings)
    );
    var snapshot = await window._rGetDocs(q);

    if (snapshot.empty) {
      container.innerHTML = '<p class="ratings-empty">No client feedback yet.</p>';
      return;
    }

    var html = '';
    snapshot.forEach(function(doc) {
      var r = doc.data();
      var name = escapeHTML(r.name || 'Anonymous');
      var email = escapeHTML(r.email || '');
      var phone = escapeHTML(r.phone || '');
      var comment = escapeHTML(r.comment || '');
      var stars = Math.min(Math.max(parseInt(r.stars) || 5, 1), 5);
      var initials = getInitials(r.name);
      var avatarColor = getAvatarColor(r.name);

      html += '<article class="rating-card">';
      
      html += '<div class="rating-top">';
      html += '<div class="rating-avatar" style="background:' + avatarColor + '">' + initials + '</div>';
      html += '<div class="rating-info">';
      html += '<div class="rating-name-row">';
      html += '<span class="rating-name">' + name + '</span>';
      html += renderStarsFilled(stars);
      html += '</div>';
      if (email || phone) {
        html += '<div class="rating-contact">';
        if (email) html += '<span class="rating-email">' + renderEmailSVG() + ' ' + email + '</span>';
        if (phone) html += '<span class="rating-phone">' + renderPhoneSVG() + ' ' + phone + '</span>';
        html += '</div>';
      }
      html += '</div>';
      html += '</div>';

      if (comment) {
        html += '<p class="rating-comment">\u201C' + comment + '\u201D</p>';
      }
      
      html += '</article>';
    });

    container.innerHTML = html;
  } catch (err) {
    console.error('[Ratings] Failed to load:', err);
    container.innerHTML = '<p class="ratings-empty">Unable to load client feedback.</p>';
  }
}

window.renderRatings = renderRatings;

function tryRender() {
  var el = document.getElementById('ratings-display');
  if (el && window.renderRatings) {
    renderRatings('ratings-display');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tryRender);
} else {
  tryRender();
}
