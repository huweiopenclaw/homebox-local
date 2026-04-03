// pages/backup/backup.js
const storage = require('../../utils/storage')

Page({
  data: {
    exporting: false,
    importing: false,
    lastBackupTime: '',
    itemCount: 0,
    locationCount: 0
  },

  onLoad() {
    this.loadStats()
  },

  onShow() {
    this.loadStats()
  },

  loadStats() {
    const items = storage.getAllItems()
    const locations = storage.getLocations()
    const lastBackup = wx.getStorageSync('lastBackupTime')
    
    this.setData({
      itemCount: items.length,
      locationCount: locations.length,
      lastBackupTime: lastBackup ? this.formatDate(new Date(lastBackup)) : '从未备份'
    })
  },

  formatDate(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const h = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${min}`
  },

  // 导出数据
  async onExport() {
    if (this.data.exporting) return
    
    this.setData({ exporting: true })
    
    try {
      const items = storage.getAllItems()
      const locations = storage.getLocations()
      const categories = wx.getStorageSync('homebox_categories') || []
      
      const backupData = {
        version: '1.0',
        exportTime: new Date().toISOString(),
        data: {
          items,
          locations,
          categories
        }
      }
      
      const jsonStr = JSON.stringify(backupData, null, 2)
      const fileName = `homebox_backup_${Date.now()}.json`
      
      // 保存到临时文件
      const fs = wx.getFileSystemManager()
      const tempPath = `${wx.env.USER_DATA_PATH}/${fileName}`
      
      fs.writeFileSync(tempPath, jsonStr, 'utf8')
      
      // 保存到相册/文件
      wx.saveFile({
        tempFilePath: tempPath,
        success: (res) => {
          wx.setStorageSync('lastBackupTime', Date.now())
          this.setData({ lastBackupTime: this.formatDate(new Date()) })
          
          wx.showModal({
            title: '导出成功',
            content: `已导出 ${items.length} 个物品和 ${locations.length} 个位置数据。\n文件已保存。`,
            showCancel: false
          })
        },
        fail: (err) => {
          // 尝试分享方式
          wx.shareFileMessage({
            filePath: tempPath,
            success: () => {
              wx.setStorageSync('lastBackupTime', Date.now())
              this.setData({ lastBackupTime: this.formatDate(new Date()) })
            },
            fail: () => {
              wx.showToast({ title: '导出失败', icon: 'none' })
            }
          })
        }
      })
      
    } catch (error) {
      wx.showToast({ title: '导出失败: ' + error.message, icon: 'none' })
    } finally {
      this.setData({ exporting: false })
    }
  },

  // 导入数据
  onImport() {
    if (this.data.importing) return
    
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['json'],
      success: (res) => {
        const filePath = res.tempFiles[0].path
        this.importFromFile(filePath)
      },
      fail: () => {
        // 尝试其他方式
        wx.chooseFile({
          count: 1,
          type: 'file',
          extension: ['json'],
          success: (res) => {
            this.importFromFile(res.tempFilePath)
          }
        })
      }
    })
  },

  importFromFile(filePath) {
    this.setData({ importing: true })
    
    try {
      const fs = wx.getFileSystemManager()
      const content = fs.readFileSync(filePath, 'utf8')
      const backupData = JSON.parse(content)
      
      // 验证格式
      if (!backupData.data || !backupData.version) {
        throw new Error('无效的备份文件格式')
      }
      
      wx.showModal({
        title: '确认导入',
        content: `将导入 ${backupData.data.items?.length || 0} 个物品和 ${backupData.data.locations?.length || 0} 个位置。\n\n注意：这将覆盖现有数据！`,
        confirmText: '导入',
        confirmColor: '#FF6B35',
        success: (modalRes) => {
          if (modalRes.confirm) {
            this.doImport(backupData)
          } else {
            this.setData({ importing: false })
          }
        }
      })
      
    } catch (error) {
      wx.showToast({ title: '读取文件失败', icon: 'none' })
      this.setData({ importing: false })
    }
  },

  doImport(backupData) {
    try {
      // 导入物品
      if (backupData.data.items) {
        wx.setStorageSync('homebox_items', backupData.data.items)
      }
      
      // 导入位置
      if (backupData.data.locations) {
        wx.setStorageSync('homebox_locations', backupData.data.locations)
      }
      
      // 导入分类
      if (backupData.data.categories) {
        wx.setStorageSync('homebox_categories', backupData.data.categories)
      }
      
      wx.showToast({ title: '导入成功', icon: 'success' })
      this.loadStats()
      
    } catch (error) {
      wx.showToast({ title: '导入失败', icon: 'none' })
    } finally {
      this.setData({ importing: false })
    }
  },

  // 复制数据到剪贴板
  onCopyToClipboard() {
    const items = storage.getAllItems()
    const locations = storage.getLocations()
    
    const text = `HomeBox 数据备份\n时间: ${new Date().toLocaleString()}\n物品数: ${items.length}\n位置数: ${locations.length}\n\n数据:\n${JSON.stringify({ items, locations }, null, 2)}`
    
    wx.setClipboardData({
      data: text.substring(0, 10000), // 限制长度
      success: () => {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' })
      }
    })
  },

  // 清空数据
  onClearData() {
    wx.showModal({
      title: '危险操作',
      content: '确定要清空所有数据吗？此操作不可恢复！',
      confirmText: '清空',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('homebox_items')
          wx.removeStorageSync('homebox_locations')
          wx.removeStorageSync('homebox_categories')
          
          wx.showToast({ title: '已清空', icon: 'success' })
          this.loadStats()
        }
      }
    })
  }
})
