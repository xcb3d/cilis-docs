import { Extension } from '@tiptap/core'

export const ZoomExtension = Extension.create({
  name: 'zoom',

  addStorage() {
    return {
      zoomLevel: 100,
      previousZoomLevel: 100, // Thêm previousZoomLevel
    }
  },

  addCommands() {
    return {
      setZoom: (zoomLevel) => ({ editor }) => {
        // Lưu giá trị zoom hiện tại vào previousZoomLevel
        editor.storage.zoom.previousZoomLevel = editor.storage.zoom.zoomLevel
        // Cập nhật zoomLevel mới
        editor.storage.zoom.zoomLevel = zoomLevel
        // Emit event để các component khác có thể lắng nghe
        editor.emit('zoom', { level: zoomLevel })
        return true
      },
    }
  },
})
