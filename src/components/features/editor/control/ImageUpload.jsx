import React, { useCallback, useState } from 'react'
import { Image as ImageIcon, Upload, X } from 'lucide-react'
import ToolbarButton from '@/components/common/ToolbarButton'

const ImageUpload = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')
  const [imageUrl, setImageUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const addImage = (url) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
      setIsOpen(false)
      setImageUrl('')
    }
  }

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File ảnh không được vượt quá 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target.result
        addImage(dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }, [editor])

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File ảnh không được vượt quá 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target.result
        addImage(dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = (e) => {
    e.preventDefault()
    if (imageUrl.trim()) {
      addImage(imageUrl.trim())
    }
  }

  return (
    <>
      <ToolbarButton 
        onClick={() => setIsOpen(true)}
        label="Chèn hình ảnh"
        icon={ImageIcon}
      />

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative bg-white rounded-lg w-full max-w-md p-6 shadow-xl transform transition-all duration-300 scale-100 opacity-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Thêm hình ảnh</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex space-x-2 mb-6">
              {['upload', 'url'].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'upload' ? 'Upload ảnh' : 'URL ảnh'}
                </button>
              ))}
            </div>

            <div className="p-2">
              {activeTab === 'upload' ? (
                <div 
                  className={`space-y-4 transition-all duration-200 ${isDragging ? 'scale-105' : 'scale-100'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <label 
                    htmlFor="image-upload"
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                      isDragging 
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <Upload className={`h-8 w-8 mb-3 transition-colors duration-200 ${
                        isDragging ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <p className="text-sm text-gray-600 font-medium mb-1">
                        Kéo thả ảnh vào đây hoặc click để chọn
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF (Max: 5MB)
                      </p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              ) : (
                <form onSubmit={handleUrlSubmit} className="space-y-5">
                  <div>
                    <label 
                      htmlFor="image-url" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      URL hình ảnh
                    </label>
                    <input
                      id="image-url"
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!imageUrl.trim()}
                    className="w-full px-4 py-2.5 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Chèn ảnh
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ImageUpload