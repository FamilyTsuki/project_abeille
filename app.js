/**
 * L'Abeille Olivetaine - Core Application Logic
 * Clean Code, SOLID principles, and Premium UX.
 */

class MenuController {
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
        
        // Close menu on link click for mobile
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
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.navLinks?.classList.remove('active');
        this.navOverlay?.classList.remove('active');
        this.body.classList.remove('no-scroll');
    }
}

class AppRouter {
    constructor(menuController) {
        this.menu = menuController;
        this.currentViewId = 'home';
        this.viewTitles = { 
            'home': 'Accueil', 
            'about': 'Mission', 
            'news': 'Actu', 
            'donate': 'Don', 
            'contact': 'Contact',
            'apiculture': 'Conseils',
            'membership': 'Adhésion'
        };
        
        this.initializeNavigation();
    }

    initializeNavigation() {
        document.addEventListener('click', (event) => {
            const navigationTrigger = event.target.closest('.nav-item, .nav-logo');
            if (navigationTrigger) {
                event.preventDefault();
                const targetView = navigationTrigger.dataset.target;
                if (targetView) this.navigateTo(targetView);
            }
        });
    }

    navigateTo(viewId) {
        if (viewId === this.currentViewId) return;

        const currentViewElement = document.getElementById(this.currentViewId);
        const targetViewElement = document.getElementById(viewId);

        if (targetViewElement) {
            this.updateViewVisibility(currentViewElement, targetViewElement);
            this.updateNavigationUI(viewId);
            this.updatePageMetadata(viewId);
            
            this.currentViewId = viewId;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    updateViewVisibility(oldView, newView) {
        if (oldView) oldView.classList.remove('active');
        newView.classList.add('active');
        
        // Trigger reveal check for the new view
        setTimeout(() => RevealObserver.checkAll(), 50);
    }

    updateNavigationUI(activeViewId) {
        document.querySelectorAll('.nav-links .nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.target === activeViewId);
        });
    }

    updatePageMetadata(viewId) {
        const viewTitle = this.viewTitles[viewId] || 'Accueil';
        document.title = `L'Abeille Olivetaine | ${viewTitle}`;
    }
}

class DonationController {
    constructor() {
        this.donationAmount = 25;
        this.donationFrequency = 'onetime';
        
        this.form = document.getElementById('donationForm');
        this.onetimeButton = document.getElementById('btn-onetime');
        this.monthlyButton = document.getElementById('btn-monthly');
        this.customAmountGroup = document.getElementById('customAmountGroup');
        this.customAmountInput = document.getElementById('customAmount');
        this.taxDeductionDisplay = document.getElementById('taxDeductionText');
        this.submitAmountDisplay = document.getElementById('submitAmount');
        this.amountButtons = document.querySelectorAll('.amount-btn');
    }

    initialize() {
        if (!this.form) return;

        this.setupFrequencyListeners();
        this.setupAmountListeners();
        this.setupCustomAmountListener();
        this.setupSubmitListener();
    }

    setupFrequencyListeners() {
        [this.onetimeButton, this.monthlyButton].forEach(btn => {
            btn?.addEventListener('click', () => {
                this.setFrequency(btn.dataset.freq);
            });
        });
    }

    setFrequency(frequency) {
        this.donationFrequency = frequency;
        const isOnetime = frequency === 'onetime';
        
        this.onetimeButton?.classList.toggle('btn-primary', isOnetime);
        this.onetimeButton?.classList.toggle('btn-outline', !isOnetime);
        
        this.monthlyButton?.classList.toggle('btn-primary', !isOnetime);
        this.monthlyButton?.classList.toggle('btn-outline', isOnetime);
    }

    setupAmountListeners() {
        this.amountButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.amountButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                
                const value = button.dataset.amount;
                if (value === 'custom') {
                    this.showCustomAmountInput(true);
                } else {
                    this.showCustomAmountInput(false);
                    this.donationAmount = parseInt(value, 10);
                    this.refreshDonationUI();
                }
            });
        });
    }

    setupCustomAmountListener() {
        this.customAmountInput?.addEventListener('input', (e) => {
            this.donationAmount = parseInt(e.target.value, 10) || 0;
            this.refreshDonationUI();
        });
    }

    showCustomAmountInput(shouldShow) {
        if (this.customAmountGroup) {
            this.customAmountGroup.style.display = shouldShow ? 'block' : 'none';
            if (shouldShow) this.customAmountInput?.focus();
        }
    }

    refreshDonationUI() {
        const netCost = (this.donationAmount * 0.34).toFixed(2);
        if (this.taxDeductionDisplay) {
            this.taxDeductionDisplay.textContent = `Un don de ${this.donationAmount}€ ne vous coûte que ${netCost}€ après réduction d'impôt.`;
        }
        if (this.submitAmountDisplay) {
            this.submitAmountDisplay.textContent = this.donationAmount;
        }
    }

    setupSubmitListener() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log(`Donation: ${this.donationFrequency}, Amount: ${this.donationAmount}€`);
            alert(`Merci pour votre soutien ! Simulation de don ${this.donationFrequency === 'onetime' ? 'ponctuel' : 'mensuel'} de ${this.donationAmount}€.`);
        });
    }
}

/**
 * Handles scroll-reveal animations using Intersection Observer.
 */
class RevealObserver {
    static init() {
        const options = {
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        this.observer = observer;
    }

    static checkAll() {
        document.querySelectorAll('.reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }
}

// Global UI Handlers
class UIHandler {
    static init() {
        // Handle contact form
        const contactForm = document.getElementById('contactForm');
        contactForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Merci ! Votre message a été envoyé.');
            contactForm.reset();
        });
    }
}

// Application Orchestrator
document.addEventListener('DOMContentLoaded', () => {
    const menuController = new MenuController();
    const appRouter = new AppRouter(menuController);
    const donationController = new DonationController();
    
    donationController.initialize();
    RevealObserver.init();
    UIHandler.init();

    // Export for debugging if needed
    window.app = { menuController, appRouter, donationController };
});
