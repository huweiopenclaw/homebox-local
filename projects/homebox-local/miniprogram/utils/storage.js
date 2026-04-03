/**
 * 本地数据存储层
 * 使用 wx.setStorageSync / wx.getStorageSync 实现
 */

// 存储键名常量
const STORAGE_KEYS = {
  ITEMS: 'homebox_items',
  LOCATIONS: 'homebox_locations',
  CATEGORIES: 'homebox_categories'
};

// 默认分类
const DEFAULT_CATEGORIES = [
  { id: 'cat_1', name: '电子产品', icon: '📱' },
  { id: 'cat_2', name: '衣物', icon: '👕' },
  { id: 'cat_3', name: '书籍', icon: '📚' },
  { id: 'cat_4', name: '工具', icon: '🔧' },
  { id: 'cat_5', name: '食品', icon: '🍎' },
  { id: 'cat_6', name: '药品', icon: '💊' },
  { id: 'cat_7', name: '文件', icon: '📄' },
  { id: 'cat_8', name: '其他', icon: '📦' }
];

// 生成唯一ID
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// 物品存储 (items)
// ============================================

/**
 * 获取所有物品
 * @returns {Array} 物品列表
 */
function getAllItems() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.ITEMS) || [];
  } catch (e) {
    console.error('getAllItems error:', e);
    return [];
  }
}

/**
 * 获取单个物品
 * @param {string} id 物品ID
 * @returns {Object|null} 物品对象
 */
function getItem(id) {
  const items = getAllItems();
  return items.find(item => item.id === id) || null;
}

/**
 * 添加物品
 * @param {Object} item 物品信息
 * @returns {Object} 添加后的物品（含ID）
 */
function addItem(item) {
  try {
    const items = getAllItems();
    const newItem = {
      ...item,
      id: generateId('item'),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    items.push(newItem);
    wx.setStorageSync(STORAGE_KEYS.ITEMS, items);
    return newItem;
  } catch (e) {
    console.error('addItem error:', e);
    return null;
  }
}

/**
 * 更新物品
 * @param {string} id 物品ID
 * @param {Object} updates 更新的字段
 * @returns {Object|null} 更新后的物品
 */
function updateItem(id, updates) {
  try {
    const items = getAllItems();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: Date.now()
    };
    wx.setStorageSync(STORAGE_KEYS.ITEMS, items);
    return items[index];
  } catch (e) {
    console.error('updateItem error:', e);
    return null;
  }
}

/**
 * 删除物品
 * @param {string} id 物品ID
 * @returns {boolean} 是否成功
 */
function deleteItem(id) {
  try {
    const items = getAllItems();
    const newItems = items.filter(item => item.id !== id);
    wx.setStorageSync(STORAGE_KEYS.ITEMS, newItems);
    return true;
  } catch (e) {
    console.error('deleteItem error:', e);
    return false;
  }
}

/**
 * 搜索物品
 * @param {string} keyword 关键词
 * @returns {Array} 匹配的物品列表
 */
function searchItems(keyword) {
  const items = getAllItems();
  if (!keyword || !keyword.trim()) return items;
  
  const lowerKeyword = keyword.toLowerCase().trim();
  return items.filter(item => {
    const name = (item.name || '').toLowerCase();
    const description = (item.description || '').toLowerCase();
    const tags = (item.tags || []).join(' ').toLowerCase();
    
    return name.includes(lowerKeyword) ||
           description.includes(lowerKeyword) ||
           tags.includes(lowerKeyword);
  });
}

// ============================================
// 位置存储 (locations)
// ============================================

/**
 * 获取位置树
 * @returns {Array} 位置树结构
 */
function getLocations() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.LOCATIONS) || [];
  } catch (e) {
    console.error('getLocations error:', e);
    return [];
  }
}

/**
 * 添加房间
 * @param {string} name 房间名称
 * @returns {Object} 添加后的房间
 */
function addRoom(name) {
  try {
    const locations = getLocations();
    const newRoom = {
      id: generateId('room'),
      name: name,
      type: 'room',
      furniture: [],
      createdAt: Date.now()
    };
    locations.push(newRoom);
    wx.setStorageSync(STORAGE_KEYS.LOCATIONS, locations);
    return newRoom;
  } catch (e) {
    console.error('addRoom error:', e);
    return null;
  }
}

/**
 * 添加家具
 * @param {string} roomId 房间ID
 * @param {string} name 家具名称
 * @returns {Object|null} 添加后的家具
 */
function addFurniture(roomId, name) {
  try {
    const locations = getLocations();
    const room = locations.find(loc => loc.id === roomId);
    if (!room) return null;
    
    const newFurniture = {
      id: generateId('furniture'),
      name: name,
      type: 'furniture',
      roomId: roomId,
      boxes: [],
      createdAt: Date.now()
    };
    
    if (!room.furniture) {
      room.furniture = [];
    }
    room.furniture.push(newFurniture);
    wx.setStorageSync(STORAGE_KEYS.LOCATIONS, locations);
    return newFurniture;
  } catch (e) {
    console.error('addFurniture error:', e);
    return null;
  }
}

