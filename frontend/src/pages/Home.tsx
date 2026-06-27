export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden">
      <div className="text-center max-w-2xl px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 mb-4">
          几何AI - 做电商设计更简单！
        </h1>
        <p className="text-lg text-slate-500 mb-8">
          一站式AI电商视觉工具平台 | 智能生图·主图·详情页
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: 'AI详情页生成', desc: '一键生成完整详情页', icon: '📄' },
            { title: 'AI主图生成', desc: '智能生成商品主图', icon: '🖼️' },
            { title: 'AI场景图', desc: '创建营销场景图', icon: '🎨' },
          ].map((card) => (
            <a
              key={card.title}
              href="/tools/ai-workbench"
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300"
            >
              <span className="text-3xl">{card.icon}</span>
              <div>
                <h3 className="font-semibold text-slate-800">{card.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{card.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
