import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppStore } from '../stores/appStore'
import { Sparkles } from 'lucide-react'

export default function Register() {
  const [account, setAccount] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const setUser = useAppStore(s => s.setUser)

  const sendCode = async () => {
    setError('')
    if (!account.trim()) return setError('请输入手机号或邮箱')
    
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: account }),
      })
      const data = await res.json()
      if (data.success) {
        setCodeSent(true)
        setCountdown(60)
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) { clearInterval(timer); setCodeSent(false); return 0 }
            return prev - 1
          })
        }, 1000)
        if (data.code) alert('验证码：' + data.code)
      } else {
        setError(data.error || '发送失败')
      }
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  const register = async () => {
    setError('')
    if (!agreed) return setError('请同意用户协议和隐私政策')
    if (!code.trim()) return setError('请输入验证码')
    
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: account, code }),
      })
      const data = await res.json()
      if (data.success) {
        setUser({ phone: account, token: data.token })
        localStorage.setItem('token', data.token)
        navigate('/tools/ai-workbench')
      } else {
        setError(data.error || '注册失败')
      }
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-xl shadow-slate-200/50">
        <div className="text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">创建账号</h1>
          <p className="text-sm text-slate-500 mt-1">注册即享 AI 电商设计工具</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">手机号 / 邮箱</label>
            <input
              type="text"
              placeholder="请输入手机号或邮箱地址"
              value={account}
              onChange={e => setAccount(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">验证码</label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                placeholder="6位验证码"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                onClick={sendCode}
                disabled={codeSent || loading}
                className="h-12 shrink-0 rounded-xl border border-blue-200 bg-blue-50 px-5 text-sm font-medium text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : countdown > 0 ? countdown + 's' : '获取验证码'}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-xs text-slate-500 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="rounded h-4 w-4 text-blue-600" />
            我已阅读并同意 <span className="text-blue-600">《用户协议》</span> 和 <span className="text-blue-600">《隐私政策》</span>
          </label>

          <button
            onClick={register}
            disabled={loading}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50"
          >
            {loading ? '注册中...' : '注 册'}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          已有账号？<Link to="/login" className="text-blue-600 font-medium hover:underline">立即登录</Link>
        </p>
      </div>
    </div>
  )
}
