/**
 * L'Abeille Olivetaine - Core Application Logic
 * Follows Clean Code and SOLID principles.
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
        if (this.menuButton) {
            this.menuButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.toggleMenu();
            });
        }
        if (this.navOverlay) {
            this.navOverlay.addEventListener('click', () => this.closeMenu());
        }
    }

    toggleMenu() {
        this.isMenuOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.isMenuOpen = true;
        this.menuButton?.classList.add('active');
        this.navLinks?.classList.add('active');
        this.navOverlay?.classList.add('active');
        this.body.classList.add('no-scroll');
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.menuButton?.classList.remove('active');
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
                const targetView = navigationTrigger.dataset.target || 'home';
                this.navigateTo(targetView);
            }
        });
    }

    navigateTo(viewId) {
        const currentViewElement = document.getElementById(this.currentViewId);
        const targetViewElement = document.getElementById(viewId);

        if (targetViewElement) {
            this.updateViewVisibility(currentViewElement, targetViewElement);
            this.updateNavigationUI(viewId);
            this.updatePageMetadata(viewId);
            
            this.currentViewId = viewId;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.menu.closeMenu();
        }
    }

    updateViewVisibility(oldView, newView) {
        if (oldView) oldView.classList.remove('active');
        newView.classList.add('active');
    }

    updateNavigationUI(activeViewId) {
        document.querySelectorAll('.nav-item').forEach(item => {
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
        
        // Cache DOM elements
        this.onetimeButton = document.getElementById('btn-onetime');
        this.monthlyButton = document.getElementById('btn-monthly');
        this.customAmountGroup = document.getElementById('customAmountGroup');
        this.customAmountInput = document.getElementById('customAmount');
        this.taxDeductionDisplay = document.getElementById('taxDeductionText');
        this.submitAmountDisplay = document.getElementById('submitAmount');
        this.amountButtons = document.querySelectorAll('.amount-btn');
    }

    initialize() {
        this.setupAmountListeners();
        this.setupCustomAmountListener();
    }

    setFrequency(frequency) {
        this.donationFrequency = frequency;
        
        const isOnetime = frequency === 'onetime';
        this.updateButtonState(this.onetimeButton, isOnetime);
        this.updateButtonState(this.monthlyButton, !isOnetime);
    }

    updateButtonState(button, isActive) {
        if (!button) return;
        button.classList.toggle('btn-primary', isActive);
        button.classList.toggle('btn-outline', !isActive);
    }

    setupAmountListeners() {
        this.amountButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                this.amountButtons.forEach(btn => btn.classList.remove('selected'));
                event.target.classList.add('selected');
                
                const value = event.target.dataset.amount;
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
        this.customAmountInput?.addEventListener('input', (event) => {
            this.donationAmount = parseInt(event.target.value, 10) || 0;
            this.refreshDonationUI();
        });
    }

    showCustomAmountInput(shouldShow) {
        if (!this.customAmountGroup) return;
        this.customAmountGroup.style.display = shouldShow ? 'block' : 'none';
    }

    refreshDonationUI() {
        const netCostAfterTax = (this.donationAmount * 0.34).toFixed(2);
        if (this.taxDeductionDisplay) {
            this.taxDeductionDisplay.textContent = `Un don de ${this.donationAmount}€ ne vous coûte que ${netCostAfterTax}€ après réduction d'impôt.`;
        }
        if (this.submitAmountDisplay) {
            this.submitAmountDisplay.textContent = this.donationAmount;
        }
    }

    handleDonationSubmit(event) {
        event.preventDefault();
        // Replacing alert with console log for cleaner production-like feel, 
        // or a custom toast could be implemented here.
        console.log(`Donation: ${this.donationFrequency}, Amount: ${this.donationAmount}€`);
        alert(`Merci pour votre soutien ! Simulation de don ${this.donationFrequency === 'onetime' ? 'ponctuel' : 'mensuel'} de ${this.donationAmount}€.`);
    }
}

// Application Orchestrator
document.addEventListener('DOMContentLoaded', () => {
    const menuController = new MenuController();
    const appRouter = new AppRouter(menuController);
    const donationController = new DonationController();
    
    donationController.initialize();

    // Exporting controllers to window only if necessary for HTML inline events (eco-conception: better to use addEventListener)
    window.appRouter = appRouter;
    window.donation = donationController;
});
