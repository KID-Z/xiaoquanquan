const db = wx.cloud.database({ env: 'azhu-1gsymxqaea8c9cff' })
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    startX: '',
    startY: '',
    quanquan: [],
  },
  // 移除喜欢
  removeLike(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    db.collection('likeQuanQuan').where({
      _id: id,
      _openid: app.globalData._openid
    }).remove().then(res => {
      // 重新获取数据
      // that.data.quanquan = []
      that.getQuanQuanData('remove');
    })
  },
  /**
 * 手指触摸动作开始，记录起点X坐标
 */
  touchstart(e) {
    this.data.quanquan.forEach(function (v, i) {
      if (v.isTouchMove) {
        v.isTouchMove = false
      }
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      quanquan: this.data.quanquan
    })
  },

  /**
   * 滑动事件处理
   */
  touchmove(e) {
    let that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ x: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.quanquan.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右划
          v.isTouchMove = false
        else
          v.isTouchMove = true
      }
    })
    that.setData({
      quanquan: that.data.quanquan
    })
  },
  angle(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度  /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
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
    // 数据获取中 显示loading
    this.getQuanQuanData();
  },
  // 获取最新数据
  getQuanQuanData(type) {
    let that = this;
    if (type !== 'remove') {
      wx.showLoading({
        title: '获取数据中...',
        mask: true
      })
    }
    db.collection('likeQuanQuan').where({
      _openid: app.globalData._openid
    }).orderBy('date', 'desc').get().then(res => {
      if (res.data.length === 0) {
        that.setData({
          quanquan: []
        })
        wx.hideLoading()
      } else {
        that.data.quanquan = []
        // 云端获取数据
        wx.cloud.callFunction({
          name: 'getLikeList',
          data: {
            likeIdArr: res.data
          },
          complete(result) {
            that.setData({
              quanquan: result.result
            })
            // 数据获取完成 关闭loading
            wx.hideLoading()
          }
        })
      }
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

  }
})