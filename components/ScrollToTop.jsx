import { useEffect, useState } from 'react'
import { BiArrowFromBottom } from 'react-icons/bi'

import { classNames } from '~/utils/classNames'

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <div className="fixed bottom-9 xs:right-1 xs:left-auto left-1">
      <button
        type="button"
        onClick={scrollToTop}
        className={classNames(
          isVisible ? 'opacity-100' : 'opacity-0',
          'text-cyan-600/60 hover:bg-cyan-700/20 focus:text-cyan-500 hover:outline-none rounded-lg border-[1.5px] border-cyan-600 inline-flex items-center shadow-sm transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2',
        )}
      >
        <BiArrowFromBottom className="h-7 w-7 xs:h-10 xs:w-10" aria-hidden="true" />
      </button>
    </div>
  )
}