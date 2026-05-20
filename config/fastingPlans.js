const PLANS = [
  {
    id: '16_8',
    name: '16:8 轻断食',
    shortName: '16:8',
    fastHours: 16,
    eatHours: 8,
    type: 'daily',
    description: '每天断食16小时，进食窗口8小时。适合初学者，最容易坚持。',
    difficulty: 1,
  },
  {
    id: '18_6',
    name: '18:6 轻断食',
    shortName: '18:6',
    fastHours: 18,
    eatHours: 6,
    type: 'daily',
    description: '每天断食18小时，进食窗口6小时。进阶方案，燃脂效率更高。',
    difficulty: 2,
  },
  {
    id: '20_4',
    name: '20:4 轻断食',
    shortName: '20:4',
    fastHours: 20,
    eatHours: 4,
    type: 'daily',
    description: '每天断食20小时，进食窗口4小时。高阶方案，需要较强自律。',
    difficulty: 3,
  },
  {
    id: 'omad',
    name: 'OMAD 一日一餐',
    shortName: 'OMAD',
    fastHours: 23,
    eatHours: 1,
    type: 'daily',
    description: '每天只吃一顿，其余23小时断食。极限方案，效果显著。',
    difficulty: 4,
  },
  {
    id: '5_2',
    name: '5:2 断食法',
    shortName: '5:2',
    fastHours: 24,
    eatHours: 0,
    type: 'weekly',
    description: '每周5天正常饮食，2天断食日（热量控制在500-600千卡）。',
    difficulty: 2,
  },
  {
    id: 'alternate',
    name: '隔日断食',
    shortName: '隔日',
    fastHours: 36,
    eatHours: 12,
    type: 'alternate',
    description: '断食日（极低热量）与正常日交替进行。效果最强但挑战最大。',
    difficulty: 5,
  },
  {
    id: 'custom',
    name: '自定义',
    shortName: '自定义',
    fastHours: 0,
    eatHours: 0,
    type: 'custom',
    description: '完全自定义你的断食与进食时长。',
    difficulty: 0,
  },
];

function getPlan(planId) {
  return PLANS.find((p) => p.id === planId);
}

function getAllPlans() {
  return PLANS;
}

module.exports = {
  PLANS,
  getPlan,
  getAllPlans,
};
