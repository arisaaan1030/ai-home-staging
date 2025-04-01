$(document).ready(function() {
    // ナビゲーションのハンバーガーメニュー
    $('.hamburger').click(function() {
        $(this).toggleClass('active');
        $('.nav-menu').toggleClass('active');
    });

    // スクロール時のヘッダー変化（より繊細に）
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) { // スクロール開始をより早く
            $('header').addClass('scrolled');
            $('#page-top-btn').addClass('show');
        } else {
            $('header').removeClass('scrolled');
            $('#page-top-btn').removeClass('show');
        }
    });

    // ページトップへ戻るボタン（よりスムーズに）
    $('#page-top-btn').click(function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 800); // より長いアニメーション時間
    });

    // スムーススクロール（よりスムーズに）
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        if (target === '#') return;
        
        var targetPos = $(target).offset().top - 100; // より大きなオフセット
        $('html, body').animate({scrollTop: targetPos}, 1000, 'easeInOutQuart'); // イージング追加
        
        // モバイルメニューを閉じる
        $('.hamburger').removeClass('active');
        $('.nav-menu').removeClass('active');
    });

    // イージング関数追加
    $.extend($.easing, {
        easeInOutQuart: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        }
    });

    // トップページのスライダー（フェード効果追加）
    let currentSlide = 0;
    const slides = $('.slide');
    const slideCount = slides.length;

    function showSlide(index) {
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;
        
        // 現在のスライドをフェードアウト
        slides.eq(currentSlide).css('opacity', 0.8);
        
        currentSlide = index;
        
        // 新しいスライドをフェードイン
        slides.css('opacity', 0);
        slides.eq(currentSlide).css('opacity', 1);
        
        $('.slide-container').css('transform', `translateX(-${currentSlide * 100}%)`);
    }

    // 初期表示
    slides.css('opacity', 0);
    slides.eq(0).css('opacity', 1);

    $('.next').click(function() {
        showSlide(currentSlide + 1);
    });

    $('.prev').click(function() {
        showSlide(currentSlide - 1);
    });

    // 自動スライド切り替え（より長い間隔）
    setInterval(function() {
        showSlide(currentSlide + 1);
    }, 10000);

    // ビフォーアフターのスライダー（より繊細な動き）
    function initBeforeAfterSlider() {
        $('.before-after').each(function() {
            const slider = $(this);
            const handle = slider.find('.slider-handle');
            const before = slider.find('.before');
            
            // 初期位置をランダムに設定してより自然に
            const initialPercent = Math.random() * 30 + 35; // 35%〜65%の間
            before.css('clip-path', `polygon(0 0, ${initialPercent}% 0, ${initialPercent}% 100%, 0 100%)`);
            handle.css('left', `${initialPercent}%`);
            
            // マウスドラッグでスライダーを移動
            let isDragging = false;
            
            handle.on('mousedown touchstart', function(e) {
                isDragging = true;
                e.preventDefault();
            });
            
            $(document).on('mouseup touchend', function() {
                isDragging = false;
            });
            
            slider.on('mousemove touchmove', function(e) {
                if (!isDragging) return;
                
                const sliderWidth = slider.width();
                let x;
                
                // タッチイベントかマウスイベントか判定
                if (e.type === 'touchmove') {
                    x = e.originalEvent.touches[0].pageX - slider.offset().left;
                } else {
                    x = e.pageX - slider.offset().left;
                }
                
                // スライダーの位置を制限
                if (x < 0) x = 0;
                if (x > sliderWidth) x = sliderWidth;
                
                // スライダー位置をパーセンテージに変換
                const percent = (x / sliderWidth) * 100;
                
                // ビフォー画像のクリップパスを更新（よりスムーズに）
                before.css({
                    'clip-path': `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`,
                    'transition': isDragging ? 'none' : 'clip-path 0.2s ease'
                });
                
                // スライダーハンドルの位置を更新
                handle.css({
                    'left': `${percent}%`,
                    'transition': isDragging ? 'none' : 'left 0.2s ease'
                });
            });
            
            // ホバー時のアニメーション追加
            slider.hover(
                function() {
                    handle.addClass('active');
                },
                function() {
                    handle.removeClass('active');
                }
            );
        });
    }

    // ギャラリーのビフォーアフタースライダー
    function initGallerySlider() {
        $('.before-after-container').each(function() {
            const container = $(this);
            const sliderBar = container.find('.slider-bar');
            const sliderButton = container.find('.slider-button');
            const beforeImg = container.find('.before-img');
            
            // 初期位置をランダムに設定
            const initialPercent = Math.random() * 30 + 35; // 35%〜65%の間
            beforeImg.css('clip-path', `polygon(0 0, ${initialPercent}% 0, ${initialPercent}% 100%, 0 100%)`);
            sliderBar.css('left', `${initialPercent}%`);
            
            let isDragging = false;
            
            sliderButton.on('mousedown touchstart', function(e) {
                isDragging = true;
                e.preventDefault();
            });
            
            $(document).on('mouseup touchend', function() {
                isDragging = false;
            });
            
            container.on('mousemove touchmove', function(e) {
                if (!isDragging) return;
                
                const containerWidth = container.width();
                let x;
                
                if (e.type === 'touchmove') {
                    x = e.originalEvent.touches[0].pageX - container.offset().left;
                } else {
                    x = e.pageX - container.offset().left;
                }
                
                if (x < 0) x = 0;
                if (x > containerWidth) x = containerWidth;
                
                const percent = (x / containerWidth) * 100;
                
                beforeImg.css({
                    'clip-path': `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`,
                    'transition': isDragging ? 'none' : 'clip-path 0.2s ease'
                });
                
                sliderBar.css({
                    'left': `${percent}%`,
                    'transition': isDragging ? 'none' : 'left 0.2s ease'
                });
            });
            
            // ホバー時のツールチップ表示（より洗練された表示）
            container.hover(
                function() {
                    $('<div class="slider-tooltip">左右にドラッグして比較</div>').appendTo(container).fadeIn(300);
                    setTimeout(function() {
                        container.find('.slider-tooltip').addClass('show');
                    }, 100);
                },
                function() {
                    container.find('.slider-tooltip').removeClass('show').fadeOut(300, function() {
                        $(this).remove();
                    });
                }
            );
        });
    }

    // FAQのアコーディオン（よりスムーズに）
    $('.faq-question').click(function() {
        const faqItem = $(this).parent();
        
        if (faqItem.hasClass('active')) {
            faqItem.removeClass('active');
            faqItem.find('.faq-answer').slideUp(300);
        } else {
            $('.faq-item.active').find('.faq-answer').slideUp(300);
            $('.faq-item').removeClass('active');
            faqItem.addClass('active');
            faqItem.find('.faq-answer').slideDown(300);
        }
    });

    // お問い合わせフォームの検証
    $('#inquiry-form').submit(function(e) {
        e.preventDefault();
        
        // フォーム入力値を取得
        const name = $('#name').val();
        const email = $('#email').val();
        const message = $('#message').val();
        
        // 簡易的なバリデーション
        let isValid = true;
        
        if (name.trim() === '') {
            markInvalid($('#name'), 'お名前を入力してください');
            isValid = false;
        } else {
            markValid($('#name'));
        }
        
        if (email.trim() === '') {
            markInvalid($('#email'), 'メールアドレスを入力してください');
            isValid = false;
        } else if (!isValidEmail(email)) {
            markInvalid($('#email'), '有効なメールアドレスを入力してください');
            isValid = false;
        } else {
            markValid($('#email'));
        }
        
        if (message.trim() === '') {
            markInvalid($('#message'), 'メッセージを入力してください');
            isValid = false;
        } else {
            markValid($('#message'));
        }
        
        if (!$('#privacy-policy').is(':checked')) {
            alert('プライバシーポリシーに同意してください');
            isValid = false;
        }
        
        // 送信処理（実際はサーバーにAjax送信）
        if (isValid) {
            // ここにAjax送信コードを追加
            // 例: $.ajax({ ... });
            
            // 仮の成功メッセージ表示（よりスタイリッシュに）
            $('.contact-form').fadeOut(400, function() {
                $(this).html('<div class="success-message"><h3>お問い合わせありがとうございます</h3><p>内容を確認後、担当者より折り返しご連絡いたします。</p></div>').fadeIn(400);
            });
        }
    });
    
    // フォーム入力値の検証ヘルパー関数
    function markInvalid(element, message) {
        element.addClass('invalid');
        
        // エラーメッセージを表示（よりスムーズに）
        if (element.next('.error-message').length === 0) {
            $(`<div class="error-message">${message}</div>`).insertAfter(element).hide().slideDown(200);
        }
    }
    
    function markValid(element) {
        element.removeClass('invalid');
        element.next('.error-message').slideUp(200, function() {
            $(this).remove();
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // アニメーション付きスクロール監視（要素が画面内に入ったらフェードイン）
    function animateOnScroll() {
        $('.feature-card, .gallery-item, .price-card, .testimonial, .flow-step, .faq-item').each(function() {
            const elementBottom = $(this).offset().top + $(this).outerHeight();
            const viewportBottom = $(window).scrollTop() + $(window).height() + 100;
            
            if (elementBottom < viewportBottom) {
                $(this).addClass('animate');
            }
        });
    }
    
    // ページ読み込み時と스크롤時にアニメーション確認
    $(window).on('load scroll', animateOnScroll);

    // 初期化呼び出し
    initBeforeAfterSlider();
    initGallerySlider();
});

// 画像の遅延読み込み
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
    
    if ('IntersectionObserver' in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    if (lazyImage.dataset.srcset) {
                        lazyImage.srcset = lazyImage.dataset.srcset;
                    }
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        let active = false;
        
        const lazyLoad = function() {
            if (active === false) {
                active = true;
                
                setTimeout(function() {
                    lazyImages.forEach(function(lazyImage) {
                        if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== 'none') {
                            lazyImage.src = lazyImage.dataset.src;
                            if (lazyImage.dataset.srcset) {
                                lazyImage.srcset = lazyImage.dataset.srcset;
                            }
                            lazyImage.classList.remove('lazy');
                            
                            lazyImages = lazyImages.filter(function(image) {
                                return image !== lazyImage;
                            });
                            
                            if (lazyImages.length === 0) {
                                document.removeEventListener('scroll', lazyLoad);
                                window.removeEventListener('resize', lazyLoad);
                                window.removeEventListener('orientationchange', lazyLoad);
                            }
                        }
                    });
                    
                    active = false;
                }, 200);
            }
        };
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
        lazyLoad();
    }
});