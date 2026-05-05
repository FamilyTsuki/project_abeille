import { MenuController } from './modules/MenuController.js';
import { AppRouter } from './modules/AppRouter.js';
import { DonationController } from './modules/DonationController.js';
import { RevealObserver } from './modules/RevealObserver.js';
import { ScrollHandler } from './modules/ScrollHandler.js';
import { UIHandler } from './modules/UIHandler.js';

document.addEventListener('DOMContentLoaded', () => {
    const menuController = new MenuController();
    const appRouter = new AppRouter(menuController);
    const donationController = new DonationController();
    
    donationController.initialize();
    RevealObserver.init();
    UIHandler.init();
    ScrollHandler.init();

    window.app = { menuController, appRouter, donationController };
});
