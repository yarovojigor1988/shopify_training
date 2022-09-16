if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      this.submitButton = this.querySelector('[type="submit"]');
      if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.handleErrorMessage();

      if (document.getElementById('add-gift-option')) {
        const giftOption = document.querySelector('#add-gift-option');
        const giftMessage = document.querySelector('.custom-gift-message');
        const giftDelivery = document.querySelector('.custom-gift-delivery');
        const giftEmail = document.querySelector('.custom-gift-email');
        const giftDeliveryInput = giftDelivery.querySelectorAll('input');
        const giftMessageInput = giftMessage.querySelector('input');
        const giftEmailInput = giftEmail.querySelector('input');
        const addGiftHidden = document.getElementById('add-gift-hiden');
        let emailDelivery = false;

        giftDeliveryInput.forEach(el => {
          if (el.checked && el.value === 'Email') {
            emailDelivery = true;
          }})

        if (giftOption.checked) {
          const patternstr = '^[A-Za-z0-9., \n]{0,50}$';
          let constraint = new RegExp(patternstr);
          if(!constraint.test(giftMessageInput.value.trim()) || giftMessageInput.value.trim().length === 0) {
            this.handleGiftErrorMessage('Please input valid gift message');
            return
          } 

          if (emailDelivery) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!re.test(giftEmailInput.value.trim()) || giftEmailInput.value.trim().length === 0) {
              this.handleGiftErrorMessage('Please input valid email');
              return
            }  
          }
          
        } else {
          giftMessageInput.name = 'properties[_Gift message]';
          giftDeliveryInput.forEach(el => {
            el.name = 'properties[_Delivery]';
          });
          giftEmailInput.name = 'properties[_Email to message]';
        }
      }

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData(this.form);
      if (this.cart) {
        formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
        formData.append('sections_url', window.location.pathname);
        this.cart.setActiveElement(document.activeElement);
      }
      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            this.handleErrorMessage(response.description);

            const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
            if (!soldOutMessage) return;
            this.submitButton.setAttribute('aria-disabled', true);
            this.submitButton.querySelector('span').classList.add('hidden');
            soldOutMessage.classList.remove('hidden');
            this.error = true;
            return;
          } else if (!this.cart) {
            window.location = window.routes.cart_url;
            return;
          }

          this.error = false;
          const quickAddModal = this.closest('quick-add-modal');
          if (quickAddModal) {
            document.body.addEventListener('modalClosed', () => {
              setTimeout(() => { this.cart.renderContents(response) });
            }, { once: true });
            quickAddModal.hide(true);
          } else {
            this.cart.renderContents(response);
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.submitButton.classList.remove('loading');
          if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
          if (!this.error) this.submitButton.removeAttribute('aria-disabled');
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');

          if (document.getElementById('add-gift-option')) {
            const giftMessage = document.querySelector('.custom-gift-message');
            const giftDelivery = document.querySelector('.custom-gift-delivery');
            const giftEmail = document.querySelector('.custom-gift-email');
            const giftDeliveryInput = giftDelivery.querySelectorAll('input');
            const giftMessageInput = giftMessage.querySelector('input');
            const giftEmailInput = giftEmail.querySelector('input');

            giftMessageInput.name = 'properties[Gift message]';
            giftDeliveryInput.forEach(el => {
              el.name = 'properties[Delivery]';
            });
            giftEmailInput.name = 'properties[Email to message]';
          }

        });
    }

    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }

    handleGiftErrorMessage(errorMessage = false) {
      this.errorMessageWrapper2 = this.querySelector('.gift-product-form__error-message-wrapper');
      if (!this.errorMessageWrapper2) return;
      this.errorMessage2 = this.errorMessageWrapper2.querySelector('.gift-product-form__error-message');

      this.errorMessageWrapper2.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage2.textContent = errorMessage;
      }
    }
  });
}
