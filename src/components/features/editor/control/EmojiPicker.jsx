import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Search } from 'lucide-react'

const EMOJI_LIST = [
  { name: 'Smile', emoji: '😊', category: 'faces' },
  { name: 'Smile to', emoji: '😁', category: 'faces' },
  { name: 'Smile to tears', emoji: '😂', category: 'faces' },
  { name: 'Laughing', emoji: '🤣', category: 'faces' },
  { name: 'Wink', emoji: '😉', category: 'faces' },
  { name: 'Love', emoji: '😍', category: 'faces' },
  { name: 'Kiss', emoji: '😘', category: 'faces' },
  { name: 'Cool', emoji: '😎', category: 'faces' },
  { name: 'Smile', emoji: '😏', category: 'faces' },
  { name: 'Thinking', emoji: '🤔', category: 'faces' },
  { name: 'Hug', emoji: '🤗', category: 'faces' },
  { name: 'Crazy', emoji: '🤪', category: 'faces' },
  { name: 'Sad', emoji: '😢', category: 'faces' },
  { name: 'Angry', emoji: '😠', category: 'faces' },
  { name: 'Devil', emoji: '😈', category: 'faces' },
  { name: 'Clown', emoji: '🤡', category: 'faces' },
  { name: 'Troubled', emoji: '😔', category: 'faces' },
  { name: 'Worried', emoji: '😟', category: 'faces' },
  { name: 'Cry', emoji: '😭', category: 'faces' },
  { name: 'Scared', emoji: '😱', category: 'faces' },
  { name: 'Sleepy', emoji: '😴', category: 'faces' },
  { name: 'Hungry', emoji: '🤤', category: 'faces' },
  { name: 'Nerd', emoji: '🤓', category: 'faces' },
  { name: 'Cowboy', emoji: '🤠', category: 'faces' },
  { name: 'Celebrating', emoji: '🥳', category: 'faces' },
  { name: 'Disguised', emoji: '🥸', category: 'faces' },
  { name: 'Shushing', emoji: '🤫', category: 'faces' },
  { name: 'Zipped mouth', emoji: '🤐', category: 'faces' },
  { name: 'Money mouth', emoji: '🤑', category: 'faces' },
  { name: 'Heart', emoji: '❤️', category: 'symbols' },
  { name: 'Orange heart', emoji: '🧡', category: 'symbols' },
  { name: 'Yellow heart', emoji: '💛', category: 'symbols' },
  { name: 'Green heart', emoji: '💚', category: 'symbols' },
  { name: 'Blue heart', emoji: '💙', category: 'symbols' },
  { name: 'Purple heart', emoji: '💜', category: 'symbols' },
  { name: 'Black heart', emoji: '🖤', category: 'symbols' },
  { name: 'Brown heart', emoji: '🤎', category: 'symbols' },
  { name: 'White heart', emoji: '🤍', category: 'symbols' },
  { name: 'Sparkling heart', emoji: '💖', category: 'symbols' },
  { name: 'Broken heart', emoji: '💔', category: 'symbols' },
  { name: 'Raising hands', emoji: '🙌', category: 'gestures' },
  { name: 'Raised fist', emoji: '✊', category: 'gestures' },
  { name: 'Star', emoji: '⭐', category: 'symbols' },
  { name: 'Sparkles', emoji: '✨', category: 'symbols' },
  { name: 'Fire', emoji: '🔥', category: 'nature' },
  { name: 'Party', emoji: '🎉', category: 'objects' },
  { name: 'Trophy', emoji: '🏆', category: 'objects' },
  { name: 'Medal', emoji: '🏅', category: 'objects' },
  { name: 'Light bulb', emoji: '💡', category: 'objects' },
  { name: 'Rocket', emoji: '🚀', category: 'objects' },
  { name: 'Gift', emoji: '🎁', category: 'objects' },
  { name: 'Crown', emoji: '👑', category: 'objects' },
  { name: 'Diamond', emoji: '💎', category: 'objects' },
  { name: 'Money bag', emoji: '💰', category: 'objects' },
  { name: 'Dollar', emoji: '💵', category: 'objects' },
  { name: 'Credit card', emoji: '💳', category: 'objects' },
  { name: 'Bell', emoji: '🔔', category: 'objects' },
  { name: 'Lock', emoji: '🔒', category: 'objects' },
  { name: 'Unlock', emoji: '🔓', category: 'objects' },
  { name: 'Hammer', emoji: '🔨', category: 'objects' },
  { name: 'Tools', emoji: '🛠️', category: 'objects' },
  { name: 'Plant', emoji: '🌿', category: 'nature' },
  { name: 'Sun', emoji: '☀️', category: 'nature' },
  { name: 'Moon', emoji: '🌙', category: 'nature' },
  { name: 'Cloud', emoji: '☁️', category: 'nature' },
  { name: 'Lightning', emoji: '⚡', category: 'nature' },
  { name: 'Umbrella', emoji: '☔', category: 'nature' },
  { name: 'Snowflake', emoji: '❄️', category: 'nature' },
  { name: 'Christmas tree', emoji: '🎄', category: 'nature' },
  { name: 'Earth', emoji: '🌍', category: 'nature' },
  { name: 'Volcano', emoji: '🌋', category: 'nature' },
  { name: 'Ocean wave', emoji: '🌊', category: 'nature' },
  { name: 'Dog', emoji: '🐶', category: 'nature' },
  { name: 'Cat', emoji: '🐱', category: 'nature' },
  { name: 'Mouse', emoji: '🐭', category: 'nature' },
  { name: 'Rabbit', emoji: '🐰', category: 'nature' },
  { name: 'Fox', emoji: '🦊', category: 'nature' },
  { name: 'Bear', emoji: '🐻', category: 'nature' },
  { name: 'Panda', emoji: '🐼', category: 'nature' },
  { name: 'Lion', emoji: '🦁', category: 'nature' },
  { name: 'Pig', emoji: '🐷', category: 'nature' },
  { name: 'Dolphin', emoji: '🐬', category: 'nature' },
  { name: 'Shark', emoji: '🦈', category: 'nature' },
  { name: 'Dragon', emoji: '🐉', category: 'nature' },
  { name: 'Rain', emoji: '🌧️', category: 'nature' },
  { name: 'Airplane', emoji: '✈️', category: 'travel' },
];


