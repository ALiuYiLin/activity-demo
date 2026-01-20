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
  const derived = useDerived({ ...base, ...ui })
  const options = useOptions({ ...base, ...derived, ...ui })

  return (
    <div className="">
      {/* TO-CHECK 比赛是否结束 */}
      <h1>比赛是否结束 {derived.isMatchEnded ? '是' : '否'}</h1>
      <Row gutter={20} >
        {/* TO-CHECK 左队是否被选择 bg-yellow-400 */}
        <Col span={12} className={classNames('bg-blue-400 h-50 relative', { 'bg-yellow-400': derived.isLeftSelected })}>
          <Flex vertical>
            {/* TO-CHECK 左队是否被选择 */}
            <p>是否被选择：{derived.isLeftSelected ? '是' : '否'}</p>
            {/* TO-CHECK 左队是否晋级 */}
            <p>是否晋级：{derived.isLeftAdvanced ? '是' : '否'}</p>
            {/* TO-CHECK 左队获取的投票数量*/}
            <p>获得投票数量：{derived.leftVoteCount}</p>
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
            {/* TO-CHECK 右队获取的投票数量*/}
            <p>获得投票数量：{derived.rightVoteCount}</p>
            {/* TO-CHECK 打开选择模态框 2 */}
            {/* TO-CHECK 已投票不显示 */}
            {!derived.isVoted && <Button onClick={() => options.openSelectModal(2)}>选择</Button>}
          </Flex>
        </Col>
      </Row>
      {/* TO-CHECK 选择模态框 */}
      <Modal 
        title="确认选择模态框"
        open={ui.showSelectModal}
        onCancel={options.closeSelectModal}
        onOk={options.comfirmSelect}
      >
        <p>内容</p>
      </Modal>
    </div>
  )
}

export default App
