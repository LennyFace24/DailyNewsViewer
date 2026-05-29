import { Dialog as SheetPrimitive } from "bits-ui";
import Root from "./sheet.svelte";
import Content from "./sheet-content.svelte";
import Description from "./sheet-description.svelte";
import Footer from "./sheet-footer.svelte";
import Header from "./sheet-header.svelte";
import Overlay from "./sheet-overlay.svelte";
import Portal from "./sheet-porta.svelte";
import Title from "./sheet-title.svelte";

const Close = SheetPrimitive.Close;

export {
  Root,
  Close,
  Content,
  Description,
  Footer,
  Header,
  Overlay,
  Portal,
  Title,
  //
  Root as Sheet,
  Close as SheetClose,
  Content as SheetContent,
  Description as SheetDescription,
  Footer as SheetFooter,
  Header as SheetHeader,
  Overlay as SheetOverlay,
  Portal as SheetPortal,
  Title as SheetTitle,
};
