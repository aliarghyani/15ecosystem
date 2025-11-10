// English video data - Manual entry
// Videos from KhashayarTalks channel
// DO NOT EDIT MANUALLY - Use YAML files and generation script when available

import type { Video } from '~/types'
import { extractYouTubeVideoId, getYouTubeThumbnail } from '~/utils/videos'

export const videos: Video[] = [
  {
    id: 'hxnS40NolrA',
    youtubeUrl: 'https://youtu.be/hxnS40NolrA?si=VmLNwagTXJDUb_KU',
    youtubeId: 'hxnS40NolrA',
    title: {
      fa: 'عادت برای افزایش سلامت، قدرت و طول عمر ۷ استاد دانشگاه هاروارد: موثرترین روش افزایش طول عمر',
      en: 'Habits for Increasing Health, Strength, and Longevity - Harvard University Professor: The Most Effective Way to Increase Longevity'
    },
    description: {
      fa: 'ویدیوی کامل و خلاصه‌شده از سخنرانی استاد دانشگاه هاروارد درباره موثرترین روش‌های افزایش طول عمر و سلامت',
      en: 'Full video and summary of Harvard University Professor\'s lecture on the most effective ways to increase longevity and health'
    },
    thumbnail: getYouTubeThumbnail('hxnS40NolrA', 'maxres'),
    duration: 1991, // 33:31 in seconds
    viewCount: 82000, // 82K views
    skillIds: [6], // Skill 6: Longevity
    categoryIds: ['health'],
    tags: ['longevity', 'health', 'harvard'],
    channelId: 'KhashayarTalks',
    channelName: 'KhashayarTalks'
  },
  {
    id: 'IFoDg0FJwnk',
    youtubeUrl: 'https://youtu.be/IFoDg0FJwnk?si=vf7CLqdF5FtmtFkq',
    youtubeId: 'IFoDg0FJwnk',
    title: {
      fa: 'Peter Attia (ترجمه فارسی) چطور سلامت مغز و بدنمان را از دست ندهیم؟ بدن تان را نابود نکنید!',
      en: 'Peter Attia (Persian Translation) How Not to Lose Our Brain and Body Health? Don\'t Destroy Your Body!'
    },
    description: {
      fa: 'ترجمه فارسی از سخنرانی دکتر Peter Attia درباره حفظ سلامت مغز و بدن و جلوگیری از نابودی بدن',
      en: 'Persian translation of Dr. Peter Attia\'s lecture on maintaining brain and body health and preventing body destruction'
    },
    thumbnail: getYouTubeThumbnail('IFoDg0FJwnk', 'maxres'),
    duration: 1614, // 26:54 in seconds
    viewCount: 44000, // 44K views
    skillIds: [6], // Skill 6: Longevity
    categoryIds: ['health'],
    tags: ['longevity', 'health', 'peter-attia', 'brain-health'],
    channelId: 'KhashayarTalks',
    channelName: 'KhashayarTalks'
  }
]

