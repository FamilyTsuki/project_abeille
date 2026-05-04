// L'Abeille Olivetaine - Core Logic

class MenuController {
    constructor() {
        this.btn = document.getElementById('mobileMenuBtn');
        this.nav = document.getElementById('navLinks');
        this.overlay = document.getElementById('navOverlay');
        this.isOpen = false;
        
        if (this.btn) {
            this.btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
        }
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.btn.classList.add('active');
        this.nav.classList.add('active');
        if (this.overlay) this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        if (this.btn) this.btn.classList.remove('active');
        if (this.nav) this.nav.classList.remove('active');
        if (this.overlay) this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

class AppRouter {
    constructor(menu) {
        this.menu = menu;
        this.currentView = 'home';
        this.init();
    }

    init() {
        // Intercept all navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('.nav-item, .nav-logo');
            if (link) {
                e.preventDefault();
                const target = link.dataset.target || 'home';
                this.navigate(target);
            }
        });
    }

    navigate(viewId) {
        const oldView = document.getElementById(this.currentView);
        const newView = document.getElementById(viewId);

        if (newView) {
            // Hide old, show new
            if (oldView) oldView.classList.remove('active');
            newView.classList.add('active');
            
            // Update UI
            document.querySelectorAll('.nav-item').forEach(l => {
                l.classList.toggle('active', l.dataset.target === viewId);
            });

            this.currentView = viewId;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.menu.close();
            
            // Update Page Title
            const titles = { 
                'home': 'Accueil', 
                'about': 'Mission', 
                'news': 'Actu', 
                'donate': 'Don', 
                'contact': 'Contact',
                'apiculture': 'Conseils',
                'membership': 'Adhésion'
            };
            document.title = `L'Abeille Olivetaine | ${titles[viewId] || 'Accueil'}`;
        }
    }
}

class DonationController {
    constructor() {
        this.amount = 25;
        this.freq = 'onetime';
    }

    setFrequency(f) {
        this.freq = f;
        document.getElementById('btn-onetime').className = f === 'onetime' ? 'btn btn-primary' : 'btn btn-outline';
        document.getElementById('btn-monthly').className = f === 'monthly' ? 'btn btn-primary' : 'btn btn-outline';
    }

    init() {
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                
                const val = e.target.dataset.amount;
                if (val === 'custom') {
                    document.getElementById('customAmountGroup').style.display = 'block';
                } else {
                    document.getElementById('customAmountGroup').style.display = 'none';
                    this.amount = parseInt(val);
                    this.updateUI();
                }
            });
        });

        document.getElementById('customAmount')?.addEventListener('input', (e) => {
            this.amount = parseInt(e.target.value) || 0;
            this.updateUI();
        });
    }

    updateUI() {
        const net = (this.amount * 0.34).toFixed(2);
        document.getElementById('taxDeductionText').textContent = `Un don de ${this.amount}€ ne vous coûte que ${net}€ après réduction d'impôt.`;
        document.getElementById('submitAmount').textContent = this.amount;
    }

    submit(e) {
        e.preventDefault();
        alert(`Merci ! Simulation de don ${this.freq} : ${this.amount}€`);
    }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
    const menu = new MenuController();
    window.appRouter = new AppRouter(menu);
    window.donation = new DonationController();
    window.donation.init();
});
