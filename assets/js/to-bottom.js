$(document).ready(function() {

    var height = $(document).height();//页面高度
    var wheight = $(window).height();//窗口高度
    var time1 = 0;

    //appear when margin top 100px, otherwise hide.
    $(function() {
        $(window).scroll(function() {
            if ($(window).scrollTop()  < height - wheight) {
                $("#to-bottom").fadeIn(1500);
            }
            else {
                $("#to-bottom").fadeOut(1500);
            }
        });

    //When click, back to top
    $("#to-bottom").click(function() {
        $('body,html').stop();
        $('body,html').animate({
            scrollTop: height
        },
        500);
        return false;
    });

    $(document).keyup(function (e) {
        var time2 = new Date().getTime();
        if (e.keyCode == 66) {
            var gap = time2 - time1;
            time1 = time2;
            if (gap < 500) {
                $('body,html').stop();
                $('body,html').animate({
                    scrollTop: height
                },
                500);
                return false;
                time1 = 0;
            }
        } 
    });

  });
});