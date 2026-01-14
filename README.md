# 📚 My Bookshelf

A beautiful, cozy web application for tracking your reading journey. Built with React, Vite, and Tailwind CSS.

![Bookshelf App](https://img.shields.io/badge/React-18.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-646CFF) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC)

## ✨ Features

- **Visual Bookshelf Layout**: Books displayed on realistic wooden shelves
- **Three Reading States**: Want to Read, Currently Reading, and Read
- **Star Ratings**: Rate books from 1-5 stars
- **Reviews**: Write and save your thoughts about each book
- **Mobile-First Design**: Smooth horizontal scrolling on mobile, grid layout on desktop
- **Persistent Storage**: All data saved to localStorage
- **Cozy Aesthetic**: Warm wood textures, soft shadows, and comfortable typography

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd bookshelf-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Start adding books to your shelf!

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
bookshelf-app/
├── src/
│   ├── components/           # React components
│   │   ├── Bookshelf.jsx    # Main container component
│   │   ├── Shelf.jsx        # Individual shelf with books
│   │   ├── BookCard.jsx     # Single book display
│   │   ├── BookModal.jsx    # Book details/edit modal
│   │   ├── AddBookModal.jsx # Add new book form
│   │   └── StarRating.jsx   # Interactive star rating
│   ├── models/
│   │   └── Book.js          # Data models and validation
│   ├── services/
│   │   └── storage.js       # localStorage service
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles and animations
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind customization
└── postcss.config.js       # PostCSS setup
```

## 🏗️ Architecture

### Component Hierarchy

```
App
└── Bookshelf (State management)
    ├── Shelf (x3: Want to Read, Currently Reading, Read)
    │   └── BookCard (Multiple per shelf)
    ├── BookModal (View/edit book details)
    ├── AddBookModal (Add new books)
    └── StarRating (Used in modals)
```

### Data Flow

1. **Bookshelf** component manages all state and data operations
2. Data is persisted to **localStorage** via the storage service
3. Changes propagate down through props
4. User actions trigger callbacks that update parent state

### Data Model

Each book contains:

```javascript
{
  id: string,              // Unique identifier (UUID format)
  title: string,           // Book title
  author: string,          // Author name
  coverUrl: string,        // Cover image URL (optional)
  status: string,          // Reading status
  rating: number|null,     // 1-5 stars or null
  review: string,          // User's written review
  createdAt: number,       // Timestamp (ms)
  updatedAt: number,       // Timestamp (ms)
  finishedAt: number|null  // Timestamp when finished (ms)
}
```

## 🎨 Design System

### Typography
- **Display/Headings**: Literata (serif) - warm, literary feel
- **Body/UI**: Work Sans (sans-serif) - clean, modern

### Colors
- **Wood tones**: #8B6F47 (primary), #5C4A2F (dark)
- **Cream**: #F5EFE7 (background), #FBF8F3 (light)
- **Accent**: #FF9800 (amber) for interactive elements

### Key Features
- Wood grain texture on shelves
- Realistic book shadows and depth
- Smooth animations and transitions
- Responsive grid → horizontal scroll behavior

## 📱 Mobile Support

The app is **mobile-first** with these touch-friendly features:

- Horizontal scrolling shelves (with scroll indicators)
- Bottom sheet modals on mobile
- Large tap targets (buttons, book cards)
- No hover-only interactions
- Responsive typography and spacing

## 🔄 Future Enhancements

### Easy Mobile App Conversion

The architecture is designed for easy conversion to React Native or mobile PWA:

1. **Component structure** uses React patterns compatible with React Native
2. **No CSS-specific features** that can't be translated (using Tailwind)
3. **Touch-first interactions** already implemented
4. **localStorage abstraction** makes backend migration simple

### Database Migration (Supabase/Firebase)

To migrate from localStorage to a real database:

1. **Replace `src/services/storage.js`** with your database service:
   ```javascript
   // Example: Supabase
   import { supabase } from './supabase-client';
   
   export async function getAllBooks() {
     const { data } = await supabase
       .from('books')
       .select('*')
       .eq('user_id', userId);
     return data;
   }
   ```

2. **Add authentication** to associate books with users

3. **Update component to use async/await**:
   ```javascript
   useEffect(() => {
     async function loadBooks() {
       const loaded = await getAllBooks();
       setBooks(loaded);
     }
     loadBooks();
   }, []);
   ```

4. **Enable real-time sync** (Supabase) or listeners (Firebase)

### Suggested Features to Add

- [ ] **Search and filter** books by title/author
- [ ] **Book API integration** (Google Books, Open Library)
- [ ] **Reading progress** tracking (page numbers, percentage)
- [ ] **Reading stats** (books per month, reading streak)
- [ ] **Collections/tags** (genres, favorites, series)
- [ ] **Import/export** data as JSON
- [ ] **Dark mode** toggle
- [ ] **Social features** (share reviews, recommendations)
- [ ] **Reading goals** (yearly challenge, monthly targets)
- [ ] **Barcode scanner** for adding books (mobile)

## 🛠️ Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  wood: {
    light: '#YOUR_COLOR',
    DEFAULT: '#YOUR_COLOR',
    dark: '#YOUR_COLOR',
  },
  // ...
}
```

### Change Fonts

1. Update Google Fonts link in `index.html`
2. Update `tailwind.config.js` fontFamily
3. Apply new classes in components

### Modify Shelf Behavior

Edit `src/components/Shelf.jsx`:
- Adjust grid columns: `md:grid-cols-4 lg:grid-cols-6`
- Change scroll amount: `const scrollAmount = 400;`
- Customize animations: modify CSS classes

## 🐛 Troubleshooting

### Books not persisting after refresh
- Check browser localStorage is enabled
- Open DevTools → Application → Local Storage
- Verify `bookshelf_books` key exists

### Modal not closing on backdrop click
- Ensure you're clicking the dark backdrop, not the modal content
- Check console for JavaScript errors

### Horizontal scroll not working on mobile
- Ensure you're swiping on the books area, not the shelf label
- Verify CSS class `overflow-x-auto` is applied

## 📄 License

This project is open source and available for personal or commercial use.

## 🤝 Contributing

Feel free to extend this project! Some ideas:

1. Fork the repository
2. Create a feature branch
3. Add your enhancements
4. Submit a pull request

## 💡 Tips for Extension

### Adding a New Reading Status

1. Update `src/models/Book.js`:
   ```javascript
   export const READING_STATUS = {
     // ... existing statuses
     ON_HOLD: 'on_hold',
   };
   ```

2. Component will automatically include it in dropdowns!

### Adding Book Cover Placeholders

Currently books without covers show gradient colors. To add custom cover generation:

1. Create a new component `src/components/GeneratedCover.jsx`
2. Use book title/author to generate unique patterns
3. Replace gradient in `BookCard.jsx` with your component

### Adding Social Features

1. Create a new service `src/services/social.js`
2. Add share buttons to `BookModal.jsx`
3. Implement Web Share API or custom sharing

---

**Built with ❤️ for book lovers everywhere**

Happy reading! 📖✨
