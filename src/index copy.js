/*
 * @Author: your name
 * @Date: 2021-04-14 10:03:15
 * @LastEditTime: 2021-04-14 11:31:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /node_playwright/src/index.js
 */
/*
 * @Author: your name
 * @Date: 2021-04-14 10:03:15
 * @LastEditTime: 2021-04-14 11:17:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /node_playwright/src/index.js
 */
const { webkit,devices } = require('playwright');
const iPhone11 = devices['iPhone 11 Pro'];
// npx playwright codegen --target javascript -o 'temp.js' -b chromium https://m.weibo.cn/
(async () => {
    const browser = await webkit.launch();
    const context = await browser.newContext({
      ...iPhone11,
      // locale: 'en-US',
      geolocation: { longitude: 12.492507, latitude: 41.889938 },
      // permissions: ['geolocation']
    });
    const page = await context.newPage();
  
    const url = `https://m.weibo.cn/`
    // const url = `https://m.weibo.cn/search?containerid=231522type%3D1%26t%3D10%26q%3D%23%E5%BD%93%E4%BB%A3%E5%B9%B4%E8%BD%BB%E4%BA%BA%E7%9A%84%E6%97%A0%E8%81%8A%E5%91%A8%E6%9C%AB%23&extparam=%23%E5%BD%93%E4%BB%A3%E5%B9%B4%E8%BD%BB%E4%BA%BA%E7%9A%84%E6%97%A0%E8%81%8A%E5%91%A8%E6%9C%AB%23&luicode=10000011&lfid=102803`
    await page.goto(url);

    await Promise.all([
      page.click('text=榜单'),
      page.click('text=#日本副首相称喝处理核废水没事#')
    ]);

    // await page.$("div")
    // const content = await page.innerHTML('#app > ')
    const content = await page.$eval('#app')

    console.log(content);

    await page.screenshot({ path: `example-webkit.png` });
    // console.log(page);
    await browser.close();
})();
