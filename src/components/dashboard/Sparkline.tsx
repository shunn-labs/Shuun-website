interface SparklineProps {
  values: number[]
  className?: string
  /** Tailwind text-* colour class drives both the line and its fill. */
  tone?: string
}

/**
 * Minimal trend line for a sensor card. Draws nothing until there are two
 * points, so a freshly-added sensor doesn't flash a flat artefact.
 */
export function Sparkline({ values, className = '', tone = 'text-accent' }: SparklineProps) {
  if (values.length < 2) {
    return <div className={`h-10 ${className}`} aria-hidden="true" />
  }

  const width = 100
  const height = 32
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width
    // 2px of padding top and bottom keeps the stroke from clipping.
    const y = height - 2 - ((v - min) / span) * (height - 4)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })

  const gradientId = `spark-${Math.round(min * 100)}-${values.length}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`h-10 w-full ${tone} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points.join(' ')} ${width},${height}`}
        fill={`url(#${gradientId})`}
      />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
