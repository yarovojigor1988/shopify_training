$(document).ready(function(){
    console.log($('[id^="customSlider-"]'));
    $('[id^="customSlider-"]').children('.custom-carousel').slick({
        autoplay: true,
        autoplaySpeed: 10000,
        dots: false,
        infinite: true,
        arrows: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1
    });
});