(function ($) {
    'use strict';

    $(document).ready(function ($) {
        // testimonial sliders
        $('.testimonial-sliders').owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            responsive: {
                0: {
                    items: 1,
                    nav: false,
                },
                600: {
                    items: 1,
                    nav: false,
                },
                1000: {
                    items: 1,
                    nav: false,
                    loop: true,
                },
            },
        });

        // homepage slider
        $('.homepage-slider').owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            nav: true,
            dots: false,
            navText: [
                '<i class="fas fa-angle-left"></i>',
                '<i class="fas fa-angle-right"></i>',
            ],
            responsive: {
                0: {
                    items: 1,
                    nav: false,
                    loop: true,
                },
                600: {
                    items: 1,
                    nav: true,
                    loop: true,
                },
                1000: {
                    items: 1,
                    nav: true,
                    loop: true,
                },
            },
        });

        // logo carousel
        $('.logo-carousel-inner').owlCarousel({
            items: 4,
            loop: true,
            autoplay: true,
            margin: 30,
            responsive: {
                0: {
                    items: 1,
                    nav: false,
                },
                600: {
                    items: 3,
                    nav: false,
                },
                1000: {
                    items: 4,
                    nav: false,
                    loop: true,
                },
            },
        });

        // count down
        if ($('.time-countdown').length) {
            $('.time-countdown').each(function () {
                var $this = $(this),
                    finalDate = $(this).data('countdown');
                $this.countdown(finalDate, function (event) {
                    var $this = $(this).html(
                        event.strftime(
                            '' +
                                '<div class="counter-column"><div class="inner"><span class="count">%D</span>Days</div></div> ' +
                                '<div class="counter-column"><div class="inner"><span class="count">%H</span>Hours</div></div>  ' +
                                '<div class="counter-column"><div class="inner"><span class="count">%M</span>Mins</div></div>  ' +
                                '<div class="counter-column"><div class="inner"><span class="count">%S</span>Secs</div></div>'
                        )
                    );
                });
            });
        }

        // projects filters isotop
        $('.product-filters li').on('click', function () {
            $('.product-filters li').removeClass('active');
            $(this).addClass('active');

            var selector = $(this).attr('data-filter');

            $('.product-lists').isotope({
                filter: selector,
            });
        });

        // isotop inner
        $('.product-lists').isotope();

        // magnific popup
        $('.popup-youtube').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false,
        });

        // light box
        $('.image-popup-vertical-fit').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            mainClass: 'mfp-img-mobile',
            image: {
                verticalFit: true,
            },
        });

        // homepage slides animations
        $('.homepage-slider').on('translate.owl.carousel', function () {
            $('.hero-text-tablecell .subtitle')
                .removeClass('animated fadeInUp')
                .css({ opacity: '0' });
            $('.hero-text-tablecell h1')
                .removeClass('animated fadeInUp')
                .css({ opacity: '0', 'animation-delay': '0.3s' });
            $('.hero-btns')
                .removeClass('animated fadeInUp')
                .css({ opacity: '0', 'animation-delay': '0.5s' });
        });

        $('.homepage-slider').on('translated.owl.carousel', function () {
            $('.hero-text-tablecell .subtitle')
                .addClass('animated fadeInUp')
                .css({ opacity: '0' });
            $('.hero-text-tablecell h1')
                .addClass('animated fadeInUp')
                .css({ opacity: '0', 'animation-delay': '0.3s' });
            $('.hero-btns')
                .addClass('animated fadeInUp')
                .css({ opacity: '0', 'animation-delay': '0.5s' });
        });

        // stikcy js
        $('#sticker').sticky({
            topSpacing: 0,
        });

        //mean menu
        $('.main-menu').meanmenu({
            meanMenuContainer: '.mobile-menu',
            meanScreenWidth: '992',
            removeElements: '.shopping-cart, .account',
        });

        // search form
        $('.search-bar-icon').on('click', function () {
            $('.search-area').addClass('search-active');
        });

        $('.close-btn').on('click', function () {
            $('.search-area').removeClass('search-active');
        });
    });

    $(document).ready(function () {
        $('.minus').click(function () {
            var $input = $(this).parent().find('input');
            var count = parseInt($input.val()) - 1;
            count = count < 1 ? 1 : count;
            $input.val(count);
            $input.change();
            return false;
        });
        $('.plus').click(function () {
            var $input = $(this).parent().find('input');
            $input.val(parseInt($input.val()) + 1);
            $input.change();
            return false;
        });
    });

    jQuery(window).on('load', function () {
        jQuery('.loader').fadeOut(1000);
    });
})(jQuery);
// limit text length
// function limitText(text, maxLength) {
//     if (text.length > maxLength) {
//         text = text.substring(0, maxLength - 3) + '...';
//     }
//     return text;
// }

