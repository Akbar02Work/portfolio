type LogoMarkProps = {
  isUnderscoreVisible: boolean;
};

/** Site logo with the blinking underscore (shared by the navbar and mobile menu). */
export const LogoMark = ({ isUnderscoreVisible }: LogoMarkProps) => (
  <span className="self-center font-mono font-bold tracking-wider whitespace-nowrap uppercase text-gray-900 dark:text-white text-lg">
    &lt;Aka
    <span style={{ opacity: isUnderscoreVisible ? 1 : 0 }}>_</span>
    /Portfolio/&gt;
  </span>
);
