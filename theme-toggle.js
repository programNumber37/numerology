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
    const cycleBtn = e.target.closest('.theme-cycle-btn');
    if (cycleBtn) {
        const current = document.documentElement.getAttribute('data-theme') || 'warm';
        const availableThemes = Array.from(document.querySelectorAll('.theme-toggle-btn')).map(b => b.dataset.theme);
        let nextTheme = 'warm';
        if (current === 'warm') {
            nextTheme = availableThemes.find(t => t && t !== 'warm') || 'classic';
        } else {
            nextTheme = 'warm';
        }
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('numerologyTheme', nextTheme);
        document.querySelectorAll('.theme-toggle-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.theme === nextTheme);
        });
        return;
    }

    const btn = e.target.closest('.theme-toggle-btn');
    if (!btn) return;
    const theme = btn.dataset.theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('numerologyTheme', theme);
    document.querySelectorAll('.theme-toggle-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`.theme-toggle-btn[data-theme="${theme}"]`).forEach(b => b.classList.add('active'));
});
