// Vanilla JavaScript Scroll Animation - Photo turun dan rotate
// Hanya aktif di desktop (> 1024px)
(function () {
    const photo = document.querySelector('.my-photo');
    if (!photo) return;

    // Cek apakah layar tablet/mobile — jika ya, skip semua animasi scroll
    function isTabletOrMobile() {
        return window.innerWidth <= 1024;
    }

    // Jika tablet/mobile, pastikan foto tidak dirender (sudah disembunyikan via CSS)
    // Tidak perlu lakukan apa-apa
    if (isTabletOrMobile()) return;

    // Konfigurasi berdasarkan ukuran layar (hanya desktop)
    let config = {
        scrollStart: 1,
        scrollDistance: 600,
        maxTranslateY: 400,
        startRotate: 0,
        endRotate: -13,
        startScale: 1,
        endScale: 1.3
    };

    let aosFinished = false;

    function updateConfig() {
        if (window.matchMedia("(max-width: 1161px)").matches) {
            config.scrollStart = 1;
            config.scrollDistance = 350;
            config.maxTranslateY = 350;
        } else {
            config.scrollStart = 1;
            config.scrollDistance = 400;
            config.maxTranslateY = 350;
        }
    }

    updateConfig();

    // Tunggu AOS selesai dulu
    setTimeout(function () {
        aosFinished = true;
        photo.style.transition = 'transform 0.05s linear';
        photo.style.transform = `rotate(${config.startRotate}deg) scale(${config.startScale})`;
    }, 1600);

    function handleScroll() {
        if (!aosFinished) return;

        // Double-check: jika user resize ke tablet saat scroll, stop
        if (isTabletOrMobile()) return;

        const scrollY = window.pageYOffset || window.scrollY;
        const scrollProgress = scrollY - config.scrollStart;

        if (scrollProgress >= 0 && scrollProgress <= config.scrollDistance) {
            const progress = scrollProgress / config.scrollDistance;
            const translateY = progress * config.maxTranslateY;
            const rotate = config.startRotate + (progress * (config.endRotate - config.startRotate));
            const scale = config.startScale + (progress * (config.endScale - config.startScale));
            photo.style.transform = `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`;
        } else if (scrollProgress > config.scrollDistance) {
            photo.style.transform = `translateY(${config.maxTranslateY}px) rotate(${config.endRotate}deg) scale(${config.endScale})`;
        } else {
            photo.style.transform = `translateY(0) rotate(${config.startRotate}deg) scale(${config.startScale})`;
        }
    }

    let ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            // Jika resize ke tablet, reset transform dan stop
            if (isTabletOrMobile()) {
                photo.style.transform = '';
                return;
            }
            updateConfig();
            handleScroll();
        }, 100);
    });

    setTimeout(function () {
        handleScroll();
    }, 1600);
})();

(function () {
    const toggle = document.getElementById('fabToggle');
    const menu = document.getElementById('fabMenu');
    const backdrop = document.getElementById('fabBackdrop');
    const items = menu.querySelectorAll('.fab-menu-item');

    let isOpen = false;

    function openMenu() {
        isOpen = true;
        toggle.classList.add('open');
        backdrop.classList.add('active');

        items.forEach((item, i) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, 10);
        });
    }

    function closeMenu() {
        isOpen = false;
        toggle.classList.remove('open');
        backdrop.classList.remove('active');

        items.forEach(item => {
            item.classList.remove('visible');
            item.classList.add('closing');
        });

        setTimeout(() => {
            items.forEach(item => item.classList.remove('closing'));
        }, 380);
    }

    toggle.addEventListener('click', () => {
        isOpen ? closeMenu() : openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMenu, 150);
        });
    });

    toggle.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            isOpen ? closeMenu() : openMenu();
        }
        if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isOpen) closeMenu();
    });
})();