"use client"

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

interface ContextProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}

const SideBarContext = createContext<ContextProps>({
  open: false,
  setOpen: () => { }
})

export function SideBarContextProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <SideBarContext.Provider value={{ open, setOpen }}>
      {children}
    </SideBarContext.Provider>
  )
}

export function useSideBarContext() {
  return useContext(SideBarContext)
}


