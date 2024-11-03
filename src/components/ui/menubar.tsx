import * as MenubarPrimitive from "@radix-ui/react-menubar"
import {
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
} from "./menubar/menubar-item"
import {
  MenubarContent,
  MenubarSubContent,
  MenubarSubTrigger,
} from "./menubar/menubar-content"
import {
  Menubar,
  MenubarTrigger,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
} from "./menubar/menubar-root"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}

export const MenubarMenu = MenubarPrimitive.Menu
export const MenubarGroup = MenubarPrimitive.Group
export const MenubarPortal = MenubarPrimitive.Portal
export const MenubarSub = MenubarPrimitive.Sub
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup