import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("smoke", () => {
  it("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
