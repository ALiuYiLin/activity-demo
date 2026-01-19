import { Button, Col, Flex, Modal, Row } from 'antd'
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
    <div className="">
      <Row gutter={20} >
        {/* TODO 左队是否被选择 bg-yellow-400 */}
        <Col span={12} className='bg-blue-400 h-50 relative'>
          <Flex vertical>
            {/* TODO 左队是否被选择 */}
            <p>是否被选择：{}</p>
            {/* TODO 左队是否晋级 */}
            <p>是否晋级：{}</p>
            {/* TODO 打开选择模态框 */}
            <Button>选择</Button>
          </Flex>
        </Col>
        {/* TODO 右队是否被选择 bg-yellow-400 */}
        <Col span={12} className='bg-green-400 h-50 relative'>
          <Flex vertical>
            {/* TODO 右队是否被选择 */}
            <p>是否被选择：{}</p>
            {/* TODO 右队是否晋级 */}
            <p>是否晋级：{}</p>
            {/* TODO 打开选择模态框 */}
            <Button>选择</Button>
          </Flex>
        </Col>
      </Row>
      {/* 选择模态框 */}
      <Modal title="确认选择模态框">
        <p>内容</p>
      </Modal>
    </div>
  )
}

export default App
