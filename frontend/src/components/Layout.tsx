import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { Search, History, Bell, Settings, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
    isActive
      ? "bg-pe-primary-container text-pe-primary font-medium"
      : "text-pe-on-surface-variant hover:text-pe-on-surface hover:bg-pe-surface-variant"
  }`

const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-1 text-xs transition-colors ${
    isActive ? "text-pe-primary" : "text-pe-on-surface-variant"
  }`

export function Layout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-pe-surface text-pe-on-surface">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b border-pe-outline-variant bg-pe-surface-container px-4">
        <div className="flex items-center gap-3">
          <span className="font-grotesk text-xl font-bold tracking-tight text-pe-primary">
            PE
          </span>
          <span className="hidden text-sm font-semibold text-pe-on-surface sm:block">
            Precision Estate Engine
          </span>
          <span className="hidden items-center rounded-full bg-pe-surface-variant px-2 py-0.5 font-grotesk text-xs text-pe-on-surface-variant lg:flex">
            v1.0.0-stable
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded-lg p-2 text-pe-on-surface-variant transition-colors hover:bg-pe-surface-variant hover:text-pe-on-surface">
            <Bell size={18} />
          </button>
          <button className="rounded-lg p-2 text-pe-on-surface-variant transition-colors hover:bg-pe-surface-variant hover:text-pe-on-surface">
            <Settings size={18} />
          </button>
          <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-pe-primary-container">
            <User size={14} className="text-pe-primary" />
          </div>
        </div>
      </header>

      {/* Sidebar (desktop) */}
      <aside className="fixed top-16 bottom-0 left-0 hidden w-60 flex-col gap-2 border-r border-pe-outline-variant bg-pe-surface-container p-4 md:flex">
        <Button
          onClick={() => navigate("/")}
          className="mb-2 w-full bg-pe-primary text-pe-on-primary hover:bg-pe-primary/90"
        >
          <Plus size={16} className="mr-2" />
          Nueva búsqueda
        </Button>
        <nav className="flex flex-col gap-1">
          <NavLink to="/" end className={navLinkClass}>
            <Search size={16} />
            Búsqueda
          </NavLink>
          <NavLink to="/history" className={navLinkClass}>
            <History size={16} />
            Historial
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="min-h-screen pt-16 md:ml-60">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed right-0 bottom-0 left-0 flex h-16 items-center justify-around border-t border-pe-outline-variant bg-pe-surface-container md:hidden">
        <NavLink to="/" end className={mobileNavClass}>
          <Search size={20} />
          Búsqueda
        </NavLink>
        <NavLink to="/history" className={mobileNavClass}>
          <History size={20} />
          Historial
        </NavLink>
      </nav>
    </div>
  )
}
