(function (IVSPlayerPackage) {

    if (!IVSPlayerPackage.isPlayerSupported) {
        console.warn("The current browser does not support the IVS player.");
        return;
    }

    const player = IVSPlayerPackage.create();
    const preview1 = IVSPlayerPackage.create();
    const preview2 = IVSPlayerPackage.create();

    player.attachHTMLVideoElement(document.getElementById("video-player"));
    preview1.attachHTMLVideoElement(document.getElementById("preview1"));
    preview2.attachHTMLVideoElement(document.getElementById("preview2"));

    const streams = {
        channel1: 'https://937a5aa6b93e.us-west-2.playback.live-video.net/api/video/v1/us-west-2.730335574547.channel.Hp6pLCYrC1o3.m3u8',
        channel2: 'https://937a5aa6b93e.us-west-2.playback.live-video.net/api/video/v1/us-west-2.730335574547.channel.EmvUzmF4kTE9.m3u8'
    };

    function loadPreview(player, streamUrl, previewId, noPreviewId) {
        fetch(streamUrl, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    player.load(streamUrl);
                    player.setVolume(0);
                    player.play();
                    document.getElementById(previewId).style.display = 'block';
                    document.getElementById(noPreviewId).style.display = 'none';
                } else {
                    document.getElementById(previewId).style.display = 'none';
                    document.getElementById(noPreviewId).style.display = 'flex';
                }
            })
            .catch(error => {
                console.warn("Preview load error:", error);
                document.getElementById(previewId).style.display = 'none';
                document.getElementById(noPreviewId).style.display = 'flex';
            });
    }

    function updatePreviewOnStreamEnd(player, previewId, noPreviewId) {
        player.addEventListener(IVSPlayerPackage.PlayerState.ENDED, () => {
            document.getElementById(previewId).style.display = 'none';
            document.getElementById(noPreviewId).style.display = 'flex';
        });
        player.addEventListener(IVSPlayerPackage.PlayerEventType.ERROR, (err) => {
            console.warn("Player Event - ERROR:", err);
            document.getElementById(previewId).style.display = 'none';
            document.getElementById(noPreviewId).style.display = 'flex';
        });
    }

    window.switchChannel = function(channel) {
        const streamUrl = streams[channel];
        player.load(streamUrl);
        player.play();
        document.getElementById('noStreamMessage').style.display = 'none';
    };

    // Load previews for the small video screens
    loadPreview(preview1, streams.channel1, 'preview1', 'noPreview1');
    loadPreview(preview2, streams.channel2, 'preview2', 'noPreview2');

    // Update preview when the stream ends
    updatePreviewOnStreamEnd(preview1, 'preview1', 'noPreview1');
    updatePreviewOnStreamEnd(preview2, 'preview2', 'noPreview2');

    // Add event listeners to switch the main video player source on click
    document.getElementById('preview1').addEventListener('click', function() {
        switchChannel('channel1');
    });

    document.getElementById('preview2').addEventListener('click', function() {
        switchChannel('channel2');
    });

    // Initialize the main player with the default stream
    player.setAutoplay(true);
    window.switchChannel('channel1');

    // Event listeners for the main player
    player.addEventListener(IVSPlayerPackage.PlayerState.PLAYING, () => {
        console.log("Player State - PLAYING");
        console.log("Latency: " + player.getLiveLatency());
    });

    player.addEventListener(IVSPlayerPackage.PlayerState.ENDED, () => {
        console.log("Player State - ENDED");
        document.getElementById('noStreamMessage').style.display = 'block';
    });

    player.addEventListener(IVSPlayerPackage.PlayerState.READY, () => {
        console.log("Player State - READY");
    });

    player.addEventListener(IVSPlayerPackage.PlayerEventType.ERROR, (err) => {
        console.warn("Player Event - ERROR:", err);
        document.getElementById('noStreamMessage').style.display = 'block';
    });

    player.addEventListener(IVSPlayerPackage.PlayerState.BUFFERING, () => {
        console.log("Player State - BUFFERING");
    });

    player.addEventListener(IVSPlayerPackage.PlayerEventType.REBUFFERING, () => {
        console.log("Player State - REBUFFERING");
    });

})(window.IVSPlayer);
