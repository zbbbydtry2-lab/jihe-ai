export default function History() {
  const mockHistory = [
    { id: 1, name: '产品A详情页', date: '2024-01-15', status: 'completed', images: 4 },
    { id: 2, name: '产品B主图', date: '2024-01-14', status: 'completed', images: 2 },
    { id: 3, name: '产品C场景图', date: '2024-01-13', status: 'completed', images: 1 },
  ]

  return (
    <div className="min-h-0 flex-1 overflow-auto p-8">
      <h1 className="text-2xl font-extrabold text-slate-800 mb-6">生成历史</h1>
      <div className="grid gap-4">
        {mockHistory.map(item => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <h3 className="font-semibold text-slate-800">{item.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{item.date} · {item.images}张图片</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">{item.status}</span>
              <button className="text-sm text-blue-600 font-medium hover:text-blue-700">查看</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
