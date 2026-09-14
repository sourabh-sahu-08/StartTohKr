import { DiscoveryMode, useFeedStore } from "@/store/feedStore";
import { Flame, Lightbulb, Zap, Rocket, TrendingUp, Target } from "lucide-react";

export function DiscoveryModeSwitcher() {
  const { discoveryMode, setDiscoveryMode } = useFeedStore();

  const MODES: { value: DiscoveryMode; label: string; icon: React.ReactNode }[] = [
    { value: 'MOMENTUM', label: 'Momentum', icon: <Flame className="w-4 h-4 mr-1.5" /> },
    { value: 'EARLY_IDEAS', label: 'Early Ideas', icon: <Lightbulb className="w-4 h-4 mr-1.5" /> },
    { value: 'BUILDING', label: 'Building', icon: <Zap className="w-4 h-4 mr-1.5" /> },
    { value: 'READY_TO_PILOT', label: 'Ready to Pilot', icon: <Rocket className="w-4 h-4 mr-1.5" /> },
    { value: 'SCALING', label: 'Scaling', icon: <TrendingUp className="w-4 h-4 mr-1.5" /> },
    { value: 'MATCHED', label: 'Matched For You', icon: <Target className="w-4 h-4 mr-1.5" /> },
    { value: 'FRESH', label: 'Fresh Drops', icon: <Zap className="w-4 h-4 mr-1.5" /> },
  ];

  return (
    <div className="flex overflow-x-auto pb-4 mb-2 gap-2 scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
      {MODES.map(mode => (
        <button
          key={mode.value}
          onClick={() => setDiscoveryMode(mode.value)}
          className={`flex items-center px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
            discoveryMode === mode.value 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-background' 
              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          {mode.icon}
          {mode.label}
        </button>
      ))}
    </div>
  );
}
