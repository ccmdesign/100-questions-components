const utils = {
    hasClass (el, className) {
        const classes = el.className.split(' ')
        for (const clazz of classes) {
            if (clazz === className) {
                return true
            }
        }
        return false
    },
    children (el, selector) {
        return selector ? el.querySelectorAll(selector) : el.children
    },
    clone (el) {
        if (el instanceof NodeList || el instanceof HTMLCollection) {
            const cloneArr = []
            for (const e of el) {
                cloneArr.push(e.cloneNode(true))
            }
            return cloneArr
        }
        return el.cloneNode(true)
    },
    calculateHeight (el) {
        if (el instanceof NodeList || el instanceof HTMLCollection) {
            let calculatedHeight = 0
            for (const e of el) {
                calculatedHeight += e.clientHeight
            }
            return calculatedHeight
        }
        return el.clientHeight
    }
}

function registerModalComponent () {
    const modalHandler = {
        modalOverlayEl: document.querySelector('.modal-overlay'),
        modalWindowEl: document.querySelector('.modal-window'),
        modalWindowContentEl: document.querySelector('.modal-window__content'),
        open: function (modalId) {
            if (!modalId) {
                console.error('You must specify a "modalId" before opening a modal.')
                return
            }
            const modalContent = document.querySelector(`.modal[data-modal-id="${modalId}"`)
            if (!modalContent || modalContent.length === 0) {
                console.error('Modal not found: ', modalId)
                return
            }
            const modalClone = utils.clone(utils.children(modalContent))
            for(const modalEl of modalClone) {
                this.modalWindowContentEl.appendChild(modalEl)
            }
            this.modalOverlayEl.classList.add('visible')
            this.modalWindowEl.classList.add('open')
            document.body.style.overflow = 'hidden'
        },
        close: function (immediate) {
            const overlayEl = this.modalOverlayEl
            if (immediate) {
                overlayEl.style.transition = 'none'
                overlayEl.classList.remove('visible')
            } else {
                overlayEl.style.transition = 'opacity 0.13s cubic-bezier(0.4, 0.0, 0.2, 1)'
                overlayEl.classList.remove('visible')
            }
            this.modalWindowEl.classList.remove('open')
            const deleteRange = document.createRange()
            deleteRange.selectNodeContents(this.modalWindowContentEl)
            deleteRange.deleteContents()
            document.body.style.overflow = 'auto'
        }
    }
    const modalButtons = document.querySelectorAll('[data-modal-target]')
    modalButtons.forEach((el) => {
        const modalId = el.getAttribute('data-modal-target')
        el.addEventListener('click', () => {
            modalHandler.open(modalId)
        })
    })
    modalHandler.modalOverlayEl.addEventListener('click', (e) => {
        if (utils.hasClass(e.target, 'modal-overlay')) {
            modalHandler.close(true)
        }
    })
    document.querySelector('.modal-window__close').addEventListener('click', () => {
        modalHandler.close()
    })
}

function registerAccordionComponent () {
    const accordions = document.querySelectorAll('.accordion')
    accordions.forEach((accordion) => {
        const onlyOneOpen = utils.hasClass(accordion, 'accordion--only-one') // if an accordion has also the class "accordion--only-one", it will open one item at a time
        let openItems = 0
        utils.children(accordion, '.accordion-item').forEach((el) => {
            const toggleButton = utils.children(el, '.accordion-item__toggle-button')
            const contentWrapper = utils.children(el, '.accordion-item__content')
            const calculatedHeight = utils.calculateHeight(contentWrapper)
            const contentHeight = calculatedHeight + 'px'
            toggleButton.forEach((button) => {
                button.addEventListener('click', () => {
                    if (utils.hasClass(el, 'accordion-item--active')) {
                        contentWrapper.forEach((e) => (e.style.height = 0))
                        el.classList.remove('accordion-item--active')
                    } else {
                        if (onlyOneOpen) {
                            const activeItems = utils.children(accordion, '.accordion-item--active')
                            activeItems.forEach((activeItem) => {
                                const itemChildren = utils.children(activeItem, '.accordion-item__toggle-button')
                                itemChildren.click()
                            })
                        }
                        contentWrapper.forEach((e) => (e.style.height = contentHeight))
                        el.classList.add('accordion-item--active')
                    }
                })
            })
            const isActive = utils.hasClass(el, 'accordion-item--active')
            if (isActive) {
                contentWrapper.forEach((e) => (e.style.height = 0)) // fix initial closing bug
                if (onlyOneOpen && openItems++ !== 0) {
                    el.classList.remove('accordion-item--active')
                } else {
                    contentWrapper.forEach((e) => (e.style.height = contentHeight)) // fix initial closing bug
                }
            } else {
                contentWrapper.forEach((e) => (e.style.height = 0))
            }
        })
    })
}

function registerMenu () {
    const navigationOverlayMenuButton = document.querySelector('.navigation-overlay__menu-button')
    navigationOverlayMenuButton.addEventListener('click', () => {
        const el = utils.children(navigationOverlayMenuButton, '.navigation-overlay__menu-icon')[0]
        const openMenuIcon = utils.children(el, '.navigation-overlay__menu-open')[0]
        const closeMenuIcon = utils.children(el, '.navigation-overlay__menu-close')[0]
        const navigationMenu = document.querySelector('.navigation-menu')
        const overlayBackground = document.querySelector('.navigation-overlay__background')
        if (utils.hasClass(openMenuIcon, 'active')) {
            closeMenuIcon.classList.add('active')
            openMenuIcon.classList.remove('active')
            navigationMenu.classList.add('navigation-menu--active')
            document.body.style.overflow = 'hidden'
            overlayBackground.classList.add('active')
        } else {
            openMenuIcon.classList.add('active')
            closeMenuIcon.classList.remove('active')
            navigationMenu.classList.remove('navigation-menu--active')
            document.body.style.overflow = 'auto'
            overlayBackground.classList.remove('active')
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    registerMenu()
    registerAccordionComponent()
    registerModalComponent()
})