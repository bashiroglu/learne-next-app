# Learne Next.js App - Marketing & Grammar Testing Platform

## Overview

This is a **public-facing Next.js application** that serves as:
1. **Marketing/Landing Page** - Promotes the Learne English learning platform
2. **Grammar Test Interface** - Interactive grammar testing with multiple question types
3. **IELTS Score Calculator** - Tool for calculating IELTS band scores

This app is separate from the main Vite application. It contains no authentication or database - it's a static/client-side only application that links to the main app (`app.learne.org`) for user registration and login.

## Tech Stack

### Framework
- **Next.js** 16.0.7 (App Router)
- **React** 19.2.0
- **TypeScript** 5

### Styling
- **Tailwind CSS** 4.0
- **next-themes** - Theme management (dark mode support)

### UI Components
- **Radix UI** - 15+ component libraries (accordion, dialog, tabs, dropdown, etc.)
- **shadcn/ui** - Pre-built component system
- **Lucide React** - Icon library
- **Recharts** - Charts and data visualization

### Forms & Utilities
- **React Hook Form** - Form state management
- **Sonner** - Toast notifications
- **clsx** + **tailwind-merge** - CSS class utilities

### No Backend
- No API routes
- No database connection
- No authentication
- All data is static (hardcoded in TypeScript files)

## Project Structure

```
nextjs-app/
├── src/
│   ├── app/                          # App Router pages
│   │   ├── layout.tsx               # Root layout with metadata
│   │   ├── page.tsx                 # Home/landing page
│   │   ├── globals.css              # Global styles
│   │   ├── grammar/
│   │   │   ├── page.tsx             # Grammar library (browse tests)
│   │   │   └── [topic-slug]/
│   │   │       └── [test-slug]/
│   │   │           └── page.tsx     # Individual test page
│   │   └── ielts-calculator/
│   │       └── page.tsx             # IELTS band score calculator
│   │
│   ├── components/
│   │   ├── ui/                      # 50+ shadcn/ui components
│   │   ├── Navbar.tsx               # Navigation
│   │   ├── QuestionRenderer.tsx     # Multi-type question component (700+ lines)
│   │   ├── ScoreDisplay.tsx         # Score visualization
│   │   ├── ScoreInput.tsx           # Score input with validation
│   │   ├── BandScoreInput.tsx       # Band score input
│   │   ├── ConversionTable.tsx      # IELTS conversion tables
│   │   ├── AssessmentCriteria.tsx   # IELTS criteria (900+ lines)
│   │   ├── SpeakingCalculator.tsx   # Speaking score calculator
│   │   └── WritingCalculator.tsx    # Writing score calculator
│   │
│   ├── frontend-data/               # Static data (no backend)
│   │   ├── grammar_topics.ts        # 6 grammar topics
│   │   ├── grammar_tests.ts         # 5 tests (A1-C1 levels)
│   │   └── grammar_questions.ts     # 100+ questions
│   │
│   ├── types/
│   │   └── index.ts                 # Question, Answer interfaces
│   │
│   ├── utils/
│   │   └── ieltsConversion.ts       # IELTS score conversion logic
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx           # Mobile responsive hook
│   │   └── use-toast.ts             # Toast notification hook
│   │
│   └── lib/
│       └── utils.ts                 # cn() utility function
│
├── public/                          # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── postcss.config.mjs
```

## Routes & Pages

### `/` - Landing Page
- Hero section with CTA buttons
- Feature cards (Practice Areas, Track Progress, Build Streaks)
- Links to `app.learne.org` for sign in/sign up

### `/grammar` - Grammar Library
- Browse all grammar tests
- Filter by CEFR level (A1, A2, B1, B2, C1, C2)
- Tests grouped by topic
- Card-based UI with level badges

### `/grammar/[topic-slug]/[test-slug]` - Grammar Test
- Interactive quiz interface
- Question navigation (prev/next)
- Question overview grid
- Real-time answer tracking
- Results page with:
  - Score percentage
  - Correct/incorrect answers
  - Explanations per question

