import { type Locator, type Page } from "@playwright/test";
export class CafePage {
  readonly page: Page;
  readonly britishAirwaysLink: Locator;
  readonly productGrid: Locator;
  readonly defaultSorting: Locator;
  readonly newArrivalsSorting: Locator;
  readonly ascSorting: Locator;
  readonly descSorting: Locator;
  readonly firstProductPhoto: Locator;
  readonly cookiesSaved: Locator;

  constructor(page: Page) {
    this.page = page;
    this.britishAirwaysLink = page.getByRole("link", {
      name: "British Airways",
    });
    this.productGrid = page.locator(".product-items");
    this.defaultSorting = page.locator("span").filter({ hasText: "Default" });
    this.newArrivalsSorting = page
      .locator("li")
      .filter({ hasText: "New Arrivals" });
    this.ascSorting = page.locator("li").filter({ hasText: "Product A-Z" });
    this.descSorting = page.locator("li").filter({ hasText: "Product Z-A" });
    this.firstProductPhoto = page.locator(".product-item-photo").nth(0);
    this.cookiesSaved = page.getByText("You saved your cookie");
  }

  async goto() {
    await this.page.goto("https://highlifeshop.com/cafe");
  }

  async getProductIds(): Promise<string[]> {
    const productIds = await this.page.$$eval(
      "li.product-item",
      (els: Element[]) =>
        els.map((el) => el.getAttribute("data-product-id") ?? "")
    );
    return productIds;
  }

  async waitForProductIdsChange(initialProductIds: string[]) {
    await this.page.waitForFunction((initialProductIds) => {
      const currentProductIds = Array.from(
        document.querySelectorAll("li.product-item")
      ).map((el) => el.getAttribute("data-product-id"));
      return (
        JSON.stringify(currentProductIds) !== JSON.stringify(initialProductIds)
      );
    }, initialProductIds);
  }

  async firstProductNameInitial(): Promise<string | undefined> {
    await this.firstProductPhoto.waitFor();
    const firstProduct = await this.page.$(".product-item-photo");
    if (firstProduct) {
      const href = await firstProduct.getAttribute("href");
      if (href) {
        const cafeIndex = href.indexOf("cafe/");
        if (cafeIndex !== -1 && href.length > cafeIndex + 5) {
          return href[cafeIndex + 5];
        }
      }
    }
    return undefined;
  }
}
