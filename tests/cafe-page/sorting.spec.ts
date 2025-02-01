import { test, expect } from "../../fixtures/cafe";

test.describe("Sorting Feature", () => {
  // This test verifies that the first product in the list after A-Z sorting starts with the letter "a"
  test("Ascending sorting by product name", async ({ cafePage, page }) => {
    // get products displayed now
    await cafePage.goto();
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
