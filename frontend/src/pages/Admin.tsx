import { useState } from 'react'

interface User {
  id: number; phone: string; createdAt: string; credits: number
}

interface GenerationRecord {
  id: number; userId: number; productName: string; type: string; images: string[]; createdAt: string
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'users' | 'generations' | 'settings'>('users')
  const [users] = useState<User[]>([
    { id: 1, phone: '138****1234', createdAt: '2024-01-10', credits: 100 },
    { id: 2, phone: '139****5678', createdAt: '2024-01-12', credits: 50 },
  ])
  const [records] = useState<GenerationRecord[]>([
    { id: 1, userId: 1, productName: '产品A', type: '详情页', images: [], createdAt: '2024-01-15' },
    { id: 2, userId: 2, productName: '产品B', type: '主图', images: [], createdAt: '2024-01-14' },
  ])

  const tabs = [
    { key: 'users' as const, label: '用户管理' },
    { key: 'generations' as const, label: '生成记录' },
    { key: 'settings' as const, label: '系统设置' },
  ]

  return (
    <div className="min-h-0 flex-1 overflow-auto p-8">
      <h1 className="text-2xl font-extrabold text-slate-800 mb-6">后台管理</h1>
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 mb-6 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">手机号</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">注册时间</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">积分</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-800">{user.id}</td>
                  <td className="px-4 py-3 text-slate-800">{user.phone}</td>
                  <td className="px-4 py-3 text-slate-500">{user.createdAt}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{user.credits}</span></td>
                  <td className="px-4 py-3"><button className="text-xs text-blue-600 font-medium hover:text-blue-700">编辑</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'generations' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">用户ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">产品名</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">类型</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">时间</th>
              </tr>
            </thead>
            <tbody>
              {records.map(rec => (
                <tr key={rec.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-800">{rec.id}</td>
                  <td className="px-4 py-3 text-slate-800">{rec.userId}</td>
                  <td className="px-4 py-3 text-slate-800">{rec.productName}</td>
                  <td className="px-4 py-3 text-slate-500">{rec.type}</td>
                  <td className="px-4 py-3 text-slate-500">{rec.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-4 max-w-lg">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-800 mb-4">API 配置</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">OpenAI API Key</label>
                <input type="password" placeholder="sk-..." className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-1 ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Stability AI API Key</label>
                <input type="password" placeholder="sk-..." className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-1 ring-blue-500" />
              </div>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">保存设置</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
