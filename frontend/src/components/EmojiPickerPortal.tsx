





import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import EmojiPickerLib, { Theme } from 'emoji-picker-react'





const PICKER_W = 340
const PICKER_H = 400



interface EmojiPickerPortalProps {
  
  anchorRef: React.RefObject<HTMLElement>
  onPick: (emoji: string) => void
  onClose: () => void
}



export default function EmojiPickerPortal({
  anchorRef,
  onPick,
  onClose,
}: EmojiPickerPortalProps) {
  const pickerRef = useRef<HTMLDivElement>(null)

  const [pos, setPos] = useState<React.CSSProperties>({
    position: 'fixed',
    visibility: 'hidden', 
    zIndex: 9999,
  })

  
  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const openUpward = spaceBelow < PICKER_H + 16 && spaceAbove >= PICKER_H + 16

    
    let left = rect.right - PICKER_W
    left = Math.max(left, 8)
    left = Math.min(left, window.innerWidth - PICKER_W - 8)

    setPos({
      position: 'fixed',
      zIndex: 9999,
      left,
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + 6 }
        : { top: rect.bottom + 6 }),
    })
  }, [anchorRef])

  
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        pickerRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      ) return
      onClose()
    }

    
    
    const id = setTimeout(() => {
      document.addEventListener('mousedown', handler)
    }, 40)

    return () => {
      clearTimeout(id)
      document.removeEventListener('mousedown', handler)
    }
  }, [anchorRef, onClose])

  
  return createPortal(
    <div className="emoji-picker-portal" ref={pickerRef} style={pos}>
      <EmojiPickerLib
        onEmojiClick={(data) => {
          onPick(data.emoji)
          onClose()
        }}
        theme={Theme.DARK}
        lazyLoadEmojis
        skinTonesDisabled
        searchDisabled={false}
        previewConfig={{ showPreview: false }}
        
        
        width={PICKER_W}
        height={PICKER_H}
      />
    </div>,
    document.body,
  )
}
