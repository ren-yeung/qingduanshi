// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, data } = event;
  
  switch (action) {
    case 'getUserInfo':
      return await getUserInfo(event, context);
    case 'updateUserInfo':
      return await updateUserInfo(event, context);
    case 'getFastingPlans':
      return await getFastingPlans(event, context);
    case 'saveFastingRecord':
      return await saveFastingRecord(event, context);
    default:
      return {
        success: false,
        message: '未知的操作',
      };
  }
};

// 获取用户信息
async function getUserInfo(event, context) {
  const wxContext = cloud.getWXContext();
  
  try {
    const db = cloud.database();
    const result = await db.collection('users').where({
      openid: wxContext.OPENID,
    }).get();
    
    if (result.data && result.data.length > 0) {
      return {
        success: true,
        data: result.data[0],
      };
    } else {
      return {
        success: true,
        data: null,
        message: '用户不存在',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: '获取用户信息失败',
      error: error.message,
    };
  }
}

// 更新用户信息
async function updateUserInfo(event, context) {
  const wxContext = cloud.getWXContext();
  const { userData } = event;
  
  try {
    const db = cloud.database();
    const result = await db.collection('users').where({
      openid: wxContext.OPENID,
    }).update({
      data: {
        ...userData,
        updateTime: db.serverDate(),
      },
    });
    
    return {
      success: true,
      message: '更新成功',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: '更新失败',
      error: error.message,
    };
  }
}

// 获取断食计划
async function getFastingPlans(event, context) {
  const { planType } = event;
  
  try {
    const db = cloud.database();
    let query = db.collection('fasting_plans');
    
    if (planType) {
      query = query.where({ type: planType });
    }
    
    const result = await query.orderBy('sort', 'asc').get();
    
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: '获取断食计划失败',
      error: error.message,
    };
  }
}

// 保存断食记录
async function saveFastingRecord(event, context) {
  const wxContext = cloud.getWXContext();
  const { record } = event;
  
  try {
    const db = cloud.database();
    const result = await db.collection('fasting_records').add({
      data: {
        openid: wxContext.OPENID,
        ...record,
        createTime: db.serverDate(),
      },
    });
    
    return {
      success: true,
      message: '记录保存成功',
      data: { _id: result._id },
    };
  } catch (error) {
    return {
      success: false,
      message: '保存失败',
      error: error.message,
    };
  }
}
