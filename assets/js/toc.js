$(document).ready(function () {
    var time1 = 0;
    var show = false;
    var margin_right = 25%

    $(document).keyup(function (e) {
        var time2 = new Date().getTime();
        if (e.keyCode == 67) {
            var gap = time2 - time1;
            time1 = time2;

            if (gap < 500) {
                if (show) {
                    $(".toc-tool").css("display", "none");
                    $(".post-all").css('margin-right', '5%');
                    show = false;
                } else {
                    $(".toc-tool").css("display", "block");
                    $(".post-all").css('margin-right', '33%');
                    show = true;
                }
                time1 = 0;
            }
        }
        else if (e.keyCode == 27) {
            $(".toc-tool").css("display", "none");
            $(".post-all").css('margin-right', '5%');
            show = false;
            time1 = 0;
        }
    });

    $("#toc-contents").keyup(function (e) {
        var time2 = new Date().getTime();
        if (e.keyCode == 67) {
            var gap = time2 - time1;
            time1 = time2;
            if (gap < 500) {
                if (show) {
                    $(".toc-tool").css("display", "none");
                    $(".post-all").css('margin-right', '5%');
                    show = false;
                } else {
                    $(".toc-tool").css("display", "block");
                    $(".post-all").css('margin-right', '33%');
                    show = true;
                }
                time1 = 0;
            }
        }

    });

    $("#toc-close-btn").click(function () {
        $(".toc-tool").css("display", "none");
        $(".post-all").css('margin-right', '5%');
        show = false;
        time1 = 0;
    });

    $("#toc-btn").click(function () {
        if(show){
            $(".toc-tool").css("display", "none");
            $(".post-all").css('margin-right', '5%');
            show = false;
            time1 = 0;
        }
        else{
            $(".toc-tool").css("display", "block");
            $(".post-all").css('margin-right', '33%');
            show = true;
            time1 = 0;
        }
    });

});
