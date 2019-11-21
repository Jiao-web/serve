module.exports = [
  {
    app: {
      name: "小蜜蜂",
      description: "飞在花丛中，嗡嗡嗡，飞到西来飞到东"
    },
    user: {
      name: "Admin",
      avatar: "assets/tmp/img/avatar.jpg",
      email: "meme@qq.com"
    },
    menu: [
      {
        text: "主导航",
        group: true,
        hideInBreadcrumb: true,
        children: [
          {
            text: "智能分析",
            icon: "anticon-cloud",
            children: [
              {
                text: "概要",
                link: "/analysis/home",
              },{
                text: "伊莉",
                link: "/analysis/eyny",
              },{
                text: "天涯",
                link: "/analysis/tianya",
              }
            ]
          },
          {
            text: "角色设置",
            icon: "anticon-user",
            children: [
              {
                text: "角色",
                link: "/setting/role",
              },{
                text: "账号",
                link: "/setting/account",
              }
            ]
          },
          {
            text: "信息推送",
            icon: "anticon-message",
            children: [
              {
                text: "创建任务",
                link: "/push/create",
              },{
                text: "任务管理",
                link: "/push/manage",
              },{
                text: "推送日志",
                link: "/push/log",
              }
            ]
          }
        ]
      }
    ]
  },
  {
    app: {
      name: "小蜜蜂",
      description: "飞在花丛中，嗡嗡嗡，飞到西来飞到东"
    },
    user: {
      name: "Admin",
      avatar: "assets/tmp/img/avatar.jpg",
      email: "meme@qq.com"
    },
    menu: [
      {
        text: "主导航",
        group: true,
        hideInBreadcrumb: true,
        children: [
          {
            text: "智能分析",
            icon: "anticon-cloud",
            children: [
              {
                text: "概要",
                link: "/analysis/home",
              },{
                text: "伊莉",
                link: "/analysis/eyny",
              },{
                text: "天涯",
                link: "/analysis/tianya",
              }
            ]
          },
          {
            text: "角色设置",
            icon: "anticon-user",
            children: [
              {
                text: "角色",
                link: "/setting/role",
              },{
                text: "账号",
                link: "/setting/account",
              }
            ]
          },
          {
            text: "信息推送",
            icon: "anticon-message",
            children: [
              {
                text: "创建任务",
                link: "/push/create",
              },{
                text: "任务管理",
                link: "/push/manage",
              },{
                text: "推送日志",
                link: "/push/log",
              }
            ]
          }
        ]
      }
    ]
  }  
]