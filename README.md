# LaunchPad - AI Career Operating System for Students

LaunchPad is an AI-powered career platform that helps students transform "I want a tech career" into a clear, personalized roadmap with step-by-step guidance, skill recommendations, and direct pathways to internships at top companies.

## Features

- **🗺️ AI Roadmap Builder** - Personalized, semester-by-semester career plans
- **💬 Career Copilot** - Interactive AI chatbot for career guidance
- **🎯 Smart Opportunity Matching** - Discover internships with transparent fit scores
- **🎤 Interview Studio** - Practice interviews with AI feedback
- **🏆 Portfolio Builder** - Shareable career profile showcasing your progress
- **📊 Analytics Dashboard** - Impact insights for institutional partners

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand with persist middleware
- **AI**: OpenAI GPT-4 (with demo mode fallback)
- **Storage**: LocalStorage (no backend required)
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Configuration

1. The app runs in **demo mode** by default (uses mock AI responses)
2. To enable full AI features:
   - Get an API key from [platform.openai.com](https://platform.openai.com)
   - Go to Settings in the app
   - Enter your API key (stored locally)
   - Toggle off demo mode

## Architecture

### Local-First Design

- All data stored in browser's localStorage
- No external database or backend required
- Complete privacy and data ownership
- Works offline after initial load

### Project Structure

```
src/
├── components/         # Reusable UI components
│   └── dashboard/     # Dashboard-specific components
├── data/              # Local JSON datasets
├── pages/             # Page components
├── services/          # AI service layer
├── store/             # Zustand state management
└── utils/             # Utility functions
```

## Key Features Detail

### AI Roadmap Builder

Generates a personalized career roadmap based on:
- Major and interests
- Current skills and experience level
- Timeline and constraints
- Target roles

### Career Copilot

Context-aware AI chatbot that:
- Answers career questions
- Explains role differences
- Suggests next steps
- Adjusts roadmaps dynamically

### Smart Matching

Calculates fit scores for opportunities based on:
- Role alignment (30 points)
- Required skills match (30 points)
- Preferred skills match (10 points)
- Experience level (15 points)
- Location preference (15 points)

### Interview Studio

- Generates role-specific interview questions
- Evaluates answers with scoring
- Provides detailed feedback
- Tracks improvement over time

## Sponsor Integration

The platform supports partnerships with companies:
- McDonald's
- PepsiCo
- American Airlines
- Fidelity Investments
- Toyota
- Verizon

Sponsor-aligned content is tagged but never forced, maintaining student trust.

## Data Privacy

- All data stored locally in browser
- No external servers or databases
- API calls made directly from browser
- Full user control and data export
- GDPR and privacy-first design

## Future Enhancements

- Hosted backend option for institutions
- Team collaboration features
- Advanced analytics and reporting
- Mobile app (React Native)
- Integration with job boards
- Verification and credentialing

## License

This project is built for educational purposes as part of a hackathon demonstration.

## Contact

For questions or feedback about LaunchPad, please reach out to the development team.

---

**Built with ❤️ for students pursuing meaningful tech careers**
