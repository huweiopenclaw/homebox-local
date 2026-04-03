// pages/ai-scan/ai-scan.js
const aiRecognition = require('../../utils/ai-recognition')
const aiConfig = require('../../utils/ai-config')
const storage = require('../../utils/storage')

Page({
  data: {
    hasPhoto: false,
    photoPath: '',
    recognizing: false,
    recognizedItems: [],
    selectedItems: [],
    locationId: '',
    locationText: '请选择位置',
    locations: [],
    locationIndex: -1,
    saving: false,
    error: ''
  },

  onLoad() {
    this.loadLocations()
    this.checkConfig()
  },

  checkConfig() {
    if (!aiConfig.isConfigured()) {
      wx.showModal({
        title: '提示',
        content: '请先配置 AI 识别服务',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/ai-settings/ai-settings'
            })
          } else {
            wx.navigateBack()
          }
        }
      })
    }
  },

  loadLocations() {
    const locations = storage.getLocations()
    // 展开为扁平列表
    const flatLocations = []
    locations.forEach(room => {
      if (room.furniture) {
        room.furniture.forEach(furniture => {
          if (furniture.boxes && furniture.boxes.length > 0) {
            furniture.boxes.forEach(box => {
              flatLocations.push({
                id: box.id,
                text: `${room.name} → ${furniture.name} → ${box.name}`
              })
            })
          } else {
            flatLocations.push({
              id: furniture.id,
              text: `${room.name} → ${furniture.name}`
            })
          }
        })
      }
    })
    this.setData({ locations: flatLocations })
  },

  // 拍照
  onTakePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        const photoPath = res.tempFiles[0].tempFilePath
        this.setData({
          hasPhoto: true,
          photoPath,
          recognizedItems: [],
          selectedItems: [],
          error: ''
        })
      }
    })
  },

  // 重新拍照
  onRetake() {
    this.setData({
      hasPhoto: false,
      photoPath: '',
      recognizedItems: [],
      selectedItems: [],
      error: ''
    })
  },

  // 开始识别
  async onStartRecognize() {
    if (!this.data.photoPath) {
      wx.showToast({ title: '请先拍照', icon: 'none' })
      return
    }

    this.setData({ recognizing: true, error: '' })

    try {
      const items = await aiRecognition.recognizeItems(this.data.photoPath)
      
      if (items.length === 0) {
        this.setData({
          recognizing: false,
          error: '未能识别到物品，请尝试重新拍照'
        })
        return
      }

      // 默认全选
      const selectedItems = items.map(item => item.id)

      this.setData({
        recognizing: false,
        recognizedItems: items,
        selectedItems
      })

      wx.showToast({ title: `识别到 ${items.length} 个物品`, icon: 'success' })

    } catch (error) {
      this.setData({
        recognizing: false,
        error: error.message
      })
      wx.showToast({ title: error.message, icon: 'none' })
    }
  },

  // 选择/取消选择物品
  onToggleItem(e) {
    const itemId = e.currentTarget.dataset.id
    let selectedItems = [...this.data.selectedItems]
    const index = selectedItems.indexOf(itemId)
    
    if (index >= 0) {
      selectedItems.splice(index, 1)
    } else {
      selectedItems.push(itemId)
    }
    
    this.setData({ selectedItems })
  },

  // 全选/取消全选
  onToggleAll() {
    if (this.data.selectedItems.length === this.data.recognizedItems.length) {
      this.setData({ selectedItems: [] })
    } else {
      this.setData({
        selectedItems: this.data.recognizedItems.map(item => item.id)
      })
    }
  },

  // 编辑物品
  onEditItem(e) {
    const itemId = e.currentTarget.dataset.id
    const item = this.data.recognizedItems.find(i => i.id === itemId)
    
    wx.showModal({
      title: '编辑物品',
      editable: true,
      placeholderText: '物品名称',
      content: item.name,
      success: (res) => {
        if (res.confirm && res.content) {
          const recognizedItems = this.data.recognizedItems.map(i => {
            if (i.id === itemId) {
              return { ...i, name: res.content }
            }
            return i
          })
          this.setData({ recognizedItems })
        }
      }
    })
  },

  // 选择位置
  onLocationChange(e) {
    const index = parseInt(e.detail.value)
    const location = this.data.locations[index]
    this.setData({
      locationIndex: index,
      locationId: location.id,
      locationText: location.text
    })
  },

  // 保存选中物品
  async onSaveItems() {
    const { selectedItems, recognizedItems, locationId, locationText } = this.data

    if (selectedItems.length === 0) {
      wx.showToast({ title: '请选择要保存的物品', icon: 'none' })
      return
    }

    this.setData({ saving: true })

    try {
      const itemsToSave = recognizedItems.filter(item => selectedItems.includes(item.id))
      
      let savedCount = 0
      itemsToSave.forEach(item => {
        const newItem = {
          id: Date.now().toString() + '_' + savedCount,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          description: item.description,
          locationId: locationId,
          location: locationText,
          photos: [this.data.photoPath],
          tags: ['AI识别'],
          createdAt: new Date().toISOString(),
          date: this.formatDate(new Date())
        }
        storage.addItem(newItem)
        savedCount++
      })

      wx.showToast({ title: `已保存 ${savedCount} 个物品`, icon: 'success' })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)

    } catch (error) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      this.setData({ saving: false })
    }
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  // 跳转设置
  onGoSettings() {
    wx.navigateTo({
      url: '/pages/ai-settings/ai-settings'
    })
  }
})
