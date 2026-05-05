export class UIHandler {
    static init() {
        const contactForm = document.getElementById('contactForm');
        contactForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Merci ! Votre message a été envoyé.');
            contactForm.reset();
        });
    }
}
