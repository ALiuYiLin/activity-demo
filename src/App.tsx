import { Button } from 'antd'
import './App.css'
import { useBase } from './hooks/useBase'
import { useDerived } from './hooks/useDerived'
import { useOptions } from './hooks/useOptions'
import { useUI } from './hooks/useUI'



function App() {
  const base = useBase()
  const ui = useUI()
  const derived = useDerived({...base, ...ui})
  const options = useOptions({...base,...derived, ...ui})

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <Button type="primary">Primary</Button>
    </div>
  )
}

export default App
