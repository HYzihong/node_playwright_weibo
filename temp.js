const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();

  // Go to https://m.weibo.cn/
  await page.goto('https://m.weibo.cn/');

  // Click text=#赵丽颖冯绍峰离婚#
  await page.click('text=#赵丽颖冯绍峰离婚#');

  // Go to https://m.weibo.cn/search?containerid=231522type%3D1%26t%3D10%26q%3D%23%E8%B5%B5%E4%B8%BD%E9%A2%96%E5%86%AF%E7%BB%8D%E5%B3%B0%E7%A6%BB%E5%A9%9A%23&extparam=%23%E8%B5%B5%E4%B8%BD%E9%A2%96%E5%86%AF%E7%BB%8D%E5%B3%B0%E7%A6%BB%E5%A9%9A%23&luicode=10000011&lfid=102803
  await page.goto('https://m.weibo.cn/search?containerid=231522type%3D1%26t%3D10%26q%3D%23%E8%B5%B5%E4%B8%BD%E9%A2%96%E5%86%AF%E7%BB%8D%E5%B3%B0%E7%A6%BB%E5%A9%9A%23&extparam=%23%E8%B5%B5%E4%B8%BD%E9%A2%96%E5%86%AF%E7%BB%8D%E5%B3%B0%E7%A6%BB%E5%A9%9A%23&luicode=10000011&lfid=102803');

  // Click text=热门
  await page.click('text=热门');

  // Close page
  await page.close();

  // ---------------------
  await context.close();
  await browser.close();
})();