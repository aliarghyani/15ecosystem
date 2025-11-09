# Investigation Prompt: Complete Skill Relationships

## Objective

To define a **complete, accurate, and comprehensive** set of skill relationships for all 15 skills in the 15ecosystem platform. This investigation will ensure that:

1. All logical dependencies are captured
2. Foundational skills are correctly identified
3. The relationship network accurately reflects how skills build upon each other
4. No skills are missing important connections

## Context

The 15 skills are organized into 3 categories:

### Health Category (Skills 1-6): Foundation
1. **Quality Sleep** (خواب با کیفیت)
2. **Focus** (تمرکز) - Economy of Attention
3. **Dopamine Management** (مدیریت دوپامین)
4. **Stress Management** (مدیریت استرس)
5. **Mental Health and Meaningful Relationships** (سلامت روان و روابط معنادار)
6. **Healthy Longevity** (طول عمر سالم)

### Identity Category (Skills 7-12): Building
7. **Creativity** (خلاقیت) - Necessity, not a benefit
8. **Specific Knowledge** (دانش تخصصی شخصی)
9. **Effective and Continuous Learning** (یادگیری مؤثر و ادامه دار)
10. **English Language** (زبان انگلیسی)
11. **Personal Brand** (برند شخصی)
12. **Authenticity** (اصالت)

### Career Category (Skills 13-15): Advanced
13. **Content Creation** (تولید محتوا)
14. **AI Literacy** (سواد هوش مصنوعی)
15. **Agency** (آژانس)

## Investigation Questions

For each skill (1-15), please answer:

### 1. Direct Prerequisites
**Question**: Which skills must be mastered **before** or are **required** for this skill?
- Example: "To have good Focus (2), you need Quality Sleep (1)"
- Example: "To learn effectively (9), you need Focus (2)"

### 2. Enabling Skills
**Question**: Which skills does this skill **enable** or **make easier** to master?
- Example: "Quality Sleep (1) enables Focus (2), Dopamine Management (3), Stress Management (4)"
- Example: "Focus (2) enables Learning (9), Creativity (7)"

### 3. Complementary Skills
**Question**: Which skills **work together** or **complement** this skill?
- Example: "Creativity (7) and Specific Knowledge (8) complement each other"
- Example: "Learning (9) and English (10) work together"

### 4. Foundational Nature
**Question**: Is this skill foundational? (Does it connect to many other skills?)
- **Key Insight**: Quality Sleep (1) is mentioned as connecting to almost all skills - is this accurate?
- Which other skills are highly foundational?

## Data Format Required

Please provide your investigation results in **JSON format** as follows:

```json
{
  "1": {
    "skillName": "Quality Sleep",
    "prerequisites": [],
    "enables": [2, 3, 4, 5, 6, 7, 9],
    "complements": [2, 3, 4],
    "notes": "Foundational skill - connects to almost all other skills"
  },
  "2": {
    "skillName": "Focus",
    "prerequisites": [1],
    "enables": [3, 7, 9],
    "complements": [1, 3, 9],
    "notes": "Requires Quality Sleep to function effectively"
  },
  "3": {
    "skillName": "Dopamine Management",
    "prerequisites": [1, 2],
    "enables": [4],
    "complements": [1, 2, 4],
    "notes": ""
  },
  "4": {
    "skillName": "Stress Management",
    "prerequisites": [1, 2, 3],
    "enables": [5],
    "complements": [1, 2, 3, 5],
    "notes": ""
  },
  "5": {
    "skillName": "Mental Health and Meaningful Relationships",
    "prerequisites": [4],
    "enables": [6],
    "complements": [4, 6],
    "notes": ""
  },
  "6": {
    "skillName": "Healthy Longevity",
    "prerequisites": [1, 4, 5],
    "enables": [],
    "complements": [1, 4, 5],
    "notes": ""
  },
  "7": {
    "skillName": "Creativity",
    "prerequisites": [2],
    "enables": [8, 9],
    "complements": [2, 8, 9],
    "notes": "Needs Focus to be creative effectively"
  },
  "8": {
    "skillName": "Specific Knowledge",
    "prerequisites": [7, 9],
    "enables": [10],
    "complements": [7, 9, 10],
    "notes": ""
  },
  "9": {
    "skillName": "Effective and Continuous Learning",
    "prerequisites": [2],
    "enables": [8, 10],
    "complements": [2, 7, 8, 10],
    "notes": ""
  },
  "10": {
    "skillName": "English Language",
    "prerequisites": [8, 9],
    "enables": [11],
    "complements": [8, 9, 11],
    "notes": ""
  },
  "11": {
    "skillName": "Personal Brand",
    "prerequisites": [7, 8, 10],
    "enables": [12, 13],
    "complements": [7, 8, 10, 12, 13],
    "notes": ""
  },
  "12": {
    "skillName": "Authenticity",
    "prerequisites": [11],
    "enables": [13],
    "complements": [11, 13],
    "notes": ""
  },
  "13": {
    "skillName": "Content Creation",
    "prerequisites": [7, 8, 11, 12],
    "enables": [14],
    "complements": [7, 8, 11, 12, 14],
    "notes": ""
  },
  "14": {
    "skillName": "AI Literacy",
    "prerequisites": [8, 9, 13],
    "enables": [15],
    "complements": [8, 9, 13, 15],
    "notes": ""
  },
  "15": {
    "skillName": "Agency",
    "prerequisites": [11, 12, 13, 14],
    "enables": [],
    "complements": [11, 12, 13, 14],
    "notes": ""
  }
}
```

