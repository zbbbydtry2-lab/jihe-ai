import { useState } from 'react'
import { ChevronDown, LayoutTemplate, Upload, Plus, Image, Sparkles, X } from 'lucide-react'

type Ratio = 'smart-1-1' | 'vertical'
type Resolution = '1K' | '2K' | '4K'
type Count = 1 | 2 | 4
type Model = 'sd' | 'dalle3' | 'midjourney'

interface Tool {
  id: string
  name: string
  icon: typeof LayoutTemplate
}

interface SceneItem {
  id: string
  type: string
  size: string
  selected: boolean
}

const defaultSizes: SceneItem[] = [
  { id: '1', type: '自定义类型', size: '720*1280', selected: true },
  { id: '2', type: '自定义类型', size: '1080*1920', selected: false },
  { id: '3', type: '自定义类型', size: '900*1200', selected: false },
  { id: '4', type: '自定义类型', size: '1200*1600', selected: false },
]

const tools: Tool[] = [
  { id: 'ai-detail-page', name: 'AI详情页生成', icon: LayoutTemplate },
  { id: 'ai-main-image', name: 'AI主图生成', icon: Image },
  { id: 'ai-scene', name: 'AI场景图', icon: Sparkles },
]

export default function AiWorkbench() {
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [ratio, setRatio] = useState<Ratio>('smart-1-1')
  const [resolution, setResolution] = useState<Resolution>('1K')
  const [count, setCount] = useState<Count>(1)
  const [selectedTool, setSelectedTool] = useState<'ai-detail-page' | 'ai-main-image-set' | 'ai-scene'>('ai-detail-page')
  const [showToolDropdown, setShowToolDropdown] = useState(false)
  const [language, _setLanguage] = useState('简体中文')
  const [scenes, setScenes] = useState<SceneItem[]>(defaultSizes)
  const [selectAll, setSelectAll] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [platform, setPlatform] = useState('通用')
  const [productImages, setProductImages] = useState<string[]>([])
  const [mainImageTypes, setMainImageTypes] = useState<SceneItem[]>([
    { id: '0', type: '首页主图', size: '通用', selected: true },
    { id: '1', type: '细节展示', size: '通用', selected: false },
    { id: '2', type: '使用场景', size: '通用', selected: false },
    { id: '3', type: '核心卖点', size: '通用', selected: false },
    { id: '4', type: '产品痛点', size: '通用', selected: false },
    { id: '5', type: '材质展示', size: '通用', selected: false },
  ])
  const [mainSelectAll, setMainSelectAll] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [referenceImages, setReferenceImages] = useState<string[]>([])
  const [model, setModel] = useState<Model>('dalle3')
  const [apiKey, setApiKey] = useState('')
  const [showApiSettings, setShowApiSettings] = useState(false)

  const currentTool = tools.find(t => t.id === selectedTool) || tools[0]

  const handleGenerate = async () => {
    if (!productName.trim()) return
    setIsGenerating(true)

    try {
      const selectedScenes = scenes.filter(s => s.selected)
      const sceneSizes = selectedScenes.map(s => s.size).join(', ')
      const prompt = `电商详情页设计：产品"${productName}"，描述：${description || '高品质电商产品'}，场景尺寸：${sceneSizes}，风格：现代简约商业风格，中文电商排版`

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model,
          count,
          ratio,
          resolution,
          apiKey: apiKey || undefined,
        }),
      })

      if (!response.ok) throw new Error('生成失败')
      const data = await response.json()
      if (data.images && data.images.length > 0) {
        setGeneratedImages(data.images)
        return
      }
    } catch (err) {
      console.error('Generation error:', err)
    }
    
    // 降级到占位图
    const mockImages = Array.from({ length: count }, (_, i) =>
      `https://placehold.co/${ratio === 'smart-1-1' ? '800x800' : '800x1200'}/1a1a2e/e0e0ff?text=AI+Detail+Page+${i + 1}`
    )
    setGeneratedImages(mockImages)
    setIsGenerating(false)
  }

  const toggleScene = (id: string) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s))
    setSelectAll(false)
  }

  const toggleSelectAll = () => {
    const newVal = !selectAll
    setSelectAll(newVal)
    setScenes(prev => prev.map(s => ({ ...s, selected: newVal })))
  }

  const addDescription = () => {
    if (description) return
    setDescription('请在此输入您的产品描述，AI将根据描述生成匹配的详情页设计')
  }

  const removeDescription = () => setDescription('')

  const addReferenceImage = () => {
    setReferenceImages(prev => [...prev, 'https://placehold.co/200x200/eee/999?text=参考图'])
  }

  const removeReferenceImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index))
  }

  const IconComponent = currentTool.icon

  return (
    <div className="min-h-0 flex-1 overflow-hidden overscroll-none ai-workbench-no-page-scroll">
      <div className="flex h-full min-h-0 w-full overflow-hidden bg-[#f4f6f9]">
        {/* 左侧面板 */}
        <div className="flex h-full min-h-0 w-[380px] shrink-0 flex-col bg-[#f4f6f9] border-r border-slate-100 px-4 pb-3 pt-5 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="shrink-0 px-6 pb-4 pt-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 text-white shadow-sm ring-1 ring-zinc-950/15">
                  <IconComponent className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="min-w-0 truncate text-xl font-extrabold tracking-tight text-slate-800">{currentTool.name}</span>
                </div>
              </div>
              <div className="relative shrink-0">
                <button onClick={() => setShowToolDropdown(!showToolDropdown)} className="inline-flex items-center gap-0.5 py-0.5 text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-900">
                  切换功能 <ChevronDown className="h-3.5 w-3.5 shrink-0 transition" />
                </button>
                {showToolDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-200 bg-white shadow-lg z-50 py-1">
                    {tools.map(tool => (
                      <button key={tool.id} onClick={() => { setSelectedTool(tool.id); setShowToolDropdown(false) }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-slate-50 ${selectedTool === tool.id ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>
                        <tool.icon className="h-4 w-4" />{tool.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <input maxLength={15} placeholder="请输入产品名" value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-200/80 bg-white px-3 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-slate-300" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 shrink-0">模型:</span>
                <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
                  {([{ key: 'dalle3', label: 'DALL-E 3' }, { key: 'sd', label: 'Stable Diffusion' }, { key: 'midjourney', label: 'Midjourney' }] as {key: Model, label: string}[]).map(m => (
                    <button key={m.key} onClick={() => setModel(m.key)}
                      className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${model === m.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{m.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <button onClick={() => setShowApiSettings(!showApiSettings)} className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-500 transition-colors">
                  <Sparkles className="h-3 w-3" />{apiKey ? 'API Key 已设置' : '设置 API Key'}
                </button>
                {showApiSettings && (
                  <div className="mt-1">
                    <input type="password" placeholder="输入 OpenAI / Stability API Key" value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-[10px] text-slate-800 outline-none focus:ring-1 focus:ring-blue-400" />
                  </div>
                )}
              </div>

              <div>
                <button onClick={addReferenceImage} className="flex w-full items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-500 transition-colors hover:border-blue-400 hover:text-blue-600">
                  <Upload className="h-4 w-4" />添加场景参考图
                </button>
                {referenceImages.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {referenceImages.map((img, i) => (
                      <div key={i} className="relative h-16 w-16 rounded-lg overflow-hidden border border-slate-200 group">
                        <img src={img} alt="参考图" className="h-full w-full object-cover" />
                        <button onClick={() => removeReferenceImage(i)} className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button onClick={addDescription} className="flex w-full items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-500 transition-colors hover:border-blue-400 hover:text-blue-600">
                  <Plus className="h-4 w-4" />添加描述词
                </button>
                {description && (
                  <div className="mt-2 relative">
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                      className="h-20 w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-1 ring-slate-300 resize-none" />
                    <button onClick={removeDescription} className="absolute top-1 right-1 h-4 w-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 中部 - 画布预览区 */}
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
          <div className="flex items-center justify-center gap-4 px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-1 rounded-xl bg-white border border-slate-200 p-0.5">
              <button onClick={() => setRatio('smart-1-1')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${ratio === 'smart-1-1' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}>智能1:1</button>
              <button onClick={() => setRatio('vertical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${ratio === 'vertical' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}>竖版</button>
              <button className="px-2 py-1.5 rounded-lg text-xs text-slate-400">更多尺寸</button>
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-white border border-slate-200 p-0.5">
              {(['1K', '2K', '4K'] as Resolution[]).map(r => (
                <button key={r} onClick={() => setResolution(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${resolution === r ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}>{r}</button>
              ))}
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-white border border-slate-200 p-0.5">
              {([1, 2, 4] as Count[]).map(c => (
                <button key={c} onClick={() => setCount(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${count === c ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}>{c}张</button>
              ))}
            </div>

            <button onClick={handleGenerate} disabled={isGenerating || !productName.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
              <Sparkles className="h-4 w-4" />{isGenerating ? '生成中...' : `立即生成 ${count} 张详情页`}
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-visible scroll-smooth">
            <div className="flex items-center justify-center min-h-full p-8">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                  <p className="text-sm text-slate-500">AI正在生成详情页...</p>
                </div>
              ) : generatedImages.length === 0 ? (
                <div className="flex flex-col items-center gap-4 text-slate-400">
                  <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300">
                    <Image className="h-12 w-12 text-slate-300" />
                  </div>
                  <p className="text-sm">输入产品名并点击生成，AI将为您创建详情页</p>
                </div>
              ) : (
                <div className={`grid gap-4 ${count === 1 ? 'grid-cols-1 max-w-md' : count === 2 ? 'grid-cols-2 max-w-2xl' : 'grid-cols-2 max-w-3xl'}`}>
                  {generatedImages.map((img, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                      <img src={img} alt={`生成结果 ${i + 1}`} className="w-full h-auto" />
                      <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-xs text-slate-500">结果 {i + 1}</span>
                        <button className="text-xs text-blue-600 font-medium hover:text-blue-700">下载</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="flex h-full min-h-0 w-[320px] shrink-0 flex-col bg-[#f4f6f9] border-l border-slate-100 px-4 pt-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-700">场景选择</span>
            <button onClick={toggleSelectAll} className="text-xs font-medium text-blue-600 hover:text-blue-700">{selectAll ? '取消全选' : '全选'}</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {scenes.map(scene => (
              <div key={scene.id} onClick={() => toggleScene(scene.id)}
                className={`flex items-center justify-between rounded-xl border px-3 py-3 cursor-pointer transition-all ${scene.selected ? 'border-blue-400 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-slate-400">{scene.type}</span>
                  <span className="text-sm font-semibold text-slate-700">{scene.size}</span>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${scene.selected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                  {scene.selected && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </div>
            ))}
          </div>

          <div className="py-3 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">语言：</span>
              <button className="text-xs font-medium text-slate-700 hover:text-slate-900">{language}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
