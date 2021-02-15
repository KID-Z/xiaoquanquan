// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({ env: 'azhu-1gsymxqaea8c9cff' })
// 云函数入口函数
exports.main = async (event, context) => {
  let likeIdArr = event.likeIdArr;
  let likeList = [];
  for (let i = 0; i < likeIdArr.length; i++) {
    const id = likeIdArr[i]._id;
    // 换取圈圈数据
    await db.collection('publishQuanQuan').doc(id).get().then(result => {
      result.data.time = setDateFormat(result.data.time)
      result.data.isTouchMove = false;
      likeList.push(result.data)
    })
  }
  return likeList
}

function setDateFormat(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${year}年${month}月${day}日 ${hours}时${minutes}分`
}