## Simplified Format (Alternative)

If the above format is too complex, you can provide a simpler format where each skill lists **all related skills** (combining prerequisites, enables, and complements):

```json
{
  "1": [2, 3, 4, 5, 6, 7, 9],
  "2": [1, 3, 7, 9],
  "3": [1, 2, 4],
  "4": [1, 2, 3, 5],
  "5": [4, 6],
  "6": [1, 4, 5],
  "7": [2, 8, 9],
  "8": [7, 9, 10],
  "9": [2, 7, 8, 10],
  "10": [8, 9, 11],
  "11": [7, 8, 10, 12, 13],
  "12": [11, 13],
  "13": [7, 8, 11, 12, 14],
  "14": [8, 9, 13, 15],
  "15": [11, 12, 13, 14]
}
```

**Note**: In this simplified format, if Skill A is related to Skill B, Skill B should also be related to Skill A (bidirectional for now).

## Key Considerations

### 1. Quality Sleep (Skill 1) - The "Mother Skill"
- You mentioned Quality Sleep connects to almost all skills
- Please verify: Does it connect to skills 1-15? Or specific ones?
- Which skills absolutely require Quality Sleep as a prerequisite?

### 2. Cross-Category Connections
- Health → Identity: Which health skills enable identity skills?
- Identity → Career: Which identity skills enable career skills?
- Are there any reverse connections? (e.g., Career skills enabling Health skills?)

### 3. Skill 7 (Creativity) - Current Status
- Currently has connections: [2, 8, 9]
- Should it connect to more skills?
- Should other skills connect TO Creativity?

### 4. Missing Connections
- Are there any obvious connections missing?
- For example: Should Learning (9) connect to more skills?
- Should Focus (2) connect to more skills?

### 5. Foundational Skills Priority
- Which 5 skills are MOST foundational?
- These should have the highest "incoming" connection counts
- Quality Sleep (1) should likely be #1

## Deliverable

Please provide:
1. **Complete JSON** with all skill relationships (use simplified format if easier)
2. **Brief notes** on any special considerations or patterns you noticed
3. **List of top 5 foundational skills** (if different from current calculation)

## Current Implementation Reference

The current relationships are defined in `app/utils/content.ts` in the `addRelatedSkills()` function. After you provide the updated data, I will:

1. Update the relationships in `app/utils/content.ts`
2. Regenerate the content data files
3. Update the Mermaid diagrams to reflect the new connections
4. Recalculate foundation scores

## Questions to Guide Your Investigation

1. **Think about learning progression**: If someone wants to master Skill X, what must they learn first?
2. **Think about dependencies**: Skill A enables Skill B - is this accurate?
3. **Think about synergies**: Skills that work better together
4. **Think about prerequisites**: What's absolutely required vs. what's helpful?

Thank you for your thorough investigation! This will ensure the skill relationship diagrams accurately represent the learning ecosystem.

