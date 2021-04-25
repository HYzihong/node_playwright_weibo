const cheerio = require('cheerio');
const { chromium } = require('playwright');
const xlsx = require('node-xlsx');
const fs = require('fs');

// npx playwright codegen --target javascript -o 'temp.js' -b chromium https://m.weibo.cn/
const userList_07  = []
const userList_06  = []
const searchText = '冯绍峰赵丽颖离婚'
async function content(){
    const browser = await chromium.launch({headless:false,slowMo:1000});
    
    const page = await browser.newPage();
  
    const url = `https://m.weibo.cn/`
    await page.goto(url);

    await page.waitForTimeout(3000)


    page.click(`text=#${searchText}#`)

    // 等待三秒
    await page.waitForTimeout(3000)

    page.click('text=热门')
    await page.waitForTimeout(3000)


    // 把鼠标移到页面视图最下方
    for(let i =0,len = 10;i<=len;i++){
      await page.evaluate(()=> window.scrollTo(0,document.body.scrollHeight))
      await page.waitForTimeout(3000)
    }
    

    // await page.evaluate(()=> window.scrollTo(0,document.body.scrollHeight))
    // await page.waitForTimeout(3000)

    // await page.evaluate(()=> window.scrollTo(0,document.body.scrollHeight))
    // await page.waitForTimeout(3000)

    // await page.evaluate(()=> window.scrollTo(0,document.body.scrollHeight))

    // await page.waitForTimeout(3000)

    // 获取网页的HTML内容
    const content = await page.content()

    const $ = cheerio.load(content)
    // console.log(content);
    $('.m-text-cut').each(async(i,elem)=>{
      // console.log(i,$(elem).children().html())
      // const user  = $(elem).children().html()
      // if(user.indexOf('m-icon-vipl6')!==-1){
      //   console.log(user);
      // }
      // console.log(ele);
      const userBox = $(elem).html()
      if(userBox.indexOf('<i class="m-icon m-icon-vipl7"></i>')!==-1){
        const user = $(elem).text()
        console.log('vip 7',user);
        userList_07.push(user)
      }
      if(userBox.indexOf('<i class="m-icon m-icon-vipl6"></i>')!==-1){
        const user = $(elem).text()
        console.log('vip 6',user);
        userList_06.push(user)
      }
      
      /*
      <h3 class="m-text-cut">
          乡野东菊
      <i class="m-icon m-icon-vipl6"></i>
      </h3>
      */ 
      // console.log(i,user);
    })

    // await page.screenshot({ path: `screenshot.png` });
    // console.log(page);
    await browser.close();
}

async function write_xlsx(){
  //写入Excel数据
  //excel数据
  var excelData = [];
  {
  //表1
      //添加数据
      var addInfo = {};
      //名称
      addInfo.name = "VIP_06";
      //数据数组
      addInfo.data = [
          ["x", "用户昵称"],
      ];

      //添加数据
      for(let i =0,len=userList_06.length;len>i;i++){
        addInfo.data.push([i,userList_06[i]]);
      }
      addInfo.data.push(['总人数为:',userList_06.length]);

      //添加数据
      excelData.push(addInfo);
    }
    {
      //表2
          //添加数据
          var addInfo = {};
          //名称
          addInfo.name = "VIP_07";
          //数据数组
          addInfo.data = [
              ["x", "用户昵称"],
          ];
    
          //添加数据
          for(let i =0,len=userList_07.length;len>i;i++){
            addInfo.data.push([i,userList_07[i]]);
          }
          addInfo.data.push(['总人数为:',userList_07.length]);
    
          //添加数据
          excelData.push(addInfo);
        }
    // 写xlsx
    var buffer = xlsx.build(excelData);
    //写入数据
    const fileName =  `./${searchText}.xls`
    fs.writeFile(fileName, buffer, function (err) {
        if (err)
        {
            throw err;
        }
        //输出日志
        console.log('Write to xls has finished');
    })
}

async function main(){
  console.time('func');
  await content()
  await write_xlsx()
  console.timeEnd('func');
}
main()