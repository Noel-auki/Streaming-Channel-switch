(function (IVSPlayerPackage) {
    if (!IVSPlayerPackage.isPlayerSupported) {
        console.warn("The current browser does not support the IVS player.");
        return;
    }

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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

    // Gain nodes for crossfading
    const gainNode1 = audioCtx.createGain();
    const gainNode2 = audioCtx.createGain();

    // Attach gain nodes to players
    const source1 = audioCtx.createMediaElementSource(document.getElementById('player1'));
    const source2 = audioCtx.createMediaElementSource(document.getElementById('player2'));

    source1.connect(gainNode1).connect(audioCtx.destination);
    source2.connect(gainNode2).connect(audioCtx.destination);

    // Start both players muted initially
    gainNode1.gain.value = 0;
    gainNode2.gain.value = 0;

    const streams = {
        output1: 'https://3893e27cd44d.us-east-1.playback.live-video.net/api/video/v1/us-east-1.007088424812.channel.zMhcn0zy6v1k.m3u8',
        output2: 'https://3893e27cd44d.us-east-1.playback.live-video.net/api/video/v1/us-east-1.007088424812.channel.QMHb5NCOo5pO.m3u8'
    };

    function loadStream(player, streamUrl) {
        player.load(streamUrl);
        player.play();
    }

    function crossfade(fromGainNode, toGainNode) {
        const duration = 2;  // Set the crossfade duration (in seconds)
        fromGainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration); // Fade out
        toGainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);  // Start with a low volume
        toGainNode.gain.exponentialRampToValueAtTime(1, audioCtx.currentTime + duration);  // Fade in
    }

    function handlePreviewClick(previewId) {
        if (previewId === 'output1') {
            document.getElementById('player1').style.display = 'block';
            document.getElementById('player2').style.display = 'none';
            crossfade(gainNode2, gainNode1);  // Crossfade from player2 to player1
        } else if (previewId === 'output2') {
            document.getElementById('player1').style.display = 'none';
            document.getElementById('player2').style.display = 'block';
            crossfade(gainNode1, gainNode2);  // Crossfade from player1 to player2
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

    // Start muted previews
    preview1.setVolume(0);
    preview2.setVolume(0);

    // Load streams into previews and ensure playback
    loadStream(preview1, streams.output1);
    loadStream(preview2, streams.output2);

    // Ensure previews are playing
    preview1.play().catch(error => console.error('Error playing preview1:', error));
    preview2.play().catch(error => console.error('Error playing preview2:', error));

})(window.IVSPlayer);
