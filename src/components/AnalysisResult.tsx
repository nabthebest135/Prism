const AnalysisResult = ({ text, onClose }: { text: string; onClose: () => void }) => (
  <div className="absolute bottom-32 left-4 right-4 z-30">
    <div className="ar-text-overlay max-w-lg mx-auto">
      <div className="flex justify-between mb-2">
        <strong>Result</strong>
        <button aria-label="Dismiss result" onClick={onClose} className="text-primary px-2">
          Close
        </button>
      </div>
      <p
        role="status"
        className="text-sm whitespace-pre-wrap leading-relaxed max-h-[45vh] overflow-y-auto"
      >
        {text}
      </p>
    </div>
  </div>
)
export default AnalysisResult
