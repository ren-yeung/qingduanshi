// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { action } = event;
  
  switch (action) {
    case 'login':
      return await handleLogin(event, context);
    case 'getOrCreateUser':
      return await handleGetOrCreateUser(event, context);
    case 'deleteUser':
      return await handleDeleteUser(event, context);
    case 'updateUserAvatar':
      return await handleUpdateUserAvatar(event, context);
    case 'updateUserNickname':
      return await handleUpdateUserNickname(event, context);
    default:
      return {
        success: false,
        message: '未知的操作',
      };
  }
};

// 登录处理 - 获取 openid
async function handleLogin(event, context) {
  const wxContext = cloud.getWXContext();
  
  try {
    return {
      success: true,
      message: '登录成功',
      data: {
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID || '',
      },
    };
  } catch (error) {
    return {
      success: false,
      message: '登录失败',
      error: error.message,
    };
  }
}

// 根据生日计算年龄（兜底）
function calculateAge(birthdayStr) {
  if (!birthdayStr) return 0;
  const birthYear = parseInt(birthdayStr.split('-')[0]);
  if (isNaN(birthYear)) return 0;
  return new Date().getFullYear() - birthYear;
}

// 获取或创建用户
async function handleGetOrCreateUser(event, context) {
  const { openid, nickName, avatarUrl, gender, birthday, age, height, firstWeight } = event;
  const computedAge = (age !== undefined && age !== null) ? age : calculateAge(birthday);
  
  if (!openid) {
    return { success: false, message: '缺少 openid 参数' };
  }
  
  try {
    // 1. 查询是否已存在该用户
    const existUser = await db.collection('users').where({
      openid: openid
    }).get();
    
    if (existUser.data && existUser.data.length > 0) {
      // 用户已存在，更新信息
      const user = existUser.data[0];
      const updateData = {};
      
      // 如果有新信息则更新
      if (gender) updateData.gender = gender;
      if (birthday) updateData.birthday = birthday;
      if (computedAge !== undefined && computedAge !== null) updateData.age = computedAge;
      if (height) updateData.height = height;
      // 首次体重只记录一次，后续不再更新
      if (firstWeight && !user.firstWeight) updateData.firstWeight = firstWeight;
      
      if (Object.keys(updateData).length > 0) {
        await db.collection('users').doc(user._id).update({
          data: updateData
        });
      }
      
      return {
        success: true,
        message: '登录成功',
        data: {
          userId: user.userId,
          nickName: user.nickName || '小小的新用户',
          avatarUrl: user.avatarUrl || '',
          avatarFileID: user.avatarFileID || '',
          gender: gender || user.gender,
          birthday: birthday || user.birthday,
          age: computedAge !== undefined && computedAge !== null ? computedAge : user.age,
          height: height || user.height,
          firstWeight: user.firstWeight || firstWeight || 0,
          createTime: user.createTime,
        }
      };
    }
    
    // 2. 首次登录，生成新用户 ID
    const userId = await generateUniqueUserId();
    
    // 3. 创建新用户
    const createTime = new Date().toISOString();
    // 根据性别设置默认头像
    const defaultAvatar = gender === 'female' 
      ? 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
      : gender === 'male'
      ? 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
      : '';
      
    await db.collection('users').add({
      data: {
        openid,
        userId,
        nickName: nickName || '小小的新用户',
        avatarUrl: avatarUrl || defaultAvatar,
        gender: gender || '',
        birthday: birthday || '',
        age: computedAge !== undefined && computedAge !== null ? computedAge : 0,
        height: height || 0,
        firstWeight: firstWeight || 0,
        createTime,
      }
    });
    
    return {
      success: true,
      message: '注册成功',
      data: {
        userId,
        nickName: nickName || '小小的新用户',
        avatarUrl: avatarUrl || defaultAvatar,
        avatarFileID: '',
        gender: gender || '',
        birthday: birthday || '',
        age: computedAge !== undefined && computedAge !== null ? computedAge : 0,
        height: height || 0,
        firstWeight: firstWeight || 0,
        createTime,
      }
    };
    
  } catch (error) {
    console.error('获取/创建用户失败:', error);
    return {
      success: false,
      message: '服务器错误',
      error: error.message,
    };
  }
}

