const html = document.documentElement
const body = document.body
const pageWrapper = document.querySelector('.main')
const header = document.querySelector('.header')
const firstScreen = document.querySelector('[data-observ]')
const burgerButton = document.querySelector('.icon-menu')
const menu = document.querySelector('.menu')
const lockPaddingElements = document.querySelectorAll('[data-lp]')


const toggleBodyLock = (isLock) => {
  FLS(`Попап ${isLock ? 'открыт' : 'закрыт'}`)
  const lockPaddingValue = window.innerWidth - pageWrapper.offsetWidth

  setTimeout(() => {
    if (lockPaddingElements) {
      lockPaddingElements.forEach((element) => {
        element.style.paddingRight = isLock ? `${lockPaddingValue}px` : '0px'
      })
    }
  
    body.style.paddingRight = isLock ? `${lockPaddingValue}px` : '0px'
    body.classList.toggle('lock', isLock)
  }, isLock ? 0 : 500)
}
// logger (Full Logging System) =================================================================================================================
function FLS(message) {
  setTimeout(() => (window.FLS ? console.log(message) : null), 0)
}

// Проверка браузера на поддержку .webp изображений =================================================================================================================
function isWebp() {
  // Проверка поддержки webp
  const testWebp = (callback) => {
    const webP = new Image()

    webP.onload = webP.onerror = () => callback(webP.height === 2)
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  }
  // Добавление класса _webp или _no-webp для HTML
  testWebp((support) => {
    const className = support ? 'webp' : 'no-webp'
    html.classList.add(className)

    FLS(support ? 'webp поддерживается' : 'webp не поддерживается')
  })
}

/* Проверка мобильного браузера */
const isMobile = {
  Android: () => navigator.userAgent.match(/Android/i),
  BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
  iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
  Opera: () => navigator.userAgent.match(/Opera Mini/i),
  Windows: () => navigator.userAgent.match(/IEMobile/i),
  any: () =>
    isMobile.Android() ||
    isMobile.BlackBerry() ||
    isMobile.iOS() ||
    isMobile.Opera() ||
    isMobile.Windows(),
}
/* Добавление класса touch для HTML если браузер мобильный */
function addTouchClass() {
  // Добавление класса _touch для HTML если браузер мобильный
  if (isMobile.any()) {
    html.classList.add('touch')
  }
}

// Добавление loaded для HTML после полной загрузки страницы
function addLoadedClass() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      html.classList.add('loaded')
    }, 0)
  })
}

// Получение хеша в адресе сайта
const getHash = () => {
  if (location.hash) {
    return location.hash.replace('#', '')
  }
}

// Указание хеша в адресе сайта
function setHash(hash) {
  hash = hash ? `#${hash}` : window.location.href.split('#')[0]
  history.pushState('', '', hash)
}

// Функция для фиксированной шапки при скролле =================================================================================================================
function headerFixed() {
  const headerStickyObserver = new IntersectionObserver(([entry]) => {
    header.classList.toggle('sticky', !entry.isIntersecting)
  })

  if (firstScreen) {
    headerStickyObserver.observe(firstScreen)
  }
}

// Универсальная функция для открытия и закрытия попапо =================================================================================================================
const togglePopupWindows = () => {
  document.addEventListener('click', ({ target }) => {
    if (target.closest('[data-type]')) {
      const popup = document.querySelector(
        `[data-popup="${target.dataset.type}"]`
      )

      if (document.querySelector('._is-open')) {
        document.querySelectorAll('._is-open').forEach((modal) => {
          modal.classList.remove('_is-open')
          document.querySelectorAll('.header-navBx__link.dropdown').forEach(el => el.classList.remove('active'))
          document.querySelector('.header-burger').classList.remove('active')
        })
      }

      popup.classList.add('_is-open')
      toggleBodyLock(true)
    }

    if (
      target.classList.contains('_overlay-bg') ||
      target.closest('.button-close')
    ) {
      const popup = target.closest('._overlay-bg')

      popup.classList.remove('_is-open')
      document.querySelectorAll('.header-navBx__link.dropdown').forEach(el => el.classList.remove('active'))
      if(document.querySelector('.header-burger')) {
        document.querySelector('.header-burger').classList.remove('active')
      }
      toggleBodyLock(false)
    }
  })
}

