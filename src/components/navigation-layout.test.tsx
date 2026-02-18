import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NavigationLayout } from "./navigation-layout";

describe("NavigationLayout", () => {
    it("renders the title", () => {
        render(<NavigationLayout title="Test Title">Content</NavigationLayout>);
        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("renders the step indicator when both step and totalSteps are provided", () => {
        render(
            <NavigationLayout title="Step Test" step={1} totalSteps={2}>
                Content
            </NavigationLayout>,
        );
        expect(screen.getByText("Step 1 of 2")).toBeInTheDocument();
    });

    it("renders the back button when onBack is provided", () => {
        render(
            <NavigationLayout title="Back Test" onBack={() => { }} backLabel="Go Back">
                Content
            </NavigationLayout>,
        );
        expect(screen.getByRole("button", { name: /Go Back/i })).toBeInTheDocument();
    });
});