// const longtext_titles = document.getElementsByClassName('news-title');

// for (let i = 0; i < longtext_titles.length; i++) {
//     const title = longtext_titles[i];
//     const originalText = title.textContent;
//     const maxLength = 55;
//     const limitedText = limitText(originalText, maxLength);
//     title.textContent = limitedText;
// }

// handle chooses versions and switches options
var choose_version = document.querySelectorAll(
    '.version-option ul.swatch-view li.swatch-view-item'
);
var choose_switch = document.querySelectorAll(
    '.switch-option ul.swatch-view li.swatch-view-item'
);
function clickEvent(elements) {
    elements.forEach((element) => {
        element.addEventListener('click', () => {
            elements.forEach((element) => {
                element.classList.remove('swatch-active');
            });
            element.classList.add('swatch-active');
        });
    });
}

clickEvent(choose_version);
clickEvent(choose_switch);

let group1Elements = document.querySelectorAll('.versions');
let group2Elements = document.querySelectorAll('.switches');

window.addEventListener('load', function () {
    document.getElementById('indexInArr0').click();
});

for (let i = 0; i < group1Elements.length; i++) {
    let versionElement = group1Elements[i];

    versionElement.onclick = function () {
        let switchId = versionElement.getAttribute('data-switch-id');
        let versionPrice = versionElement.getAttribute('data-price');
        let formatted = parseFloat(versionPrice).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        document.getElementById('changePrice').innerText = formatted;
        const selectVersion = document.getElementsByClassName('input_version');
        for (let z = 0; z < selectVersion.length; z++) {
            selectVersion[z].disabled = true;
        }
        document.querySelector(
            `[data-switch-id="${switchId}"] input[name="key_version"]`
        ).disabled = false;

        for (let j = 0; j < group2Elements.length; j++) {
            if (group2Elements[j].id === switchId) {
                group2Elements[j].style.display = 'block';
                document.querySelector(`#${switchId} li:first-child`).click();
            } else {
                group2Elements[j].style.display = 'none';
            }
        }
    };
}

const switchItems = document.querySelectorAll('.swatch-view-item.switch');

switchItems.forEach(function (switchItem) {
    const inputSwitch = switchItem.querySelector('.input_switch');
    switchItem.addEventListener('click', function () {
        switchItems.forEach(function (switchItem) {
            switchItem.classList.remove('switch-active');
            const inputSwitch = switchItem.querySelector('.input_switch');
            inputSwitch.disabled = true;
        });
        switchItem.classList.add('switch-active');
        inputSwitch.disabled = false;
    });
});

// show toast
$(document).ready(function () {
    $('.toast').toast('show');
});

// format money
let formatMoneys = document.getElementsByClassName('formatMoney');
for (let i = 0; i < formatMoneys.length; i++) {
    let myNumber = formatMoneys[i].textContent;
    let formatted = parseFloat(myNumber).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    formatMoneys[i].textContent = formatted;
}


// change address if user login already
const selectTag = document.querySelector('#savedAddress');

