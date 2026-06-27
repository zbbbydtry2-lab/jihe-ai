import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex h-dvh overflow-hidden overscroll-none bg-[#f4f6f9]">
      <Sidebar />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f4f6f9] pb-0 pl-20">
        <Outlet />
      </div>
    </div>
  )
}
