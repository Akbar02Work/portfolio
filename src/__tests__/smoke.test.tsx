import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";

describe("smoke", () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState({}, "", "/");
  });

  it("renders the current home sections and editorial project links", () => {
    window.history.replaceState({}, "", "/");
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: /android developer/i })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: /about me/i })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Selected Works" })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: "Open case study" }).length).toBeGreaterThan(0);
  });

  it("renders the project detail flow", async () => {
    window.history.replaceState({}, "", "/projects/voicenotes");
    render(<App />);

    expect(await screen.findByRole("heading", { level: 1, name: "VoiceNotes" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Screens" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Engineering note" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Overview" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Key Features" })).toBeTruthy();
  });
});
