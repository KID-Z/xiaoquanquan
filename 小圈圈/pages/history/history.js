const db = wx.cloud.database({ env: 'azhu-1gsymxqaea8c9cff' })
const app = getApp();
Page({
  totalQuanQuan: 0,
  nowPage: 0,
  /**
   * 页面的初始数据
   */
  data: {
    quanquan: [],
  },
  // 进入详情页
  detailsPage(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detailsPage/detailsPage?id=${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 得到圈圈总条数
    this.quanquanCount()

    // 得到发力历史圈圈数据
    this.getQuanQuanPublishHistoryData()
  },
  // 获取数据
  getQuanQuanPublishHistoryData(type) {
    let that = this;
    wx.showNavigationBarLoading()
    db.collection('publishQuanQuan').where({
      _openid: app.globalData._openid
    }).orderBy('time', 'desc').skip(this.nowPage * 8).limit(8).get().then(res => {
      res.data.map(item => {
        item.time = that.setDateFormat(item.time)
      })

      if (type === 'pullToRefresh') {
        if (res.data.length > 0) {
          that.setData({
            quanquan: that.data.quanquan.concat(res.data)
          })
          that.nowPage++
        }
      } else {
        that.setData({
          quanquan: res.data
        })
        // 下拉刷新收起
        wx.stopPullDownRefresh()
      }
      // 下拉刷新loading关闭
      wx.hideNavigationBarLoading()
    })
  },
  // 设置自定义时间格式
  setDateFormat(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${year}年${month}月${day}日 ${hours}时${minutes}分`
  },
  // 得到圈圈总条数
  quanquanCount() {
    let that = this;
    db.collection('publishQuanQuan').where({
      _openid: app.globalData._openid
    }).count().then(res => {
      that.totalQuanQuan = res.total
    })
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
    this.nowPage = 0;
    this.getQuanQuanPublishHistoryData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.quanquan.length < this.totalQuanQuan) {
      this.nowPage = this.nowPage + 1
      this.getQuanQuanPublishHistoryData('pullToRefresh')
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})