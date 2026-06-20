(function () {
    window.initMoviePlayer = function (streamUrl) {
        var video = document.getElementById('movie-player');
        var playButton = document.querySelector('[data-play-button]');
        if (!video || !streamUrl) return;

        function enablePlayer() {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                video.load();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                return;
            }

            video.src = streamUrl;
            video.load();
        }

        function startPlayback() {
            if (playButton) {
                playButton.classList.add('is-hidden');
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        enablePlayer();

        if (playButton) {
            playButton.addEventListener('click', startPlayback);
        }

        video.addEventListener('play', function () {
            if (playButton) {
                playButton.classList.add('is-hidden');
            }
        });
    };
})();
