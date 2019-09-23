
const beginDay = new Date().getTime();

Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  

function genVisitData() {
  const visitData = [];
  const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
  for (let i = 0; i < fakeY.length; i += 1) {
    visitData.push({
      x: new Date(beginDay + 1000 * 60 * 60 * 24 * i).Format('YYYY-MM-DD'),
      y: fakeY[i],
    });
  }
  return visitData;
}

const statisticData = {
  push_cnt: {
    total: 100,
    success: 95,
    fail: 5,
    success_rate: 0.95,
  },
  crawl_cnt: {
    total: 8848,
    today_cnt: 1234,
  },
  push_node_cnt: {
    total: 8,
    active: 4,
    activate_rate: 0.5,
  },
  crawl_node_cnt: {
    total: 10,
    active: 7,
    activate_rate: 0.7,
  },
  detail: [
    {
      title: '采集统计',
      bar_title: '每日采集量',
      bar_data: [
        { x: '2019-08-20', y: 365 },
        { x: '2019-08-21', y: 125 },
        { x: '2019-08-22', y: 876 },
        { x: '2019-08-23', y: 352 },
        { x: '2019-08-24', y: 243 },
        { x: '2019-08-25', y: 198 },
        { x: '2019-08-26', y: 652 },
      ],
      rank_title: '单个节点采集信息量排名',
      rank_data: [
        { title: 'aaa', cnt: 987 },
        { title: 'bbb', cnt: 887 },
        { title: 'ccc', cnt: 787 },
        { title: 'ddd', cnt: 687 },
        { title: 'eee', cnt: 587 },
        { title: 'fff', cnt: 487 },
        { title: 'ggg', cnt: 387 },
      ],
    },
    {
      title: '采集统计',
      bar_title: '每日采集量',
      bar_data: [
        { x: '2019-08-20', y: 365 },
        { x: '2019-08-21', y: 125 },
        { x: '2019-08-22', y: 876 },
        { x: '2019-08-23', y: 352 },
        { x: '2019-08-24', y: 243 },
        { x: '2019-08-25', y: 198 },
        { x: '2019-08-26', y: 652 },
      ],
      rank_title: '单个节点采集信息量排名',
      rank_data: [
        { title: 'aaa', cnt: 987 },
        { title: 'bbb', cnt: 887 },
        { title: 'ccc', cnt: 787 },
        { title: 'ddd', cnt: 687 },
        { title: 'eee', cnt: 587 },
        { title: 'fff', cnt: 487 },
        { title: 'ggg', cnt: 387 },
      ],
    },
  ],
  visitData: genVisitData(),
};

class Statistic {
  static data(user_id, cb) {
    cb(null, statisticData);
  }
}

module.exports = Statistic;