// 删除用户及其所有相关数据
async function handleDeleteUser(event, context) {
  const { openid } = event;
  
  if (!openid) {
    return { success: false, message: '缺少 openid 参数' };
  }
  
  try {
    // 1. 删除 users 集合中的用户
    const existUser = await db.collection('users').where({
      openid: openid
    }).get();
    
    if (existUser.data && existUser.data.length > 0) {
      const user = existUser.data[0];
      await db.collection('users').doc(user._id).remove();
    }
    
    // 2. 删除 bodyData 集合中的用户数据
    await deleteCollectionData('bodyData', openid);
    
    // 3. 删除 foodLogs 集合中的用户数据（如果存在）
    await deleteCollectionData('foodLogs', openid);
    
    return {
      success: true,
      message: '注销成功',
    };
    
  } catch (error) {
    console.error('注销用户失败:', error);
    return {
      success: false,
      message: '服务器错误',
      error: error.message,
    };
  }
}

// 批量删除集合中的用户数据
async function deleteCollectionData(collectionName, openid) {
  try {
    // 查询该用户的所有数据
    const result = await db.collection(collectionName).where({
      openid: openid
    }).get();
    
    if (result.data && result.data.length > 0) {
      // 逐条删除
      for (const item of result.data) {
        await db.collection(collectionName).doc(item._id).remove();
      }
    }
  } catch (error) {
    // 集合可能不存在，忽略错误
    console.log(`删除 ${collectionName} 数据时出错:`, error.message);
  }
}

// 生成唯一用户 ID（优化：使用时间戳+随机数，避免重复查询）
function generateUniqueUserId() {
  const timestamp = Date.now().toString().slice(-5); // 取时间戳后5位
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4位随机数
  return timestamp + random;
}

// 更新用户头像
async function handleUpdateUserAvatar(event, context) {
  const { openid, avatarFileID } = event;
  
  if (!openid) {
    return { success: false, message: '缺少 openid 参数' };
  }
  
  if (!avatarFileID) {
    return { success: false, message: '缺少 avatarFileID 参数' };
  }
  
  try {
    // 查找用户
    const existUser = await db.collection('users').where({
      openid: openid
    }).get();
    
    if (existUser.data && existUser.data.length > 0) {
      const user = existUser.data[0];
      
      // 更新头像（保存 fileID，清空旧的临时链接）
      await db.collection('users').doc(user._id).update({
        data: {
          avatarFileID: avatarFileID,
          avatarUrl: ''
        }
      });
      
      return {
        success: true,
        message: '头像更新成功',
      };
    }
    
    return {
      success: false,
      message: '用户不存在',
    };
  } catch (error) {
    console.error('更新头像失败:', error);
    return {
      success: false,
      message: '服务器错误',
      error: error.message,
    };
  }
}

// 更新用户昵称
async function handleUpdateUserNickname(event, context) {
  const { openid, nickName } = event;
  
  if (!openid) {
    return { success: false, message: '缺少 openid 参数' };
  }
  
  if (!nickName) {
    return { success: false, message: '缺少 nickName 参数' };
  }
  
  try {
    // 查找用户
    const existUser = await db.collection('users').where({
      openid: openid
    }).get();
    
    if (existUser.data && existUser.data.length > 0) {
      const user = existUser.data[0];
      
      // 更新昵称
      await db.collection('users').doc(user._id).update({
        data: {
          nickName: nickName
        }
      });
      
      return {
        success: true,
        message: '昵称更新成功',
      };
    }
    
    return {
      success: false,
      message: '用户不存在',
    };
  } catch (error) {
    console.error('更新昵称失败:', error);
    return {
      success: false,
      message: '服务器错误',
      error: error.message,
    };
  }
}
