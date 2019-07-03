
$(document).ready(function() {

  var time1 = 0;

  //hide first
  $("#back-to-top").hide();

  //appear when margin top 100px, otherwise hide.
  $(function() {
      $(window).scroll(function() {
          if ($(window).scrollTop() > 100) {
              $("#back-to-top").fadeIn(1500);
          }
          else {
              $("#back-to-top").fadeOut(1500);
          }
      });

    //When click, back to top
    $("#back-to-top").click(function() {
        $('body,html').animate({
            scrollTop: 0
        },
        500);
        return false;
    });

    $(document).keyup(function (e) {
        var time2 = new Date().getTime();
        if (e.keyCode == 84) {
            var gap = time2 - time1;
            time1 = time2;
            if (gap < 500) {
                $('body,html').animate({
                    scrollTop: 0
                },
                500);
                return false;
                time1 = 0;
            }
        } 
    });

  });
});