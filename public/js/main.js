$(function () {
    $(document).scroll(function () {

        var $nav = $(".navbar-light");
        $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    });
});