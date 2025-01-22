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
    jobStatus.value = "running";

    jobId.value = (await stopRecording()).id;

    const interval = setInterval(async () => {
        if (!jobId.value) return;

        jobStatus.value = await getTranscriptionStatus(jobId.value);

        console.log(jobStatus.value);

        if (jobStatus.value === 'done') {
            clearInterval(interval);

            transcription.value = await getTranscription(jobId.value) || ".";
        }
    }, 5000);
};

const imageMap = [
    { url: '/geocities_adbanner.gif', style: { top: '90vh', left: '34vw' } },
    { url: '/animbarfirewal.gif', style: { top: '95vh', left: '30vw' } },
    { url: '/ucabar1.gif', style: { top: '65vh', left: '31vw' } },

    { url: '/godflame.gif', style: { top: '20vh', left: '1vw' } },
    { url: '/godflame.gif', style: { top: '20vh', left: '85vw', transform: "scaleX(-1)" } },

    { url: '/wamkydancingskull.gif', style: { top: '2vh', left: '17vw' } },
    { url: '/wamkydancingskull.gif', style: { top: '2vh', left: '77vw', transform: "scaleX(-1)" } },


    { url: '/burning_bright_torch_aniGif.gif', style: { top: '22vh', left: '17vw' } },
    { url: '/burning_bright_torch_aniGif.gif', style: { top: '22vh', left: '77vw', transform: "scaleX(-1)" } },

    { url: '/Movie5.gif', style: { top: '2vh', left: '1vw' } },
    { url: '/Movie5.gif', style: { top: '2vh', left: '86vw' } },
];
</script>

<template>
    <main>
        <div class="tapiporla">
            <img :style="{ position: 'absolute', ...image.style }" v-for="image in imageMap" :key="image.url"
                :src="image.url" />
            <!-- https://gifcities.org/ -->
            <!-- https://www.cameronsworld.net/ -->
            <!-- 
            https://web.archive.org/web/20090821142410/http://geocities.com/Heartland/Fields/9757/geocities_adbanner.gif
            https://web.archive.org/web/20090821081034/http://geocities.com/tbr_random/animbarfirewal.gif
            https://web.archive.org/web/20090829033052/http://geocities.com/random_darkness/godflame.gif
            https://web.archive.org/web/20090829201953/http://geocities.com/vintagetechnologyclub/ucabar1.gif
            https://web.archive.org/web/20091019074343/http://www.geocities.com/deepakpithwainfashiontechnology/Movie5.gif
            https://web.archive.org/web/20090830154342/http://www.geocities.com/epmorgue/skeleton4.gif

            <img
                src="https://web.archive.org/web/20091021131526/http://www.geocities.com/goth_wanker//wamkydancingskull.gif" />
            <img
                src="https://web.archive.org/web/20091019054523/http://www.geocities.com/astronomy_with_tru2004433/burning_bright_torch_aniGif.gif" /> -->
        </div>

        <div class="contento">
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
                <img
                    src="https://web.archive.org/web/20091021132125/http://www.geocities.com/dicketgeorge/windows.gif" />
            </template>
        </div>

    </main>
</template>

<style>
div,
button {
    font-family: "Comic Sans MS", "Comic Sans";
    font-size: 32px;
}

body {
    color: white;
    background: black;
    text-align: center;
    background-image: url('/bg.png');
}

.contento {
    background-color: black;
    border: 8px double blue;
    max-width: 600px;
    margin: auto;
    z-index: 10;
}

.tapiporla {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}
</style>
