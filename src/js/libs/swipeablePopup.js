class SwipeablePopup {
    constructor(selector, popupModal) {
        this.popup = document.querySelector(selector);
        this.startY = 0;
        this.startPopupY = 0; // Store the initial popup position
        this.touching = false;
        this.popupModal = document.querySelector(popupModal);
        this.startedInUpperArea = false;

        this.popup.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.popup.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.popup.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    onTouchStart(event) {
        this.startY = event.touches[0].clientY;
        this.startPopupY = this.popup.offsetTop; // Store the initial popup position
        const parentTopOffset = this.popup.parentElement.offsetTop; // Offset of parent container
        this.startedInUpperArea = this.startY <= (this.startPopupY + parentTopOffset + 50); // Check if started in upper area
        this.touching = true;
    }

    onTouchMove(event) {
        if (!this.touching || !this.startedInUpperArea) return;

        const deltaY = event.touches[0].clientY - this.startY;

        if (deltaY > 0) { // Check if moving downwards
            const newY = deltaY;
            this.popup.style.transform = `translate(0%, ${newY}px)`; // Apply translateY

            // Calculate opacity based on distance
            const opacity = 1 - (deltaY / 300); // Make it more transparent as deltaY approaches 100
            this.popup.style.opacity = opacity;
        }
    }

    onTouchEnd(event) {
        if (!this.touching || !this.startedInUpperArea) return;
        this.touching = false;
        if(!this.startedInUpperArea) this.startPopupY = 0

        const deltaY = event.changedTouches[0].clientY - this.startY;
        console.log(deltaY)
        if (Math.abs(deltaY) < 120) {
            this.popup.style.transform = `translate(0%, 0)`; // Return to the initial position
            this.popup.style.opacity = 1
        } else {
            this.popup.style.transform = `translate(0%, 100%)`;
            this.popupModal.classList.remove('_is-open')

            let isCloseAllModal = true
            document.querySelectorAll('[data-popup]').forEach(el_modal => {
                if(el_modal.classList.contains('_is-open')) isCloseAllModal = false
            })

            toggleBodyLock(!isCloseAllModal)

            setTimeout(() => {
                this.popup.removeAttribute('style')
            }, 500)
        }
        this.popup.removeAttribute('style')

    }
}