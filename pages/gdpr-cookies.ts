import { type Locator, type Page } from "@playwright/test";

export class GDPR {
  readonly page: Page;
  readonly britishAirwaysLink: Locator;

  constructor(page: Page) {
    this.page = page;
  }

  async acceptCookies() {
    await this.page.getByRole("button", { name: "ACCEPT COOKIES" }).click();
  }
}
