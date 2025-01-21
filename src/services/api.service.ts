import type { AppConfig } from "@/config";
import axios from "axios";
import type { IApiService } from "./api.service.types";

// https://docs.speechmatics.com/jobsapi

const BASE_URL = "https://asr.api.speechmatics.com/v2";

const getAuthHeader = (apiKey: string) => ({
    Authorization: `Bearer ${apiKey}`,
});

export const getApiService = (appConfig: AppConfig): IApiService => ({
    postAudio: async (formData: FormData) => {
        const response = await axios.post(`${BASE_URL}/jobs`, formData, {
            headers: {
                ...getAuthHeader(appConfig.apiKey),
                "Content-Type": "multipart/form-data",
            },
        });

        return { id: response.data.id as string };
    },

    getTranscriptionStatus: async (jobId: string) => {
        const response = await axios.get(`${BASE_URL}/jobs/${jobId}`, {
            headers: { ...getAuthHeader(appConfig.apiKey) },
        });

        return { status: response.data.job.status };
    },

    getTranscription: async (jobId: string) => {
        const response = await axios.get(
            `${BASE_URL}/jobs/${jobId}/transcript?format=txt`,
            {
                headers: { ...getAuthHeader(appConfig.apiKey) },
            },
        );

        return { result: response.data as string };
    },
});
