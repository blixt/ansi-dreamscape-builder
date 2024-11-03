import * as SheetPrimitive from "@radix-ui/react-dialog"
import { SheetContent } from "./sheet/sheet-content"
import { SheetHeader, SheetFooter } from "./sheet/sheet-header"
import { SheetTitle, SheetDescription } from "./sheet/sheet-title"

const Sheet = SheetPrimitive.Root
const SheetTrigger =  SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal
const SheetOverlay = SheetPrimitive.Overlay

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}