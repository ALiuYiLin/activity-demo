import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button, Card, Space, Typography } from 'antd'
import './App.css'

const { Title, Text } = Typography

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <div className="flex space-x-8 mb-8">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo h-24 w-24 hover:drop-shadow-[0_0_2em_#646cffaa] transition-all" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react h-24 w-24 hover:drop-shadow-[0_0_2em_#61dafbaa] transition-all animate-spin-slow" alt="React logo" />
        </a>
      </div>
      
      <Title level={1} className="!mb-8">Vite + React + Antd + Tailwind</Title>
      
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <Space orientation="vertical" size="large" className="w-full text-center">
          <div className="flex justify-center">
            <Button type="primary" size="large" onClick={() => setCount((count) => count + 1)}>
              Count is {count}
            </Button>
          </div>
          
          <Text type="secondary">
            Edit <Text code>src/App.tsx</Text> and save to test HMR
          </Text>
        </Space>
      </Card>
      
      <Text className="mt-8 text-gray-500">
        Click on the Vite and React logos to learn more
      </Text>
    </div>
  )
}

export default App
