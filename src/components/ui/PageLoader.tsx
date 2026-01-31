import { Loader2 } from "lucide-react";

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
    <Loader2 className="w-8 h-8 animate-spin text-gray-900 dark:text-white" />
  </div>
);