/**
 * 添加箱子
 * @param {string} furnitureId 家具ID
 * @param {string} name 箱子名称
 * @returns {Object|null} 添加后的箱子
 */
function addBox(furnitureId, name) {
  try {
    const locations = getLocations();
    
    // 查找家具所在的房间
    for (const room of locations) {
      if (!room.furniture) continue;
      
      const furniture = room.furniture.find(f => f.id === furnitureId);
      if (furniture) {
        const newBox = {
          id: generateId('box'),
          name: name,
          type: 'box',
          furnitureId: furnitureId,
          roomId: room.id,
          createdAt: Date.now()
        };
        
        if (!furniture.boxes) {
          furniture.boxes = [];
        }
        furniture.boxes.push(newBox);
        wx.setStorageSync(STORAGE_KEYS.LOCATIONS, locations);
        return newBox;
      }
    }
    
    return null;
  } catch (e) {
    console.error('addBox error:', e);
    return null;
  }
}

/**
 * 删除房间
 * @param {string} roomId 房间ID
 * @returns {boolean} 是否成功
 */
function deleteRoom(roomId) {
  try {
    const locations = getLocations();
    const newLocations = locations.filter(loc => loc.id !== roomId);
    wx.setStorageSync(STORAGE_KEYS.LOCATIONS, newLocations);
    return true;
  } catch (e) {
    console.error('deleteRoom error:', e);
    return false;
  }
}

/**
 * 删除家具
 * @param {string} furnitureId 家具ID
 * @returns {boolean} 是否成功
 */
function deleteFurniture(furnitureId) {
  try {
    const locations = getLocations();
    
    for (const room of locations) {
      if (!room.furniture) continue;
      const index = room.furniture.findIndex(f => f.id === furnitureId);
      if (index !== -1) {
        room.furniture.splice(index, 1);
        wx.setStorageSync(STORAGE_KEYS.LOCATIONS, locations);
        return true;
      }
    }
    
    return false;
  } catch (e) {
    console.error('deleteFurniture error:', e);
    return false;
  }
}

/**
 * 删除箱子
 * @param {string} boxId 箱子ID
 * @returns {boolean} 是否成功
 */
function deleteBox(boxId) {
  try {
    const locations = getLocations();
    
    for (const room of locations) {
      if (!room.furniture) continue;
      
      for (const furniture of room.furniture) {
        if (!furniture.boxes) continue;
        
        const index = furniture.boxes.findIndex(b => b.id === boxId);
        if (index !== -1) {
          furniture.boxes.splice(index, 1);
          wx.setStorageSync(STORAGE_KEYS.LOCATIONS, locations);
          return true;
        }
      }
    }
    
    return false;
  } catch (e) {
    console.error('deleteBox error:', e);
    return false;
  }
}

// ============================================
// 分类存储 (categories)
// ============================================

/**
 * 获取默认分类
 * @returns {Array} 默认分类列表
 */
function getDefaultCategories() {
  return [...DEFAULT_CATEGORIES];
}

/**
 * 获取所有分类（默认 + 自定义）
 * @returns {Array} 所有分类列表
 */
function getAllCategories() {
  try {
    const customCategories = wx.getStorageSync(STORAGE_KEYS.CATEGORIES) || [];
    return [...DEFAULT_CATEGORIES, ...customCategories];
  } catch (e) {
    console.error('getAllCategories error:', e);
    return [...DEFAULT_CATEGORIES];
  }
}

/**
 * 添加自定义分类
 * @param {string} name 分类名称
 * @param {string} icon 分类图标（可选）
 * @returns {Object} 添加后的分类
 */
function addCategory(name, icon = '📦') {
  try {
    const categories = wx.getStorageSync(STORAGE_KEYS.CATEGORIES) || [];
    const newCategory = {
      id: generateId('cat'),
      name: name,
      icon: icon,
      isCustom: true,
      createdAt: Date.now()
    };
    categories.push(newCategory);
    wx.setStorageSync(STORAGE_KEYS.CATEGORIES, categories);
    return newCategory;
  } catch (e) {
    console.error('addCategory error:', e);
    return null;
  }
}

/**
 * 删除自定义分类
 * @param {string} categoryId 分类ID
 * @returns {boolean} 是否成功
 */
function deleteCategory(categoryId) {
  try {
    const categories = wx.getStorageSync(STORAGE_KEYS.CATEGORIES) || [];
    const newCategories = categories.filter(cat => cat.id !== categoryId);
    wx.setStorageSync(STORAGE_KEYS.CATEGORIES, newCategories);
    return true;
  } catch (e) {
    console.error('deleteCategory error:', e);
    return false;
  }
}

// ============================================
// 导出模块
// ============================================

module.exports = {
  // 物品存储
  getAllItems,
  getItem,
  addItem,
  updateItem,
  deleteItem,
  searchItems,
  
  // 位置存储
  getLocations,
  addRoom,
  addFurniture,
  addBox,
  deleteRoom,
  deleteFurniture,
  deleteBox,
  
  // 分类存储
  getDefaultCategories,
  getAllCategories,
  addCategory,
  deleteCategory,
  
  // 工具函数
  generateId,
  STORAGE_KEYS
};