selectTag.addEventListener('change', (event) => {
    const selectedOption =
        event.target.options[event.target.selectedIndex] || {};
    const selectCountry = document.querySelector('.selectCountry');
    let properties;
    if (selectedOption.dataset.properties) {
        properties = JSON.parse(selectedOption.dataset.properties);
    }

    if (properties) {
        document.querySelector('input[name="firstName"]').value =
            properties.firstName;
        document.querySelector('input[name="lastName"]').value =
            properties.lastName;
        const country = (selectCountry.value = properties.country);
        country.selected = true;
        document.querySelector('input[name="address"]').value =
            properties.address1;
        if (properties.address2) {
            document.querySelector('input[name="additionalInfor"]').value =
                properties.address2;
        }
        if (properties.postalCode) {
            document.querySelector('input[name="postal"]').value =
                properties.postalCode;
        }
        document.querySelector('input[name="city"]').value = properties.city;
        document.querySelector('input[name="phone"]').value = properties.phone;
    } else {
        document.querySelector('input[name="firstName"]').value = '';
        document.querySelector('input[name="lastName"]').value = '';
        selectCountry.options[selectCountry.selectedIndex].value = '';
        selectCountry.options[selectCountry.selectedIndex].text = 'Choose your Country/Region';
        document.querySelector('input[name="address"]').value = '';
        document.querySelector('input[name="additionalInfor"]').value = '';
        document.querySelector('input[name="postal"]').value = '';
        document.querySelector('input[name="city"]').value = '';
        document.querySelector('input[name="phone"]').value = '';
    }
});

// validate phone number
const regexes = {
    Vietnam: /^(?:(?:0[1-9]{1})|(?:[2-9][0-9]{1}))\d{8}$/,
    Russia: /^(\+7|8)\d{10}$/,
    Singapore: /^(?:(?:[0-9]{4})|(?:[0-9]{3}))[- ]?[0-9]{3}[- ]?[0-9]{4}$/,
    China: /^1[3|4|5|7|8][0-9]\d{8}$/,
    Taiwan: /^(?:(?:0\d{2})|(?:[1-9]\d{3}))\d{8}$/,
    Korea: /^(?:(?:0\d{2})|(?:0[1-9]\d{2})|(?:1[3-9]\d{2})|(?:2[0-8]\d{2}))-?\d{3}-?\d{4}$/,
    Canada: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
    'United State': /^\(?\d{3}\)?\d{3}-\d{4}$/,
    Mexico: /^\d{3}-\d{3}-\d{4}$/,
    'United Kingdom': /((\+44(\s\(0\)\s|\s0\s|\s)?)|0)7\d{3}(\s)?\d{6}/,
    France: /^((\+)33|0)[1-9](\d{2}){4}$/,
    Spain: /^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/,
    Italy: /^(([+]|00)39)?((3[1-6][0-9]))(\d{7})$/,
};

const select = document.querySelector('.selectCountry');
const input = document.querySelector('.phoneNumber');

select.addEventListener('change', () => {
    const regex = regexes[select.value];
    input.pattern = regex ? regex.source : '';
});

input.addEventListener('input', () => {
    const regex = regexes[select.value];
    if (regex && !regex.test(input.value)) {
        input.setCustomValidity('Invalid phone number');
    } else {
        input.setCustomValidity('');
    }
});


// confirm order
const submitBtn = document.getElementById('submit-btn');
submitBtn.addEventListener('click', function () {
    const form = document.querySelector('.placeOrder');
    form.submit();
});


// change tab in account page
function changeTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
}

const button = document.querySelector('#openForm');
button.addEventListener('click', () => {
    
    const form = document.querySelector('#addAddress');
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
});

function openFrom(evt) {
    const form = document.querySelector('#addAddress');
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

const form = document.querySelector('#my-form');
const btnSubmit1 = document.querySelector('#addToCart');
const btnSubmit2 = document.querySelector('#buyNow');

btnSubmit1.addEventListener('click', function (event) {
    event.preventDefault();
    form.action = '/addToCart';
    form.submit();
});

btnSubmit2.addEventListener('click', function (event) {
    event.preventDefault();
    form.action = '/buyNow';
    form.submit();
});