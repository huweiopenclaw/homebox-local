// pages/location/location.js
const storage = require('../../utils/storage')

Page({
  data: {
    locations: [],
    showAddModal: false,
    addType: '', // room, furniture, box
    parentId: null,
    inputValue: ''
  },

  onLoad() {
    this.loadLocations()
  },

  onShow() {
    this.loadLocations()
  },

  loadLocations() {
    const locations = storage.getLocations()
    this.setData({ locations })
  },

  // 添加房间
  onAddRoom() {
    this.setData({ showAddModal: true, addType: 'room', parentId: null, inputValue: '' })
  },

  // 添加家具
  onAddFurniture(e) {
    const roomId = e.currentTarget.dataset.id
    this.setData({ showAddModal: true, addType: 'furniture', parentId: roomId, inputValue: '' })
  },

  // 添加箱子
  onAddBox(e) {
    const furnitureId = e.currentTarget.dataset.id
    this.setData({ showAddModal: true, addType: 'box', parentId: furnitureId, inputValue: '' })
  },

  // 输入变化
  onInputChange(e) {
    this.setData({ inputValue: e.detail.value })
  },

  // 确认添加
  onConfirmAdd() {
    const { addType, parentId, inputValue } = this.data
    if (!inputValue.trim()) {
      wx.showToast({ title: '请输入名称', icon: 'none' })
      return
    }

    if (addType === 'room') {
      storage.addRoom(inputValue)
    } else if (addType === 'furniture') {
      storage.addFurniture(parentId, inputValue)
    } else if (addType === 'box') {
      storage.addBox(parentId, inputValue)
    }

    this.setData({ showAddModal: false })
    this.loadLocations()
    wx.showToast({ title: '添加成功', icon: 'success' })
  },

  // 取消添加
  onCancelAdd() {
    this.setData({ showAddModal: false })
  },

  // 删除位置
  onDelete(e) {
    const { id, type } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除吗？',
      success: (res) => {
        if (res.confirm) {
          if (type === 'room') storage.deleteRoom(id)
          else if (type === 'furniture') storage.deleteFurniture(id)
          else if (type === 'box') storage.deleteBox(id)
          this.loadLocations()
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  },

  // 展开收起
  onToggle(e) {
    const { id } = e.currentTarget.dataset
    const locations = this.data.locations.map(room => {
      if (room.id === id) {
        room.expanded = !room.expanded
      }
      if (room.furniture) {
        room.furniture = room.furniture.map(f => {
          if (f.id === id) {
            f.expanded = !f.expanded
          }
          return f
        })
      }
      return room
    })
    this.setData({ locations })
  }
})
