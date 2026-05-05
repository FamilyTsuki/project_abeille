export class MenuController {
    constructor() {
        this.menuButton = document.getElementById('mobileMenuBtn');
        this.navLinks = document.getElementById('navLinks');
        this.navOverlay = document.getElementById('navOverlay');
        this.body = document.body;
        this.isMenuOpen = false;
        
        this.initializeListeners();
    }

    initializeListeners() {
        this.menuButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });
        
        this.navOverlay?.addEventListener('click', () => this.closeMenu());
        
        this.navLinks?.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    toggleMenu() {
        this.isMenuOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.isMenuOpen = true;
        this.navLinks?.classList.add('active');
        this.navOverlay?.classList.add('active');
        this.body.classList.add('no-scroll');
        this.menuButton?.setAttribute('aria-expanded', 'true');
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.navLinks?.classList.remove('active');
        this.navOverlay?.classList.remove('active');
        this.body.classList.remove('no-scroll');
        this.menuButton?.setAttribute('aria-expanded', 'false');
    }
}
