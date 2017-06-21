$(document).foundation();
(function() {
    var triggerBttn = document.getElementById('trigger-overlay'),
        overlay = document.querySelector('div.overlay'),
        closeBttn = overlay.querySelector('.menu-button');
    transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
        support = { transitions: Modernizr.csstransitions };

    var morphSearch = document.getElementById('morphsearch'),
        input = morphSearch.querySelector('input.morphsearch-input'),
        ctrlClose = morphSearch.querySelector('span.morphsearch-close'),
        isOpen = isAnimating = false,
        toggleSearch = function(evt) {
            if (evt.type.toLowerCase() === 'focus' && isOpen) return false;

            var offsets = morphsearch.getBoundingClientRect();
            if (isOpen) {
                classie.remove(morphSearch, 'open');
                if (input.value !== '') {
                    setTimeout(function() {
                        classie.add(morphSearch, 'hideInput');
                        setTimeout(function() {
                            classie.remove(morphSearch, 'hideInput');
                            input.value = '';
                        }, 300);
                    }, 500);
                }

                input.blur();
            } else {
                classie.add(morphSearch, 'open');
            }
            isOpen = !isOpen;
        };

    function toggleOverlay() {
        if (classie.has(overlay, 'open')) {
            classie.remove(overlay, 'open');
            //classie.add(overlay, 'close');
            var onEndTransitionFn = function(ev) {
                if (support.transitions) {
                    if (ev.propertyName !== 'visibility') return;
                    this.removeEventListener(transEndEventName, onEndTransitionFn);
                }
                classie.remove(overlay, 'close');
            };
            if (support.transitions) {
                overlay.addEventListener(transEndEventName, onEndTransitionFn);
            } else {
                onEndTransitionFn();
            }
        } else if (!classie.has(overlay, 'close')) {
            classie.add(overlay, 'open');
        }
    }

    triggerBttn.addEventListener('click', toggleOverlay);
    closeBttn.addEventListener('click', toggleOverlay);
    input.addEventListener('focus', toggleSearch);
    ctrlClose.addEventListener('click', toggleSearch);

    document.addEventListener('keydown', function(ev) {
        var keyCode = ev.keyCode || ev.which;
        if (keyCode === 27 && isOpen) {
            toggleSearch(ev);
        }
    });

    $('.trigger.menu-button').click(function() {
        $(this).addClass('open');
        $('.overlay.overlay-hugeinc .menu-button').addClass('open');
    });
    $('.overlay.overlay-hugeinc .menu-button').on('click', function() {
        $('.trigger.menu-button').removeClass('open');
        $(this).removeClass('open');
    });

    $('a[data-rel^=lightcase]').lightcase({
        onFinish: {
            custom: function() {

                var caption = $(this).find('.caption');
                if (caption.length) {
                    lightcase.get('caption').html(caption.html());
                    $('#lightcase-caption').show();
                }
                lightcase.resize();
            }
        }
    });

    $(document).on('click', '.scroll-link a[href^=\\#]', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top }, 500, 'linear');
    });

    $('.landing-page.results.holder a').on('hover', function() {
        alert();
    });

    $('.ajaxVideo').click(function() {
        var val1 = $('.search-date').html();
        $.ajax({
            type: 'POST',
            url: '/community-church/iframe/video.php',
            data: { val: val1 },
            success: function(response) {
                content.html(response);
            }
        });
    });
    var window_width = $(window).width();
    if (window_width < 768) {
        $(".sticky-sidebar").trigger("sticky_kit:detach");
    } else {
        if ($('.sticky-sidebar').length) {
            make_sticky();
        }
    }

    $(window).resize(function() {
        window_width = $(window).width();
        if (window_width < 768) {
            $(".sticky-sidebar").trigger("sticky_kit:detach");
        } else {
            if ($('.sticky-sidebar').length) {
                make_sticky();
            }
        }
    });

    function make_sticky() {
        $('.sticky-sidebar').stick_in_parent({
            'parent': $('.js-sticky-container'),
            'offset_top': 50
        });
    }
})();
