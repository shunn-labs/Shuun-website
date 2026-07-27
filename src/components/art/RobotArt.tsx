interface ArtProps {
  className?: string
}

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Quadruped work robot — inspired by legged industrial robots, drawn as original line art. */
export function QuadrupedArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 400 320" className={className} role="img" aria-label="Illustration of a four-legged robot">
      <g {...strokeProps} opacity={0.35}>
        <line x1="20" y1="270" x2="380" y2="270" />
      </g>
      <g {...strokeProps}>
        {/* body */}
        <rect x="120" y="110" width="160" height="70" rx="18" />
        {/* head/sensor mast */}
        <path d="M280 130 h30 a10 10 0 0 1 10 10 v10 a10 10 0 0 1 -10 10 h-30" />
        <circle cx="308" cy="150" r="5" fill="currentColor" stroke="none" />
        {/* front legs */}
        <path d="M150 180 v40 l-18 40" />
        <path d="M150 180 v40 l18 40" />
        {/* back legs */}
        <path d="M250 180 v40 l-18 40" />
        <path d="M250 180 v40 l18 40" />
        {/* feet */}
        <path d="M114 258 h36" />
        <path d="M150 258 h36" />
        <path d="M214 258 h36" />
        <path d="M250 258 h36" />
      </g>
      <g stroke="currentColor" strokeWidth={2.5} opacity={0.5}>
        <path d="M140 130 h100" strokeDasharray="4 8" />
      </g>
    </svg>
  )
}

/** Wheeled base robot with a manipulator arm, for warehouse-style handling. */
export function HaulerArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 400 320" className={className} role="img" aria-label="Illustration of a wheeled robot with a manipulator arm">
      <g {...strokeProps} opacity={0.35}>
        <line x1="20" y1="270" x2="380" y2="270" />
      </g>
      <g {...strokeProps}>
        {/* base */}
        <rect x="90" y="190" width="180" height="60" rx="14" />
        <circle cx="130" cy="262" r="16" />
        <circle cx="230" cy="262" r="16" />
        {/* mast */}
        <path d="M150 190 v-70" />
        {/* arm */}
        <path d="M150 130 h70 l30 -40" />
        {/* gripper */}
        <path d="M250 90 l20 -8" />
        <path d="M250 90 l14 14" />
      </g>
      <g stroke="currentColor" strokeWidth={2.5} opacity={0.5}>
        <rect x="108" y="205" width="60" height="30" rx="6" strokeDasharray="4 6" />
      </g>
    </svg>
  )
}

/** Bipedal humanoid robot, standing pose. */
export function HumanoidArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 400 320" className={className} role="img" aria-label="Illustration of a bipedal humanoid robot">
      <g {...strokeProps} opacity={0.35}>
        <line x1="20" y1="280" x2="380" y2="280" />
      </g>
      <g {...strokeProps}>
        {/* head */}
        <rect x="175" y="50" width="50" height="40" rx="12" />
        {/* torso */}
        <path d="M160 90 h80 l10 90 h-100 z" />
        {/* arms */}
        <path d="M160 100 l-30 50 l10 40" />
        <path d="M240 100 l30 50 l-10 40" />
        {/* legs */}
        <path d="M175 180 l-10 100" />
        <path d="M225 180 l10 100" />
        <path d="M155 280 h30" />
        <path d="M215 280 h30" />
      </g>
      <circle cx="200" cy="68" r="4" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Aerial sensing motif — a scan sweep flagging points of interest on the ground, one confirmed and one still pending review. */
export function ScanArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 400 320" className={className} role="img" aria-label="Illustration of an aerial sensor scanning the ground and flagging points of interest">
      <g stroke="currentColor" strokeWidth={2.5} opacity={0.35}>
        <line x1="20" y1="270" x2="380" y2="270" />
      </g>
      <g {...strokeProps}>
        {/* sensor lens */}
        <circle cx="200" cy="70" r="34" />
        <circle cx="200" cy="70" r="14" />
      </g>
      <g stroke="currentColor" strokeWidth={2} opacity={0.4}>
        <path d="M170 100 L110 250" strokeDasharray="6 8" />
        <path d="M230 100 L290 250" strokeDasharray="6 8" />
        <path d="M200 104 L200 260" strokeDasharray="6 8" />
      </g>
      {/* confirmed detection */}
      <circle cx="110" cy="252" r="9" fill="currentColor" stroke="none" />
      {/* pending review — lower confidence, needs a human look */}
      <circle cx="290" cy="252" r="9" fill="none" stroke="currentColor" strokeWidth={2.5} strokeDasharray="3 5" opacity={0.6} />
      <circle cx="200" cy="262" r="9" fill="currentColor" stroke="none" opacity={0.5} />
    </svg>
  )
}

/** Human-approval dashboard motif — a task list with one item confirmed and one awaiting review. */
export function ApprovalArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 400 320" className={className} role="img" aria-label="Illustration of a dashboard panel awaiting human approval of a proposed action">
      <g stroke="currentColor" strokeWidth={2.5} opacity={0.35}>
        <line x1="20" y1="270" x2="380" y2="270" />
      </g>
      <g {...strokeProps}>
        {/* panel */}
        <rect x="110" y="60" width="200" height="150" rx="16" />
        {/* task rows */}
        <path d="M132 100 h130" />
        <path d="M132 140 h100" opacity={0.5} />
        <path d="M132 180 h115" opacity={0.5} />
      </g>
      {/* approved row: check */}
      <circle cx="278" cy="100" r="10" fill="none" stroke="currentColor" strokeWidth={2.5} />
      <path d="M273 100 l4 4 l8 -9" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* pending rows: hollow, awaiting review */}
      <circle cx="248" cy="140" r="8" fill="none" stroke="currentColor" strokeWidth={2} opacity={0.4} />
      <circle cx="263" cy="180" r="8" fill="none" stroke="currentColor" strokeWidth={2} opacity={0.4} />
      {/* a hand confirming the approved row */}
      <path
        d="M330 130 l16 -22 a8 8 0 0 1 13 9 l-9 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
      />
    </svg>
  )
}

/** Abstract network / dashboard motif for fleet-management software. */
export function NetworkArt({ className }: ArtProps) {
  const nodes = [
    [60, 60],
    [200, 40],
    [330, 90],
    [90, 180],
    [240, 200],
    [340, 240],
    [140, 260],
  ]
  return (
    <svg viewBox="0 0 400 320" className={className} role="img" aria-label="Abstract illustration of a connected robot fleet dashboard">
      <g stroke="currentColor" strokeWidth={2} opacity={0.4}>
        <line x1={nodes[0][0]} y1={nodes[0][1]} x2={nodes[1][0]} y2={nodes[1][1]} />
        <line x1={nodes[1][0]} y1={nodes[1][1]} x2={nodes[2][0]} y2={nodes[2][1]} />
        <line x1={nodes[0][0]} y1={nodes[0][1]} x2={nodes[3][0]} y2={nodes[3][1]} />
        <line x1={nodes[3][0]} y1={nodes[3][1]} x2={nodes[4][0]} y2={nodes[4][1]} />
        <line x1={nodes[4][0]} y1={nodes[4][1]} x2={nodes[2][0]} y2={nodes[2][1]} />
        <line x1={nodes[4][0]} y1={nodes[4][1]} x2={nodes[5][0]} y2={nodes[5][1]} />
        <line x1={nodes[3][0]} y1={nodes[3][1]} x2={nodes[6][0]} y2={nodes[6][1]} />
      </g>
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 4 ? 10 : 6} fill="currentColor" opacity={i === 4 ? 1 : 0.7} />
      ))}
    </svg>
  )
}
