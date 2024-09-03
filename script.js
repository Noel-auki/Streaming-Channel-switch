// script.js
(function (IVSPlayerPackage) {
    if (!IVSPlayerPackage.isPlayerSupported) {
        console.warn("The current browser does not support the IVS player.");
        return;
    }

    const player1 = IVSPlayerPackage.create({
        liveLowLatency: true,
        maxBufferLength: 10
    });

    const player2 = IVSPlayerPackage.create({
        liveLowLatency: true,
        maxBufferLength: 10
    });

    const preview1 = IVSPlayerPackage.create();
    const preview2 = IVSPlayerPackage.create();

    // Attach video elements to IVS players
    player1.attachHTMLVideoElement(document.getElementById("player1"));
    player2.attachHTMLVideoElement(document.getElementById("player2"));
    preview1.attachHTMLVideoElement(document.getElementById("preview1"));
    preview2.attachHTMLVideoElement(document.getElementById("preview2"));

    const streams = {
        output1: 'https://3893e27cd44d.us-east-1.playback.live-video.net/api/video/v1/us-east-1.007088424812.channel.zMhcn0zy6v1k.m3u8',
        output2: 'https://3893e27cd44d.us-east-1.playback.live-video.net/api/video/v1/us-east-1.007088424812.channel.QMHb5NCOo5pO.m3u8'
    };

    function loadStream(player, streamUrl) {
        player.load(streamUrl);
        player.play();
    }

    function handlePreviewClick(previewId) {
        if (previewId === 'output1') {
            document.getElementById('player1').style.display = 'block';
            document.getElementById('player2').style.display = 'none';
            player1.setVolume(1); // Unmute player1
            player2.setVolume(0); // Mute player2
        } else if (previewId === 'output2') {
            document.getElementById('player1').style.display = 'none';
            document.getElementById('player2').style.display = 'block';
            player1.setVolume(0); // Mute player1
            player2.setVolume(1); // Unmute player2
        }
    }

    document.querySelectorAll('.preview-container').forEach(container => {
        container.addEventListener('click', () => {
            const streamId = container.dataset.stream;
            handlePreviewClick(streamId);
        });
    });

    // Start streaming both players initially
    loadStream(player1, streams.output1);
    loadStream(player2, streams.output2);

})(window.IVSPlayer);
