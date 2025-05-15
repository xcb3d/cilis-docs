import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Search } from 'lucide-react'

const EMOJI_LIST = [
  { name: 'Cười', emoji: '😊', category: 'faces' },
  { name: 'Cười to', emoji: '😁', category: 'faces' },
  { name: 'Cười ra nước mắt', emoji: '😂', category: 'faces' },
  { name: 'Cười lăn', emoji: '🤣', category: 'faces' },
  { name: 'Nháy mắt', emoji: '😉', category: 'faces' },
  { name: 'Yêu', emoji: '😍', category: 'faces' },
  { name: 'Hôn', emoji: '😘', category: 'faces' },
  { name: 'Ngầu', emoji: '😎', category: 'faces' },
  { name: 'Cười đểu', emoji: '😏', category: 'faces' },
  { name: 'Suy nghĩ', emoji: '🤔', category: 'faces' },
  { name: 'Ôm', emoji: '🤗', category: 'faces' },
  { name: 'Ngáo', emoji: '🤪', category: 'faces' },
  { name: 'Buồn', emoji: '😢', category: 'faces' },
  { name: 'Tức giận', emoji: '😠', category: 'faces' },
  { name: 'Quỷ', emoji: '😈', category: 'faces' },
  { name: 'Hề', emoji: '🤡', category: 'faces' },
  { name: 'Trầm ngâm', emoji: '😔', category: 'faces' },
  { name: 'Lo lắng', emoji: '😟', category: 'faces' },
  { name: 'Khóc', emoji: '😭', category: 'faces' },
  { name: 'Hoảng sợ', emoji: '😱', category: 'faces' },
  { name: 'Ngủ gật', emoji: '😴', category: 'faces' },
  { name: 'Thèm thuồng', emoji: '🤤', category: 'faces' },
  { name: 'Mó mắt', emoji: '🤓', category: 'faces' },
  { name: 'Cao bồi', emoji: '🤠', category: 'faces' },
  { name: 'Ăn mừng', emoji: '🥳', category: 'faces' },
  { name: 'Cả trốn', emoji: '🥸', category: 'faces' },
  { name: 'Suỵt', emoji: '🤫', category: 'faces' },
  { name: 'Khóa miệng', emoji: '🤐', category: 'faces' },
  { name: 'Miệng tiền', emoji: '🤑', category: 'faces' },
  { name: 'Tim', emoji: '❤️', category: 'symbols' },
  { name: 'Tim cam', emoji: '🧡', category: 'symbols' },
  { name: 'Tim vàng', emoji: '💛', category: 'symbols' },
  { name: 'Tim xanh lá', emoji: '💚', category: 'symbols' },
  { name: 'Tim xanh dương', emoji: '💙', category: 'symbols' },
  { name: 'Tim tím', emoji: '💜', category: 'symbols' },
  { name: 'Tim đen', emoji: '🖤', category: 'symbols' },
  { name: 'Tim nâu', emoji: '🤎', category: 'symbols' },
  { name: 'Tim trắng', emoji: '🤍', category: 'symbols' },
  { name: 'Tim long lanh', emoji: '💖', category: 'symbols' },
  { name: 'Tim tan vỡ', emoji: '💔', category: 'symbols' },
  { name: 'Hai tay thành công', emoji: '🙌', category: 'gestures' },
  { name: 'Tay cầm quyền lực', emoji: '✊', category: 'gestures' },
  { name: 'Bông tỏa sáng', emoji: '⭐', category: 'symbols' },
  { name: 'Sao long lanh', emoji: '✨', category: 'symbols' },
  { name: 'Lửa', emoji: '🔥', category: 'nature' },
  { name: 'Tiệc tùng', emoji: '🎉', category: 'objects' },
  { name: 'Cúp', emoji: '🏆', category: 'objects' },
  { name: 'Huy chương', emoji: '🏅', category: 'objects' },
  { name: 'Bóng đèn', emoji: '💡', category: 'objects' },
  { name: 'Tên lửa', emoji: '🚀', category: 'objects' },
  { name: 'Quà', emoji: '🎁', category: 'objects' },
  { name: 'Vương miện', emoji: '👑', category: 'objects' },
  { name: 'Kim cương', emoji: '💎', category: 'objects' },
  { name: 'Tiền', emoji: '💰', category: 'objects' },
  { name: 'Dollar', emoji: '💵', category: 'objects' },
  { name: 'Thẻ tín dụng', emoji: '💳', category: 'objects' },
  { name: 'Hòa chuông', emoji: '🔔', category: 'objects' },
  { name: 'Khóa', emoji: '🔒', category: 'objects' },
  { name: 'Mở khóa', emoji: '🔓', category: 'objects' },
  { name: 'Búa', emoji: '🔨', category: 'objects' },
  { name: 'Công cụ', emoji: '🛠️', category: 'objects' },
  { name: 'Cây cảnh', emoji: '🌿', category: 'nature' },
  { name: 'Trời nắng', emoji: '☀️', category: 'nature' },
  { name: 'Trăng', emoji: '🌙', category: 'nature' },
  { name: 'Mây', emoji: '☁️', category: 'nature' },
  { name: 'Sấm sét', emoji: '⚡', category: 'nature' },
  { name: 'Ô', emoji: '☔', category: 'nature' },
  { name: 'Băng tuyết', emoji: '❄️', category: 'nature' },
  { name: 'Cây thông', emoji: '🎄', category: 'nature' },
  { name: 'Địa cầu', emoji: '🌍', category: 'nature' },
  { name: 'Núi lửa', emoji: '🌋', category: 'nature' },
  { name: 'Biển', emoji: '🌊', category: 'nature' },
  { name: 'Chó', emoji: '🐶', category: 'nature' },
  { name: 'Mèo', emoji: '🐱', category: 'nature' },
  { name: 'Chuột', emoji: '🐭', category: 'nature' },
  { name: 'Thỏ', emoji: '🐰', category: 'nature' },
  { name: 'Cáo', emoji: '🦊', category: 'nature' },
  { name: 'Gấu', emoji: '🐻', category: 'nature' },
  { name: 'Gấu trúc', emoji: '🐼', category: 'nature' },
  { name: 'Sư tử', emoji: '🦁', category: 'nature' },
  { name: 'Con lợn', emoji: '🐷', category: 'nature' },
  { name: 'Cá heo', emoji: '🐬', category: 'nature' },
  { name: 'Cá mập', emoji: '🦈', category: 'nature' },
  { name: 'Con rồng', emoji: '🐉', category: 'nature' },
  { name: 'Mưa', emoji: '🌧️', category: 'nature' },
  { name: 'Máy bay', emoji: '✈️', category: 'travel' },
];


