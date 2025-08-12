# Timeline Component

A React component for visualizing items on a timeline with a compact lane layout and interactive features.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run in development mode
npm start
# or
npm run dev

# Production build
npm run build
```

The app will be available at `http://localhost:5173`.

## 📋 Implemented Features

### ✅ Core Features
- **Compact lane layout**: Items that do not overlap in time share the same lane
- **Clear visualization**: Each item shows its name, start, and end dates
- **Responsive**: Adapts to different screen sizes
- **Efficient lane algorithm**: Uses the optimized code in `assignLanes.ts`

### ✅ Extras
- **Zoom In/Out**: Control the visible time scale
- **Drag & Drop**: Drag items horizontally to change dates
- **Resize**: Adjust start/end dates via resize handles
- **Inline editing**: Click the item name to edit it directly
- **"Today" indicator**: A red line shows the current date
- **Visual controls**: Zoom buttons and timeline information

## 🎨 Design Decisions

### Inspiration
- **Microsoft Project**: Lane layout and bar visualization
- **GitHub Projects Timeline**: Clean aesthetics and zoom controls
- **Google Calendar**: Color system and visual feedback during interactions

### Technical Choices
- **Vite + React**: Modern, fast build tool for development
- **TypeScript**: Type safety for maintainability
- **Tailwind CSS 4**: Utility-first design system
- **Lucide React**: Lightweight, consistent SVG icons
- **Clsx + Tailwind Merge**: CSS class management utilities

### Layout and UX
- **Automatic color system**: Each item receives a color based on its ID
- **Visual feedback**: Clear hover, dragging, and editing states
- **Intuitive controls**: Resize handles and a clear drag area
- **Contextual information**: Tooltip with instructions and timeline details

## 💡 What I like about this implementation

1. **Efficient lane algorithm**: The `assignLanes.ts` code was optimized to create the most compact layout possible, including a buffer between items for better readability.

2. **Rich interactivity**: The combination of zoom, drag & drop, and inline editing offers a complete user experience without cluttering the interface.

3. **Modular code**: Well-separated components (`Timeline`, `TimelineItem`, `TimelineHeader`) make maintenance and testing easier.

4. **Performance**: `useMemo` and `useCallback` help avoid unnecessary re-renders, especially important with many items.

5. **Accessibility**: Use of contrasting colors, descriptive tooltips, and keyboard navigation.

## 🔄 What I would change if I did it again

1. **Virtualization**: For timelines with hundreds of items, implement virtualization to render only visible items.

2. **Global state**: Use Context API or Zustand to manage state, enabling features like undo/redo.

3. **Persistence**: Add localStorage or backend integration to save changes.

4. **Themes**: A more robust dark/light theme system.

5. **Internationalization**: Multi-language support, especially for date formats.

6. **Stronger validation**: Validate date overlaps and conflicts during editing.

## 🧪 How I would test with more time

### Unit Tests
```typescript
// Example tests I would implement
describe('assignLanes', () => {
  it('should assign items to the minimum number of lanes', () => {
    // Lane algorithm test
  });
  
  it('should handle overlapping items correctly', () => {
    // Overlap test
  });
});

describe('Timeline Component', () => {
  it('should render all items correctly', () => {
    // Render test
  });
  
  it('should handle zoom interactions', () => {
    // Zoom test
  });
  
  it('should support drag and drop', () => {
    // Drag & drop test
  });
});
```

### Integration Tests
- **Full flow**: Create → Edit → Drag → Resize item
- **Zoom + Interaction**: Test features at different zoom levels
- **Performance**: Use 100+ items to verify responsiveness

### E2E Tests
- **Cypress/Playwright**: Automate complex user interactions
- **Accessibility**: Screen readers and keyboard navigation
- **Cross-browser**: Compatibility across different browsers

### Performance Tests
- **React DevTools Profiler**: Identify components with unnecessary re-renders
- **Lighthouse**: Performance and accessibility metrics
- **Bundle analysis**: Optimize bundle size

## 🛠 Technologies Used

- **React 19** - Main framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **Clsx + Tailwind Merge** - CSS class management

## 📁 Project Structure

```
src/
├── components/
│   ├── Timeline.tsx          # Main component
│   ├── TimelineItem.tsx      # Individual timeline item
│   └── TimelineHeader.tsx    # Date header
├── lib/
│   └── utils.ts              # Utilities (cn function)
├── assignLanes.ts            # Lane layout algorithm
├── timelineItems.js          # Example data
├── App.tsx                   # Root component
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

---

This project demonstrates a complete implementation of a timeline component with a focus on usability, performance, and code maintainability.
