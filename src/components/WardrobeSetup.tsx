import { useState } from 'react'
import { Check, Plus } from 'lucide-react'

interface WardrobeSetupProps {
  onComplete: (wardrobe: WardrobeItems) => void
  onCancel: () => void
}

interface WardrobeItem {
  name: string
  color: string
}

interface WardrobeItems {
  tops: WardrobeItem[]
  bottoms: WardrobeItem[]
  shoes: WardrobeItem[]
}

const WardrobeSetup = ({ onComplete, onCancel }: WardrobeSetupProps) => {
  const [currentCategory, setCurrentCategory] = useState<'tops' | 'bottoms' | 'shoes'>('tops')
  const [wardrobe, setWardrobe] = useState<WardrobeItems>({
    tops: [],
    bottoms: [],
    shoes: []
  })
  const [inputValue, setInputValue] = useState('')
  const [selectedColor] = useState('black')
  const [showColorPicker, setShowColorPicker] = useState<string | false>(false)

  const colors = [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Gray', value: 'gray', hex: '#808080' },
    { name: 'Navy', value: 'navy', hex: '#000080' },
    { name: 'Blue', value: 'blue', hex: '#0066CC' },
    { name: 'Red', value: 'red', hex: '#CC0000' },
    { name: 'Green', value: 'green', hex: '#00AA00' },
    { name: 'Brown', value: 'brown', hex: '#8B4513' },
    { name: 'Beige', value: 'beige', hex: '#F5F5DC' },
    { name: 'Pink', value: 'pink', hex: '#FF69B4' },
    { name: 'Purple', value: 'purple', hex: '#800080' },
    { name: 'Yellow', value: 'yellow', hex: '#FFD700' }
  ]

  const categories = [
    { id: 'tops' as const, name: 'Tops', items: ['T-shirt', 'Shirt', 'Hoodie', 'Sweater', 'Tank Top', 'Blouse', 'Jacket'] },
    { id: 'bottoms' as const, name: 'Bottoms', items: ['Jeans', 'Trousers', 'Shorts', 'Skirt', 'Leggings', 'Sweatpants', 'Chinos'] },
    { id: 'shoes' as const, name: 'Shoes', items: ['Sneakers', 'Boots', 'Sandals', 'Dress Shoes', 'Loafers', 'High Heels', 'Flats'] }
  ]

  const currentCategoryData = categories.find(cat => cat.id === currentCategory)!
  const currentCategoryIndex = categories.findIndex(cat => cat.id === currentCategory)

  const addItem = (itemName: string, color: string = selectedColor) => {
    const newItem = { name: itemName, color }
    setWardrobe(prev => ({
      ...prev,
      [currentCategory]: [...prev[currentCategory], newItem]
    }))
  }

  const removeItem = (item: WardrobeItem) => {
    setWardrobe(prev => ({
      ...prev,
      [currentCategory]: prev[currentCategory].filter(i => i.name !== item.name || i.color !== item.color)
    }))
  }

  const addCustomItem = () => {
    if (inputValue.trim()) {
      addItem(inputValue.trim(), selectedColor)
      setInputValue('')
    }
  }

  const nextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategory(categories[currentCategoryIndex + 1].id)
    } else {
      onComplete(wardrobe)
    }
  }

  const isItemSelected = (itemName: string) => 
    wardrobe[currentCategory].some(item => item.name === itemName)

  const toggleItem = (itemName: string) => {
    if (isItemSelected(itemName)) {
      const item = wardrobe[currentCategory].find(i => i.name === itemName)!
      removeItem(item)
    } else {
      setShowColorPicker(itemName)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">Setup Your Wardrobe</h2>
        <p className="text-gray-600 mb-6">
          Step {currentCategoryIndex + 1} of {categories.length}: Select your {currentCategoryData.name.toLowerCase()}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCategoryIndex + 1) / categories.length) * 100}%` }}
          />
        </div>

        {/* Category Items */}
        <div className="space-y-2 mb-6">
          {currentCategoryData.items.map(item => (
            <button
              key={item}
              onClick={() => toggleItem(item)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isItemSelected(item)
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span>{item}</span>
              {isItemSelected(item) && <Check size={20} />}
            </button>
          ))}
        </div>

        {/* Color Picker Modal */}
        {showColorPicker && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4">
              <h3 className="font-medium mb-3">Choose color for {showColorPicker}:</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {colors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => {
                      addItem(showColorPicker, color.value)
                      setShowColorPicker(false)
                    }}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-300 mb-1"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowColorPicker(false)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Custom Item Input */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Add custom ${currentCategory.slice(0, -1)}...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
            />
            <button
              onClick={addCustomItem}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Selected Items */}
        {wardrobe[currentCategory].length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Selected {currentCategoryData.name}:</h3>
            <div className="flex flex-wrap gap-2">
              {wardrobe[currentCategory].map((item, index) => {
                const colorData = colors.find(c => c.value === item.color)
                return (
                  <span
                    key={`${item.name}-${item.color}-${index}`}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm cursor-pointer hover:bg-primary/20"
                    onClick={() => removeItem(item)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: colorData?.hex || '#000' }}
                    />
                    {item.name} ({item.color}) ×
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={nextCategory}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            {currentCategoryIndex < categories.length - 1 ? 'Next' : 'Complete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WardrobeSetup