import { ArrowRight } from 'lucide-react'
export default function Onboarding({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <main className="min-h-screen px-8 py-12 flex flex-col max-w-3xl mx-auto">
      <p className="text-2xl font-semibold tracking-tight">
        prism<span className="text-amber-700">.</span>
      </p>
      <section className="my-auto py-16 max-w-xl">
        <p className="text-xs uppercase tracking-widest text-stone-500 mb-5">Camera & wardrobe</p>
        <h1 className="editorial-title text-5xl leading-tight">
          Start with
          <br />a photo.
        </h1>
        <p className="mt-6 text-stone-600 text-lg leading-relaxed">
          Translate text, keep track of your clothes, and make a virtual try-on preview.
        </p>
        <button
          onClick={onGetStarted}
          className="mt-10 bg-primary text-white px-6 py-3 rounded-md flex items-center gap-6"
        >
          Open Prism <ArrowRight size={18} />
        </button>
        <p className="text-sm text-stone-500 mt-5">
          No account needed. Saved items stay in this browser.
        </p>
      </section>
    </main>
  )
}
