<script setup lang="ts">
import { useAudioTools } from '../src/composables/use-audio-tools';
import { useSTT } from '../src//composables/use-stt';
import { appConfig } from '../src//config';
import { getApiService } from '../src/services/api.service';
import { ref } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);
const { getTranscription, getTranscriptionStatus, sendAudio } = useSTT(getApiService(appConfig));
const { startRecording, stopRecording, isRecording } = useAudioTools(sendAudio);

const jobId = ref<string | null>(null);
const jobStatus = ref<"running" | "done" | "rejected" | "deleted" | "expired" | null>(null);
const transcription = ref<string | null>(null);

const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const onStartRecording = async () => {
    if (!canvas.value) {
        console.log('no canvas no taco tuesdays');
        return;
    }

    transcription.value = null;
    jobStatus.value = null;

    await startRecording(canvas.value);
};

const onStopRecording = async () => {
    jobId.value = (await stopRecording()).id;

    const interval = setInterval(async () => {
        if (!jobId.value) return;

        jobStatus.value = await getTranscriptionStatus(jobId.value);

        console.log(jobStatus.value);

        if (jobStatus.value === 'done') {
            clearInterval(interval);

            transcription.value = await getTranscription(jobId.value);
        }
    }, 5000);
};
</script>


<style>
div,
button {
    font-family: "Comic Sans MS", "Comic Sans";
    font-size: 32px;
}
</style>


<template>
    <main>
        <div>
            <canvas style="outline: 1px solid black" ref="canvas" width="500" height="150"></canvas>

            <br />

            <button data-testid="start-recording" @click="onStartRecording" :disabled="isRecording">
                Start Recording
            </button>
            <button data-testid="stop-recording" @click="onStopRecording" :disabled="!isRecording">
                Stop Recording
            </button>

            <br />

            <template v-if="transcription">
                <h4>Transcription result</h4>
                <p data-testid="transcription-result"><span v-for="(char, index) in transcription" :key="index"
                        :style="{ color: getRandomColor() }">
                        {{ char }}
                    </span>
                </p>
            </template>
            <template v-else-if="jobStatus">
                <h4>Transcription status</h4>
                <p data-testid="transcription-status"><span v-for="(char, index) in jobStatus" :key="index"
                        :style="{ color: getRandomColor() }">
                        {{ char }}
                    </span>
                </p>
            </template>
        </div>
    </main>
</template>
