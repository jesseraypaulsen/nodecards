import {
  qs,
  render,
  div,
  setPosition,
  centerpoint,
} from "../src/views/dom-helpers";

describe("qs", () => {
  const headline = document.createElement("h1");
  headline.innerText = "Breaking News";
  headline.id = "headline";
  document.body.append(headline);

  it("should return an HTML element", () => {
    const selector = "#headline";
    const element = qs(selector);
    expect(element instanceof HTMLElement).toBe(true);
  });
});
