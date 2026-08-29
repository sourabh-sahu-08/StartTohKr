import { PostType, SignalType, InnovationStage } from '@prisma/client';

export const MOCK_USERS = [
  { id: "usr-1", name: "EcoTech Innovations", role: "STARTUP" as const, image: "" },
  { id: "usr-2", name: "Ministry of Jal Shakti", role: "GOVERNMENT" as const, image: "" },
  { id: "usr-3", name: "Global Climate Fund", role: "INVESTOR" as const, image: "" },
  { id: "usr-4", name: "AgriVision AI", role: "STARTUP" as const, image: "" },
  { id: "usr-5", name: "CleanRoute Systems", role: "STARTUP" as const, image: "" },
];

export const MOCK_INNOVATIONS = [
  {
    id: "inv-1",
    startupId: "usr-1",
    startup: MOCK_USERS[0],
    title: "AquaSense AI",
    tagline: "Detecting underground water leaks before millions of liters are wasted.",
    problem: "40% of urban water supply is lost due to undetected underground leaks, costing municipalities billions and wasting critical resources.",
    solution: "We deploy acoustic and pressure sensors across the pipe network, analyzed by an AI model that predicts leaks weeks before pipe bursts occur.",
    impact: "Currently saving 2.4 million liters monthly in our initial deployment, with potential to scale to 50 million liters across a Tier 1 city.",
    category: "WaterTech",
    technologies: ["AI", "IoT", "Edge Computing"],
    stage: "PILOT" as InnovationStage,
    momentumScore: 84.5,
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "inv-2",
    startupId: "usr-4",
    startup: MOCK_USERS[3],
    title: "AgriVision",
    tagline: "Computer vision for early crop disease detection.",
    problem: "Farmers lose up to 30% of crop yield due to diseases that are detected too late.",
    solution: "A mobile-first computer vision model that analyzes leaf patterns to detect diseases 14 days earlier than visual symptoms.",
    impact: "Increased yield by 15% for 200 pilot farmers.",
    category: "AgriTech",
    technologies: ["Computer Vision", "Mobile", "Machine Learning"],
    stage: "MVP" as InnovationStage,
    momentumScore: 62.0,
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "inv-3",
    startupId: "usr-5",
    startup: MOCK_USERS[4],
    title: "CleanRoute",
    tagline: "AI-powered waste collection optimization.",
    problem: "Waste collection trucks drive fixed routes, wasting fuel and time on empty bins.",
    solution: "IoT bin sensors combined with a dynamic routing algorithm to only collect full bins.",
    impact: "Reduces fuel consumption by 32% and emissions by 28%.",
    category: "Smart Cities",
    technologies: ["Routing AI", "IoT"],
    stage: "PROTOTYPE" as InnovationStage,
    momentumScore: 45.0,
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }
];

export const MOCK_POSTS = [
  {
    id: "post-1",
    authorId: "usr-1",
    author: MOCK_USERS[0],
    innovationId: "inv-1",
    innovation: MOCK_INNOVATIONS[0],
    type: "IMPACT_REPORT" as PostType,
    content: {
      metricName: "Water Saved",
      previousValue: "0 Liters",
      currentValue: "2.4M Liters",
      description: "Our pilot with the municipal corporation has officially crossed the 2 million liter mark! Our sensors successfully detected 14 micro-leaks this month alone."
    },
    mediaUrls: [],
    signals: [
      { id: "sig-1", userId: "usr-2", type: "HIGH_IMPACT" as SignalType },
      { id: "sig-2", userId: "usr-3", type: "PROMISING" as SignalType },
    ],
    comments: [
      { id: "com-1", userId: "usr-2", user: MOCK_USERS[1], category: "INSIGHT", content: "This aligns perfectly with our Jal Jeevan Mission objectives." }
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "post-2",
    authorId: "usr-4",
    author: MOCK_USERS[3],
    innovationId: "inv-2",
    innovation: MOCK_INNOVATIONS[1],
    type: "COLLABORATION_CALL" as PostType,
    content: {
      helpNeeded: "Looking for agricultural research partners",
      expertise: "Plant Pathology",
      duration: "6 months",
      description: "We are expanding our model to detect rare fungal infections in wheat. Looking to collaborate with agricultural universities for dataset annotation."
    },
    mediaUrls: [],
    signals: [
      { id: "sig-3", userId: "usr-3", type: "WATCHING" as SignalType },
    ],
    comments: [],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "post-3",
    authorId: "usr-5",
    author: MOCK_USERS[4],
    innovationId: "inv-3",
    innovation: MOCK_INNOVATIONS[2],
    type: "INNOVATION_DROP" as PostType,
    content: {
      description: "Excited to unveil CleanRoute! We've finally assembled our first batch of IoT sensors and they are ready for field testing."
    },
    mediaUrls: [],
    signals: [
      { id: "sig-4", userId: "usr-1", type: "INNOVATIVE" as SignalType },
    ],
    comments: [],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }
];
