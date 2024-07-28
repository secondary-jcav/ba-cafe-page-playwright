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

  // This test verifies that the first product in the list after A-Z sorting starts with the letter "a"
  test("Ascending sorting by product name", async ({ page }) => {
    // get products displayed now
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

  // This test verifies that the page can handle an error 500 from the backend.
  // Since the current implementation does not handle it, test fails.
  // This can be caught at the integration level
  test("Page recovers after 500 error in sorting", async ({ page }) => {
    // get products displayed now
    const initialProductIds = await cafePage.getProductIds();

    await page.route(
      new RegExp(
        "https://highlifeshop\\.com/cafe\\?product_list_order=product_asc.*"
      ),
      (route) => {
        route.fulfill({
          status: 500,
          body: "Internal Server Error",
        });
      }
    );

    // open sorting menu
    await cafePage.defaultSorting.click();

    await cafePage.ascSorting.click();

    await cafePage.waitForProductIdsChange(initialProductIds);
    // Check that the products are still visible
    await cafePage.productGrid.waitFor();
  });
});
