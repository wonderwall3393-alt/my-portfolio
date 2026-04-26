// Vanilla JavaScript Scroll Animation - Photo turun dan rotate
(function () {
    const photo = document.querySelector('.my-photo');
    if (!photo) return;

    // Konfigurasi berdasarkan ukuran layar
    let config = {
        scrollStart: 1,      // Mulai animasi setelah scroll 100px
        scrollDistance: 600,   // Durasi animasi dalam pixel scroll
        maxTranslateY: 400,    // Berapa pixel foto turun ke bawah
        startRotate: 0,      // Rotasi awal (derajat miring)
        endRotate: -13,          // Rotasi akhir (lurus)
        startScale: 1,       // Scale awal (80% ukuran asli)
        endScale: 1.3          // Scale akhir (120% ukuran asli)
    };

    let aosFinished = false;

    // Update konfigurasi berdasarkan screen size
    function updateConfig() {
        if (window.matchMedia("(max-width: 768px)").matches) {
            config.scrollStart = 1;
            config.scrollDistance = 400;
            config.maxTranslateY = 130;
        } else if (window.matchMedia("(max-width: 1161px)").matches) {
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
        // Set posisi awal setelah AOS selesai
        photo.style.transform = `rotate(${config.startRotate}deg) scale(${config.startScale})`;
    }, 1600); // Sesuaikan dengan durasi AOS Anda

    // Handle scroll event
    function handleScroll() {
        if (!aosFinished) return;

        const scrollY = window.pageYOffset || window.scrollY;
        const scrollProgress = scrollY - config.scrollStart;

        if (scrollProgress >= 0 && scrollProgress <= config.scrollDistance) {
            // Hitung progress (0 sampai 1)
            const progress = scrollProgress / config.scrollDistance;

            // Hitung translateY (foto turun)
            const translateY = progress * config.maxTranslateY;

            // Hitung rotate (dari -15deg ke 0deg)
            const rotate = config.startRotate + (progress * (config.endRotate - config.startRotate));

            // Hitung scale (dari kecil ke besar)
            const scale = config.startScale + (progress * (config.endScale - config.startScale));

            // Apply transform
            photo.style.transform = `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`;

        } else if (scrollProgress > config.scrollDistance) {
            // Animasi selesai - posisi final
            photo.style.transform = `translateY(${config.maxTranslateY}px) rotate(${config.endRotate}deg) scale(${config.endScale})`;
        } else {
            // Belum mulai animasi - posisi awal
            photo.style.transform = `translateY(0) rotate(${config.startRotate}deg) scale(${config.startScale})`;
        }
    }

    // Smooth scroll dengan requestAnimationFrame
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

    // Update config saat resize
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            updateConfig();
            handleScroll();
        }, 100);
    });

    // Jangan set transform di sini, biar AOS dulu yang jalan
    // Transform awal akan di-set setelah AOS selesai (lihat setTimeout di atas)

    // Initial call setelah AOS selesai
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

        // Stagger items bottom → top (items are ordered in reverse in HTML)
        items.forEach((item, i) => {
            // Small timeout to ensure transition kicks in after display
            setTimeout(() => {
                item.classList.add('visible');
            }, 10);
        });
    }

    function closeMenu() {
        isOpen = false;
        toggle.classList.remove('open');
        backdrop.classList.remove('active');

        // Add closing class for out-animation, then clean up
        items.forEach(item => {
            item.classList.remove('visible');
            item.classList.add('closing');
        });

        // Remove closing class after animation finishes
        setTimeout(() => {
            items.forEach(item => item.classList.remove('closing'));
        }, 380);
    }

    toggle.addEventListener('click', () => {
        isOpen ? closeMenu() : openMenu();
    });

    // Close when clicking backdrop
    backdrop.addEventListener('click', closeMenu);

    // Close when a menu link is clicked
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMenu, 150);
        });
    });

    // Keyboard support
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