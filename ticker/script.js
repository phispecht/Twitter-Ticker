(function () {
    /////// ajax part ////////

    $.ajax({
        url: "/data.json",
        method: "GET",
        success: function (response) {
            var myLink = "";
            for (var i = 0; i < response.length; i++) {
                var link =
                    "<a href=" +
                    response[i].link +
                    ">" +
                    response[i].text +
                    "</a>";
                myLink += link;
            }
            // first fetches all links, after all links are inserted into the page the animation starts
            $("#news").html(myLink, moveNews());
        },
    });

    ////// ajax part end ///////

    var jqnews = $("#news");
    var jqleft = jqnews.offset().left;

    var animationId;

    function moveNews() {
        jqnews.css({
            left: jqleft-- + "px",
        });

        link = $("a");

        for (var i = 0; i < link.length; i++) {
            var firstLink = link.eq(0).width();
            if (jqleft <= -firstLink) {
                jqleft = jqleft + firstLink + 42; // added some pixels to guarantee the flow in the ticker
                jqnews.css({
                    left: jqleft + "px",
                });
                link.eq(0).appendTo(jqnews);
            }
        }

        animationId = requestAnimationFrame(moveNews);
    }
    // moveNews();

    jqnews.on("mouseover", "a", function () {
        cancelAnimationFrame(animationId);
    });

    jqnews.on("mouseout", "a", function () {
        requestAnimationFrame(moveNews);
    });
})();