// Модуль работы с меню (бургер) =======================================================================================================================================================================================================================
const menuInit = () => {
  if (burgerButton) {
    document.addEventListener('click', ({ target }) => {
      if (target.closest('.icon-menu')) {
        html.classList.toggle('menu-open')
        toggleBodyLock(html.classList.contains('menu-open'))
      }
    })
  }
}
const menuOpen = () => {
  toggleBodyLock(true)
  html.classList.add('menu-open')
}
const menuClose = () => {
  toggleBodyLock(false)
  html.classList.remove('menu-open')
}

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

// Включить/выключить FLS (Full Logging System) (в работе)

$('a[href^="#"]').on("click", function (e) {
    let anchor = $(this);
    let offsetAnchor = 100
    if (window.innerWidth <= 768) offsetAnchor = 100
    let offset = document.documentElement.clientHeight * offsetAnchor / 929
    $('html, body').stop().animate({
        scrollTop: $(anchor.attr("href")).offset().top - offset
    }, 700);
    e.preventDefault();
});

document.addEventListener('DOMContentLoaded', function () { // Аналог $(document).ready(function(){
    if (document.querySelector('input[name="tel"]')) {
        $('input[name="tel"]').mask('+7 (999) 999-99-99')
    }
    if (document.querySelector('input[name="phone"]')) {
        $('input[name="tel"]').mask('+7 (999) 999-99-99')
    }

    if (document.querySelector('.license')) {
        const swiper = new Swiper('.license-wrapper', {
            // Optional parameters
            direction: 'horizontal',
            loop: false,
            slidesPerView: 3,
            spaceBetween: 30,
            navigation: {
                nextEl: '#license-arrow-next',
                prevEl: '#license-arrow-prev',
            },
            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                600: {
                    slidesPerView: 2,
                    spaceBetween: 12,
                },
                // when window width is >= 480px
                800: {
                    slidesPerView: 3,
                    spaceBetween: 30
                },
            }
        });
        Fancybox.bind('[data-fancybox="gallery"]', {});
    }

    if (document.getElementById('map')) {
        let addr = $('.js-map').data('addr'),
            x = $(".js-map").data('x'),
            y = $(".js-map").data('y')

        ymaps.ready(init);

        function init() {
            var Map = new ymaps.Map("map", {
                center: [x, y],
                zoom: 10,
                controls: [
                    'zoomControl',
                    'rulerControl',
                    'routeButtonControl',
                ]
            });

            let mark = new ymaps.Placemark([x, y], {
                hint: 'Сервисный центр ',
                balloonContent: addr,
            });

            Map.geoObjects.add(mark);
        }
    }

    if (document.querySelector('.modal.repair')) {
        let modalRepair = new SwipeablePopup('.modal-formBx', '.modal.repair')
    }
    if (document.querySelector('.modal.thanks')) {
        let modalThanks = new SwipeablePopup('.thanks-wrapper', '.modal.thanks')
    }

    if (document.querySelector('.header-burger')) {
        document.querySelector('.header-burger').addEventListener('click', (e) => {
            e.target.classList.toggle('active')
            document.querySelector('.header-nav-helper').classList.toggle('_is-open')
            toggleBodyLock(document.querySelector('.header-nav-helper').classList.contains('_is-open'))
        })
    }

    if (document.querySelector('.header-navBx__link.dropdown')) {
        let links = document.querySelectorAll('.header-navBx__link.dropdown')

        links.forEach(link => {
            link.addEventListener('click', () => {

                if (link.classList.contains('active')) {
                    link.classList.remove('active')

                    let dropdown = link.parentNode.querySelector('.header-dropdown')
                    dropdown.classList.remove('_is-open')
                } else {
                    links.forEach(el => el.classList.remove('active'))
                    document.querySelectorAll('.header-dropdown').forEach(el => el.classList.remove('_is-open'))

                    link.classList.add('active')
                    let dropdown = link.parentNode.querySelector('.header-dropdown')
                    dropdown.classList.add('_is-open')
                }
            })
        })

        let backLinks = document.querySelectorAll('.header-dropdown-back')
        backLinks.forEach(el => {
            el.addEventListener('click', () => {
                el.closest('.header-navBx__item').querySelector('._is-open').classList.remove('_is-open')
                el.closest('.header-navBx__item').querySelector('.header-navBx__link ').classList.remove('active')
            })
        })
    }

    if (document.querySelector('.price')) {
        hidePrice();
    }

    //слайдер отзывов
    let reviews = document.querySelector('.reviews__list')
    if (reviews) {
        $('.reviews__list').slick({
            adaptiveHeight: true,
            arrows: true,
            mobileFirst: true,
            slidesToShow: 1,
            prevArrow: '<button type="button" class="slider-arrow slider-arrow--prev"></button>',
            nextArrow: '<button type="button" class="slider-arrow slider-arrow--next"></button>',
            responsive: [
                {
                    breakpoint: 1216, 
                    settings: {
                        slidesToShow: 2,
                    }
                }
            ]
        })
    }

    // меню.
    let headerBtn = document.querySelector('.header__button')
    let headerMenu = document.querySelector('.header__menu-wrapper')
    if (headerBtn) {
        headerBtn.addEventListener('click', () => {
            headerMenu.classList.add('header__menu-wrapper--opened')

        })
    }

    let headerCloseBtns = document.querySelectorAll('.header__button-close, .header__menu-link:not(.header__menu-link--with-submenu)')
    headerCloseBtns.forEach((item) => {
        item.addEventListener('click', () => {
            headerMenu.classList.remove('header__menu-wrapper--opened')
        })
    }) 

    let subMenus = document.querySelectorAll('.header__menu-link--with-submenu')

    subMenus.forEach((item) => {
        item.addEventListener('click', () => {
            item.classList.toggle('header__menu-link--active')

            let subMenuList = item.closest('li').querySelector('.header__submenu')
            subMenuList.classList.toggle('header__submenu--visible')
        })
    })

    let popupBtns = document.querySelectorAll('[data-type]')
    let modal = document.querySelector('.modal')

    popupBtns.forEach((item) => {
        item.addEventListener('click', () => {
            modal.querySelector('.modal__title').innerText = item.dataset.heading
            modal.querySelector('.modal__subtitle').innerText = item.dataset.text
            modal.querySelector('textarea').setAttribute('placeholder', item.dataset.placeholder)
        })
    })
});

