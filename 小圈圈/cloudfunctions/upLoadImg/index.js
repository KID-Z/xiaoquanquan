// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let fileNames = event.fileNames;
  let imgBase64s = event.imgBase64s;

  let images = [];

  for (let i = 0; i < fileNames.length; i++) {
    await cloud.uploadFile({
      cloudPath: newFileName(fileNames[i]),
      fileContent: new Buffer(imgBase64s[i], 'base64'),
    }).then(res => {
      images.push(res.fileID)
    })
  }
  return images;
}

function newFileName(fileName) {
  let postfix = '';
  let random = Math.floor(Math.random() * (9999 - 1000)) + 1000;

  if (/.jpeg$/g.test(fileName)) {
    postfix = 'jpeg'
  } else {
    postfix = fileName.substr(-3, 3);
  }
  return `${Date.now()}${random}.${postfix}`
}


