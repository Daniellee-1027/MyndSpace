# 📚 MyndSpace

**MyndSpace** is an immersive, virtual co-studying platform designed to boost focus and productivity. It combines ambient environments, social accountability, and AI-powered assistance into a single, sleek web application.

![MyndSpace Dashboard](https://images.unsplash.com/photo-1616400619175-5beda3a17896?auto=format&fit=crop&w=1200&q=80)
*(Replace this link with a real screenshot of your dashboard after deployment)*

## ✨ Features

MyndSpace is built to simulate the feeling of studying in a library, cafe, or study hall, directly from your browser.

### 🏠 Virtual Study Rooms
- **Subject-Based Matching**: Join rooms dedicated to specific topics like Computer Science, Mathematics, Literature, or General Focus.
- **Live Occupancy**: See who is studying in real-time.
- **Create Custom Rooms**: Host your own sessions with specific topics and capacity limits.

### 🎨 Immersive Environments
- **Dynamic Scenes**: Instantly switch your environment to match your mood.
  - 🌌 **Orbital View**: Deep focus in space.
  - 🌧️ **Rainy Cafe**: Cozy vibes for reading.
  - 🏖️ **Sunset Beach**: Relaxed study sessions.
  - 📚 **Modern Library**: Classic academic atmosphere.
- **Ambient Tools**: Integrated **Lofi Music Player** and customizable background settings.

### 🤖 AI Tutor Integration
- Powered by **Google Gemini 2.5 Flash**.
- A dedicated **AI Assistant** sits in every room to help answer questions, summarize concepts, or provide study tips without you needing to leave the tab.

### ⚡ Productivity & Social
- **Pomodoro Timer**: Built-in focus timer to manage study sprints.
- **Friend System**: See which friends are online, what they are studying, and join them instantly.
- **Leaderboards**: Monthly rankings to gamify your study duration.
- **Live Campus Spots**: View simulated crowd levels of physical study spots.

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
- **Icons**: FontAwesome

## 🚀 Getting Started

Follow these steps to run MyndSpace locally on your machine.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/myndspace.git
   cd myndspace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory to enable the AI features.
   ```bash
   API_KEY=your_google_gemini_api_key_here
   ```
   > You can get an API key from [Google AI Studio](https://aistudio.google.com/).

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to start studying!

## 📦 Deployment

This project is optimized for deployment on platforms like **Vercel** or **Netlify**.

1. Push your code to a GitHub repository.
2. Import the project into Vercel/Netlify.
3. Add your `API_KEY` in the deployment settings/environment variables.
4. Deploy!

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
