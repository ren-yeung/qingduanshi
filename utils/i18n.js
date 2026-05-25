/**
 * 多语言翻译模块 v2.0 - 全应用覆盖
 * 使用方式: const { t } = require('~/utils/i18n'); t('设置');
 */
const TRANSLATIONS = {
  // ========== 导航 & 通用 ==========
  设置: { 'zh-CN': '设置', en: 'Settings' },
  通用设置: { 'zh-CN': '通用设置', en: 'General' },
  通知设置: { 'zh-CN': '通知设置', en: 'Notifications' },
  深色模式: { 'zh-CN': '深色模式', en: 'Dark Mode' },

  播放设置: { 'zh-CN': '播放设置', en: 'Sound & Display' },
  账号安全: { 'zh-CN': '账号安全', en: 'Account Security' },
  隐私: { 'zh-CN': '隐私', en: 'Privacy' },
  隐私政策: { 'zh-CN': '隐私政策', en: 'Privacy Policy' },
  用户协议: { 'zh-CN': '用户协议', en: 'Terms of Service' },
  清除缓存: { 'zh-CN': '清除缓存', en: 'Clear Cache' },
  返回: { 'zh-CN': '返回', en: 'Back' },
  保存: { 'zh-CN': '保存', en: 'Save' },
  取消: { 'zh-CN': '取消', en: 'Cancel' },
  确定: { 'zh-CN': '确定', en: 'OK' },
  退出登录: { 'zh-CN': '退出登录', en: 'Log Out' },
  请选择: { 'zh-CN': '请选择', en: 'Select' },
  修改: { 'zh-CN': '修改', en: 'Edit' },
  编辑: { 'zh-CN': '编辑', en: 'Edit' },
  记录: { 'zh-CN': '记录', en: 'Record' },
  全部: { 'zh-CN': '全部', en: 'All' },
  更多: { 'zh-CN': '更多', en: 'More' },
  完成: { 'zh-CN': '完成', en: 'Done' },
  确认: { 'zh-CN': '确认', en: 'Confirm' },
  登录: { 'zh-CN': '登录', en: 'Log In' },
  提示: { 'zh-CN': '提示', en: 'Notice' },
  关于: { 'zh-CN': '关于', en: 'About' },
  默认: { 'zh-CN': '默认', en: 'Default' },

  // ========== TabBar ==========
  概览: { 'zh-CN': '概览', en: 'Home' },
  日志: { 'zh-CN': '日志', en: 'Log' },
  干货: { 'zh-CN': '干货', en: 'Tips' },
  我的: { 'zh-CN': '我的', en: 'Profile' },
  定制: { 'zh-CN': '定制', en: 'Customize' },

  // ========== 文章/干货 ==========
  文章详情: { 'zh-CN': '文章详情', en: 'Article' },
  文章不存在: { 'zh-CN': '文章不存在', en: 'Article not found' },
  小贴士: { 'zh-CN': '小贴士', en: 'Tip' },
  优势: { 'zh-CN': '优势', en: 'Pros' },
  注意: { 'zh-CN': '注意', en: 'Cons' },
  为什么适合: { 'zh-CN': '为什么适合', en: 'Why suitable' },
  为什么需要谨慎: { 'zh-CN': '为什么需要谨慎', en: 'Why be cautious' },
  为什么避免: { 'zh-CN': '为什么避免', en: 'Why avoid' },
  推荐运动: { 'zh-CN': '推荐运动', en: 'Recommended' },
  可以放心尝试: { 'zh-CN': '可以放心尝试', en: 'Can try with confidence' },
  '请慎重，建议先咨询医生': { 'zh-CN': '请慎重，建议先咨询医生', en: 'Please consult a doctor first' },
  以上人群都: { 'zh-CN': '以上人群都', en: 'These groups can all' },
  以上人群请: { 'zh-CN': '以上人群请', en: 'These groups should' },

  // ========== 首页/概览 ==========
  首页: { 'zh-CN': '首页', en: 'Home' },
  轻断食: { 'zh-CN': '轻断食', en: 'Light Fasting' },
  '准备开始今天的断食吗？': { 'zh-CN': '准备开始今天的断食吗？', en: 'Ready to start today\'s fast?' },
  '坚持住，断食进行中': { 'zh-CN': '坚持住，断食进行中', en: 'Keep going, fasting!' },
  '享受你的进食窗口': { 'zh-CN': '享受你的进食窗口', en: 'Enjoy your eating window' },
  当前体重: { 'zh-CN': '当前体重', en: 'Weight' },
  '热量(kcal)': { 'zh-CN': '热量(kcal)', en: 'Calories (kcal)' },
  连续打卡: { 'zh-CN': '连续打卡', en: 'Streak' },
  今日断食: { 'zh-CN': '今日断食', en: 'Today\'s Fast' },
  剩余: { 'zh-CN': '剩余', en: 'Remaining' },
  '16:8 轻断食': { 'zh-CN': '16:8 轻断食', en: '16:8 Light Fast' },
  '断食中，已进行 ': { 'zh-CN': '断食中，已进行 ', en: 'Fasting, ' },
  '觅食中，已进行 ': { 'zh-CN': '觅食中，已进行 ', en: 'Eating, ' },
  提前进食: { 'zh-CN': '提前进食', en: 'Eat Early' },
  开始断食: { 'zh-CN': '开始断食', en: 'Start Fast' },
  结束: { 'zh-CN': '结束', en: 'End' },
  结束断食: { 'zh-CN': '结束断食', en: 'End Fast' },
  '当前没有进行中的断食计划': { 'zh-CN': '当前没有进行中的断食计划', en: 'No active fasting plan' },
  今日摄入: { 'zh-CN': '今日摄入', en: 'Today\'s Intake' },
  数据统计: { 'zh-CN': '数据统计', en: 'Statistics' },
  千卡: { 'zh-CN': '千卡', en: 'kcal' },
  目标: { 'zh-CN': '目标', en: 'Target' },
  已摄入: { 'zh-CN': '已摄入', en: 'Consumed' },
  碳水: { 'zh-CN': '碳水', en: 'Carbs' },
  蛋白质: { 'zh-CN': '蛋白质', en: 'Protein' },
  脂肪: { 'zh-CN': '脂肪', en: 'Fat' },
  '今日已打卡': { 'zh-CN': '今日已打卡', en: 'Checked In' },
  今日打卡: { 'zh-CN': '今日打卡', en: 'Check In' },
  已打卡: { 'zh-CN': '已打卡', en: 'Done' },
  去打卡: { 'zh-CN': '去打卡', en: 'Check In' },
  快捷操作: { 'zh-CN': '快捷操作', en: 'Quick Actions' },
  记录饮食: { 'zh-CN': '记录饮食', en: 'Log Meal' },
  记录体重: { 'zh-CN': '记录体重', en: 'Log Weight' },
  连续: { 'zh-CN': '连续', en: 'Streak' },
  天: { 'zh-CN': '天', en: 'd' },
  确认结束: { 'zh-CN': '确认结束', en: 'Confirm End' },
  '确定要结束当前断食周期吗？': { 'zh-CN': '确定要结束当前断食周期吗？', en: 'End current fasting cycle?' },
  需要登录: { 'zh-CN': '需要登录', en: 'Login Required' },
  '请先登录后再使用此功能': { 'zh-CN': '请先登录后再使用此功能', en: 'Please log in first' },
  去登录: { 'zh-CN': '去登录', en: 'Log In' },

  // ========== 断食计划 ==========
  '16:8 轻断食': { 'zh-CN': '16:8 轻断食', en: '16:8 Intermittent Fasting' },
  '18:6 轻断食': { 'zh-CN': '18:6 轻断食', en: '18:6 Intermittent Fasting' },
  '20:4 轻断食': { 'zh-CN': '20:4 轻断食', en: '20:4 Intermittent Fasting' },
  'OMAD 一日一餐': { 'zh-CN': 'OMAD 一日一餐', en: 'OMAD One Meal a Day' },
  '5:2 断食法': { 'zh-CN': '5:2 断食法', en: '5:2 Fasting Method' },
  隔日断食: { 'zh-CN': '隔日断食', en: 'Alternate Day Fasting' },
  自定义: { 'zh-CN': '自定义', en: 'Custom' },
  难度: { 'zh-CN': '难度', en: 'Difficulty' },
  '断食 ': { 'zh-CN': '断食 ', en: 'Fast ' },
  ' 进食 ': { 'zh-CN': ' 进食 ', en: ' Eat ' },
  小时: { 'zh-CN': '小时', en: 'h' },
  断食时长: { 'zh-CN': '断食时长', en: 'Fast Duration' },
  进食时长: { 'zh-CN': '进食时长', en: 'Eat Duration' },
  确认开始: { 'zh-CN': '确认开始', en: 'Confirm Start' },
  '是否立即开始该断食计划？': { 'zh-CN': '是否立即开始该断食计划？', en: 'Start this fasting plan now?' },
  '时长需大于0': { 'zh-CN': '时长需大于0', en: 'Duration must be >0' },
  选择断食计划: { 'zh-CN': '选择断食计划', en: 'Select Fasting Plan' },
  开始自定义计划: { 'zh-CN': '开始自定义计划', en: 'Start Custom Plan' },
  // 计划描述翻译
  '每天断食16小时，进食窗口8小时。适合初学者，最容易坚持。': { 'zh-CN': '每天断食16小时，进食窗口8小时。适合初学者，最容易坚持。', en: 'Fast 16h daily, 8h eating window. Best for beginners.' },
  '每天断食18小时，进食窗口6小时。进阶方案，燃脂效率更高。': { 'zh-CN': '每天断食18小时，进食窗口6小时。进阶方案，燃脂效率更高。', en: 'Fast 18h daily, 6h eating window. Better fat burn.' },
  '每天断食20小时，进食窗口4小时。高阶方案，需要较强自律。': { 'zh-CN': '每天断食20小时，进食窗口4小时。高阶方案，需要较强自律。', en: 'Fast 20h daily, 4h eating window. Requires discipline.' },
  '每天只吃一顿，其余23小时断食。极限方案，效果显著。': { 'zh-CN': '每天只吃一顿，其余23小时断食。极限方案，效果显著。', en: 'One meal per day, 23h fast. Extreme & effective.' },
  '每周5天正常饮食，2天断食日（热量控制在500-600千卡）。': { 'zh-CN': '每周5天正常饮食，2天断食日（热量控制在500-600千卡）。', en: '5 normal days + 2 fast days (500-600 kcal).' },
  '断食日（极低热量）与正常日交替进行。效果最强但挑战最大。': { 'zh-CN': '断食日（极低热量）与正常日交替进行。效果最强但挑战最大。', en: 'Alternate fast days & normal days. Most powerful.' },
  '完全自定义你的断食与进食时长。': { 'zh-CN': '完全自定义你的断食与进食时长。', en: 'Fully customize your fast & eating hours.' },

  // ========== 日志/饮食 ==========
  早餐: { 'zh-CN': '早餐', en: 'Breakfast' },
  午餐: { 'zh-CN': '午餐', en: 'Lunch' },
  晚餐: { 'zh-CN': '晚餐', en: 'Dinner' },
  加餐: { 'zh-CN': '加餐', en: 'Snack' },
  任意: { 'zh-CN': '任意', en: 'Anytime' },
  '确定要删除这个食物吗？': { 'zh-CN': '确定要删除这个食物吗？', en: 'Delete this food?' },
  请选择食物: { 'zh-CN': '请选择食物', en: 'Please select a food' },
  请输入有效份量: { 'zh-CN': '请输入有效份量', en: 'Please enter a valid amount' },

  // ========== 我的计划 ==========
  我的计划: { 'zh-CN': '我的计划', en: 'My Plan' },
  进行中: { 'zh-CN': '进行中', en: 'Active' },
  已结束: { 'zh-CN': '已结束', en: 'Ended' },
  '每日断食...小时 · 进食窗口...小时': { 'zh-CN': '每日断食', en: 'Daily fast' },
  今日: { 'zh-CN': '今日', en: 'Today' },
  连续天数: { 'zh-CN': '连续天数', en: 'Streak Days' },
  最长连续: { 'zh-CN': '最长连续', en: 'Longest Streak' },
  本月完成率: { 'zh-CN': '本月完成率', en: 'Monthly Rate' },
  累计断食: { 'zh-CN': '累计断食', en: 'Total Fast' },
  切换方案: { 'zh-CN': '切换方案', en: 'Switch Plan' },
  结束计划: { 'zh-CN': '结束计划', en: 'End Plan' },
  本周概览: { 'zh-CN': '本周概览', en: 'This Week' },
  查看全部: { 'zh-CN': '查看全部', en: 'View All' },
  查看: { 'zh-CN': '查看', en: 'View' },
  '日': { 'zh-CN': '日', en: 'S' },
  '一': { 'zh-CN': '一', en: 'M' },
  '二': { 'zh-CN': '二', en: 'T' },
  '三': { 'zh-CN': '三', en: 'W' },
  '四': { 'zh-CN': '四', en: 'T' },
  '五': { 'zh-CN': '五', en: 'F' },
  '六': { 'zh-CN': '六', en: 'S' },
  已完成: { 'zh-CN': '已完成', en: 'Done' },
  周进度: { 'zh-CN': '周进度', en: 'Weekly Progress' },
  本周断食: { 'zh-CN': '本周断食', en: 'Weekly Fast' },
  连续中: { 'zh-CN': '连续中', en: 'Ongoing' },
  成就数据: { 'zh-CN': '成就数据', en: 'Achievements' },
  详细报告: { 'zh-CN': '详细报告', en: 'Report' },
  '累计断食总时长': { 'zh-CN': '累计断食总时长', en: 'Total Fasting Time' },
  '历史最长连续': { 'zh-CN': '历史最长连续', en: 'Historical Best Streak' },
  '保持记录中': { 'zh-CN': '保持记录中', en: 'Keep it up!' },
  习惯养成: { 'zh-CN': '习惯养成', en: 'Habit Formed' },
  连续执行: { 'zh-CN': '连续执行', en: 'Consistent' },
  稳定执行: { 'zh-CN': '稳定执行', en: 'Steady' },
  尝试体验: { 'zh-CN': '尝试体验', en: 'Trying Out' },
  '本月完成天数': { 'zh-CN': '本月完成天数', en: 'Completed This Month' },
  '持续坚持周期': { 'zh-CN': '持续坚持周期', en: 'Consistency Cycle' },
  小时: { 'zh-CN': '小时', en: 'hr' },
  '第': { 'zh-CN': '第', en: '#' },
  '周': { 'zh-CN': '周', en: 'wk' },
  历史计划: { 'zh-CN': '历史计划', en: 'History' },
  '完成率 ...%': { 'zh-CN': '完成率', en: 'Rate' },
  '暂无历史计划': { 'zh-CN': '暂无历史计划', en: 'No history yet' },
  创建新计划: { 'zh-CN': '创建新计划', en: 'Create New Plan' },
  '向上滑动回到顶部': { 'zh-CN': '向上滑动回到顶部', en: 'Swipe up to top' },

  // ========== 数据中心 ==========
  数据中心: { 'zh-CN': '数据中心', en: 'Data Center' },
  近7天: { 'zh-CN': '近7天', en: '7 Days' },
  近30天: { 'zh-CN': '近30天', en: '30 Days' },
  体重趋势: { 'zh-CN': '体重趋势', en: 'Weight Trend' },
  '暂无数据，快去记录体重吧': { 'zh-CN': '暂无数据，快去记录体重吧', en: 'No data yet, log your weight' },
  最低体重: { 'zh-CN': '最低体重', en: 'Lowest Weight' },
  平均体重: { 'zh-CN': '平均体重', en: 'Average Weight' },
  记录明细: { 'zh-CN': '记录明细', en: 'Records' },
  BMI: { 'zh-CN': 'BMI', en: 'BMI' },

  // ========== 身体维度 ==========
  身体维度: { 'zh-CN': '身体维度', en: 'Body Dimensions' },
  最新体重: { 'zh-CN': '最新体重', en: 'Latest Weight' },
  较上周: { 'zh-CN': '较上周', en: 'vs last week' },
  体脂率: { 'zh-CN': '体脂率', en: 'Body Fat %' },
  腰围: { 'zh-CN': '腰围', en: 'Waist' },
  臀围: { 'zh-CN': '臀围', en: 'Hip' },
  偏瘦: { 'zh-CN': '偏瘦', en: 'Underweight' },
  正常: { 'zh-CN': '正常', en: 'Normal' },
  偏胖: { 'zh-CN': '偏胖', en: 'Overweight' },
  肥胖: { 'zh-CN': '肥胖', en: 'Obese' },
  'BMI 指数': { 'zh-CN': 'BMI 指数', en: 'BMI Index' },
  '记录今天的数据': { 'zh-CN': '记录今天的数据', en: 'Record Today' },
  历史记录: { 'zh-CN': '历史记录', en: 'History' },
  目标进度: { 'zh-CN': '目标进度', en: 'Goal Progress' },
  目标体重: { 'zh-CN': '目标体重', en: 'Target Weight' },
  已减: { 'zh-CN': '已减', en: 'Lost' },
  '再减 ': { 'zh-CN': '再减 ', en: 'Lose ' },
  ' 即可达成目标！预计还需 ~': { 'zh-CN': ' 即可达成目标！预计还需 ~', en: ' to goal! ~' },
  ' 周': { 'zh-CN': ' 周', en: ' wks left' },
  趋势变化: { 'zh-CN': '趋势变化', en: 'Trend' },
  区间: { 'zh-CN': '区间', en: 'Range' },
  累计变化: { 'zh-CN': '累计变化', en: 'Change' },
  记录次数: { 'zh-CN': '记录次数', en: 'Entries' },
  记录历史: { 'zh-CN': '记录历史', en: 'History' },
  '暂无记录，开始记录你的身体数据吧': { 'zh-CN': '暂无记录，开始记录你的身体数据吧', en: 'No records yet, start tracking' },
  立即记录: { 'zh-CN': '立即记录', en: 'Record Now' },

  // ========== 记录身体数据 ==========
  记录身体数据: { 'zh-CN': '记录身体数据', en: 'Record Body Data' },
  体重: { 'zh-CN': '体重', en: 'Weight' },
  '例如 65.5': { 'zh-CN': '例如 65.5', en: 'e.g. 143.3' },
  '例如 131.0': { 'zh-CN': '例如 131.0', en: 'e.g. 143.3' },
  '例如 22.5': { 'zh-CN': '例如 22.5', en: 'e.g. 22.5' },
  '例如 78': { 'zh-CN': '例如 78', en: 'e.g. 30.7' },
  '例如 95': { 'zh-CN': '例如 95', en: 'e.g. 37.4' },
  今日步数: { 'zh-CN': '今日步数', en: 'Steps Today' },
  '例如 8000': { 'zh-CN': '例如 8000', en: 'e.g. 8000' },
  心情评分: { 'zh-CN': '心情评分', en: 'Mood' },
  '分': { 'zh-CN': '分', en: 'pts' },
  备注: { 'zh-CN': '备注', en: 'Notes' },
  '记录今天的感受...': { 'zh-CN': '记录今天的感受...', en: 'How are you feeling today?' },

  // ========== 记录饮食 ==========
  搜索食物名称: { 'zh-CN': '搜索食物名称', en: 'Search food' },
  份量: { 'zh-CN': '份量', en: 'Portion' },
  '克': { 'zh-CN': '克', en: 'g' },
  热量: { 'zh-CN': '热量', en: 'Calories' },
  '（每100g）': { 'zh-CN': '（每100g）', en: ' (per 100g)' },
  确认添加: { 'zh-CN': '确认添加', en: 'Add' },

  // ========== 日志页 ==========
  今日营养: { 'zh-CN': '今日营养', en: 'Today\'s Nutrition' },
  'kcal 剩余': { 'zh-CN': 'kcal 剩余', en: 'kcal left' },
  '点击 + 添加食物': { 'zh-CN': '点击 + 添加食物', en: 'Tap + to add food' },
  今日身体数据: { 'zh-CN': '今日身体数据', en: 'Today\'s Body' },
  '今日还未记录身体数据': { 'zh-CN': '今日还未记录身体数据', en: 'No body data today' },

  // ========== 饮食库 ==========
  食物库: { 'zh-CN': '食物库', en: 'Food Library' },

  // ========== 打卡分享 ==========
  打卡分享: { 'zh-CN': '打卡分享', en: 'Check-in' },
  打卡成功: { 'zh-CN': '打卡成功', en: 'Check-in Success' },
  分享给好友: { 'zh-CN': '分享给好友', en: 'Share' },
  返回首页: { 'zh-CN': '返回首页', en: 'Back to Home' },

  // ========== 排行榜 ==========
  排行榜: { 'zh-CN': '排行榜', en: 'Leaderboard' },
  '天连续断食': { 'zh-CN': '天连续断食', en: ' days fasting streak' },
  本周减重: { 'zh-CN': '本周减重', en: 'Wt Lost' },
  我: { 'zh-CN': '我', en: 'Me' },
  '暂无排行数据': { 'zh-CN': '暂无排行数据', en: 'No ranking data' },
  '数据每日凌晨更新': { 'zh-CN': '数据每日凌晨更新', en: 'Data updates daily' },
  已获成就: { 'zh-CN': '已获成就', en: 'Achievements Earned' },
  '全部 ... 个': { 'zh-CN': '全部', en: 'All' },

  // ========== 我的目标 ==========
  我的目标: { 'zh-CN': '我的目标', en: 'My Goals' },
  每日摄入目标: { 'zh-CN': '每日摄入目标', en: 'Daily Intake Goal' },
  请输入: { 'zh-CN': '请输入', en: 'Enter' },
  体重目标_zh: { 'zh-CN': '体重目标', en: 'Weight Goal' },
  我的身高: { 'zh-CN': '我的身高', en: 'Height' },
  请输入身高: { 'zh-CN': '请输入身高', en: 'Enter height' },
  请输入体重: { 'zh-CN': '请输入体重', en: 'Enter weight' },
  说明: { 'zh-CN': '说明', en: 'Info' },
  '热量：每日摄入的总能量目标': { 'zh-CN': '热量：每日摄入的总能量目标', en: 'Calories: Daily total energy target' },
  '蛋白质：帮助维持肌肉和代谢': { 'zh-CN': '蛋白质：帮助维持肌肉和代谢', en: 'Protein: Helps maintain muscle & metabolism' },
  '碳水：提供日常活动能量': { 'zh-CN': '碳水：提供日常活动能量', en: 'Carbs: Provides daily energy' },
  '脂肪：维持激素和细胞健康': { 'zh-CN': '脂肪：维持激素和细胞健康', en: 'Fat: Maintains hormone & cell health' },
  恢复默认目标: { 'zh-CN': '恢复默认目标', en: 'Reset to Default' },
  保存成功: { 'zh-CN': '保存成功', en: 'Saved!' },

  // ========== 设置页 ==========
  注销账号: { 'zh-CN': '注销账号', en: 'Delete Account' },
  '确定要清除所有本地缓存吗？这不会影响您的账号数据。': { 'zh-CN': '确定要清除所有本地缓存吗？这不会影响您的账号数据。', en: 'Clear all local cache? Your account data won\'t be affected.' },
  '确定要退出登录吗？': { 'zh-CN': '确定要退出登录吗？', en: 'Are you sure you want to log out?' },
  '注销后所有数据将永久删除，确定要注销吗？': { 'zh-CN': '注销后所有数据将永久删除，确定要注销吗？', en: 'All data will be permanently deleted. Continue?' },
  清理中: { 'zh-CN': '清理中...', en: 'Cleaning...' },
  计算中: { 'zh-CN': '计算中...', en: 'Calculating...' },
  缓存已清除: { 'zh-CN': '缓存已清除', en: 'Cache cleared' },
  清除失败: { 'zh-CN': '清除失败', en: 'Clear failed' },
  注销中: { 'zh-CN': '注销中...', en: 'Deleting...' },
  账号已注销: { 'zh-CN': '账号已注销', en: 'Account deleted' },
  '注销失败，请重试': { 'zh-CN': '注销失败，请重试', en: 'Delete failed, retry' },

  // ========== 我的页 ==========
  我的目标_link: { 'zh-CN': '我的目标', en: 'My Goals' },
  数据统计_link: { 'zh-CN': '数据统计', en: 'Statistics' },
  食物库_link: { 'zh-CN': '食物库', en: 'Food Library' },
  '断食计划': { 'zh-CN': '断食计划', en: 'Fasting Plans' },
  身体维度_link: { 'zh-CN': '身体维度', en: 'Body' },
  排行榜_link: { 'zh-CN': '排行榜', en: 'Leaderboard' },
  我的订单: { 'zh-CN': '我的订单', en: 'My Orders' },
  个性化: { 'zh-CN': '个性化', en: 'Customize' },
  联系我们: { 'zh-CN': '联系我们', en: 'Contact Us' },
  '使用教程': { 'zh-CN': '使用教程', en: 'Tutorial' },
  消息通知: { 'zh-CN': '消息通知', en: 'Notifications' },
  设置_link: { 'zh-CN': '设置', en: 'Settings' },
  登录中: { 'zh-CN': '登录中...', en: 'Logging in...' },
  '登录失败，请重试': { 'zh-CN': '登录失败，请重试', en: 'Login failed, retry' },
  '登录失败，请检查网络': { 'zh-CN': '登录失败，请检查网络', en: 'Login failed, check network' },
  登录成功: { 'zh-CN': '登录成功', en: 'Login success' },
  '功能开发中': { 'zh-CN': '功能开发中', en: 'Coming soon' },
  '计划已结束': { 'zh-CN': '计划已结束', en: 'Plan ended' },
  '周后解锁徽章': { 'zh-CN': '周后解锁徽章', en: 'wk to badge' },
  '确定要结束当前断食计划吗？': { 'zh-CN': '确定要结束当前断食计划吗？', en: 'End current fasting plan?' },
  '结束后可以从历史记录中查看。': { 'zh-CN': '结束后可以从历史记录中查看。', en: 'Available in history afterwards.' },
  '昵称不能为空': { 'zh-CN': '昵称不能为空', en: 'Nickname required' },
  修改成功: { 'zh-CN': '修改成功', en: 'Updated' },
  修改失败: { 'zh-CN': '修改失败', en: 'Update failed' },
  上传中: { 'zh-CN': '上传中...', en: 'Uploading...' },
  头像更新成功: { 'zh-CN': '头像更新成功', en: 'Avatar updated' },
  '上传失败，请重试': { 'zh-CN': '上传失败，请重试', en: 'Upload failed, retry' },
  '小小的新用户': { 'zh-CN': '小小的新用户', en: 'New User' },
  '点击头像登录': { 'zh-CN': '点击头像登录', en: 'Tap avatar to login' },
  请输入昵称: { 'zh-CN': '请输入昵称', en: 'Enter nickname' },

  // ========== 通用设置 ==========
  语言与地区: { 'zh-CN': '语言与地区', en: 'Language & Region' },
  语言: { 'zh-CN': '语言', en: 'Language' },
  单位制: { 'zh-CN': '单位制', en: 'Unit System' },
  简体中文: { 'zh-CN': '简体中文', en: 'Simplified Chinese' },
  English: { 'zh-CN': 'English', en: 'English' },
  '公制 (kg/cm)': { 'zh-CN': '公制 (kg/cm)', en: 'Metric (kg/cm)' },
  '斤/cm': { 'zh-CN': '斤/cm', en: 'Jin/cm' },
  默认行为: { 'zh-CN': '默认行为', en: 'Defaults' },
  默认断食方案: { 'zh-CN': '默认断食方案', en: 'Default Fasting Plan' },
  每周起始日: { 'zh-CN': '每周起始日', en: 'Week Start Day' },
  自动同步数据: { 'zh-CN': '自动同步数据', en: 'Auto Sync Data' },
  仅WiFi下同步: { 'zh-CN': '仅 Wi-Fi 下同步', en: 'Wi-Fi Only Sync' },
  '16:8 间歇性断食': { 'zh-CN': '16:8 间歇性断食', en: '16:8 Intermittent Fasting' },
  周一: { 'zh-CN': '周一', en: 'Monday' },
  周二: { 'zh-CN': '周二', en: 'Tuesday' },
  周三: { 'zh-CN': '周三', en: 'Wednesday' },
  周四: { 'zh-CN': '周四', en: 'Thursday' },
  周五: { 'zh-CN': '周五', en: 'Friday' },
  周六: { 'zh-CN': '周六', en: 'Saturday' },
  周日: { 'zh-CN': '周日', en: 'Sunday' },
  同步提示: { 'zh-CN': '开启「自动同步」后，您的断食记录和身体数据将实时备份至云端，换设备不会丢失。', en: 'With auto-sync enabled, your fasting records and body data will be backed up to the cloud.' },

  // ========== 通知设置 ==========
  断食提醒: { 'zh-CN': '断食提醒', en: 'Fasting Reminders' },
  断食开始提醒: { 'zh-CN': '断食开始提醒', en: 'Fasting Start' },
  断食结束提醒: { 'zh-CN': '断食结束提醒', en: 'Fasting End' },
  断食中途提醒: { 'zh-CN': '断食中途提醒', en: 'Mid-Fasting' },
  每日打卡提醒时间: { 'zh-CN': '每日打卡提醒时间', en: 'Daily Check-in Time' },
  打卡互动: { 'zh-CN': '打卡互动', en: 'Check-in & Social' },
  社区互动通知: { 'zh-CN': '社区互动通知', en: 'Social Interactions' },
  公告推送: { 'zh-CN': '公告推送', en: 'Announcements' },
  '通知权限提示': { 'zh-CN': '开启通知权限，第一时间获得断食进度、打卡提醒和社区互动消息', en: 'Enable notifications to receive fasting progress, check-in reminders and social interactions' },
  开始断食提醒: { 'zh-CN': '开始断食提醒', en: 'Fasting Start Reminder' },
  结束断食提醒: { 'zh-CN': '结束断食提醒', en: 'Fasting End Reminder' },
  中途阶段提醒: { 'zh-CN': '中途阶段提醒', en: 'Mid-Stage Reminder' },
  '打卡与互动': { 'zh-CN': '打卡与互动', en: 'Check-in & Social' },
  每日打卡提醒: { 'zh-CN': '每日打卡提醒', en: 'Daily Check-in Reminder' },
  '活动与公告推送': { 'zh-CN': '活动与公告推送', en: 'Events & Announcements' },
  请确保微信已开启本小程序的通知权限: { 'zh-CN': '请确保微信已开启本小程序的通知权限，否则无法收到提醒。', en: 'Please ensure WeChat notifications are enabled for this app.' },

  // ========== 深色模式 ==========
  外观主题: { 'zh-CN': '外观主题', en: 'Appearance' },
  跟随系统: { 'zh-CN': '跟随系统', en: 'Follow System' },
  浅色模式: { 'zh-CN': '浅色模式', en: 'Light Mode' },
  深色主题: { 'zh-CN': '深色模式', en: 'Dark Theme' },
  跟随系统描述: { 'zh-CN': '自动根据手机系统的深色/浅色模式切换外观', en: 'Automatically switch based on system dark/light mode' },
  浅色模式描述: { 'zh-CN': '始终使用浅色模式，适合大多数场景', en: 'Always use light mode, suitable for most scenarios' },
  深色模式描述: { 'zh-CN': '适合夜间或低光环境使用，更护眼并省电', en: 'Eye-friendly for night use, saves battery on OLED screens' },
  模式说明: { 'zh-CN': '选择「跟随系统」时，小程序将根据手机系统的深色/浅色模式自动切换外观。部分旧版本可能不支持跟随系统。', en: 'When "Follow System" is selected, the app will match your device\'s dark/light mode automatically. Older versions may not support this feature.' },
  效果预览: { 'zh-CN': '效果预览', en: 'Preview' },
  浅色: { 'zh-CN': '浅色', en: 'Light' },
  '深色': { 'zh-CN': '深色', en: 'Dark' },
  预览区域: { 'zh-CN': '预览区域', en: 'Preview Area' },








  // ========== 播放设置 ==========
  声音与振动: { 'zh-CN': '声音与振动', en: 'Sound & Vibration' },
  提示音效: { 'zh-CN': '提示音效', en: 'Sound Effects' },
  振动反馈: { 'zh-CN': '振动反馈', en: 'Vibration' },
  铃声选择: { 'zh-CN': '铃声选择', en: 'Ringtone' },
  动画效果: { 'zh-CN': '动画效果', en: 'Animations' },
  过渡动画: { 'zh-CN': '过渡动画', en: 'Transition Animation' },
  打卡动效: { 'zh-CN': '打卡动效', en: 'Check-in Animation' },
  成就特效: { 'zh-CN': '成就特效', en: 'Achievement Effects' },
  电量提示: { 'zh-CN': '💡 关闭过渡动画和动效可以减轻手机性能压力，延长电池使用时间。', en: '💡 Disabling animations can reduce performance overhead and extend battery life.' },
  提示铃声: { 'zh-CN': '提示铃声', en: 'Ringtone' },
  页面过渡动画: { 'zh-CN': '页面过渡动画', en: 'Page Transition' },
  打卡成功动效: { 'zh-CN': '打卡成功动效', en: 'Check-in Effect' },
  成就解锁特效: { 'zh-CN': '成就解锁特效', en: 'Achievement Effect' },
  关闭动画和振动可略微减少电量消耗: { 'zh-CN': '关闭动画和振动可略微减少电量消耗，建议在低电量模式下关闭。', en: 'Turning off animations and vibration can save battery, recommended in low-power mode.' },
  清脆: { 'zh-CN': '清脆', en: 'Crisp' },
  柔和: { 'zh-CN': '柔和', en: 'Soft' },

  // ========== 账号安全 ==========
  账号信息: { 'zh-CN': '账号信息', en: 'Account Info' },
  头像: { 'zh-CN': '头像', en: 'Avatar' },
  昵称: { 'zh-CN': '昵称', en: 'Nickname' },
  安全设置: { 'zh-CN': '安全设置', en: 'Security' },
  修改密码: { 'zh-CN': '修改密码', en: 'Change Password' },
  绑定手机号: { 'zh-CN': '绑定手机号', en: 'Bind Phone' },
  设备管理: { 'zh-CN': '设备管理', en: 'Device Management' },
  最后登录: { 'zh-CN': '最后登录', en: 'Last Login' },
  退出确认: { 'zh-CN': '确定要退出当前账号吗？退出后需要重新登录。', en: 'Are you sure you want to log out? You will need to log in again.' },
  登录设备管理: { 'zh-CN': '登录设备管理', en: 'Device Management' },
  上次登录: { 'zh-CN': '上次登录：', en: 'Last login: ' },
  退出当前账号: { 'zh-CN': '退出当前账号', en: 'Log Out' },

  // ========== 联系我们 ==========
  '反馈与支持': { 'zh-CN': '反馈与支持', en: 'Feedback & Support' },
  意见反馈: { 'zh-CN': '意见反馈', en: 'Feedback' },
  联系客服: { 'zh-CN': '联系客服', en: 'Contact Support' },
  关于轻断食: { 'zh-CN': '关于轻断食', en: 'About Light Fasting' },
  检查更新: { 'zh-CN': '检查更新', en: 'Check Updates' },
  法律信息: { 'zh-CN': '法律信息', en: 'Legal' },
  小小轻断食: { 'zh-CN': '小小轻断食', en: 'Light Fasting' },
  '健康生活每一天': { 'zh-CN': '健康生活每一天', en: 'Healthy life every day' },

  // ========== 个性化 ==========
  外观模式: { 'zh-CN': '外观模式', en: 'Appearance Mode' },
  '自定义配色': { 'zh-CN': '自定义配色', en: 'Custom Colors' },
  '品牌色': { 'zh-CN': '品牌色', en: 'Brand Color' },
  '页面背景': { 'zh-CN': '页面背景', en: 'Page Background' },
  '卡片色': { 'zh-CN': '卡片色', en: 'Card Color' },
  显示设置: { 'zh-CN': '显示设置', en: 'Display' },
  '字体': { 'zh-CN': '字体', en: 'Font' },
  '首页快捷入口': { 'zh-CN': '首页快捷入口', en: 'Home Shortcuts' },
  其他: { 'zh-CN': '其他', en: 'Other' },
  恢复默认设置: { 'zh-CN': '恢复默认设置', en: 'Reset to Default' },
  '外观已切换': { 'zh-CN': '外观已切换', en: 'Appearance changed' },
  '字体已切换': { 'zh-CN': '字体已切换', en: 'Font changed' },
  '已恢复默认': { 'zh-CN': '已恢复默认', en: 'Reset to default' },
  '恢复默认': { 'zh-CN': '恢复默认', en: 'Reset' },
  '确定要恢复所有个性化设置为默认值吗？': { 'zh-CN': '确定要恢复所有个性化设置为默认值吗？', en: 'Reset all customization to defaults?' },
  清新绿: { 'zh-CN': '清新绿', en: 'Fresh Green' },
  暖阳橙: { 'zh-CN': '暖阳橙', en: 'Warm Orange' },
  深海蓝: { 'zh-CN': '深海蓝', en: 'Deep Blue' },
  自定义: { 'zh-CN': '自定义', en: 'Custom' },
  系统默认: { 'zh-CN': '系统默认', en: 'System Default' },
  楷体: { 'zh-CN': '楷体', en: 'KaiTi' },
  宋体: { 'zh-CN': '宋体', en: 'SongTi' },
  仿宋: { 'zh-CN': '仿宋', en: 'FangSong' },

  // ========== 选择断食计划 ==========
  选择断食计划: { 'zh-CN': '选择断食计划', en: 'Choose Fasting Plan' },
  难度: { 'zh-CN': '难度', en: 'Difficulty' },
  开始自定义计划: { 'zh-CN': '开始自定义计划', en: 'Start Custom Plan' },
  断食时长: { 'zh-CN': '断食时长', en: 'Fasting Duration' },
  进食时长: { 'zh-CN': '进食时长', en: 'Eating Window' },

  // ========== 消息通知 ==========
  公告: { 'zh-CN': '公告', en: 'Announcement' },
  '版本': { 'zh-CN': '版本', en: 'Version' },
  指南: { 'zh-CN': '指南', en: 'Guide' },
  活动: { 'zh-CN': '活动', en: 'Event' },
  收起详情: { 'zh-CN': '收起详情', en: 'Collapse' },
  展开详情: { 'zh-CN': '展开详情', en: 'Expand' },

  // ========== 身体数据全部记录 ==========
  全部记录: { 'zh-CN': '全部记录', en: 'All Records' },
  身体数据: { 'zh-CN': '身体数据', en: 'Body Data' },
  步数: { 'zh-CN': '步数', en: 'Steps' },
  当天暂无记录: { 'zh-CN': '当天暂无记录', en: 'No records' },
  当天心情: { 'zh-CN': '当天心情', en: 'Mood' },

  // ========== 验证码登录 ==========
  请输入验证码: { 'zh-CN': '请输入验证码', en: 'Enter verification code' },
  '验证码已通过短信发送至': { 'zh-CN': '验证码已通过短信发送至', en: 'Code sent via SMS to' },
  输入验证码: { 'zh-CN': '输入验证码', en: 'Enter code' },
  发送验证码: { 'zh-CN': '发送验证码', en: 'Send Code' },
  秒后重发: { 'zh-CN': '秒后重发', en: 's to resend' },

  // ========== 完善个人信息 ==========
  完善个人信息: { 'zh-CN': '完善个人信息', en: 'Complete Profile' },
  '帮助我们为你提供更精准的断食方案': { 'zh-CN': '帮助我们为你提供更精准的断食方案', en: 'Help us provide a more accurate fasting plan' },
  '选择您的性别': { 'zh-CN': '选择您的性别', en: 'Select Gender' },
  '女生': { 'zh-CN': '女生', en: 'Female' },
  '男生': { 'zh-CN': '男生', en: 'Male' },
  '选择您的出生年月': { 'zh-CN': '选择您的出生年月', en: 'Select Birth Date' },
  '选择您的身高': { 'zh-CN': '选择您的身高', en: 'Select Height' },
  '选择您当前体重': { 'zh-CN': '选择您当前体重', en: 'Select Weight' },
  开始体验: { 'zh-CN': '开始体验', en: 'Start' },

  // ========== App级别 ==========
  更新提示: { 'zh-CN': '更新提示', en: 'Update Available' },
  '新版本已经准备好，是否重启应用？': { 'zh-CN': '新版本已经准备好，是否重启应用？', en: 'New version ready. Restart now?' },

  // ========== Toast通用 ==========
  请输入有效热量: { 'zh-CN': '请输入有效热量', en: 'Enter valid calories' },
  '暂仅支持简体中文': { 'zh-CN': '暂仅支持简体中文', en: 'Only Simplified Chinese supported' },
  '暂仅支持公制': { 'zh-CN': '暂仅支持公制', en: 'Only metric supported' },
  '请在首页选择方案': { 'zh-CN': '请在首页选择方案', en: 'Select plan on home page' },
  '暂仅支持周一': { 'zh-CN': '暂仅支持周一', en: 'Only Monday supported' },
  已是最新版本: { 'zh-CN': '已是最新版本', en: 'Already up to date' },
  确认重置: { 'zh-CN': '确认重置', en: 'Confirm Reset' },
  '确定要恢复默认目标吗？': { 'zh-CN': '确定要恢复默认目标吗？', en: 'Reset to default goals?' },
  请选择出生年月: { 'zh-CN': '请选择出生年月', en: 'Select birth date' },
  '保存中...': { 'zh-CN': '保存中...', en: 'Saving...' },
  获取登录信息失败: { 'zh-CN': '获取登录信息失败', en: 'Failed to get login info' },
  设置成功: { 'zh-CN': '设置成功', en: 'Setup complete' },
  '保存失败，请重试': { 'zh-CN': '保存失败，请重试', en: 'Save failed, retry' },
  正常范围: { 'zh-CN': '正常范围', en: 'Normal' },
  轻断食达人: { 'zh-CN': '轻断食达人', en: 'Fasting Pro' },
  未绑定: { 'zh-CN': '未绑定', en: 'Not bound' },
  请在微信中修改个人信息: { 'zh-CN': '请在微信中修改个人信息', en: 'Modify in WeChat' },
  暂不支持修改密码: { 'zh-CN': '暂不支持修改密码', en: 'Password change not supported' },
  暂仅支持微信登录: { 'zh-CN': '暂仅支持微信登录', en: 'WeChat login only' },
  当前设备已认证: { 'zh-CN': '当前设备已认证', en: 'Device verified' },
  '确定要退出当前账号吗？': { 'zh-CN': '确定要退出当前账号吗？', en: 'Log out of current account?' },
  知道了: { 'zh-CN': '知道了', en: 'Got it' },
  已是最新的: { 'zh-CN': '已是最新的', en: 'Already up to date' },
  '加载中...': { 'zh-CN': '加载中...', en: 'Loading...' },
  总榜: { 'zh-CN': '总榜', en: 'Overall' },
  本月断食: { 'zh-CN': '本月断食', en: 'Monthly Fast' },
  本月: { 'zh-CN': '本月', en: 'This Month' },
  历史: { 'zh-CN': '历史', en: 'All Time' },
  完成率: { 'zh-CN': '完成率', en: 'Rate' },
  '心情 ': { 'zh-CN': '心情 ', en: 'Mood ' },
  欢快: { 'zh-CN': '欢快', en: 'Lively' },
  静音: { 'zh-CN': '静音', en: 'Silent' },
  '7天连续': { 'zh-CN': '7天连续', en: '7-Day Streak' },
  '早鸟早起': { 'zh-CN': '早鸟早起', en: 'Early Bird' },
  '月度达人': { 'zh-CN': '月度达人', en: 'Monthly Master' },
  '21天挑战': { 'zh-CN': '21天挑战', en: '21-Day Challenge' },
  '钻石会员': { 'zh-CN': '钻石会员', en: 'Diamond Member' },
  '冠军之路': { 'zh-CN': '冠军之路', en: 'Champion Road' },
  '30天挑战': { 'zh-CN': '30天挑战', en: '30-Day Challenge' },
  '减重大师': { 'zh-CN': '减重大师', en: 'Weight Loss Master' },
  '完美月度': { 'zh-CN': '完美月度', en: 'Perfect Month' },
  '百日挑战': { 'zh-CN': '百日挑战', en: 'Century Challenge' },
  较上周$: { 'zh-CN': '较上周', en: 'vs last wk' },
  '再减 ': { 'zh-CN': '再减 ', en: 'Lose ' },
  ' 即可达成目标！预计还需 ~': { 'zh-CN': ' 即可达成目标！预计还需 ~', en: ' to reach goal! ~' },
  ' 周': { 'zh-CN': ' 周', en: ' wks left' },
  '目标：': { 'zh-CN': '目标：', en: 'Goal: ' },
  '关于轻断食\n描述': { 'zh-CN': '轻断食是一款科学健康的断食追踪助手，帮助您轻松管理饮食计划，养成健康的生活习惯。\n\n版本：v', en: 'Light Fasting is a science-based fasting tracker that helps you manage your diet plan and build healthy habits.\n\nVersion: v' },
  请输入昵称_toast: { 'zh-CN': '请输入昵称', en: 'Please enter a nickname' },
  填写已复制: { 'zh-CN': '已复制', en: 'Copied' },
  '体重 (kg) *': { 'zh-CN': '体重 (kg) *', en: 'Weight (kg) *' },
  '体重 (斤) *': { 'zh-CN': '体重 (斤) *', en: 'Weight (jin) *' },
  '体脂率 (%)': { 'zh-CN': '体脂率 (%)', en: 'Body Fat (%)' },
  '腰围 (cm)': { 'zh-CN': '腰围 (cm)', en: 'Waist (cm)' },
  '臀围 (cm)': { 'zh-CN': '臀围 (cm)', en: 'Hip (cm)' },
  '身高 (cm)': { 'zh-CN': '身高 (cm)', en: 'Height (cm)' },
};