//обрезка текста с добавлением в конец синего слова еще, по нажатию на который происходит раскрытие текста
const cutText = (element, limit, isShow = false, preventText = '') => {
    if (isShow) {
        element.parentNode.textContent = preventText
        return false
    }
    let maxLength = element.textContent.length,
        text = element.textContent,
        sliced = element.textContent.slice(0, limit).trim()
    if (sliced.length < element.textContent.length) {
        element.textContent = sliced
        element.innerHTML += `<span class='more' data-text='${text}'">ещё</span>`
    }
}

const openText = (element, preventText = '') => {
    element.textContent = preventText
    return false
}

$('img.svg').each(function () {
    let $img = $(this);
    let imgID = $img.attr('id');
    let imgClass = $img.attr('class');
    let imgURL = $img.attr('src');

    $.get(imgURL, function (data) {
        // Get the SVG tag, ignore the rest
        let $svg = $(data).find('svg');

        // Add replaced image's ID to the new SVG
        if (typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass + ' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
        if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }

        // Replace image with new SVG
        $img.replaceWith($svg);

    }, 'xml');

});


// Паралакс мышей ========================================================================================
// const mousePrlx = new MousePRLX({})
// =======================================================================================================

// Фиксированный header ==================================================================================
// headerFixed()
// =======================================================================================================

togglePopupWindows()
// =======================================================================================================
