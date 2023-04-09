"use client"

import Card from './Card'
import { motion } from 'framer-motion'
import { useSideBarContext } from '@/contexts/SideBarContext'
import { useDisplay } from '@/hooks/useDisplay'

const gridVariants = {
  open: {
    x: "-5rem",
    transition: {
      duration: 0.2
    }
  },
  closed: {
    x: "0",
    transition: {
      type: "spring",
      damping: 12,
      delay: 0.25
    }
  }
}

export default function Grid({ posts }: { posts: Post[] }) {
  const display = useDisplay()
  const { open, setOpen } = useSideBarContext()

  if (display == "mobile") {
    setOpen(false)
  }

  return (
    <motion.div
      animate={open == true ? "open" : "closed"}
      initial={false}
      variants={gridVariants}
      className="shopLayout">
      {posts.map((post, idx) => {
        return <Card post={post} key={idx} idx={idx} />
      })}
    </motion.div>
  )
}