/**
 * 获取翻译文本
 * @param {string} key - 翻译 key
 * @param {string} [lang] - 语言代码，默认从 storage 读取
 * @returns {string}
 */
function t(key, lang) {
  if (!lang) {
    try {
      const settings = wx.getStorageSync('customizeSettings') || {};
      lang = settings.language === 'English' ? 'en' : 'zh-CN';
    } catch (e) {
      lang = 'zh-CN';
    }
  }
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[lang] || entry['zh-CN'] || key;
}

/**
 * 获取当前语言代码
 * @returns {'zh-CN'|'en'}
 */
function getCurrentLang() {
  try {
    const settings = wx.getStorageSync('customizeSettings') || {};
    return settings.language === 'English' ? 'en' : 'zh-CN';
  } catch (e) {
    return 'zh-CN';
  }
}

/**
 * 批量翻译 - 返回翻译后对象
 * @param {string[]} keys - 翻译 key 数组
 * @param {string} [lang] - 语言代码
 * @returns {Object} { key: translatedValue }
 */
function tBatch(keys, lang) {
  if (!lang) lang = getCurrentLang();
  const result = {};
  keys.forEach(key => {
    result['i18n_' + key] = t(key, lang);
  });
  return result;
}

module.exports = { t, getCurrentLang, tBatch, TRANSLATIONS };
