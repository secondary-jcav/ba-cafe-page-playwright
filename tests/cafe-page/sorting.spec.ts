import { expect, test } from "@playwright/test";
import { GDPR } from "../../pages/gdpr-cookies";
import { CafePage } from "../../pages/cafe-page";

test.describe("Sorting Feature", () => {
  let cafePage, gdprMenu;

  test.beforeEach(async ({ page }) => {
    cafePage = new CafePage(page);
    gdprMenu = new GDPR(page);
    await cafePage.goto();
    await gdprMenu.acceptCookies();
    await cafePage.productGrid.waitFor();
    await cafePage.britishAirwaysLink.waitFor();
  });

  test("Ascending sorting by product name", async ({ page }) => {
    const initialProductIds = await cafePage.getProductIds();

    // open sorting menu
    await cafePage.defaultSorting.click();

    // click on A-Z sorting
    const sortingPromise = page.waitForRequest(
      (request) =>
        request
          .url()
          .startsWith(
            "https://highlifeshop.com/cafe?product_list_order=product_asc"
          ) && request.method() === "GET"
    );
    await cafePage.ascSorting.click();
    await sortingPromise;

    // page takes some time to render changes
    await cafePage.waitForProductIdsChange(initialProductIds);

    // assert sorting is done correctly
    const firstProductInitial = await cafePage.firstProductNameInitial();
    expect(firstProductInitial).toBe("a");
  });
});
