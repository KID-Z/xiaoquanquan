const db = wx.cloud.database({ env: 'azhu-1gsymxqaea8c9cff' })
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '',
    content: ''
  },
  // 回复内容
  commentContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 发布评论按钮
  publishComment() {
    console.log('1')
    if (this.data.content.trim() !== '') {
      this.publishCommentToDb();
    } else {
      wx.showToast({
        title: '内容不能为空哦',
        icon: 'none'
      })
    }
  },
  // 发布到云上
  publishCommentToDb() {
    let that = this
    db.collection('replyQuanQuan').add({
      data: {
        who_comment_id: that.data.id,
        who_openid: app.globalData._openid,
        who_name: that.data.name,
        comment_content: that.data.content,
        date: new Date(),
      },
      success(res) {
        wx.showToast({
          title: '发布成功',
          duration: 1000
        })

        setTimeout(() => {
          that.setData({
            content: ''
          })
          wx.navigateBack({
            delta: 1,
          })
        }, 1300)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      name: options.name
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