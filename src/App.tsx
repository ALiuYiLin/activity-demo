import { Button, Col, Flex, Modal, Row } from 'antd'
import classNames from 'classnames'
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
        {/* TO-CHECK 左队是否被选择 bg-yellow-400 */}
        <Col span={12} className={classNames('bg-blue-400 h-50 relative', { 'bg-yellow-400': derived.isLeftSelected })}>
          <Flex vertical>
            {/* TO-CHECK 左队是否被选择 */}
            <p>是否被选择：{derived.isLeftSelected ? '是' : '否'}</p>
            {/* TO-CHECK 左队是否晋级 */}
            <p>是否晋级：{derived.isLeftAdvanced ? '是' : '否'}</p>
            {/* TO-CHECK 打开选择模态框 1 */}
            {/* TO-CHECK 已投票不显示 */}
            {!derived.isVoted && <Button onClick={() => options.openSelectModal(1)}>选择</Button>}
          </Flex>
        </Col>
        {/* TO-CHECK 右队是否被选择 bg-yellow-400 */}
        <Col span={12} className={classNames('bg-green-400 h-50 relative', { 'bg-yellow-400': derived.isRightSelected })}>
          <Flex vertical>
            {/* TO-CHECK 右队是否被选择 */}
            <p>是否被选择：{derived.isRightSelected ? '是' : '否'}</p>
            {/* TO-CHECK 右队是否晋级 */}
            <p>是否晋级：{derived.isRightAdvanced ? '是' : '否'}</p>
            {/* TO-CHECK 打开选择模态框 2 */}
            {/* TO-CHECK 已投票不显示 */}
            {!derived.isVoted && <Button onClick={() => options.openSelectModal(2)}>选择</Button>}
          </Flex>
        </Col>
      </Row>
      {/* TO-CHECK 选择模态框 */}
      <Modal title="确认选择模态框" open={ui.showSelectModal} onCancel={options.closeSelectModal} onOk={options.comfirmSelect}>
        <p>你选择了：{ui.tempSelectTeam === 1 ? '左队' : '右队'}</p>
      </Modal>
    </div>
  )
}

export default App
