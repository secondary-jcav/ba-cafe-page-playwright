import { type Locator, type Page } from "@playwright/test";
import urls from "../url/url";
export class CafePage {
  readonly page: Page;
  readonly britishAirwaysLink: Locator;
  readonly productGrid: Locator;
  readonly defaultSorting: Locator;
  readonly newArrivalsSorting: Locator;
  readonly ascSorting: Locator;
  readonly descSorting: Locator;
  readonly firstProductPhoto: Locator;

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
  }

  async goto() {
    await this.page.goto(urls.cafe);
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
