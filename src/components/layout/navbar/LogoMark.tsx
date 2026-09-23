import { cn } from "@/lib/utils";
import { useDesignChoice } from "@/dev/designPreviewStore";

type LogoMarkProps = {
  isUnderscoreVisible: boolean;
  size: "nav" | "menu";
};

/** Site logo. The `akbar_` variant is only reachable via the temporary design preview. */
export const LogoMark = ({ isUnderscoreVisible, size }: LogoMarkProps) => {
  const { logo } = useDesignChoice();

  if (logo === "akbar") {
    return (
      <span
        className={cn(
          "self-center font-mono font-bold tracking-tight whitespace-nowrap text-gray-900 dark:text-white",
          size === "nav" ? "text-xl" : "text-[clamp(1.125rem,2.8vh,1.625rem)]"
        )}
      >
        akbar
        <span className="text-volt-ink dark:text-volt" style={{ opacity: isUnderscoreVisible ? 1 : 0 }}>
          _
        </span>
      </span>
    );
  }

  return (
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
};
