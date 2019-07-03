$(document).ready(function () {
    var time1 = 0;
    var show = false;

    $(document).keyup(function (e) {
        var time2 = new Date().getTime();
        if (e.keyCode == 67) {
            var gap = time2 - time1;
            time1 = time2;

            if (gap < 500) {
                if (show) {
                    $(".toc-tool").css("display", "none");
                    show = false;
                } else {
                    $(".toc-tool").css("display", "block");
                    show = true;
                }
                time1 = 0;
            }
        }
        else if (e.keyCode == 27) {
            $(".toc-tool").css("display", "none");
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
                    show = false;
                } else {
                    $(".toc-tool").css("display", "block");
                    show = true;
                }
                time1 = 0;
            }
        }

    });

    $("#toc-close-btn").click(function () {
        $(".toc-tool").css("display", "none");
        show = false;
        time1 = 0;
    });

    $("#toc-btn").click(function () {
        if(show){
            $(".toc-tool").css("display", "none");
            show = false;
            time1 = 0;
        }
        else{
            $(".toc-tool").css("display", "block");
            show = true;
            time1 = 0;
        }
    });

});
