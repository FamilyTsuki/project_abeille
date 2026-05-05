export class DonationController {
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
            alert(`Merci pour votre soutien ! Simulation de don ${this.donationFrequency === 'onetime' ? 'ponctuel' : 'mensuel'} de ${this.donationAmount}€.`);
        });
    }
}
