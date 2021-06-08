const cheerio = require('cheerio');
const { chromium } = require('playwright');
const xlsx = require('node-xlsx');
const fs = require('fs');
const readline = require('readline');//命令行输入
const inquirer = require("inquirer");// 命令行select
const rl = readline.createInterface({// 命令行输入 config
  input: process.stdin,
  output: process.stdout
});
const pageLimit =  {
      type: "list",
      message: "请选择抓取的页数：",
      name: "page",
      choices: [
        {
          name: "10页",
          value: 10,
        },
        {
          name:  "20页",
          value: 20,
        },
        {
          name: "50页",
          value: 50,
        },
        {
          name:  "100页",
          value: 100,
        },
      ],
}



// npx playwright codegen --target javascript -o 'temp.js' -b chromium https://m.weibo.cn/
// const userList_07  = []
// const userList_06  = []
const userList_bluev = []// 蓝V
const userList_goldv_static  = []// 金V
const userList_yellowv  = []// 黄V
// const userArr = ['蓝V','金V','黄V']
// const searchText = '小龙虾一斤降价十几元'
/**
 * @description: playwright and cheerio
 * @param {string} url 话题所在地址
 * @param {number} pagination 统计页数
 * @return {arr} userList
 */
async function content(url,pagination){
    const browser = await chromium.launch({slowMo:1000});
    
    const page = await browser.newPage();
  
    // const url = `https://m.weibo.cn/search?containerid=100103type%3D1%26t%3D10%26q%3D%23%E4%B8%8A%E7%99%BE%E5%90%8D%E5%85%B1%E5%92%8C%E5%85%9A%E4%BA%BA%E8%A6%81%E6%B1%82%E8%AF%A5%E5%85%9A%E4%B8%8E%E7%89%B9%E6%9C%97%E6%99%AE%E5%86%B3%E8%A3%82%23&isnewpage=1&extparam=seat%3D1%26source%3Dranklist%26filter_type%3Drealtimehot%26pos%3D0%26pre_seqid%3D1940032114%26dgr%3D0%26c_type%3D30%26mi_cid%3D100103%26flag%3D1%26cate%3D0%26display_time%3D1620994529&luicode=10000011&lfid=231583`
    await page.goto(url);

    // await page.waitForTimeout(3000)

    // page.click(`text=#${searchText}#`)

    // 等待三秒
    await page.waitForTimeout(3000)

    // page.click('text=热门')
    // await page.waitForTimeout(3000)


    // 把鼠标移到页面视图最下方
    for(let i =0,len = pagination;i<=len;i++){
      await page.evaluate(()=> window.scrollTo(0,document.body.scrollHeight))
      await page.waitForTimeout(2000)
    }

    // 获取网页的HTML内容
    const content = await page.content()
    // console.log(content);

    const $ = cheerio.load(content)
    $('.m-avatar-box').each(async(i,elem)=>{
      const userBox = $(elem).html()
      // console.log(userBox);
      // if(userBox.indexOf('<i class="m-icon m-icon-vipl7"></i>')!==-1){
      //   const user = $(elem).text()
      //   console.log('vip 7 ===> ',user);
      //   userList_07.push(user)
      // }
      // if(userBox.indexOf('<i class="m-icon m-icon-vipl6"></i>')!==-1){
      //   const user = $(elem).text()
      //   console.log('vip 6 ===> ',user);
      //   userList_06.push(user)
      // }
      // 蓝V
      if(userBox.indexOf('<i class="m-icon m-icon-bluev"></i>')!==-1){
        const user = await setUser($(elem).text()) 
        // console.log('vip bluev ===> ',user);
        userList_bluev.push(user)
      }
      // 金V
      if(userBox.indexOf('<i class="m-icon m-icon-goldv-static"></i>')!==-1){
        const user = await setUser($(elem).text()) 
        // console.log('vip goldv-static ===> ',user);
        userList_goldv_static.push(user)
      }
      // 黄V
      if(userBox.indexOf('<i class="m-icon m-icon-yellowv"></i>')!==-1){
        const user = await setUser($(elem).text()) 
        // console.log('vip goldv-static ===> ',user);
        userList_yellowv.push(user)
      }
      
    })

    await browser.close();
}

async function setUser(user){
  return await {user:user.split('          ')[1],desc:user}
}


function unique(arr){            
  for(var i=0; i<arr.length; i++){
      for(var j=i+1; j<arr.length; j++){
          if(arr[i].user==arr[j].user){ 
              arr.splice(j,1);
              j--;
          }
      }
  }
return [...arr];
}

// 初始化xlsx数据
async function init_xlsx_data() {
  const userList =  [
    {name:'bluev',title:'蓝V',arr:unique(userList_bluev)},
    {name:'goldv_static',title:'金V',arr:unique(userList_goldv_static)},
    {name:'yellowv',title:'黄V',arr:unique(userList_yellowv)},
  ]
  // console.log(userList);
  let excelData = []
  for(let i = 0,len=userList.length;i<len;i++){
    const temp = userList[i]
    // console.log(temp);
    let addInfo = {};
    addInfo.name = temp.title
    addInfo.data = [
      [temp.title, "用户昵称",'备注'],
    ]
    for(let y = 0,len=temp.arr.length;y<len;y++){
      // console.log([y,temp.arr[y]]);
      addInfo.data.push([y,temp.arr[y].user,temp.arr[y].desc]);
      // console.log(111,addInfo);
    }
    addInfo.data.push(['总计：',`${temp.arr.length}个`,''])
    excelData.push(addInfo);
  }
  // console.log(111,excelData);
  await write_xlsx(excelData)
}

async function write_xlsx(excelData){
    // 写xlsx
    var buffer = xlsx.build(excelData);
    //写入数据
    const fileName =  `./话题统计.xls`
    fs.writeFile(fileName, buffer, function (err) {
        if (err)
        {
            throw err;
        }
        //输出日志
        console.log(`话题已搞定`);
    })
}

async function xlsx_main(url,pagination){
  // const url = `https://m.weibo.cn/search?containerid=100103type%3D1%26t%3D10%26q%3D%23%E4%B8%8A%E7%99%BE%E5%90%8D%E5%85%B1%E5%92%8C%E5%85%9A%E4%BA%BA%E8%A6%81%E6%B1%82%E8%AF%A5%E5%85%9A%E4%B8%8E%E7%89%B9%E6%9C%97%E6%99%AE%E5%86%B3%E8%A3%82%23&isnewpage=1&extparam=seat%3D1%26source%3Dranklist%26filter_type%3Drealtimehot%26pos%3D0%26pre_seqid%3D1940032114%26dgr%3D0%26c_type%3D30%26mi_cid%3D100103%26flag%3D1%26cate%3D0%26display_time%3D1620994529&luicode=10000011&lfid=231583`
  // const pagination = 10
  // console.log('xlsx_main',url,pagination);
  console.time('func');
  await content(url,pagination)
  await init_xlsx_data()
  console.timeEnd('func');
}



async function main(){
  let page ;
  let url ;
  rl.question('请输入微博话题网址：', (wb_url) => {
    url=wb_url;
    // console.log('wb_url',url);
    rl.close();
    inquirer.prompt(pageLimit).then((option) => {
      // console.log(option);
      page = option.page
      xlsx_main(url,page)
    });
  });
}

main()
