# StartTohKr 🚀

**Tagline:** "Where Ideas Meet Opportunities."

StartTohKr is an AI-powered innovation ecosystem built for the **Smart India Hackathon (SIH)**. It serves as a unified bridge connecting **Startups, Government Departments, Investors, Mentors, Industry Partners, and Evaluators** to solve the complete innovation and startup procurement lifecycle.

## 🌟 The Vision

> **Idea → Showcase → Discovery → Connection → Collaboration → Funding/Pilot → Evaluation → Procurement → Scaling**

Instead of a traditional, clunky government tender portal, StartTohKr operates as a modern ecosystem combining the best elements of:
- **LinkedIn** (Professional Networking & Identity)
- **Product Hunt** (Innovation Discovery)
- **AngelList** (Investment Discovery)
- **GovTech** (Challenge & Procurement Management)

---

## 🏗️ Architecture & Tech Stack

StartTohKr is built on a modern, high-performance web architecture:

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui & Radix UI / Base UI
- **Icons & Animation:** Lucide React & Framer Motion
- **Database ORM:** Prisma (PostgreSQL ready)
- **Authentication:** NextAuth.js (Role-based access control)

---

## 🚀 Key Features

### 1. Unified Identity & Profiles
Multi-role onboarding system accommodating 7 distinct entity types. Features **Innovation Passports** to track verified credentials, completed pilots, and technical KPIs.

### 2. Government Challenge Marketplace
A centralized hub for government departments to post challenges. Startups can apply directly via the platform with AI-assisted proposal drafting. 

### 3. Innovation Feed & Social Networking
A dynamic timeline where startups post updates, request pilots, and share milestones. Investors and mentors can like, share, and save innovations.

### 4. Evaluator Console & Blind Mode
A specialized dashboard for technical evaluators to score proposals on Feasibility, Cost, and Innovation. Features a **Blind Mode** to remove systemic bias during the initial review phase.

### 5. Pilot Management Workspace
A collaborative Kanban-style board to track ongoing pilots. Monitors real-time KPIs (e.g., Uptime, Traffic Reduction) between government partners and startups.

### 6. StartTohKr AI Copilot
A globally available AI assistant that helps users discover relevant opportunities, draft complex proposals, and navigate the ecosystem effortlessly.

---

## 🛠️ Getting Started (Local Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/sourabh-sahu-08/StartTohKr.git
   cd StartTohKr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Rename `.env.example` to `.env` and configure your database URL. (The application includes a mock-fallback mode for UI development if a database is not connected).

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Repository Structure

- `/src/app` - Next.js App Router (Pages & API Routes)
- `/src/components/ui` - Reusable Shadcn UI components
- `/src/components` - Global application components (e.g., AI Copilot, Layouts)
- `/src/lib` - Utility functions and authentication configuration
- `/prisma` - Database schema and configuration

---

*Built with ❤️ for the Smart India Hackathon.*
