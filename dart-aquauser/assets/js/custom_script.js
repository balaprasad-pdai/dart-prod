
  sal({
        // once: false
      });

$('#services-carousel').owlCarousel({
    loop:false,
    margin:10,
    nav:true,
    autoWidth:true,
})
$('#brand-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:false,
    autoWidth:true,
})
$('#blog-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    autoWidth:true,
})

$('#coupon-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    autoWidth:true,
})

$('#testimonial-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    items:1,
    // autoWidth:true,
})



$(".form-control-floating").focus(function(){
  $(this).parent().addClass("is-active is-completed");
});

$(".form-control-floating").focusout(function(){
  if($(this).val() === "")
    $(this).parent().removeClass("is-completed");
  $(this).parent().removeClass("is-active");
})



$(window).scroll(function(){
  //alert($(window).scrollTop())
    if ($(window).scrollTop() >= 50) {
        $('body').find('#pageHeader').addClass('active')
    }
    else {
        $('body').find('#pageHeader').removeClass('active')
    }
});
