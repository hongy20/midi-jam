import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageLayout } from "./page-layout";

describe("PageLayout", () => {
  it("renders header, footer, and children in the correct slots", () => {
    render(
      <PageLayout
        header={<div data-testid="header">Header</div>}
        footer={<div data-testid="footer">Footer</div>}
      >
        <div data-testid="content">Content</div>
      </PageLayout>,
    );
    expect(screen.getByTestId("header")).toBeDefined();
    expect(screen.getByTestId("footer")).toBeDefined();
    expect(screen.getByTestId("content")).toBeDefined();
  });
});
