// app.js
App({
  onLaunch() {
    console.log('HomeBox Local 启动');
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },

  globalData: {
    userInfo: null,
    version: '1.0.0'
  }
});
