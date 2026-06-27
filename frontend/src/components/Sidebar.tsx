import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Grid3X3, Wand2, Clock, CreditCard, User, Gift, Bell, EyeOff } from 'lucide-react'

const navItems = [
  { icon: Home, label: '首页', path: '/' },
  { icon: Grid3X3, label: '选择类目', path: '/tools/ai-workbench' },
  { icon: Wand2, label: 'AI工具', path: '/tools/ai-workbench' },
  { icon: Clock, label: '生成历史', path: '/history' },
  { icon: CreditCard, label: '充值', path: '/' },
  { icon: User, label: '个人中心', path: '/admin' },
]

export default function Sidebar() {
  const location = useLocation()
  const [credits] = useState(0)

  const isActive = (p: string) => {
    if (p === '/') return location.pathname === '/'
    return location.pathname.startsWith(p)
  }

  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-20 flex-col bg-[#f4f6f9]" style={{fontFamily: "PingFang SC, PingFang SC, Microsoft YaHei, Helvetica Neue, Arial, sans-serif"}}>
      <div className="flex flex-col items-center px-1 pt-5 pb-2">
        <div className="flex items-center justify-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">J</div>
        </div>
      </div>

      <div className="relative mt-28 flex min-h-0 flex-1 flex-col items-center gap-2.5 overflow-visible px-1 py-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`group flex flex-col items-center gap-[1px] rounded-xl px-1 py-0.5 text-[10px] font-medium leading-none transition-colors w-full hover:bg-zinc-100/90 hover:text-zinc-900 ${active ? 'text-zinc-900' : 'text-slate-500'}`}
            >
              <div className="flex h-8 w-9 shrink-0 items-center justify-center">
                <div className="relative h-[1.35rem] w-[1.35rem]">
                  <Icon className="absolute inset-0 h-[1.35rem] w-[1.35rem]" strokeWidth={active ? 2 : 1.5} />
                </div>
              </div>
              <span className="relative w-full text-center">{item.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="-mt-0.5 flex flex-col items-center gap-0 bg-[#f4f6f9] px-1 pb-2 pt-2">
        <button className="-mt-1 flex w-full max-w-[4.2rem] flex-col items-center justify-center gap-[1px] px-1 py-1 text-zinc-900 transition-colors hover:text-black">
          <div className="-ml-0.5 flex items-center justify-center gap-0">
            <Gift className="h-[0.95rem] w-[0.95rem] shrink-0" />
            <span className="-mb-px -ml-px inline-flex items-center text-[12px] font-semibold leading-none tabular-nums tracking-tight">{credits}</span>
          </div>
          <span className="rounded-md border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-[9px] font-medium leading-none text-zinc-700">充值</span>
        </button>
        <div className="relative flex w-full justify-center overflow-visible pb-0.5" />
        <button className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition hover:bg-zinc-100/90">
          <Gift className="h-[1.05rem] w-[1.05rem] text-zinc-600" strokeWidth={1.5} />
        </button>
        <button className="relative flex h-8 w-8 items-center justify-center rounded-xl transition hover:bg-zinc-100/90">
          <Bell className="h-[1.02rem] w-[1.02rem] text-zinc-600" strokeWidth={1.5} />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-xl transition hover:bg-zinc-100/90">
          <EyeOff className="h-[1.05rem] w-[1.05rem] text-zinc-600" strokeWidth={1.5} />
        </button>
        <div className="relative mt-1 flex w-full justify-center">
          <div className="flex flex-col items-center gap-0.5">
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white transition-all ring-1 ring-[#c8d9ec]">
              <User className="h-[0.95rem] w-[0.95rem] text-slate-400" strokeWidth={1.5} />
            </div>
            <span className="text-[9px] font-medium leading-none text-zinc-500">我的</span>
          </div>
        </div>
      </div>
    </div>
  )
}
