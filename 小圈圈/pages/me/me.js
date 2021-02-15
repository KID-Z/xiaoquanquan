// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 跳转到 提建议页面
  navToProposal() {
    wx.navigateTo({
      url: '/pages/proposal/proposal',
    })
  },
  // 跳转到发布历史页
  navToHistory() {
    wx.navigateTo({
      url: '/pages/history/history',
    })
  },
  // 跳转到收藏页
  navToCollect() {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '小圈圈社交圈',
      path: '/pages/home/home',
      imageUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=117025278,2486424640&fm=26&gp=0.jpg'
    }
  }
})