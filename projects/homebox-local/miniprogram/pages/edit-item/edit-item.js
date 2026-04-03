// pages/edit-item/edit-item.js
const storage = require('../../utils/storage')

Page({
  data: {
    item: null,
    categories: [],
    locations: [],
    selectedCategory: '',
    selectedLocation: '',
    name: '',
    quantity: 1,
    description: '',
    tags: ''
  },

  onLoad(options) {
    const id = options.id
    const item = storage.getItem(id)
    const categories = storage.getDefaultCategories()
    const locations = storage.getLocations()

    if (item) {
      this.setData({
        item,
        categories,
        locations,
        name: item.name,
        quantity: item.quantity || 1,
        selectedCategory: item.category,
        selectedLocation: item.locationId,
        description: item.description || '',
        tags: (item.tags || []).join(',')
      })
    }
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value })
  },

  onQuantityChange(e) {
    this.setData({ quantity: parseInt(e.detail.value) || 1 })
  },

  onDescriptionInput(e) {
    this.setData({ description: e.detail.value })
  },

  onTagsInput(e) {
    this.setData({ tags: e.detail.value })
  },

  onCategoryChange(e) {
    const index = e.detail.value
    this.setData({ selectedCategory: this.data.categories[index].name })
  },

  onLocationChange(e) {
    const index = e.detail.value
    this.setData({ selectedLocation: this.data.flatLocations[index].id })
  },

  onSave() {
    const { item, name, quantity, selectedCategory, selectedLocation, description, tags } = this.data

    if (!name.trim()) {
      wx.showToast({ title: '请输入物品名称', icon: 'none' })
      return
    }

    const updatedItem = {
      ...item,
      name: name.trim(),
      quantity,
      category: selectedCategory,
      locationId: selectedLocation,
      description: description.trim(),
      tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : []
    }

    storage.updateItem(item.id, updatedItem)
    wx.showToast({ title: '保存成功', icon: 'success' })
    
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  },

  onDelete() {
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteItem(this.data.item.id)
          wx.showToast({ title: '已删除', icon: 'success' })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      }
    })
  }
})
