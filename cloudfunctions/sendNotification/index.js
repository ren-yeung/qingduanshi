// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 订阅消息模板ID（与 utils/fasting.js 保持一致）
const TEMPLATE_IDS = {
  SCHEDULE: 'sjW91ev2qCqzGHKxo0MFEe1RNarlwTLWJyZp7r4ZChU',
};

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { OPENID } = wxContext;
  
  const { 
    templateId, 
    title, 
    content, 
    endTime,
    page 
  } = event;
  
  // 使用配置的模板ID
  const finalTemplateId = templateId || TEMPLATE_IDS.SCHEDULE;
  
  try {
    // 发送订阅消息
    const result = await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      templateId: finalTemplateId,
      page: page || 'pages/overview/index',
      data: {
        date2: {
          value: formatTime(new Date(endTime || Date.now())),
        },
        thing3: {
          value: title || '轻断食提醒',
        },
        thing1: {
          value: content || '您的断食状态已更新',
        },
      },
    });
    
    return {
      success: true,
      message: '发送成功',
      data: result,
    };
  } catch (error) {
    console.error('发送订阅消息失败:', error);
    return {
      success: false,
      message: '发送失败',
      error: error.message,
    };
  }
};

// 格式化时间函数
function formatTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}
