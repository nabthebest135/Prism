import { useState } from 'react'
import { Check, Plus } from 'lucide-react'

interface WardrobeSetupProps {
  onComplete: (wardrobe: WardrobeItems) => void
  onCancel: () => void
}

interface WardrobeItems {
  tops: string[]
  bottoms: string[]
  shoes: string[]
}

const WardrobeSetup = ({ onComplete, onCancel }: WardrobeSetupProps) => {
  const [currentCategory, setCurrentCategory] = useState<'tops' | 'bottoms' | 'shoes'>('tops')
  const [wardrobe, setWardrobe] = useState<WardrobeItems>({
    tops: [],
    bottoms: [],
    shoes: []
  })
  const [inputValue, setInputValue] = useState('')

  const categories = [
    { id: 'tops' as const, name: 'Tops', items: ['T-shirt', 'Shirt', 'Hoodie', 'Sweater', 'Tank Top', 'Blouse', 'Jacket'] },
    { id: 'bottoms' as const, name: 'Bottoms', items: ['Jeans', 'Trousers', 'Shorts', 'Skirt', 'Leggings', 'Sweatpants', 'Chinos'] },
    { id: 'shoes' as const, name: 'Shoes', items: ['Sneakers', 'Boots', 'Sandals', 'Dress Shoes', 'Loafers', 'High Heels', 'Flats'] }
  ]

  const currentCategoryData = categories.find(cat => cat.id === currentCategory)!
  const currentCategoryIndex = categories.findIndex(cat => cat.id === currentCategory)

  const addItem = (item: string) => {
    setWardrobe(prev => ({
      ...prev,
      [currentCategory]: [...prev[currentCategory], item]
    }))
  }

  const removeItem = (item: string) => {
    setWardrobe(prev => ({
      ...prev,
      [currentCategory]: prev[currentCategory].filter(i => i !== item)
    }))
  }

  const addCustomItem = () => {
    if (inputValue.trim()) {
      addItem(inputValue.trim())
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

  const isItemSelected = (item: string) => wardrobe[currentCategory].includes(item)

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
              onClick={() => isItemSelected(item) ? removeItem(item) : addItem(item)}
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
              {wardrobe[currentCategory].map(item => (
                <span
                  key={item}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm cursor-pointer hover:bg-primary/20"
                  onClick={() => removeItem(item)}
                >
                  {item} ×
                </span>
              ))}
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