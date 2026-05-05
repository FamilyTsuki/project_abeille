import { RevealObserver } from './RevealObserver.js';

export class AppRouter {
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
        
        setTimeout(() => RevealObserver.checkAll(), 50);
    }

    updateNavigationUI(activeViewId) {
        document.querySelectorAll('.nav-links .nav-item').forEach(item => {
            const isActive = item.dataset.target === activeViewId;
            item.classList.toggle('active', isActive);
            if (isActive) {
                item.setAttribute('aria-current', 'page');
            } else {
                item.removeAttribute('aria-current');
            }
        });
    }

    updatePageMetadata(viewId) {
        const viewTitle = this.viewTitles[viewId] || 'Accueil';
        document.title = `L'Abeille Olivetaine | ${viewTitle}`;
    }
}
