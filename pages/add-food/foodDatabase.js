const FOODS = [
  { name: '米饭', category: '主食', caloriesPer100g: 116, protein: 2.6, carbs: 25.9, fat: 0.3 },
  { name: '燕麦', category: '主食', caloriesPer100g: 377, protein: 13.5, carbs: 66.9, fat: 6.7 },
  { name: '全麦面包', category: '主食', caloriesPer100g: 246, protein: 8.5, carbs: 45.8, fat: 3.1 },
  { name: '红薯', category: '主食', caloriesPer100g: 86, protein: 1.6, carbs: 20.1, fat: 0.1 },
  { name: '玉米', category: '主食', caloriesPer100g: 112, protein: 4.0, carbs: 22.8, fat: 1.2 },
  { name: '荞麦面', category: '主食', caloriesPer100g: 337, protein: 12.0, carbs: 70.0, fat: 2.5 },
  { name: '鸡胸肉', category: '肉蛋', caloriesPer100g: 133, protein: 19.4, carbs: 2.5, fat: 5.0 },
  { name: '鸡蛋', category: '肉蛋', caloriesPer100g: 140, protein: 12.6, carbs: 1.1, fat: 9.5 },
  { name: '牛肉(瘦)', category: '肉蛋', caloriesPer100g: 106, protein: 20.2, carbs: 1.2, fat: 2.3 },
  { name: '三文鱼', category: '肉蛋', caloriesPer100g: 139, protein: 17.2, carbs: 0, fat: 7.8 },
  { name: '虾仁', category: '肉蛋', caloriesPer100g: 48, protein: 10.4, carbs: 0, fat: 0.7 },
  { name: '猪里脊', category: '肉蛋', caloriesPer100g: 109, protein: 19.2, carbs: 0.9, fat: 3.5 },
  { name: '豆腐', category: '豆制品', caloriesPer100g: 76, protein: 8.1, carbs: 1.9, fat: 4.8 },
  { name: '豆浆(无糖)', category: '豆制品', caloriesPer100g: 31, protein: 3.0, carbs: 1.2, fat: 1.6 },
  { name: '牛奶', category: '乳制品', caloriesPer100g: 54, protein: 3.0, carbs: 4.7, fat: 2.9 },
  { name: '希腊酸奶', category: '乳制品', caloriesPer100g: 59, protein: 10.0, carbs: 3.6, fat: 0.4 },
  { name: '芝士片', category: '乳制品', caloriesPer100g: 310, protein: 18.0, carbs: 3.0, fat: 25.0 },
  { name: '西兰花', category: '蔬菜', caloriesPer100g: 34, protein: 2.8, carbs: 7.0, fat: 0.4 },
  { name: '菠菜', category: '蔬菜', caloriesPer100g: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { name: '番茄', category: '蔬菜', caloriesPer100g: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { name: '黄瓜', category: '蔬菜', caloriesPer100g: 16, protein: 0.8, carbs: 2.9, fat: 0.2 },
  { name: '胡萝卜', category: '蔬菜', caloriesPer100g: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },
  { name: '生菜', category: '蔬菜', caloriesPer100g: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
  { name: '苹果', category: '水果', caloriesPer100g: 53, protein: 0.2, carbs: 14.1, fat: 0.2 },
  { name: '香蕉', category: '水果', caloriesPer100g: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
  { name: '蓝莓', category: '水果', caloriesPer100g: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
  { name: '牛油果', category: '水果', caloriesPer100g: 160, protein: 2.0, carbs: 8.5, fat: 14.7 },
  { name: '橙子', category: '水果', caloriesPer100g: 47, protein: 0.9, carbs: 11.8, fat: 0.1 },
  { name: '草莓', category: '水果', caloriesPer100g: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
  { name: '杏仁', category: '坚果', caloriesPer100g: 578, protein: 21.2, carbs: 21.6, fat: 49.4 },
  { name: '核桃', category: '坚果', caloriesPer100g: 654, protein: 15.2, carbs: 13.7, fat: 65.2 },
  { name: '花生', category: '坚果', caloriesPer100g: 567, protein: 25.8, carbs: 16.1, fat: 49.2 },
  { name: '橄榄油', category: '调味品', caloriesPer100g: 884, protein: 0, carbs: 0, fat: 100 },
  { name: '蜂蜜', category: '调味品', caloriesPer100g: 304, protein: 0.3, carbs: 82.4, fat: 0 },
  { name: '酱油', category: '调味品', caloriesPer100g: 63, protein: 5.6, carbs: 5.6, fat: 0 },
  { name: '黑咖啡', category: '饮品', caloriesPer100g: 1, protein: 0.1, carbs: 0, fat: 0 },
  { name: '绿茶', category: '饮品', caloriesPer100g: 1, protein: 0, carbs: 0.2, fat: 0 },
  { name: '可乐', category: '饮品', caloriesPer100g: 42, protein: 0, carbs: 10.6, fat: 0 },
  { name: '啤酒', category: '饮品', caloriesPer100g: 43, protein: 0.5, carbs: 3.6, fat: 0 },
  { name: '巧克力(黑)', category: '零食', caloriesPer100g: 546, protein: 4.9, carbs: 61.0, fat: 31.0 },
  { name: '薯片', category: '零食', caloriesPer100g: 536, protein: 7.0, carbs: 53.0, fat: 35.0 },
  { name: '饼干', category: '零食', caloriesPer100g: 502, protein: 7.0, carbs: 64.0, fat: 25.0 },
];

function searchFoods(keyword) {
  if (!keyword) return FOODS;
  const lower = keyword.toLowerCase();
  return FOODS.filter((f) => f.name.includes(keyword) || f.category.includes(keyword));
}

function getFoodByName(name) {
  return FOODS.find((f) => f.name === name);
}

function getCategories() {
  return [...new Set(FOODS.map((f) => f.category))];
}

module.exports = { FOODS, searchFoods, getFoodByName, getCategories };
