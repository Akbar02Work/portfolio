import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useTashkentClock() {
  const [text, setText] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Tashkent", hour: "2-digit", minute: "2-digit",
      second: "2-digit", hour12: false,
    });
    const formatTime = () => {
      const now = new Date();
      const time = formatter.format(now);
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
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setOn((value) => !value), ms);
    return () => window.clearInterval(id);
  }, [ms, reduced]);

  return reduced || on;
}
