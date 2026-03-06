'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '#/components/ui/sidebar'

import type { NavPrimaryProps, NavUserProps } from '#/lib/types'
import { Link, linkOptions } from '@tanstack/react-router'
import { BookmarkIcon, CompassIcon, ImportIcon } from 'lucide-react'
import { NavPrimary } from './nav-primary'
import { NavUser } from './nav-user'

const navItems: NavPrimaryProps['items'] = linkOptions([
  {
    title: 'Items',
    icon: BookmarkIcon,
    to: '/dashboard/items',
    activeOptions: { exact: false },
  },
  {
    title: 'Import',
    icon: ImportIcon,
    to: '/dashboard/import',
    activeOptions: { exact: false },
  },
  {
    title: 'Discover',
    icon: CompassIcon,
    to: '/dashboard/discover',
    activeOptions: { exact: false },
  },
])

export function AppSidebar({ user }: NavUserProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <BookmarkIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-medium">Recall</span>
                  <span className="text-xs">Your AI Knowledge Base</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
