export interface IApiService {
    postAudio: (formData: FormData) => Promise<{ id: string }>;

    getTranscriptionStatus: (
        id: string,
    ) => Promise<{
        status: "running" | "done" | "rejected" | "deleted" | "expired";
    }>;

    getTranscription: (id: string) => Promise<{ result: string }>;
}
