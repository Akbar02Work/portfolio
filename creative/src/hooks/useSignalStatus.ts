import { useEffect, useState } from "react";

export function useTashkentClock() {
  const [text, setText] = useState("");

  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Tashkent",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setText(time);
    };

    formatTime();
    const id = window.setInterval(formatTime, 1000);
    return () => window.clearInterval(id);
  }, []);

  return text;
}

export function useBlink(ms = 530) {
  const [on, setOn] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => setOn((value) => !value), ms);
    return () => window.clearInterval(id);
  }, [ms]);

  return on;
}

