const db = wx.cloud.database({ env: 'azhu-1gsymxqaea8c9cff' })
Page({
  totalQuanQuan: 0,
  nowPage: 1,
  pageNum: 8,
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
  // 得到圈圈数据
  getQuanQuanData() {
    let that = this;
    db.collection('publishQuanQuan').orderBy('time', 'desc').limit(8).get().then(res => {
      res.data.map(item => {
        item.time = that.setDateFormat(item.time)
      })

      that.setData({
        quanquan: res.data
      })
      that.nowPage = 1;
      // 下拉刷新loading关闭
      wx.hideNavigationBarLoading()
      // 下拉刷新收起
      wx.stopPullDownRefresh()
    }, err => {
      // 下拉刷新loading关闭
      wx.hideNavigationBarLoading()
      // 下拉刷新收起
      wx.stopPullDownRefresh()
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
    db.collection('publishQuanQuan').count().then(res => {
      that.totalQuanQuan = res.total
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
    this.getQuanQuanData()
    this.quanquanCount()
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
    // 下拉刷新loading
    wx.showNavigationBarLoading()
    this.getQuanQuanData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (that.data.quanquan.length < that.totalQuanQuan) {
      wx.showNavigationBarLoading()
      // 获取数据
      db.collection('publishQuanQuan').orderBy('time', 'desc').skip(that.nowPage * that.pageNum).limit(that.pageNum).get().then(res => {
        res.data.map(item => {
          item.time = that.setDateFormat(item.time)
        })
        if (res.data.length > 0) {
          that.setData({
            quanquan: that.data.quanquan.concat(res.data)
          })
          that.nowPage++
          wx.hideNavigationBarLoading()
        }
      })

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
    return {
      title: '小圈圈社交圈',
      path: '/pages/home/home',
      imageUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=117025278,2486424640&fm=26&gp=0.jpg'
    }
  }
})