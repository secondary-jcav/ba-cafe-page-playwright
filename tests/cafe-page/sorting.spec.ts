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
    const initialProductIds = await page.$$eval("li.product-item", (els) =>
      els.map((el) => el.getAttribute("data-product-id"))
    );

    console.log(initialProductIds);

    await cafePage.defaultSorting.click();
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

    await page.waitForFunction((initialProductIds) => {
      const currentProductIds = Array.from(
        document.querySelectorAll("li.product-item")
      ).map((el) => el.getAttribute("data-product-id"));
      return (
        JSON.stringify(currentProductIds) !== JSON.stringify(initialProductIds)
      );
    }, initialProductIds);
    //"https://highlifeshop.com/cafe/tom-kerridge-ham-hock-and-smoked-cheddar-sandwich"

    const newProductIds = await page.$$eval("li.product-item", (els) =>
      els.map((el) => el.getAttribute("data-product-id"))
    );

    console.log(newProductIds);

    const firstProductInitial = await cafePage.firstProductNameInitial();
    console.log(firstProductInitial);
    expect(firstProductInitial).toBe("a");
  });
});
