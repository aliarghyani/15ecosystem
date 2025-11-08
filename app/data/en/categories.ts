// English category data - Placeholder structure
// TODO: Verify English translations

import type { Category } from '~/types'

export const categories: Category[] = [
  {
    "id": "health",
    "name": {
      "fa": "سلامت",
      "en": "Health"
    },
    "description": {
      "fa": "مهارت‌های ۱ تا ۶: سلامت و انرژی پایه",
      "en": "Skills 1-6: Health and Energy Foundation"
    },
    "skills": [
      1,
      2,
      3,
      4,
      5,
      6
    ]
  },
  {
    "id": "identity",
    "name": {
      "fa": "هویت",
      "en": "Identity"
    },
    "description": {
      "fa": "مهارت‌های ۷ تا ۱۲: هویت، هدف و یادگیری",
      "en": "Skills 7-12: Identity, Purpose and Learning"
    },
    "skills": [
      7,
      8,
      9,
      10,
      11,
      12
    ]
  },
  {
    "id": "career",
    "name": {
      "fa": "شغل",
      "en": "Career"
    },
    "description": {
      "fa": "مهارت‌های ۱۳ تا ۱۵: بازار کار و درآمد",
      "en": "Skills 13-15: Career and Income"
    },
    "skills": [
      13,
      14,
      15
    ]
  }
]
