import { test as setup } from "../../fixtures/cafe";
import path from "path";

const authFile = path.join(__dirname, "../../auth/auth.json");

setup("authenticate", async ({ page, cafePage, gdprMenu }) => {
  await cafePage.goto();
  await gdprMenu.acceptCookies();
  await cafePage.productGrid.waitFor();
  await cafePage.britishAirwaysLink.waitFor();
  await cafePage.cookiesSaved.waitFor();

  await page.context().storageState({ path: authFile });
});
