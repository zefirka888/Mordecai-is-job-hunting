// script.js
document.addEventListener('DOMContentLoaded', () => {

    /* ---------- ТЕМА ---------- */
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (themeLabel) themeLabel.textContent = theme.toUpperCase();
        if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☾' : '☀';
        localStorage.setItem('mordecai-theme', theme);
    }

    const savedTheme = localStorage.getItem('mordecai-theme') || 'light';
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });
    }

    /* ---------- МОБИЛЬНОЕ МЕНЮ ---------- */
    const menuToggle = document.getElementById('menuToggle');
    const osMenu = document.getElementById('osMenu');
    if (menuToggle && osMenu) {
        menuToggle.addEventListener('click', () => osMenu.classList.toggle('open'));
    }

    /* ---------- ОКНА-ЯРЛЫКИ ---------- */
    const windows = document.querySelectorAll('.window');
    const icons = document.querySelectorAll('.desktop-icon[data-target]');
    const navButtons = document.querySelectorAll('.os-menu button[data-target]');
    const emptyDesktop = document.getElementById('emptyDesktop');
    let secretClicks = 0; // Счетчик кликов для пасхалки

    function openWindow(target) {
        let found = false;
        windows.forEach(w => {
            const isTarget = w.id === 'win-' + target;
            w.classList.toggle('active', isTarget);
            if (isTarget) found = true;
        });
        icons.forEach(i => i.classList.toggle('selected', i.dataset.target === target));
        if (emptyDesktop) emptyDesktop.classList.toggle('show', !found);
        if (osMenu && osMenu.classList.contains('open')) osMenu.classList.remove('open');
        
        // При открытии окна сбрасываем счетчик секретных кликов
        secretClicks = 0;
    }

    icons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            openWindow(icon.dataset.target);
        });
    });

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => openWindow(btn.dataset.target));
    });

    document.querySelectorAll('.win-close').forEach(btn => {
        btn.addEventListener('click', () => {
            windows.forEach(w => w.classList.remove('active'));
            icons.forEach(i => i.classList.remove('selected'));
            if (emptyDesktop) emptyDesktop.classList.add('show');
            secretClicks = 0; // Сброс при закрытии
        });
    });

    /* ---------- ФИЛЬТР ПРОЕКТОВ ---------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                const show = filter === 'all' || card.dataset.cat === filter;
                card.classList.toggle('hidden', !show);
            });
        });
    });

    /* ---------- ЧАСЫ ---------- */
    const clock = document.getElementById('clock');
    if (clock) {
        const tick = () => {
            const d = new Date();
            clock.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        };
        tick();
        setInterval(tick, 1000);
    }

    /* ---------- ПАСХАЛКА: ДРОЖАНИЕ И СЕКРЕТНЫЙ РЕЖИМ ---------- */
    const screenEl = document.querySelector('.crt-screen');
    const rainbowOverlay = document.getElementById('rainbow-overlay');
    const spinMordecai = document.getElementById('spin-mordecai');

    if (screenEl) {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes shake {
                0% { transform: translate(0,0); }
                25% { transform: translate(-2px,1px); }
                50% { transform: translate(2px,-1px); }
                75% { transform: translate(-1px,2px); }
                100% { transform: translate(0,0); }
            }
        `;
        document.head.appendChild(styleSheet);
        
        screenEl.addEventListener('click', (e) => {
            // Если кликнули по ссылке или кнопке — ничего не делаем
            if (e.target.closest('a, button')) return;
            
            // Эффект дрожания
            screenEl.style.animation = 'none';
            void screenEl.offsetHeight;
            screenEl.style.animation = 'shake 0.15s ease';
            setTimeout(() => { screenEl.style.animation = ''; }, 150);

            // Проверка на пасхалку (если нет активных окон)
            const hasActiveWindows = document.querySelectorAll('.window.active').length > 0;
            if (!hasActiveWindows) {
                secretClicks++;
                if (secretClicks >= 15) {
                    triggerSecretEasterEgg();
                    secretClicks = 0; // сбрасываем
                }
            }
        });
    }

    function triggerSecretEasterEgg() {
        if (!rainbowOverlay || !spinMordecai) return;
        
        rainbowOverlay.classList.remove('hidden');
        spinMordecai.classList.remove('hidden');
        
        // Отключаем пасхалку через 5 секунд
        setTimeout(() => {
            rainbowOverlay.classList.add('hidden');
            spinMordecai.classList.add('hidden');
        }, 5000);
    }
});