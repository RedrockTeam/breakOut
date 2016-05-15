(function () {
    document.addEventListener('readystatechange', () => {
        if (document.readyState === "complete") {
            document.querySelector("#cover").className += " cover-hide";
            setTimeout(() => {
                document.querySelector("#banner").className += " banner-bounce";
                document.querySelector("#start").className += " start-after";
                document.querySelector("#intro").className += " intro-after";
                document.querySelector("#redrock").className += " redrock-after";
            }, 1000);
        }
    });
    document.querySelector("#start").addEventListener('touchstart', () => {
        window.location.href = './game.html';
    });
    document.querySelector("#intro").addEventListener('touchstart', () => {
        window.location.href = './intro.html';
    });
})();