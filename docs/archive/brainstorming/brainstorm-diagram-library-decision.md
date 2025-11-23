# Diagram Library Decision: Mermaid vs Vue Flow

## ✅ Final Decision: **Mermaid**

**Chosen**: Mermaid  
**Reason**: Perfect fit for static display requirements, smaller bundle, easier maintenance, built-in dark mode support

## Use Case Analysis

**Requirements:**
- Display skill connections visually
- Show foundational scores (connection counts)
- Emphasize foundational skills (like Quality Sleep)
- Support dark/light mode
- Static display (users don't create diagrams)
- We create diagrams programmatically

## Library Comparison

### Mermaid (Text-Based Diagrams) ✅ CHOSEN

**Pros:**
✅ **Easy to create/maintain**: Text-based syntax, easy to generate programmatically  
✅ **Smaller bundle**: ~200KB vs Vue Flow's larger size  
✅ **Perfect for static display**: Designed for documentation-style diagrams  
✅ **Dark mode support**: Built-in theme switching (`theme: 'dark'`)  
✅ **Multiple diagram types**: Flowcharts, graphs, hierarchies  
✅ **SSG-friendly**: Works well with static site generation  
✅ **Simple integration**: Just render text → SVG  

**Cons:**
❌ **Less interactive**: No drag/zoom/pan (but we don't need this)  
❌ **Limited customization**: Node sizes based on text, not dynamic scores  
❌ **Fixed layouts**: Layout algorithms are automatic  

**Best For:**
- Documentation-style diagrams ✅
- Hierarchical relationships ✅
- Flow/progression visualization ✅
- When you want simple, maintainable code ✅

### Vue Flow (Interactive Diagrams) ❌ NOT CHOSEN

**Pros:**
✅ **Highly interactive**: Drag, zoom, pan, hover effects  
✅ **Dynamic node sizing**: Can size nodes based on connection scores  
✅ **Custom nodes**: Fully customizable skill cards  
✅ **Force-directed layouts**: Automatic graph layout algorithms  
✅ **Rich interactions**: Hover effects, click handlers, animations  
✅ **Professional look**: More polished, modern appearance  

**Cons:**
❌ **Larger bundle**: More dependencies, bigger size  
❌ **More complex**: Requires more setup and configuration  
❌ **Overkill for static**: If users don't interact, features go unused  
❌ **SSG considerations**: May need client-side only rendering  

**Best For:**
- Interactive explorations
- Dynamic visualizations
- When users need to explore relationships
- Complex custom node designs

## Implementation Details

### Scoring Algorithm (Implemented)
```typescript
Foundation Score = (Incoming × 2) + Outgoing
```
- **Incoming × 2**: Emphasizes foundational nature (many skills depend on this)
- **Outgoing**: Shows how this skill enables others

### Visual Representation Strategy (Implemented)

1. **Foundational Skills Flowchart**: Shows top 5 foundational skills and what they enable
2. **Progression Flowchart**: Shows Health → Identity → Career flow with subgraphs
3. **Connection Network** (optional): Full network view (can be toggled)

### Foundational Emphasis (Implemented)

- ⭐ Star badges on foundational skills in main view
- Special styling (amber/gold) in Mermaid diagrams
- "Start Here" messaging
- Foundation scores displayed
- Visual hierarchy in diagrams

### Files Created/Modified

1. **`app/components/common/MermaidDiagram.client.vue`**: Mermaid component with dark mode support
2. **`app/utils/diagrams.ts`**: Scoring utilities and diagram generation functions
3. **`app/components/diagrams/SkillRelationshipDiagram.vue`**: Updated to use Mermaid diagrams
4. **`app/utils/content.ts`**: Expanded Quality Sleep relationships
5. **`i18n/locales/*.json`**: Added translations for new UI elements

## Next Steps

✅ All implementation complete!  
The Key Connections section now features:
- Visual scoring system
- Foundational skills emphasis
- Comprehensive relationship mapping
- Mermaid diagrams for clear visualization
- Dark mode support