const CATEGORIES = {
  faces: {
    name: 'Biểu cảm & Cảm xúc',
    icon: '😊',
    emojis: EMOJI_LIST.filter(e => e.category === 'faces')
  },
  symbols: {
    name: 'Trái tim & Biểu tượng',
    icon: '❤️',
    emojis: EMOJI_LIST.filter(e => e.category === 'symbols')
  },
  gestures: {
    name: 'Cử chỉ',
    icon: '👋',
    emojis: EMOJI_LIST.filter(e => e.category === 'gestures')
  },
  objects: {
    name: 'Đồ vật',
    icon: '💡',
    emojis: EMOJI_LIST.filter(e => e.category === 'objects')
  },
  nature: {
    name: 'Thiên nhiên & Động vật',
    icon: '🦋',
    emojis: EMOJI_LIST.filter(e => e.category === 'nature')
  },
  food: {
    name: 'Đồ ăn & Thức uống',
    icon: '🍔',
    emojis: EMOJI_LIST.filter(e => e.category === 'food')
  },
  activities: {
    name: 'Hoạt động',
    icon: '⚽',
    emojis: EMOJI_LIST.filter(e => e.category === 'activities')
  },
  travel: {
    name: 'Du lịch',
    icon: '✈️',
    emojis: EMOJI_LIST.filter(e => e.category === 'travel')
  }
}

