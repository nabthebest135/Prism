import { Link } from 'react-router-dom'
import { ArrowUpRight, Camera, Shirt, Layers, ScanLine } from 'lucide-react'
import { useHistoryStore } from '../store/historyStore'

const tools = [
  {
    to: '/world-lens',
    title: 'Read your surroundings',
    detail: 'Translate a sign. Identify an object. Find out about a place.',
    icon: Camera,
    number: '01',
  },
  {
    to: '/style-lens',
    title: 'Work with your wardrobe',
    detail: 'Photograph clothes, save them, and check care instructions.',
    icon: Shirt,
    number: '02',
  },
  {
    to: '/smart-outfit',
    title: 'Put an outfit together',
    detail: 'Choose from your own clothes for the day or an occasion.',
    icon: Layers,
    number: '03',
  },
  {
    to: '/try-on',
    title: 'Try a garment on',
    detail: 'Upload a photo and a garment to make a wearing preview.',
    icon: ScanLine,
    number: '04',
  },
]
export default function Home() {
  const { analyses } = useHistoryStore()
  const recent = analyses[0]
  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <header className="flex items-center justify-between border-b border-stone-300 pb-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          prism<span className="text-amber-700">.</span>
        </h1>
        <Link to="/wardrobe" className="text-sm underline underline-offset-4">
          My wardrobe
        </Link>
      </header>
      <section className="py-10 sm:py-14 max-w-xl">
        <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">Camera & wardrobe</p>
        <h2 className="text-4xl sm:text-5xl leading-tight font-normal editorial-title">
          A little help with
          <br />
          what's in front of you.
        </h2>
        <p className="text-stone-600 mt-5 leading-relaxed">
          Start with a photo. Read something, save a piece of clothing, or see how it might look on
          you.
        </p>
      </section>
      <section aria-label="Prism tools" className="border-t border-stone-300">
        {tools.map(({ to, title, detail, icon: Icon, number }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-4 sm:gap-6 py-6 border-b border-stone-300 hover:bg-stone-100 transition-colors"
          >
            <span className="text-xs text-stone-500 hidden sm:block">{number}</span>
            <Icon size={22} strokeWidth={1.5} className="shrink-0 text-stone-600" />
            <div className="flex-1">
              <h3 className="text-lg font-medium">{title}</h3>
              <p className="text-sm text-stone-600 mt-1">{detail}</p>
            </div>
            <ArrowUpRight size={20} strokeWidth={1.5} className="shrink-0" />
          </Link>
        ))}
      </section>
      <section className="mt-10 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-lg">
          <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-3">Last saved</h2>
          <p className="text-sm text-stone-600">
            {recent
              ? recent.result.slice(0, 160) + (recent.result.length > 160 ? '…' : '')
              : 'No saved photos yet. Your results will appear here.'}
          </p>
        </div>
        <Link to="/history" className="text-sm underline underline-offset-4">
          View history
        </Link>
      </section>
    </div>
  )
}
