function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          PriClaim AI
        </h1>
        <p className="text-slate-400">
          Medical Insurance Claim Auditing Platform
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
            🟢 Low Risk
          </span>
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
            🟡 Medium
          </span>
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
            🔴 High Risk
          </span>
        </div>
      </div>
    </div>
  )
}

export default App