import { ref } from "vue";

export const useAudioTools = (
    sendAudio: (
        audioChunks: Float32Array<ArrayBuffer>[],
    ) => Promise<{ id: string }>,
) => {
    const isRecording = ref(false);
    let audioChunks: Float32Array<ArrayBuffer>[] = [];
    let input: MediaStreamAudioSourceNode;
    let processor: ScriptProcessorNode;
    let analyser: AnalyserNode;
    let audioContext: AudioContext;
    let animationFrameId: number;

    const drawVisualizer = (canvasEl: HTMLCanvasElement) => {
        if (!canvasEl || !analyser) return;

        const canvasCtx = canvasEl.getContext("2d");

        if (!canvasCtx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationFrameId = requestAnimationFrame(draw);

            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = "#f5f5f5";
            canvasCtx.fillRect(0, 0, canvasEl.width, canvasEl.height);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = "#0078d7";

            canvasCtx.beginPath();

            const sliceWidth = (canvasEl.width * 1.0) / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * canvasEl.height) / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(canvasEl.width, canvasEl.height / 2);
            canvasCtx.stroke();
        };

        draw();
    };

    const startRecording = async (canvasEl: HTMLCanvasElement) => {
        isRecording.value = true;
        audioChunks = [];
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        audioContext = new window.AudioContext();
        input = audioContext.createMediaStreamSource(stream);

        console.log("AudioContext state:", audioContext?.state);
        console.log("AudioContext sample rate:", audioContext?.sampleRate);

        // Create analyser for visualizer
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;

        // Connect the input to the analyser
        input.connect(analyser);

        // Script processor for recording audio chunks
        processor = audioContext.createScriptProcessor(1024, 1, 1);
        processor.onaudioprocess = (event) => {
            console.log("Audio recording active:", isRecording.value);

            if (!isRecording.value) return;

            const inputData = event.inputBuffer.getChannelData(0);
            if (inputData.length === 0) {
                console.error("Empty input buffer detected!");
            } else {
                console.log("Input buffer length:", inputData.length);
            }

            const audioBuffer = new Float32Array(inputData.length);
            audioBuffer.set(inputData); // Copy data to prevent overwriting
            audioChunks.push(audioBuffer);
            console.log("Audio chunk added. Length:", audioBuffer.length);
        };

        analyser.connect(processor);
        processor.connect(audioContext.destination);

        // Start visualizer
        drawVisualizer(canvasEl);
    };

    const stopRecording = async () => {
        isRecording.value = false;

        if (processor) {
            processor.disconnect();
            input.disconnect();
            analyser.disconnect();
        }

        // Cleanup resources & cancel visualizer animation
        if (audioContext) audioContext.close();
        cancelAnimationFrame(animationFrameId);

        return sendAudio(audioChunks);
    };

    return { startRecording, stopRecording, isRecording };
};