### `/ielts-calculator` - IELTS Calculator
- Academic vs General Training toggle
- Listening/Reading raw score inputs (0-40)
- Writing/Speaking band score inputs (0-9)
- Overall band score calculation
- Score conversion tables
- Detailed assessment criteria

## Question Types

The `QuestionRenderer` component supports 8+ question types:

| Type | Description |
|------|-------------|
| `multiple-choice` | Single selection with radio buttons |
| `true-false` | Boolean question |
| `fill-in-blank` | Text input with multiple blanks |
| `multiple-select` | Multi-select with checkboxes |
| `short-answer` | Text input with word-level feedback |
| `long-answer` | Textarea for essays |
| `inline-conditional-choice` | Inline dropdowns with "/" separators |
| `drag-drop-sentence` | Drag and drop word ordering |

## Data Structures

### Grammar Topic
```typescript
interface GrammarTopic {
  idx: number;
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  created_at: string;
}
```

### Grammar Test
```typescript
interface GrammarTest {
  idx: number;
  id: string;
  title: string;
  description: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  topic: string;
  topic_id: string;
  duration: string | null;
  is_published: boolean;
  created_at: string;
}
```

### Grammar Question
```typescript
interface GrammarQuestion {
  idx: number;
  id: string;
  test_id: string;
  type: string;
  question_text: string;
  correct_answer: string;  // JSON string or plain string
  explanation: string;
  config: string;          // JSON with question-specific config
  question_order: number;
  created_at: string;
}
```

### Question/Answer (Runtime)
```typescript
interface Question {
  id: string;
  type: string;
  question: string;
  correctAnswer: string | string[];
  explanation?: string;
  options?: string[];
  segments?: Array<{
    type: "text" | "choice";
    content?: string;
    options?: string[];
    correct?: number;
  }>;
  words?: string[];
}

interface Answer {
  questionId: string;
  answer: string | string[];
}
```

## IELTS Scoring Logic

Located in `src/utils/ieltsConversion.ts`:

- **Listening**: 40 raw scores → band 0-9
- **Academic Reading**: 40 raw scores → band 0-9
- **General Training Reading**: 40 raw scores → band 0-9
- **Overall Calculation**: Average of 4 skills, rounded to nearest 0.5

```typescript
// Overall score calculation
const overall = Math.round(average * 2) / 2;
```

## Development

### Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Configuration Files
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind with custom HSL color variables
- `tsconfig.json` - Path aliases (`@/*` → `./src/*`)
- `postcss.config.mjs` - PostCSS configuration

## External Links

The app links to the main application for authentication:
- Sign In: `https://app.learne.org/login`
- Sign Up: `https://app.learne.org/signup`
- Get Started: `https://app.learne.org/signup`

## Relationship to Main App

| Aspect | This Next.js App | Main Vite App |
|--------|------------------|---------------|
| **Purpose** | Public marketing + free tools | Full learning platform |
| **Auth** | None (links to main app) | Supabase authentication |
| **Database** | None (static data) | Supabase PostgreSQL |
| **Routes** | 4 pages | 40+ pages |
| **Features** | Grammar tests, IELTS calc | Full learning modules |
| **Users** | Anonymous visitors | Authenticated users |
| **Deployment** | Static/SSG ready | Full-stack |

This app serves as the **public-facing entry point** and **free tool showcase** for visitors before they sign up for the main platform.

## Key Components

| Component | Purpose | Lines |
|-----------|---------|-------|
| `QuestionRenderer.tsx` | Renders all question types | 700+ |
| `AssessmentCriteria.tsx` | IELTS rubrics display | 900+ |
| `SpeakingCalculator.tsx` | Speaking sub-score calc | ~200 |
| `WritingCalculator.tsx` | Writing sub-score calc | ~200 |
| `ConversionTable.tsx` | Score conversion tables | ~150 |

## Available Grammar Content

### Topics
1. Present Simple
2. Present Perfect
3. Conditional Sentences
4. Passive Voice
5. Subjunctive Mood
6. (Additional topics)

### Tests by Level
- **A1**: Present Simple: To Be
- **A2**: Present Perfect
- **B1**: Conditional Sentences
- **B2**: Passive Voice
- **C1**: Subjunctive Mood

Total: 100+ questions across all tests
