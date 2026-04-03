// pages/batch-edit/batch-edit.js
const storage = require('../../utils/storage')

Page({
  data: {
    items: [],
    selectedItems: [],
    isEditMode: false,
    selectAll: false,
    loading: true,
    
    // 批量操作选项
    showActionSheet: false,
    actions: [
      { name: '批量删除', icon: '🗑️', action: 'delete' },
      { name: '批量移动', icon: '📍', action: 'move' },
      { name: '批量修改分类', icon: '📂', action: 'category' },
      { name: '取消选择', icon: '❌', action: 'cancel' }
    ],
    
    // 移动位置选择
    showMovePicker: false,
    locations: [],
    rooms: [],
    selectedRoomIndex: -1,
    selectedFurnitureIndex: -1,
    selectedBoxIndex: -1,
    furnitures: [],
    boxes: [],
    
    // 分类选择
    showCategoryPicker: false,
    categories: [],
    selectedCategoryIndex: -1
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const items = storage.getAllItems()
    const locations = storage.getLocations()
    const categories = storage.getAllCategories()
    
    // 提取房间列表
    const rooms = locations.map(loc => ({
      id: loc.id,
      name: loc.name,
      furniture: loc.furniture || []
    }))
    
    this.setData({
      items,
      locations,
      rooms,
      categories,
      loading: false
    })
  },

  // 进入/退出编辑模式
  toggleEditMode() {
    const isEditMode = !this.data.isEditMode
    this.setData({
      isEditMode,
      selectedItems: isEditMode ? this.data.selectedItems : [],
      selectAll: false
    })
  },

  // 选择/取消选择物品
  toggleItem(e) {
    const id = e.currentTarget.dataset.id
    let selectedItems = [...this.data.selectedItems]
    const index = selectedItems.indexOf(id)
    
    if (index >= 0) {
      selectedItems.splice(index, 1)
    } else {
      selectedItems.push(id)
    }
    
    const selectAll = selectedItems.length === this.data.items.length
    
    this.setData({ selectedItems, selectAll })
  },

  // 全选/取消全选
  toggleSelectAll() {
    if (this.data.selectAll) {
      this.setData({ selectedItems: [], selectAll: false })
    } else {
      const allIds = this.data.items.map(item => item.id)
      this.setData({ selectedItems: allIds, selectAll: true })
    }
  },

  // 显示操作菜单
  showActions() {
    if (this.data.selectedItems.length === 0) {
      wx.showToast({ title: '请先选择物品', icon: 'none' })
      return
    }
    this.setData({ showActionSheet: true })
  },

  hideActions() {
    this.setData({ showActionSheet: false })
  },

  // 执行操作
  onActionTap(e) {
    const action = e.currentTarget.dataset.action
    this.setData({ showActionSheet: false })
    
    switch (action) {
      case 'delete':
        this.batchDelete()
        break
      case 'move':
        this.showMovePicker()
        break
      case 'category':
        this.showCategoryPicker()
        break
      case 'cancel':
        this.setData({ selectedItems: [], selectAll: false })
        break
    }
  },

  // 批量删除
  batchDelete() {
    const count = this.data.selectedItems.length
    wx.showModal({
      title: '确认删除',
      content: `确定要删除选中的 ${count} 个物品吗？`,
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          this.data.selectedItems.forEach(id => {
            storage.deleteItem(id)
          })
          
          wx.showToast({ title: `已删除 ${count} 个物品`, icon: 'success' })
          
          this.setData({
            selectedItems: [],
            selectAll: false,
            isEditMode: false
          })
          
          this.loadData()
        }
      }
    })
  },

  // 显示位置选择器
  showMovePicker() {
    this.setData({ showMovePicker: true })
  },

  hideMovePicker() {
    this.setData({ showMovePicker: false })
  },

  onRoomChange(e) {
    const index = parseInt(e.detail.value)
    const room = this.data.rooms[index]
    const furnitures = room.furniture || []
    
    this.setData({
      selectedRoomIndex: index,
      furnitures,
      selectedFurnitureIndex: -1,
      selectedBoxIndex: -1,
      boxes: []
    })
  },

  onFurnitureChange(e) {
    const index = parseInt(e.detail.value)
    const furniture = this.data.furnitures[index]
    const boxes = furniture.boxes || []
    
    this.setData({
      selectedFurnitureIndex: index,
      boxes,
      selectedBoxIndex: -1
    })
  },

  onBoxChange(e) {
    const index = parseInt(e.detail.value)
    this.setData({ selectedBoxIndex: index })
  },

  // 确认移动
  confirmMove() {
    const { selectedRoomIndex, selectedFurnitureIndex, selectedBoxIndex, rooms, furnitures, boxes, selectedItems } = this.data
    
    if (selectedRoomIndex < 0) {
      wx.showToast({ title: '请选择房间', icon: 'none' })
      return
    }
    
    // 构建位置文本
    let locationText = rooms[selectedRoomIndex].name
    if (selectedFurnitureIndex >= 0) {
      locationText += ` → ${furnitures[selectedFurnitureIndex].name}`
    }
    if (selectedBoxIndex >= 0) {
      locationText += ` → ${boxes[selectedBoxIndex].name}`
    }
    
    // 批量更新
    selectedItems.forEach(id => {
      storage.updateItem(id, {
        location: locationText,
        room: rooms[selectedRoomIndex].name,
        furniture: selectedFurnitureIndex >= 0 ? furnitures[selectedFurnitureIndex].name : '',
        box: selectedBoxIndex >= 0 ? boxes[selectedBoxIndex].name : ''
      })
    })
    
    wx.showToast({ title: `已移动 ${selectedItems.length} 个物品`, icon: 'success' })
    
    this.setData({
      showMovePicker: false,
      selectedItems: [],
      selectAll: false,
      isEditMode: false
    })
    
    this.loadData()
  },

  // 显示分类选择器
  showCategoryPicker() {
    this.setData({ showCategoryPicker: true })
  },

  hideCategoryPicker() {
    this.setData({ showCategoryPicker: false })
  },

  onCategoryChange(e) {
    const index = parseInt(e.detail.value)
    this.setData({ selectedCategoryIndex: index })
  },

  // 确认修改分类
  confirmCategory() {
    const { selectedCategoryIndex, categories, selectedItems } = this.data
    
    if (selectedCategoryIndex < 0) {
      wx.showToast({ title: '请选择分类', icon: 'none' })
      return
    }
    
    const categoryName = categories[selectedCategoryIndex].name
    
    // 批量更新
    selectedItems.forEach(id => {
      storage.updateItem(id, { category: categoryName })
    })
    
    wx.showToast({ title: `已修改 ${selectedItems.length} 个物品分类`, icon: 'success' })
    
    this.setData({
      showCategoryPicker: false,
      selectedItems: [],
      selectAll: false,
      isEditMode: false
    })
    
    this.loadData()
  },

  // 跳转详情
  onItemTap(e) {
    if (this.data.isEditMode) return
    
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  }
})
