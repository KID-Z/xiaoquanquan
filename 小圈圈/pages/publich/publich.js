const db = wx.cloud.database({ env: 'azhu-1gsymxqaea8c9cff' })
Page({
  /**
   * 页面的初始数据
   */
  data: {
    previewImage: [],
    content: '说点什么吧...',
    user: {},
    inp: false,
  },
  // 预览图片
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.previewImage[index],
      urls: this.data.previewImage,
    })
  },
  // 删除图片
  removeImg(e) {
    let index = e.currentTarget.dataset.index;

    this.data.previewImage.splice(index, 1)
    // 重新渲染
    this.setData({
      previewImage: this.data.previewImage
    })
  },
  //发布圈圈
  publishQuanQuan(e) {
    if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
      // 未授权 提示
      wx.showModal({
        title: '未授权',
        content: '请授权后再操作'
      })
      return;
    } else {
      //已授权
      this.data.user = e.detail.userInfo;

      if (this.data.previewImage.length > 0) {
        this.uploadDb(this);
      } else if (this.data.content.trim() !== '' && this.data.content.trim() !== '说点什么吧...') {
        this.uploadDb(this);
      } else {
        wx.showToast({
          title: '没有内容哦!',
          icon: 'none'
        })
      }
    }
  },
  // 上传到数据库
  uploadDb(that) {
    if (that.data.content === "说点什么吧...") {
      that.data.content = '';
    }
    db.collection('publishQuanQuan').add({
      data: {
        content: that.data.content,
        time: new Date(),
        images: that.data.previewImage,
        user: that.data.user,
      }
    }).then(res => {
      // 保存到发布历史
      that.historyPublish(that)
      // 数据清空
      that.setData({
        content: '说点什么吧...',
        inp: false,
        previewImage: []
      })

      // 跳转 用户提示
      that.navToHome();

    }, err => {
      console.log(err)
    })
  },
  // 保存到发布历史
  historyPublish(that) {
    db.collection('historyPublish').add({
      data: {
        content: that.data.content,
        time: new Date(),
        images: that.data.previewImage,
        user: that.data.user,
      }
    })
  },
  // 发布成功 跳转到广场页
  navToHome() {
    wx.showToast({
      title: '发布成功',
      icon: 'none',
      duration: 500
    })
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/home/home'
      })
    }, 500)
  },
  // 圈圈文字
  quanquanText(e) {
    this.setData({
      content: e.detail.value
    })
    if (this.data.content.trim() === '') {
      this.setData({
        content: '说点什么吧...',
        inp: false
      })
    }
  },
  //输入框聚焦
  inpFocus() {
    if (this.data.content.trim() === '说点什么吧...') {
      this.setData({
        content: '',
        inp: true,
      })
    }
  },
  // 选择图片 预览 上传云端
  chooseImg() {
    let that = this;
    wx.chooseImage({
      count: 6,
      success(res) {
        wx.showLoading({
          title: '预览加载中',
        })

        //清空预览图片路径
        that.data.previewImage = [];

        let fileNames = res.tempFilePaths;
        res.tempFilePaths = res.tempFilePaths.map((img) => {
          return img = wx.getFileSystemManager().readFileSync(img, 'base64');
        })

        wx.cloud.callFunction({
          name: 'upLoadImg',
          data: {
            fileNames: fileNames,
            imgBase64s: res.tempFilePaths,
          },
          complete(result) {
            that.setData({
              previewImage: result.result
            })
            wx.hideLoading()
          }
        })
      }
    })
  },
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