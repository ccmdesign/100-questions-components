$(document).ready(() => {
  $('.accordion').each(function () {
      const accordion = $(this)
      const onlyOneOpen = accordion.hasClass('accordion--only-one') // if an accordion has also the class "accordion--only-one", it will open one item at a time
      let openItems = 0
      accordion.children('.accordion-item').each(function () {
        const el = $(this)
        const toggleButton = el.children('.accordion-item__toggle-button')
        const contentWrapper = el.children('.accordion-item__content')
        const contentHeight = contentWrapper.height() + 'px'
        toggleButton.click(function () {
            if (el.hasClass('accordion-item--active')) {
              contentWrapper.css('height', 0)
              el.removeClass('accordion-item--active')
            } else {
              if (onlyOneOpen) {
                accordion.children('.accordion-item--active').children('.accordion-item__toggle-button').click()
              }
              contentWrapper.css('height', contentHeight)
              el.addClass('accordion-item--active')
            }
        })
        const isActive = el.hasClass('accordion-item--active')
        if (isActive) {
            contentWrapper.css('height', 0) // fix initial closing bug
            if (onlyOneOpen && openItems++ !== 0) {
                el.removeClass('accordion-item--active')
            } else {
                contentWrapper.css('height', contentHeight) // fix initial closing bug
            }
        } else {
            contentWrapper.css('height', 0)
        }
      })
  })
})
