import { forwardRef, useEffect } from "react"

const DayEmpty = forwardRef(({ binary }, ref) => {
  useEffect(() => {
    if (ref?.current) {
      ref.current.style.transform = `scale(${binary ? 0.9 : 0.65})`
    }
  }, [])
  return (
    <svg className="empty">
      <rect x="0" y="0" height="100%" width="100%" />
    </svg>
  )
})

export default DayEmpty
