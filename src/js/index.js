(function () {
    document.addEventListener('readystatechange', () => {
        if (document.readyState === "complete") {
            document.querySelector("#cover").className += " cover-hide";
            setTimeout(() => {
                document.querySelector("#banner").className += " banner-bounce";
                document.querySelector("#start").className += " start-after";
                document.querySelector("#intro").className += " intro-after";
            }, 1000);
        }
    });
    document.querySelector("#start").addEventListener('touchstart', () => {
        document.querySelector("#cover").className = 'cover';
        window.location.href = './game.html';
    });
    document.querySelector("#intro").addEventListener('touchstart', () => {
        document.querySelector("#cover").className = 'cover';
        window.location.href = './intro.html';
    });
})();