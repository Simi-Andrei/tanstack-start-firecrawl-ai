import { Navbar } from '#/components/web/navbar'
import { ComponentExample } from '@/components/component-example'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      <Navbar />
      <ComponentExample />
    </div>
  )
}
