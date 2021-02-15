const db = wx.cloud.database({ env: 'azhu-1gsymxqaea8c9cff' })
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    quanquan: [],
    isLike: false,
    replyList: [],
  },
  // 获取回复列表
  getReplyList() {
    let that = this
    db.collection('replyQuanQuan').where({
      who_comment_id: that.data.id
    }).orderBy('date', 'desc').get().then(res => {
      that.setData({
        replyList: res.data
      })
    })
  },
  // 跳转到回复页面
  navToReplyPage(e) {
    if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
      // 未授权 提示
      wx.showModal({
        title: '未授权',
        content: '请授权后再操作'
      })
      return;
    } else {
      let nickName = e.detail.userInfo.nickName;
      wx.navigateTo({
        url: `/pages/reply/reply?id=${this.data.id}&name=${nickName}`,
      })
    }
  },
  // 预览图片
  preview(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.quanquan[0].images[index],
      urls: this.data.quanquan[0].images,
    })
  },
  // 喜欢 或 不喜欢圈圈 likeQuanQuan
  likeQuanQuan() {
    if (this.data.isLike) {
      // 已喜欢圈圈 点击取消喜欢
      this.removeLike(this)
    } else {
      // 未喜欢圈圈 点击添加喜欢
      this.addLike(this)
    }

  },
  // 已喜欢圈圈 点击取消喜欢
  removeLike(that) {
    db.collection('likeQuanQuan').where({
      _id: that.data.id,
      _openid: app.globalData._openid
    }).remove().then(res => {
      that.refreshLikeIcon(false)
    })
  },
  // 未喜欢圈圈 点击添加喜欢
  addLike(that) {
    db.collection('likeQuanQuan').add({
      data: {
        _id: that.data.id,
        date: new Date()
      },
      success(res) {
        if (res._id) {
          that.refreshLikeIcon(true)
        }
      }
    })
  },
  // 更新喜欢的图标
  refreshLikeIcon(isLike) {
    this.setData({
      isLike: isLike
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      id: options.id
    })
    db.collection('publishQuanQuan').where({
      _id: that.data.id,
    }).get().then(res => {
      res.data.map(item => {
        item.time = that.setDateFormat(item.time)
      })
      that.setData({
        quanquan: res.data
      })
    })
    // 看看是否已经喜欢
    db.collection('likeQuanQuan').where({
      _id: that.data.id
    }).get().then(res => {
      // 如果已经喜欢显示 喜欢图标和文字
      if (res.data.length > 0) {
        that.refreshLikeIcon(true)
      }
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
    // 获取回复列表
    this.getReplyList()
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