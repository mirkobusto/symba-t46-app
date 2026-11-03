// A flow arrow that can be drawn apart from the other arrows between the same
// two actors. React Flow's smoothstep `offset` only lengthens the stubs at the
// two ends: two flows A → B kept the same path and label (Fable review of
// #203). This edge moves the middle segment (and the label) by `data.shift`.

import { BaseEdge, type EdgeProps } from 'reactflow'

import { flowEdgePath } from './networkGraph'

export default function FlowEdge(props: EdgeProps<{ shift?: number }>) {
  const [path, labelX, labelY] = flowEdgePath(props, props.data?.shift ?? 0)
  return (
    <BaseEdge
      id={props.id}
      path={path}
      labelX={labelX}
      labelY={labelY}
      label={props.label}
      labelStyle={props.labelStyle}
      labelShowBg
      labelBgPadding={[4, 2]}
      labelBgBorderRadius={3}
      markerEnd={props.markerEnd}
      style={props.style}
      interactionWidth={16}
    />
  )
}

