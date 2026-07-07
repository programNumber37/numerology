// ============================================
// SHARED THEME TOGGLE — included on every page
// ============================================

(function initTheme() {
    const saved = localStorage.getItem('numerologyTheme') || 'warm';
    document.documentElement.setAttribute('data-theme', saved);
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === saved);
    });
})();

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-toggle-btn');
    if (!btn) return;
    const theme = btn.dataset.theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('numerologyTheme', theme);
    document.querySelectorAll('.theme-toggle-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`.theme-toggle-btn[data-theme="${theme}"]`).forEach(b => b.classList.add('active'));
});
