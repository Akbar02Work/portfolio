/**
 * TEMPORARY design preview (logo + font candidates). Enabled only with
 * `?design=1` (remembered in localStorage, `?design=0` turns it off), so normal
 * visitors never see it. Remove this folder once the choices are made.
 */
import { useSyncExternalStore } from "react";
import { storage } from "@/lib/storage";

export type LogoVariant = "tag" | "akbar";

export type DesignChoice = {
  logo: LogoVariant;
  sans: string;
  mono: string;
};

const KEY = "design-preview";
const ENABLED_KEY = "design-preview-enabled";

const readEnabled = (): boolean => {
  if (typeof window === "undefined") return false;
  const flag = new URLSearchParams(window.location.search).get("design");
  if (flag === "1") storage.setString(ENABLED_KEY, "1");
  if (flag === "0") storage.setString(ENABLED_KEY, "");
  return storage.getString(ENABLED_KEY) === "1";
};

export const designPreviewEnabled = readEnabled();

const DEFAULT_CHOICE: DesignChoice = { logo: "tag", sans: "inter", mono: "jetbrains" };

const readChoice = (): DesignChoice => {
  if (!designPreviewEnabled) return DEFAULT_CHOICE;
  try {
    return { ...DEFAULT_CHOICE, ...(JSON.parse(storage.getString(KEY, "{}")) as Partial<DesignChoice>) };
  } catch {
    return DEFAULT_CHOICE;
  }
};

let current = readChoice();
const listeners = new Set<() => void>();

export const setDesignChoice = (patch: Partial<DesignChoice>) => {
  current = { ...current, ...patch };
  storage.setString(KEY, JSON.stringify(current));
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useDesignChoice = () => useSyncExternalStore(subscribe, () => current, () => DEFAULT_CHOICE);
