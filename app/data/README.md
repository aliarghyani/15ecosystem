# Data Directory

Content data files organized by language.

## Structure

```
data/
├── en/          # English content data
│   ├── skills.ts
│   ├── categories.ts
│   └── books.ts
└── fa/          # Persian content data
    ├── skills.ts
    ├── categories.ts
    └── books.ts
```

## Usage

Data files are imported explicitly:

```typescript
import { skills } from '~/data/en/skills'
import { skills as skillsFa } from '~/data/fa/skills'
```

