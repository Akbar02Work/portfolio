import { cn } from "@/lib/utils";

type LogoMarkProps = {
  isUnderscoreVisible: boolean;
  size: "nav" | "menu";
};

/** Site logo with the blinking underscore (shared by the navbar and mobile menu). */
export const LogoMark = ({ isUnderscoreVisible, size }: LogoMarkProps) => (
  <span
    className={cn(
      "self-center font-mono font-bold tracking-wider whitespace-nowrap uppercase text-gray-900 dark:text-white",
      size === "nav" ? "text-lg" : "text-[clamp(1rem,2.5vh,1.5rem)]"
    )}
  >
    &lt;Aka
    <span style={{ opacity: isUnderscoreVisible ? 1 : 0 }}>_</span>
    /Portfolio/&gt;
  </span>
);
