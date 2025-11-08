import { useRef, useEffect, useState } from 'react'
import PhaseCard from './PhaseCard'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

/**
 * RoadmapTimeline - Horizontal timeline view of roadmap phases
 *
 * Features:
 * - Horizontal scrolling layout
 * - Phase cards with connecting lines
 * - Navigation arrows for scrolling
 * - Responsive design (stacks on mobile)
 */
const RoadmapTimeline = ({
  phases,
  viewMode = 'detailed',
  onMilestoneSelect,
  onMilestoneStatusChange,
  selectedMilestoneId = null
}) => {
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Check scroll position
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScrollPosition()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      return () => container.removeEventListener('scroll', checkScrollPosition)
    }
  }, [phases, viewMode])

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      })
    }
  }

  if (!phases || phases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-2">📍</div>
        <p className="text-gray-600">No phases in this roadmap yet.</p>
      </div>
    )
  }

  const isCompact = viewMode === 'compact'

  return (
    <div className="relative">
      {/* Timeline Container */}
      <div className="relative py-8">
        {/* Scroll Left Button */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all"
            aria-label="Scroll left"
          >
            <FiChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Scroll Right Button */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all"
            aria-label="Scroll right"
          >
            <FiChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-visible hide-scrollbar px-8"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* Timeline Lane */}
          <div className="relative inline-flex items-start gap-8 pb-4">
            {/* Background line */}
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-gray-300 -z-10" />

            {/* Phase Cards */}
            {phases.map((phase, index) => (
              <div key={phase.id} className="relative">
                <PhaseCard
                  phase={phase}
                  phaseIndex={index}
                  isCompact={isCompact}
                  onMilestoneSelect={onMilestoneSelect}
                  onMilestoneStatusChange={onMilestoneStatusChange}
                  selectedMilestoneId={selectedMilestoneId}
                />

                {/* Remove connecting line from last phase */}
                {index === phases.length - 1 && (
                  <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: Stack Phases */}
      <style jsx>{`
        @media (max-width: 768px) {
          .overflow-x-auto {
            overflow-x: visible;
          }
          .inline-flex {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          .absolute.top-1/2 {
            display: none;
          }
        }

        /* Hide scrollbar */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default RoadmapTimeline