const EmojiButton = ({ emoji, onClick, className }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  
  return (
    <button
      onClick={() => onClick(emoji)}
      className={`relative ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {emoji.emoji}
      <div
        className={`
          absolute top-full left-1/2 -translate-x-1/2 mt-1
          px-2 py-1 text-xs font-medium text-white
          bg-gray-800 rounded-md whitespace-nowrap
          transition-opacity duration-200
          ${showTooltip ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          z-20
        `}
      >
        {emoji.name}
        {/* Mũi tên tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mt-[1px]">
          <div className="border-4 border-transparent border-b-gray-800" />
        </div>
      </div>
    </button>
  )
}

// Thêm component CategoryButton
const CategoryButton = ({ category, id, isActive, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <button
      onClick={() => onClick(id)}
      className={`relative flex-shrink-0 p-2 rounded text-lg hover:bg-gray-100 ${
        isActive ? 'bg-gray-100' : ''
      }`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {category.icon}
      <div
        className={`
          absolute top-full left-1/2 -translate-x-1/2 mt-1
          px-2 py-1 text-xs font-medium text-white
          bg-gray-800 rounded-md whitespace-nowrap
          transition-opacity duration-200
          ${showTooltip ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          z-20
        `}
      >
        {category.name}
        {/* Mũi tên tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mt-[1px]">
          <div className="border-4 border-transparent border-b-gray-800" />
        </div>
      </div>
    </button>
  )
}

const removeAccents = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const EmojiPicker = ({ editor, show, onHide, position }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('faces')
  const suggestionRef = useRef(null)
  const searchInputRef = useRef(null)
  const categoryRefs = useRef({})

  // Memoize filtered suggestions
  const filteredEmojis = useMemo(() => {
    if (!searchQuery) return null
    
    const normalizedQuery = removeAccents(searchQuery);
    
    return EMOJI_LIST.filter(emoji => {
      const normalizedName = removeAccents(emoji.name);
      return normalizedName.includes(normalizedQuery) || emoji.emoji.includes(searchQuery);
    });
  }, [searchQuery])

  // Handle click outside
  useEffect(() => {
    if (!show) return

    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        onHide()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [show, onHide])

  useEffect(() => {
    if (!editor || !show) return
    
    const updateSearch = () => {
      const { state } = editor
      const { selection } = state
      const { from } = selection
      const currentContent = state.doc.textBetween(0, from)
      const lastColonPos = currentContent.lastIndexOf(':')
      
      if (lastColonPos !== -1) {
        const textAfterColon = currentContent.slice(lastColonPos + 1)
        setSearchQuery(textAfterColon)
      }
    }

    // Lắng nghe sự kiện update của editor
    editor.on('update', updateSearch)
    
    // Chạy lần đầu khi component mount
    updateSearch()

    return () => {
      editor.off('update', updateSearch)
    }
  }, [editor, show])

  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  const scrollToCategory = useCallback((categoryId) => {
    setActiveCategory(categoryId)
    categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const insertEmoji = useCallback((emojiObj) => {
    if (!editor) return

    const { state } = editor
    const { selection } = state
    const { from } = selection
    const currentContent = state.doc.textBetween(0, from)
    const lastColonPos = currentContent.lastIndexOf(':')
    
    if (lastColonPos !== -1) {
      const actualColonPos = from - (currentContent.length - lastColonPos)
      
      if (from - actualColonPos <= 50) {
        editor
          .chain()
          .focus()
          .deleteRange({ from: actualColonPos, to: from })
          .insertContent(emojiObj.emoji)
          .run()
      } else {
        editor.chain().focus().insertContent(emojiObj.emoji).run()
      }
    } else {
      editor.chain().focus().insertContent(emojiObj.emoji).run()
    }

    onHide()
    setSearchQuery('')
  }, [editor, onHide])
  if (!show) return null

  return (
    <div
      ref={suggestionRef}
      className="fixed z-50 rounded-lg shadow-lg w-96 bg-white text-gray-800"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        maxHeight: '600px',
      }}
    >
      {/* Search Bar - Fixed at top */}
      <div className="sticky top-0 bg-white z-20 p-2 border-b">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm kiếm emoji..."
            className="w-full pl-8 pr-2 py-1.5 rounded bg-gray-100 text-sm"
          />
          <Search className="w-4 h-4 absolute left-2 top-2 text-gray-400" />
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-[60px] bg-white z-10 border-b">
        <div className="flex p-1 gap-1 hide-scrollbar">
          {Object.entries(CATEGORIES).map(([id, category]) => (
            <CategoryButton
              key={id}
              id={id}
              category={category}
              isActive={activeCategory === id}
              onClick={scrollToCategory}
            />
          ))}
        </div>
      </div>

      {/* Emoji Content */}
      <div className="overflow-y-auto" style={{ height: '300px' }}>
        {searchQuery ? (
          // Search Results
          <div className="p-2">
            <div className="grid grid-cols-6 gap-1">
              {filteredEmojis.map((emoji) => (
                <EmojiButton
                  key={emoji.name}
                  emoji={emoji}
                  onClick={insertEmoji}
                  className="p-1.5 text-xl hover:bg-gray-100 rounded"
                />
              ))}
            </div>
          </div>
        ) : (
          // Categories
          Object.entries(CATEGORIES).map(([id, category]) => (
            <div
              key={id}
              ref={el => categoryRefs.current[id] = el}
              className="p-2"
            >
              <h3 className="text-xs font-semibold text-gray-500 mb-1">
                {category.name}
              </h3>
              <div className="grid grid-cols-6 gap-1">
                {category.emojis.map((emoji) => (
                  <EmojiButton
                    key={emoji.name}
                    emoji={emoji}
                    onClick={insertEmoji}
                    className="p-1.5 text-xl hover:bg-gray-100 rounded"
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default React.memo(EmojiPicker)
