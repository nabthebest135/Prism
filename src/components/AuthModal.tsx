import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState('')
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          useAuthStore.getState().setName(name)
          onClose()
        }}
        className="bg-white rounded-lg p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold">Your local profile</h2>
        <p>Your wardrobe and history stay in this browser. No account is needed.</p>
        <label className="block">
          Your name
          <input
            autoFocus
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full border rounded-xl p-3 mt-2"
            placeholder="Your name"
          />
        </label>
        <button className="w-full bg-primary text-white p-3 rounded-xl">Continue</button>
        <button type="button" onClick={onClose} className="w-full p-2">
          Cancel
        </button>
      </form>
    </div>
  )
}
export default AuthModal
