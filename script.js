(function (IVSPlayerPackage) {
    if (!IVSPlayerPackage.isPlayerSupported) {
        console.warn("The current browser does not support the IVS player.");
        return;
    }

    const player = IVSPlayerPackage.create();
    const preview1 = IVSPlayerPackage.create();
    const preview2 = IVSPlayerPackage.create();
    const preview3 = IVSPlayerPackage.create();

    // Attach video elements to IVS players
    player.attachHTMLVideoElement(document.getElementById("video-player"));
    preview1.attachHTMLVideoElement(document.getElementById("preview1"));
    preview2.attachHTMLVideoElement(document.getElementById("preview2"));
    preview3.attachHTMLVideoElement(document.getElementById("preview3"));

    const streams = {
        audioOnly: 'https://3893e27cd44d.us-east-1.playback.live-video.net/api/video/v1/us-east-1.007088424812.channel.RAWqcM6Vjd5z.m3u8',
        output1: 'https://3893e27cd44d.us-east-1.playback.live-video.net/api/video/v1/us-east-1.007088424812.channel.zMhcn0zy6v1k.m3u8',
        output2: 'https://3893e27cd44d.us-east-1.playback.live-video.net/api/video/v1/us-east-1.007088424812.channel.QMHb5NCOo5pO.m3u8',
        output3: 'https://3893e27cd44d.us-east-1.playback.live-video.net/api/video/v1/us-east-1.007088424812.channel.CE3R3eih0gja.m3u8'
    };

    let currentPreviewUrls = {
        preview1: streams.audioOnly,
        preview2: streams.audioOnly,
        preview3: streams.audioOnly
    };

    function loadPreview(previewPlayer, streamUrl, previewId) {
        fetch(streamUrl, { method: 'HEAD', cache: 'no-store' })
        .then(response => {
            if (response.ok && currentPreviewUrls[previewId] !== streamUrl) {
                previewPlayer.load(streamUrl);
                currentPreviewUrls[previewId] = streamUrl;
            } else if (!response.ok && currentPreviewUrls[previewId] !== streams.audioOnly) {
                previewPlayer.load(streams.audioOnly);
                currentPreviewUrls[previewId] = streams.audioOnly;
            }
            previewPlayer.play(); // Ensure play is called after load
        })
        .catch(error => {
            console.error("Preview load error:", error);
            previewPlayer.load(streams.audioOnly);
            previewPlayer.play();
            currentPreviewUrls[previewId] = streams.audioOnly;
        });
    }

    document.getElementById('preview1').addEventListener('click', () => {
        player.load(currentPreviewUrls.preview1);
        player.play();
    });

    document.getElementById('preview2').addEventListener('click', () => {
        player.load(currentPreviewUrls.preview2);
        player.play();
    });

    document.getElementById('preview3').addEventListener('click', () => {
        player.load(currentPreviewUrls.preview3);
        player.play();
    });

    setInterval(() => {
        loadPreview(preview1, streams.output1, 'preview1');
        loadPreview(preview2, streams.output2, 'preview2');
        loadPreview(preview3, streams.output3, 'preview3');
    }, 5000); // Check every 5 seconds

    // Initialize players with audio only stream
    [preview1, preview2, preview3].forEach(preview => {
        preview.load(streams.audioOnly);
        preview.play();
    });

    player.setAutoplay(true);
    player.load(streams.audioOnly);
    player.play();

    player.addEventListener(IVSPlayerPackage.PlayerState.PLAYING, () => {
        console.log("Player State - PLAYING");
    });

    player.addEventListener(IVSPlayerPackage.PlayerState.ENDED, () => {
        console.log("Player State - ENDED");
        player.load(streams.audioOnly);
        player.play();
    });

    player.addEventListener(IVSPlayerPackage.PlayerEventType.ERROR, (err) => {
        console.warn("Player Event - ERROR:", err);
        player.load(streams.audioOnly);
        player.play();
    });

})(window.IVSPlayer);
