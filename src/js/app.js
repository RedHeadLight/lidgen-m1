//=include ./helpers/elementsNodeList.js
//=include ./helpers/toggleBodyLock.js
//=include ./modules/index.js
//=include ./libs/swipeablePopup.js

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
        $('input[name="phone"]').mask('+7 (999) 999-99-99')
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

    let subMenuLinks = document.querySelectorAll('.header__menu-link--with-submenu')

    subMenuLinks.forEach((item) => {
        item.addEventListener('click', (evt) => {
            evt.stopPropagation()
            item.classList.toggle('header__menu-link--active')

            let subMenuList = item.closest('li').querySelector('.header__submenu')
            subMenuList.classList.toggle('header__submenu--visible')
        })
    })

    let subMenus = document.querySelectorAll('.header__submenu')
    subMenus.forEach((item) => {
        item.addEventListener('click', (evt) => {
            evt.stopPropagation()
        })
    })

    document.body.addEventListener('click', () => {
        let openedMenu = document.querySelector('.header__submenu--visible')

        if (openedMenu) {
            openedMenu.classList.remove('header__submenu--visible')
        }

        let openedMenuLink = document.querySelector('.header__menu-link--active')

        if (openedMenuLink) {
            openedMenuLink.classList.remove('header__menu-link--active')
        }
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

    //скрипт показывает по кнопке "показать еще" позиции из списка

    let showMoreBtns = document.querySelectorAll('[data-show-more]')
    const SHOW_MORE_COUNTER = 6

    showMoreBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            let showMoreItems = btn.closest('[data-show-more-root]').querySelectorAll('.hidden[data-show-more-item]')
            if (showMoreItems.length <= SHOW_MORE_COUNTER) {
                btn.classList.add("hidden")
            }

            let current = [...showMoreItems].slice(0, SHOW_MORE_COUNTER)
            current.forEach((element) => {
                element.classList.remove("hidden")
            });
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
