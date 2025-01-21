<script setup lang="ts">
import { useAudioTools } from '@/composables/use-audio-tools';
import { useSTT } from '@/composables/use-stt';
import { appConfig } from '@/config';
import { getApiService } from '@/services/api.service';
import { ref } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);
const { getTranscription, getTranscriptionStatus, sendAudio } = useSTT(getApiService(appConfig));
const { startRecording, stopRecording, isRecording } = useAudioTools(sendAudio);

const jobId = ref<string | null>(null);
const jobStatus = ref<"running" | "done" | "rejected" | "deleted" | "expired" | null>(null);
const transcription = ref<string | null>(null);

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
                <p data-testid="transcription-result">{{ transcription }}</p>
            </template>
            <template v-else-if="jobStatus">
                <h4>Transcription status</h4>
                <p data-testid="transcription-status">{{ jobStatus }}</p>
            </template>
        </div>
    </main>
</template>
