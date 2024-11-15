// Download audio code:

document.querySelector(".download").addEventListener("click", async () => {
    const text = document.querySelector("textarea").value;
    const voice = voices[voiceselect.value];
    const audioBlob = await textToSpeechBlob(text, voice);
    const url = URL.createObjectURL(audioBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "speech.wav";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

async function textToSpeechBlob(text, voice) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const destination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream);

    speech = new SpeechSynthesisUtterance(text);
    speech.voice = voice;

    const source = audioContext.createMediaStreamSource(destination.stream);
    const chunks = [];

    mediaRecorder.ondataavailable = event => chunks.push(event.data);
    mediaRecorder.start();

    speech.onend = () => {
        mediaRecorder.stop();
    };

    window.speechSynthesis.speak(speech);

    return new Promise(resolve => {
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/wav" });
            resolve(blob);
        };
    });
}