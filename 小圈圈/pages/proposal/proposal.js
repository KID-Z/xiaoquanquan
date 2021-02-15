const db = wx.cloud.database({ env: 'azhu-1gsymxqaea8c9cff' })

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 提交建议
  submitProposal(e) {
    let title = e.detail.value.title;
    let content = e.detail.value.content;
    if (title.trim() !== '' && content.trim() !== '') {
      db.collection('proposalQuanQuan').add({
        data: {
          title,
          content,
          date: new Date()
        },
        success(res) {
          // 提交成功 提示
          wx.showToast({
            title: '提交成功',
            duration: 1000
          })

          setTimeout(() => {
            // 提交成功 跳转到首页
            wx.switchTab({
              url: '/pages/home/home',
            })
          }, 1300)
        }
      })
    } else {
      wx.showToast({
        title: '标题或内容不能为空哦',
        icon: 'none'
      })
    }
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

  }
})