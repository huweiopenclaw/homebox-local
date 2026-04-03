// pages/add-item/add-item.js
const storage = require('../../utils/storage')

Page({
  data: {
    // 表单数据
    name: '',
    categoryIndex: -1,
    quantity: 1,
    roomIndex: -1,
    furnitureIndex: -1,
    boxIndex: -1,
    photos: [],
    remark: '',
    locationText: '',
    saving: false,

    // 分类选项 - 从 storage 获取
    categories: [],
    
    // 位置数据 - 从 storage 动态获取
    locations: [],      // 完整位置树
    rooms: [],          // 房间列表
    furnitures: [],     // 当前房间的家具列表
    boxes: [],          // 当前家具的箱子列表
    
    // 选中的位置ID
    selectedRoomId: '',
    selectedFurnitureId: '',
    selectedBoxId: '',
    
    // 是否有自定义位置
    hasCustomLocations: false
  },

  onLoad(options) {
    this.loadCategories()
    this.loadLocations()
    
    // 如果有传入的分类参数，预设分类
    if (options.category) {
      const index = this.data.categories.findIndex(c => c.name === options.category)
      if (index >= 0) {
        this.setData({ categoryIndex: index })
      }
    }
  },

  onShow() {
    // 每次显示时刷新位置数据
    this.loadLocations()
  },

  // 加载分类
  loadCategories() {
    const categories = storage.getAllCategories()
    this.setData({ 
      categories: categories,
      categoryNames: categories.map(c => c.name)
    })
  },

  // 加载位置数据
  loadLocations() {
    const locations = storage.getLocations()
    const hasCustomLocations = locations && locations.length > 0
    
    // 提取房间列表
    const rooms = locations.map(room => ({
      id: room.id,
      name: room.name
    }))
    
    this.setData({ 
      locations, 
      rooms,
      hasCustomLocations
    })
  },

  // 物品名称输入
  onNameInput(e) {
    this.setData({ name: e.detail.value })
  },

  // 分类选择
  onCategoryChange(e) {
    const index = parseInt(e.detail.value)
    this.setData({ categoryIndex: index })
  },

  // 数量输入
  onQuantityInput(e) {
    let value = parseInt(e.detail.value) || 1
    if (value < 1) value = 1
    if (value > 9999) value = 9999
    this.setData({ quantity: value })
  },

  // 数量减少
  onQuantityMinus() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 })
    }
  },

  // 数量增加
  onQuantityPlus() {
    if (this.data.quantity < 9999) {
      this.setData({ quantity: this.data.quantity + 1 })
    }
  },

  // 房间选择
  onRoomChange(e) {
    const index = parseInt(e.detail.value)
    const room = this.data.locations[index]
    
    // 获取该房间的家具列表
    const furnitures = (room.furniture || []).map(f => ({
      id: f.id,
      name: f.name,
      boxes: f.boxes || []
    }))
    
    this.setData({
      roomIndex: index,
      selectedRoomId: room.id,
      furnitures: furnitures,
      furnitureIndex: -1,
      boxIndex: -1,
      boxes: [],
      selectedFurnitureId: '',
      selectedBoxId: '',
      locationText: room.name
    })
  },

  // 家具选择
  onFurnitureChange(e) {
    const index = parseInt(e.detail.value)
    const furniture = this.data.furnitures[index]
    const room = this.data.locations[this.data.roomIndex]
    
    // 获取该家具的箱子列表
    const boxes = (furniture.boxes || []).map(b => ({
      id: b.id,
      name: b.name
    }))
    
    this.setData({
      furnitureIndex: index,
      selectedFurnitureId: furniture.id,
      boxes: boxes,
      boxIndex: -1,
      selectedBoxId: '',
      locationText: `${room.name} → ${furniture.name}`
    })
  },

  // 箱子选择
  onBoxChange(e) {
    const index = parseInt(e.detail.value)
    const box = this.data.boxes[index]
    const room = this.data.locations[this.data.roomIndex]
    const furniture = this.data.furnitures[this.data.furnitureIndex]
    
    this.setData({
      boxIndex: index,
      selectedBoxId: box.id,
      locationText: `${room.name} → ${furniture.name} → ${box.name}`
    })
  },

  // 跳转到位置管理
  onGoToLocation() {
    wx.navigateTo({
      url: '/pages/location/location'
    })
  },

  // 拍照
  onTakePhoto() {
    const remaining = 9 - this.data.photos.length
    if (remaining <= 0) {
      wx.showToast({ title: '最多添加9张照片', icon: 'none' })
      return
    }

    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        const newPhotos = res.tempFiles.map(file => file.tempFilePath)
        this.setData({ photos: [...this.data.photos, ...newPhotos] })
      }
    })
  },

  // 删除照片
  onDeletePhoto(e) {
    const index = e.currentTarget.dataset.index
    const photos = this.data.photos.filter((_, i) => i !== index)
    this.setData({ photos })
  },

  // 预览照片
  onPreviewPhoto(e) {
    const index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.photos[index],
      urls: this.data.photos
    })
  },

  // 备注输入
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  // 表单验证
  validateForm() {
    const { name, categoryIndex, roomIndex, furnitureIndex } = this.data
    
    if (!name.trim()) {
      wx.showToast({ title: '请输入物品名称', icon: 'none' })
      return false
    }
    
    if (categoryIndex < 0) {
      wx.showToast({ title: '请选择分类', icon: 'none' })
      return false
    }
    
    // 位置选择改为可选
    // if (roomIndex < 0) {
    //   wx.showToast({ title: '请选择房间', icon: 'none' })
    //   return false
    // }
    
    return true
  },

  // 保存物品
  onSave() {
    if (!this.validateForm()) return
    if (this.data.saving) return

    this.setData({ saving: true })

    const { name, categories, categoryIndex, quantity, locations, roomIndex, 
            furnitures, furnitureIndex, boxes, boxIndex, photos, remark, 
            locationText, selectedRoomId, selectedFurnitureId, selectedBoxId } = this.data

    // 构建物品数据
    const item = {
      id: Date.now().toString(),
      name: name.trim(),
      category: categories[categoryIndex].name,
      quantity: quantity,
      location: locationText || '未设置',
      roomId: selectedRoomId || '',
      room: roomIndex >= 0 ? locations[roomIndex].name : '',
      furnitureId: selectedFurnitureId || '',
      furniture: furnitureIndex >= 0 ? furnitures[furnitureIndex].name : '',
      boxId: selectedBoxId || '',
      box: boxIndex >= 0 ? boxes[boxIndex].name : '',
      photos: photos,
      remark: remark.trim(),
      createdAt: new Date().toISOString(),
      date: this.formatDate(new Date())
    }

    // 使用 storage 保存
    try {
      storage.addItem(item)
      
      wx.showToast({ title: '保存成功', icon: 'success', duration: 1500 })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)

    } catch (err) {
      console.error('保存失败', err)
      wx.showToast({ title: '保存失败，请重试', icon: 'none' })
      this.setData({ saving: false })
    }
  },

  // 取消
  onCancel() {
    const { name, categoryIndex, photos, remark } = this.data
    
    if (name || categoryIndex >= 0 || photos.length > 0 || remark) {
      wx.showModal({
        title: '提示',
        content: '确定要放弃编辑吗？',
        success: (res) => {
          if (res.confirm) wx.navigateBack()
        }
      })
    } else {
      wx.navigateBack()
    }
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
})
