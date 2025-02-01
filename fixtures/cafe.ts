import { GDPR } from "../pages/gdpr-cookies";
import { CafePage } from "../pages/cafe-page";
import { expect, test as base } from "@playwright/test";

type Testfixtures = {
  cafePage: CafePage;
  gdprMenu: GDPR;
};

export const test = base.extend<Testfixtures>({
  cafePage: async ({ page }, use) => {
    const cafePage = new CafePage(page);
    await use(cafePage);
  },
  gdprMenu: async ({ page }, use) => {
    const gdprMenu = new GDPR(page);
    await use(gdprMenu);
  },
});

export { expect };
