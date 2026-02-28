# 🚗 Matchy: Smart Shuttle Sharing

Matchy is a premium shuttle-sharing application designed for travelers who want to save money, reduce their carbon footprint, and meet new people. Built for the **Hamburg Hackathon**, it leverages state-of-the-art AI to connect users traveling to similar destinations.

## 🌟 Key Features

### 🤖 AI-Powered Matching Engine (Gemini 1.5 Flash)
The core of Matchy is its intelligent matching system powered by **Google Gemini AI**. 

- **Sophisticated Logic**: Instead of simple keyword matching, the AI understands the nuances of travel requests.
- **Priority Ranking**: Matches are ranked based on flight numbers (highest priority), destination proximity, language preferences, and transport types.
- **Human-Readable Insights**: For every match found, the AI provides a "Compatibility Reason," explaining exactly why two travelers are a good fit (e.g., *"Matched based on your shared flight LH2024 and English preference"*).
- **Robust Fallback**: The backend is configured with multi-model resilience, ensuring high availability by automatically switching between Gemini Flash and Pro models.

### 🍃 Sustainable Travel
A built-in carbon impact calculator shows users exactly how much CO2 they've saved by sharing a ride, encouraging eco-friendly travel choices.

### 💎 Premium User Experience
- **Next.js & React**: Built on the latest Next.js 15 framework for lightning-fast performance and SEO optimization.
- **Fluid Animations**: Smooth page transitions and micro-interactions powered by `Framer Motion`.
- **Responsive Design**: A sleek, mobile-first design system tailored for travelers on the move.

## 🛠️ Tech Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide React
- **AI**: Google Generative AI SDK (Gemini 1.5 Flash & Pro)
- **Deployment**: Fully optimized for Vercel Serverless Functions

## 🚀 Getting Started

1. **Clone the repository**
2. **Setup environment variables**: Create a `.env.local` file with your `GEMINI_API_KEY`.
3. **Install dependencies**: 
   ```bash
   npm install
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open the App**: Navigate to [http://localhost:3000](http://localhost:3000)

---
*Created for the "Innovate the Skies and Beyond" Hackathon - Hamburg.*
