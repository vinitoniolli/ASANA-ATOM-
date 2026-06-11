import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import type { TabKey } from '../types/dashboard'

interface LayoutProps {
  activeTab: TabKey
  onSelectTab: (tab: TabKey) => void
  children: ReactNode
}

export function Layout({ activeTab, onSelectTab, children }: LayoutProps) {
  return (
    <div className="layout">
      <Sidebar activeTab={activeTab} onSelectTab={onSelectTab} />
      <main className="layout__content">{children}</main>
    </div>
  )
}