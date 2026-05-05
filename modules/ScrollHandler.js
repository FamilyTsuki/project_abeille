export class ScrollHandler {
    static init() {
        const navbar = document.getElementById('navbar');
        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    navbar?.classList.toggle('scrolled', lastScrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}
