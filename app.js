class MenuController {
    constructor() {
        this.btn = document.getElementById('mobileMenuBtn');
        this.nav = document.getElementById('navLinks');
        this.overlay = document.getElementById('navOverlay');
        this.isOpen = false;
        this.bindEvents();
    }

    bindEvents() {
        this.btn.addEventListener('click', () => this.toggle());
        this.overlay.addEventListener('click', () => this.close());
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.btn.setAttribute('aria-expanded', 'true');
        this.btn.classList.add('active');
        this.nav.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        this.btn.setAttribute('aria-expanded', 'false');
        this.btn.classList.remove('active');
        this.nav.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

class AppRouter {
    constructor(menuController) {
        this.currentView = 'home';
        this.menuController = menuController;
        this.init();
    }
    
    init() {
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.dataset.target;
                if (target) {
                    this.navigate(target);
                    this.menuController.close();
                }
            });
        });

        // Initialize animations on first view
        this.animateIn(this.currentView);
    }

    animateIn(viewId) {
        const section = document.getElementById(viewId);
        if (section) {
            section.classList.add('animate-in');
            // Reset after animation
            setTimeout(() => section.classList.remove('animate-in'), 1000);
        }
    }

    navigate(viewId) {
        if(this.currentView === viewId) return;

        const oldView = document.getElementById(this.currentView);
        const newView = document.getElementById(viewId);

        if (oldView && newView) {
            oldView.classList.remove('active');
            newView.classList.add('active');
            this.animateIn(viewId);
        }
        
        document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.toggle('active', link.dataset.target === viewId);
        });

        this.currentView = viewId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        const titleMap = {
            'home': 'Accueil',
            'about': 'Qui sommes-nous',
            'news': 'Actualités',
            'donate': 'Faire un don',
            'contact': 'Contact',
            'legal': 'Mentions Légales'
        };
        document.title = `L'Abeille Olivetaine | ${titleMap[viewId] || 'Accueil'}`;
    }
}

class DonationController {
    constructor() {
        this.frequency = 'onetime';
        this.amount = 25;
        this.initEvents();
    }

    setFrequency(freq) {
        this.frequency = freq;
        const btnOneTime = document.getElementById('btn-onetime');
        const btnMonthly = document.getElementById('btn-monthly');

        if (freq === 'onetime') {
            btnOneTime.classList.add('btn-primary');
            btnOneTime.classList.remove('btn-outline');
            btnMonthly.classList.add('btn-outline');
            btnMonthly.classList.remove('btn-primary');
        } else {
            btnOneTime.classList.add('btn-outline');
            btnOneTime.classList.remove('btn-primary');
            btnMonthly.classList.add('btn-primary');
            btnMonthly.classList.remove('btn-outline');
        }
    }

    updateTax() {
        const costAfterTaxes = (this.amount * 0.34).toFixed(2);
        const taxText = document.getElementById('taxDeductionText');
        const submitAmount = document.getElementById('submitAmount');
        
        if (taxText) {
            taxText.textContent = `Un don de ${this.amount}€ ne vous coûte que ${costAfterTaxes}€ après réduction d'impôt (66%).`;
        }
        if (submitAmount) {
            submitAmount.textContent = this.amount;
        }
    }

    initEvents() {
        const amountBtns = document.querySelectorAll('.amount-btn');
        const customInputGroup = document.getElementById('customAmountGroup');
        const customInput = document.getElementById('customAmount');

        amountBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                amountBtns.forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');

                const val = e.target.dataset.amount;
                if (val === 'custom') {
                    if (customInputGroup) customInputGroup.style.display = 'block';
                    this.amount = customInput && customInput.value ? parseInt(customInput.value) : 0;
                } else {
                    if (customInputGroup) customInputGroup.style.display = 'none';
                    this.amount = parseInt(val);
                }
                this.updateTax();
            });
        });

        if (customInput) {
            customInput.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                this.amount = isNaN(val) ? 0 : val;
                this.updateTax();
            });
        }
    }

    submit(event) {
        event.preventDefault();
        if(this.amount <= 0) {
            alert("Veuillez saisir un montant valide.");
            return;
        }
        const freqText = this.frequency === 'onetime' ? 'ponctuel' : 'mensuel';
        alert(`Merci pour votre intention de don ${freqText} de ${this.amount}€. \n\n(Ceci est une simulation éco-conçue)`);
    }
}

class FormController {
    submit(event) {
        event.preventDefault();
        alert("Votre message a bien été envoyé. Nous vous répondrons très vite !");
        event.target.reset();
    }
}

// Startup
document.addEventListener('DOMContentLoaded', () => {
    const menu = new MenuController();
    window.appRouter = new AppRouter(menu);
    window.donationController = new DonationController();
    window.formController = new FormController();
});
