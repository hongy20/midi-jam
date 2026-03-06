import { render, screen } from "@testing-library/react";
import { PageLayout } from "./page-layout";
import { describe, it, expect } from "vitest";

describe("PageLayout", () => {
  it("renders header, footer, and children in the correct slots", () => {
    render(
      <PageLayout
        header={<div data-testid="header">Header</div>}
        footer={<div data-testid="footer">Footer</div>}
      >
        <div data-testid="content">Content</div>
      </PageLayout>
    );
    expect(screen.getByTestId("header")).toBeDefined();
    expect(screen.getByTestId("footer")).toBeDefined();
    expect(screen.getByTestId("content")).toBeDefined();
  });
});
