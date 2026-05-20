// 云函数入口文件 - 身体数据同步
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { action, openid, data } = event;

  // 如果没有传入 openid，从云函数上下文获取
  const userOpenid = openid || cloud.getWXContext().OPENID;

  if (!userOpenid) {
    return { success: false, message: '缺少用户身份' };
  }

  switch (action) {
    case 'save':
      return await saveBodyData(userOpenid, data);
    case 'get':
      return await getBodyData(userOpenid, event.date);
    case 'getList':
      return await getBodyDataList(userOpenid, event);
    default:
      return { success: false, message: '未知操作' };
  }
};

// 保存身体数据
async function saveBodyData(openid, bodyData) {
  try {
    const { date, height, weight, bodyFat, waist, hip, steps, mood, note, bmi } = bodyData;

    // 查询是否已有该日期的记录
    const exist = await db.collection('bodyData').where({
      openid,
      date
    }).get();

    if (exist.data && exist.data.length > 0) {
      // 更新已有记录
      await db.collection('bodyData').where({
        openid,
        date
      }).update({
        data: {
          height: height !== undefined ? height : null,
          weight: weight || null,
          bodyFat: bodyFat !== undefined ? bodyFat : null,
          waist: waist !== undefined ? waist : null,
          hip: hip !== undefined ? hip : null,
          steps: steps !== undefined ? steps : null,
          mood: mood !== undefined ? mood : 5,
          note: note || '',
          bmi: bmi || null,
          updateTime: new Date().toISOString(),
        }
      });
      return { success: true, message: '更新成功' };
    } else {
      // 新增记录
      await db.collection('bodyData').add({
        data: {
          openid,
          date,
          height: height !== undefined ? height : null,
          weight,
          bodyFat: bodyFat !== undefined ? bodyFat : null,
          waist: waist !== undefined ? waist : null,
          hip: hip !== undefined ? hip : null,
          steps: steps !== undefined ? steps : null,
          mood: mood !== undefined ? mood : 5,
          note: note || '',
          bmi: bmi || null,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
        }
      });
      return { success: true, message: '保存成功' };
    }
  } catch (error) {
    console.error('保存身体数据失败:', error);
    return { success: false, message: '服务器错误', error: error.message };
  }
}

// 获取指定日期的身体数据
async function getBodyData(openid, date) {
  try {
    const result = await db.collection('bodyData').where({
      openid,
      date
    }).get();

    return {
      success: true,
      data: result.data && result.data.length > 0 ? result.data[0] : null
    };
  } catch (error) {
    console.error('获取身体数据失败:', error);
    return { success: false, message: '服务器错误', error: error.message };
  }
}

// 获取身体数据列表（用于趋势图表）
async function getBodyDataList(openid, options = {}) {
  try {
    const { startDate, endDate, limit = 90 } = options;

    let query = { openid };

    if (startDate && endDate) {
      query.date = db.command.gte(startDate).and(db.command.lte(endDate));
    } else if (startDate) {
      query.date = db.command.gte(startDate);
    } else if (endDate) {
      query.date = db.command.lte(endDate);
    }

    const result = await db.collection('bodyData')
      .where(query)
      .orderBy('date', 'asc')
      .limit(limit)
      .get();

    return {
      success: true,
      data: result.data || []
    };
  } catch (error) {
    console.error('获取身体数据列表失败:', error);
    return { success: false, message: '服务器错误', error: error.message };
  }
}
