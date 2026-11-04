// The zoom / fit / lock buttons of React Flow with translated labels.
// reactflow 11 hard-codes "zoom in", "fit view"… as title and aria-label of
// its <Controls /> (Kimi test 2026-11-04, A7-06), so this renders the same
// buttons, with the same classes and behaviour, through ControlButton.

import { Lock, LockOpen, Maximize, Minus, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ControlButton, Panel, useReactFlow, useStore, useStoreApi } from 'reactflow'

export default function FlowControls() {
  const { t } = useTranslation()
  const store = useStoreApi()
  const { zoomIn, zoomOut, fitView } = useReactFlow()
  const isInteractive = useStore((s) => s.nodesDraggable || s.nodesConnectable || s.elementsSelectable)
  const minZoomReached = useStore((s) => s.transform[2] <= s.minZoom)
  const maxZoomReached = useStore((s) => s.transform[2] >= s.maxZoom)

  const label = (key: string) => ({ title: t(`flowControls.${key}`), 'aria-label': t(`flowControls.${key}`) })
  return (
    <Panel position="bottom-left" className="react-flow__controls">
      <ControlButton className="react-flow__controls-zoomin" onClick={() => zoomIn()}
        disabled={maxZoomReached} {...label('zoomIn')}>
        <Plus />
      </ControlButton>
      <ControlButton className="react-flow__controls-zoomout" onClick={() => zoomOut()}
        disabled={minZoomReached} {...label('zoomOut')}>
        <Minus />
      </ControlButton>
      <ControlButton className="react-flow__controls-fitview" onClick={() => fitView()} {...label('fitView')}>
        <Maximize />
      </ControlButton>
      <ControlButton
        className="react-flow__controls-interactive"
        onClick={() => store.setState({
          nodesDraggable: !isInteractive,
          nodesConnectable: !isInteractive,
          elementsSelectable: !isInteractive,
        })}
        {...label(isInteractive ? 'lock' : 'unlock')}
      >
        {isInteractive ? <LockOpen /> : <Lock />}
      </ControlButton>
    </Panel>
  )
}
