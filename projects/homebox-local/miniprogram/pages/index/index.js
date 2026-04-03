// pages/index/index.js
Page({
  onLoad() {
    // 跳转到首页
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/home/home'
      });
    }, 500);
  }
});
