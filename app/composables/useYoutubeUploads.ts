import type { UploadItem } from '~/types/youtube'

export const useYoutubeUploads = (handle?: string | Ref<string>) => {
    return useFetch<UploadItem[]>('/api/youtube/uploads', {
        query: { handle },
    })
}
