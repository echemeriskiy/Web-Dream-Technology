    $('.header__burger').on('click', function(e) {
        e.preventDefault()
        $(this).toggleClass('--active');
        $('.header__nav').toggleClass('--active');
    })
    var activeSlide = 0,
        items = $('.main__item').length;

        for (let i = 0; i < items; i++) {
          
          $('.main__slider-dots').append('<li></li>')
          if(i===0){
            $('.main__slider-dots li').addClass('--active')
          }
        }

      
      $('body').on('click','.main__slider-dots li', function(e){
        let active = $(this).index();
          $('.main__slider-dots li.--active').removeClass('--active')
          $(this).addClass('--active')
          activeSlide = active;
           $('.main__item').css('transform', 'translateX(-' + activeSlide + '00%)')
      })



    $('.main__slider-arrows').on('click', function(e) {
        e.preventDefault()
        
        if ($(this).hasClass('--next')) {
            ++activeSlide
            if (activeSlide === items) {
                activeSlide = 0
            }
        } else {
                --activeSlide
              if (activeSlide < 0) {
                activeSlide = --items
            }


        }

        $('.main__slider-dots li.--active').removeClass('--active')
        $('.main__slider-dots li').eq(activeSlide).addClass('--active')
        $('.main__item').css('transform', 'translateX(-' + activeSlide + '00%)')


    })