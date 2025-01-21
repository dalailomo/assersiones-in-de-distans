import axios from "axios";
import { ref } from "vue";

import { appConfig } from "./../config";
import type { IApiService } from "@/services/api.service.types";

const float32ArrayToWav = (
    buffer: Float32Array<ArrayBuffer>,
    sampleRate = 44100,
) => {
    console.log("Generating WAV with buffer length:", buffer.length);

    if (buffer.length === 0) {
        console.error("Buffer is empty. No audio recorded.");
        return null;
    }

    const wavBuffer = new ArrayBuffer(44 + buffer.length * 2);
    const view = new DataView(wavBuffer);

    // Write WAV header
    const writeString = (
        view: DataView<ArrayBuffer>,
        offset: number,
        string: string,
    ) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + buffer.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // AudioFormat (PCM)
    view.setUint16(22, 1, true); // NumChannels
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, sampleRate * 2, true); // ByteRate
    view.setUint16(32, 2, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample
    writeString(view, 36, "data");
    view.setUint32(40, buffer.length * 2, true); // Subchunk2Size

    // Write PCM samples
    let offset = 44;
    for (let i = 0; i < buffer.length; i++, offset += 2) {
        const sample = Math.max(-1, Math.min(1, buffer[i])); // Clamping
        view.setInt16(
            offset,
            sample < 0 ? sample * 0x8000 : sample * 0x7fff,
            true,
        );
    }

    return new Blob([wavBuffer], { type: "audio/wav" });
};

export const useSTT = (apiService: IApiService) => {
    const transcript = ref("");

    const sendAudio = async (audioChunks: Float32Array<ArrayBuffer>[]) => {
        console.log("Number of audio chunks:", audioChunks.length);
        audioChunks.forEach((chunk, index) => {
            console.log(`Chunk ${index} length:`, chunk.length);
        });

        // Merge all audio chunks into a single Float32Array
        const combinedBuffer = new Float32Array(
            audioChunks.reduce((acc, chunk) => acc + chunk.length, 0),
        );
        let offset = 0;
        audioChunks.forEach((chunk) => {
            combinedBuffer.set(chunk, offset);
            offset += chunk.length;
        });
        console.log("Combined audio buffer length:", combinedBuffer.length);

        // Convert Float32Array to WAV Blob
        const audioBlob = float32ArrayToWav(combinedBuffer);

        const formData = new FormData();
        formData.append("data_file", audioBlob as any);

        // Add config as before
        const config = {
            type: "transcription",
            transcription_config: {
                operating_point: "enhanced",
                language: "en",
            },
        };
        formData.append("config", JSON.stringify(config));

        const id = await apiService.postAudio(formData);

        return id;
    };

    const getTranscriptionStatus = async (jobId: string) => {
        const { status } = await apiService.getTranscriptionStatus(jobId);

        return status;
    };

    const getTranscription = async (jobId: string) => {
        const { result } = await apiService.getTranscription(jobId);

        return result;
    };

    return { sendAudio, getTranscriptionStatus, getTranscription };
};