const CATEGORIES = {
  faces: {
    name: 'Expressions & Emotions',
    icon: '😊',
    emojis: EMOJI_LIST.filter(e => e.category === 'faces')
  },
  symbols: {
    name: 'Hearts & Symbols',
    icon: '❤️',
    emojis: EMOJI_LIST.filter(e => e.category === 'symbols')
  },
  gestures: {
    name: 'Gestures',
    icon: '👋',
    emojis: EMOJI_LIST.filter(e => e.category === 'gestures')
  },
  objects: {
    name: 'Objects',
    icon: '💡',
    emojis: EMOJI_LIST.filter(e => e.category === 'objects')
  },
  nature: {
    name: 'Nature & Animals',
    icon: '🦋',
    emojis: EMOJI_LIST.filter(e => e.category === 'nature')
  },
  food: {
    name: 'Food & Drinks',
    icon: '🍔',
    emojis: EMOJI_LIST.filter(e => e.category === 'food')
  },
  activities: {
    name: 'Activities',
    icon: '⚽',
    emojis: EMOJI_LIST.filter(e => e.category === 'activities')
  },
  travel: {
    name: 'Travel',
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
        {/* Tooltip arrow */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mt-[1px]">
          <div className="border-4 border-transparent border-b-gray-800" />
        </div>
      </div>
    </button>
  )
}

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
        {/* Tooltip arrow */}
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

    // Listen for editor update events
    editor.on('update', updateSearch)
    
    // Run initially when component mounts
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
            placeholder="Search emoji..."
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
