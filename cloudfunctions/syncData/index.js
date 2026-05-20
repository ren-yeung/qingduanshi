const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { action } = event;

  switch (action) {
    case 'upload':
      return await handleUpload(event, context);
    case 'download':
      return await handleDownload(event, context);
    case 'delete':
      return await handleDelete(event, context);
    default:
      return {
        success: false,
        message: '未知的操作',
      };
  }
};

/**
 * 上传用户数据到 user_data 集合（增量合并，已存在则只更新传入的字段）
 * 支持部分字段更新（如仅更新 fastingState），不会覆盖其他已有字段
 */
async function handleUpload(event, context) {
  const wxContext = cloud.getWXContext();
  const { syncData } = event;

  if (!wxContext.OPENID) {
    return { success: false, message: '缺少 openid' };
  }

  try {
    // 查询是否已存在该用户的数据文档
    const exist = await db.collection('user_data').where({
      _openid: wxContext.OPENID
    }).get();

    const now = db.serverDate();

    if (exist.data && exist.data.length > 0) {
      // 已存在 → 增量合并：只更新传入的字段，保留其他已有字段
      const updateData = { updateTime: now };
      for (const key of Object.keys(syncData)) {
        updateData[key] = syncData[key];
      }
      await db.collection('user_data').doc(exist.data[0]._id).update({ data: updateData });
    } else {
      // 不存在 → 新增文档（传入什么写什么）
      const data = {
        _openid: wxContext.OPENID,
        updateTime: now,
        ...syncData,
      };
      await db.collection('user_data').add({ data });
    }

    return { success: true, message: '上传成功' };
  } catch (error) {
    console.error('[syncData upload] 失败:', error);
    return {
      success: false,
      message: '服务器错误',
      error: error.message,
    };
  }
}

/**
 * 从 user_data 集合下载用户全量数据
 */
async function handleDownload(event, context) {
  const wxContext = cloud.getWXContext();

  if (!wxContext.OPENID) {
    return { success: false, message: '缺少 openid' };
  }

  try {
    const result = await db.collection('user_data').where({
      _openid: wxContext.OPENID
    }).get();

    if (result.data && result.data.length > 0) {
      const userData = result.data[0];
      // 移除内部字段，只返回业务数据
      delete userData._id;
      delete userData._openid;
      return {
        success: true,
        data: userData,
      };
    } else {
      return {
        success: true,
        data: null,
        message: '云端无数据',
      };
    }
  } catch (error) {
    console.error('[syncData download] 失败:', error);
    return {
      success: false,
      message: '服务器错误',
      error: error.message,
    };
  }
}

/**
 * 删除 user_data 集合中当前用户的数据
 */
async function handleDelete(event, context) {
  const wxContext = cloud.getWXContext();

  if (!wxContext.OPENID) {
    return { success: false, message: '缺少 openid' };
  }

  try {
    const exist = await db.collection('user_data').where({
      _openid: wxContext.OPENID
    }).get();

    if (exist.data && exist.data.length > 0) {
      await db.collection('user_data').doc(exist.data[0]._id).remove();
    }

    return { success: true, message: '删除成功' };
  } catch (error) {
    console.error('[syncData delete] 失败:', error);
    return {
      success: false,
      message: '服务器错误',
      error: error.message,
    };
  }
}
