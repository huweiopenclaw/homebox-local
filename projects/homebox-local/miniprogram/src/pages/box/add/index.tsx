import { View, Text, Input, Button } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { useBoxStore } from '../../stores/boxStore'
import './index.scss'

export default function AddBoxPage() {
  const { addBox } = useBoxStore()
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [photoPath, setPhotoPath] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleTakePhoto = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album']
      })
      setPhotoPath(res.tempFilePaths[0])
    } catch (error) {
      console.log('取消选择图片')
    }
  }
  
  const handleSubmit = async () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入箱子名称', icon: 'none' })
      return
    }
    
    setLoading(true)
    
    const box = {
      id: `box-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      locationId: undefined,
      photoPath,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    addBox(box)
    
    setLoading(false)
    Taro.showToast({ title: '保存成功', icon: 'success' })
    
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }
  
  return (
    <View className="add-box-page">
      {/* 照片区域 */}
      <View className="photo-section">
        {photoPath ? (
          <View className="photo-preview" onClick={handleTakePhoto}>
            <image src={photoPath} mode="aspectFill" className="preview-image" />
            <View className="photo-overlay">
              <Text className="change-text">点击更换</Text>
            </View>
          </View>
        ) : (
          <View className="photo-placeholder" onClick={handleTakePhoto}>
            <Text className="placeholder-icon">📷</Text>
            <Text className="placeholder-text">拍照记录箱子</Text>
          </View>
        )}
      </View>
      
      {/* 表单区域 */}
      <View className="form-section">
        <View className="form-item">
          <Text className="form-label">箱子名称 *</Text>
          <Input
            className="form-input"
            placeholder="例如：冬季衣物-1"
            value={name}
            onInput={e => setName(e.detail.value)}
          />
        </View>
        
        <View className="form-item">
          <Text className="form-label">存放位置</Text>
          <Input
            className="form-input"
            placeholder="例如：卧室衣柜第2层"
            value={location}
            onInput={e => setLocation(e.detail.value)}
          />
        </View>
        
        <View className="form-item">
          <Text className="form-label">备注</Text>
          <textarea
            className="form-textarea"
            placeholder="添加备注信息..."
            value={description}
            onInput={e => setDescription(e.detail.value)}
          />
        </View>
      </View>
      
      {/* AI 识别提示 */}
      <View className="ai-tip">
        <Text className="tip-icon">💡</Text>
        <Text className="tip-text">拍照后可以使用 AI 自动识别箱内物品</Text>
      </View>
      
      {/* 提交按钮 */}
      <View className="submit-section">
        <Button
          className="submit-btn"
          onClick={handleSubmit}
          loading={loading}
          disabled={!name.trim()}
        >
          保存箱子
        </Button>
      </View>
    </View>
  )
}

export definePageConfig({
  navigationBarTitleText: '记录箱子'
})
