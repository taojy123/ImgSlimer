//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    size: 1,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    if (!this.data.download_url){
      wx.showToast({
        title: '填写目标再传图',
      })
      return
    }
    wx.showToast({
      title: '正在保存...',
      icon: 'loading',
      mask: true,
      duration: 5000
    })
    wx.downloadFile({
      url: this.data.download_url,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res){
            wx.hideToast()
            console.log('save success!')
            wx.showToast({
              title: '成功保存到相册',
            })
            console.log(res)
          },
          fail: function (res) {
            wx.hideToast()
            console.log('save fail!')
            wx.showModal({
              title: '保存图片失败',
              content: res.errMsg
            })
            console.log(res)
          }
        })
      }
    })
    
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function () {
    wx.getSetting({
      success: function(res) {
        console.log(res.authSetting['scope.writePhotosAlbum'])
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function() {
              console.log('授权成功')
            }
          })
        }
      }
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  sizeInput: function(e){
    this.setData({
      size: e.detail.value
    })
  },
  slim: function(){
    var self = this
    var size = parseFloat(this.data.size)
    if(!size){
      wx.showToast({
        title: '请正确填写目标',
      })
      return
    }
    console.log(size)
    wx.chooseImage({
      count: 1,
      success: function(res){
        var filePath = res.tempFilePaths[0]
        if(!filePath){
          return
        }
        console.log(filePath)
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 5000
        })
        wx.uploadFile({
          url: 'https://txu3.taojy123.cn/slim/',
          filePath: filePath,
          name: 'img',
          formData: {  
            size: size,
            kind: 'url'
          },
          header: {
            "Content-Type": "multipart/form-data"
          },  
          success: function (res) {  
            wx.hideToast()
            console.log(res)
            var url = res.data
            self.setData({
              userInfo: {
                avatarUrl: url,
                nickName: '点击图片保存'
              },
              download_url: url
            })
            console.log(self.data)
          },
          fail: function (res) {
            wx.hideToast()
            wx.showModal({
              title: '上传图片失败',
              content: res.errMsg,
              showCancel: false
            })
            console.log(res)
          }  
        })
      }
    })
  }
})
