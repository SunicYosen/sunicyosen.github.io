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
                    //$(".post-all").css('margin-right', '10%');
                    $(".post-all").css('width', '100%');
                    // $(".previous_page").css('width', '50%');
                    // $(".next_page").css('width', '50%');
                    show = false;
                } else {
                    $(".toc-tool").css("display", "block");
                    //$(".post-all").css('margin-right', '30%');
                    $(".post-all").css('width', '70%');
                    // $(".previous_page").css('width', '50%');
                    // $(".next_page").css('width', '50%');
                    show = true;
                }
                time1 = 0;
            }
        }
        else if (e.keyCode == 27) {
            $(".toc-tool").css("display", "none");
            //$(".post-all").css('margin-right', '10%');
            $(".post-all").css('width', '100%');
            // $(".previous_page").css('width', '50%');
            // $(".next_page").css('width', '50%');
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
                    //$(".post-all").css('margin-right', '10%');
                    $(".post-all").css('width', '100%');
                    // $(".previous_page").css('width', '50%');
                    // $(".next_page").css('width', '50%');
                    show = false;
                } else {
                    $(".toc-tool").css("display", "block");
                    //$(".post-all").css('margin-right', '30%');
                    $(".post-all").css('width', '70%');
                    // $(".previous_page").css('width', '50%');
                    // $(".next_page").css('width', '50%');
                    show = true;
                }
                time1 = 0;
            }
        }

    });

    $("#toc-close-btn").click(function () {
        $(".toc-tool").css("display", "none");
        //$(".post-all").css('margin-right', '10%');
        $(".post-all").css('width', '100%');
        // $(".previous_page").css('width', '50%');
        // $(".next_page").css('width', '50%');
        show = false;
        time1 = 0;
    });

    $("#toc-btn").click(function () {
        if(show){
            $(".toc-tool").css("display", "none");
            // $(".post-all").css('margin-right', '10%');
            $(".post-all").css('width', '100%');
            // $(".previous_page").css('width', '50%');
            // $(".next_page").css('width', '50%');
            show = false;
            time1 = 0;
        }
        else{
            $(".toc-tool").css("display", "block");
            //$(".post-all").css('margin-right', '33%');
            $(".post-all").css('width', '70%');
            // $(".previous_page").css('width', '50%');
            // $(".next_page").css('width', '50%');
            show = true;
            time1 = 0;
        }
    });

});
