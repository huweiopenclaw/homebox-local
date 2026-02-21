export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/box/list/index',
    'pages/box/detail/index',
    'pages/box/add/index',
    'pages/search/index',
    'pages/chat/index',
    'pages/settings/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#4F46E5',
    navigationBarTitleText: 'HomeBox',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#6B7280',
    selectedColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/box/list/index',
        text: '箱子',
        iconPath: 'assets/icons/box.png',
        selectedIconPath: 'assets/icons/box-active.png'
      },
      {
        pagePath: 'pages/search/index',
        text: '搜索',
        iconPath: 'assets/icons/search.png',
        selectedIconPath: 'assets/icons/search-active.png'
      },
      {
        pagePath: 'pages/settings/index',
        text: '设置',
        iconPath: 'assets/icons/settings.png',
        selectedIconPath: 'assets/icons/settings-active.png'
      }
    ]
  }
})

declare const defineAppConfig: <T>(config: T) => T
