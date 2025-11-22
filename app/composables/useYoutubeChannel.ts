import type { ChannelData } from '~/types/youtube'

export const useYoutubeChannel = (handle?: string | Ref<string>) => {
    return useFetch<ChannelData>('/api/youtube/channel', {
        query: { handle },
    })
}
