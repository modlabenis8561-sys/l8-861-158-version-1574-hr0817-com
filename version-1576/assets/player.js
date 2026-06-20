(function () {
    function setupMoviePlayer(streamUrl, videoId) {
        var video = document.getElementById(videoId);
        if (!video) {
            return;
        }
        var shell = video.closest('[data-player]');
        var layer = shell ? shell.querySelector('.play-layer') : null;
        var loaded = false;
        var hls = null;

        function loadSource() {
            if (loaded) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
            loaded = true;
        }

        function hideLayer() {
            if (layer) {
                layer.classList.add('is-hidden');
            }
        }

        function playVideo() {
            loadSource();
            hideLayer();
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        if (layer) {
            layer.addEventListener('click', playVideo);
        }
        video.addEventListener('click', function () {
            if (!loaded || video.paused) {
                playVideo();
            }
        });
        video.addEventListener('play', hideLayer);
        video.addEventListener('error', function () {
            if (hls) {
                try {
                    hls.destroy();
                } catch (error) {}
                hls = null;
                loaded = false;
            }
        });
    }

    window.setupMoviePlayer = setupMoviePlayer;
})();
