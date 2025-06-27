import { ChevronRight, type LucideIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '~/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';

interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavMainItem[];
}

// Recursive component for rendering nested menu items
function NavMenuItem({ item, isNested = false }: { item: NavMainItem; isNested?: boolean }) {
  if (isNested) {
    // Render as sub-menu item
    return (
      <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton asChild>
            <a href={item.url}>
              <span>{item.title}</span>
            </a>
          </SidebarMenuSubButton>
          {item.items && item.items.length > 0 && (
            <>
              <CollapsibleTrigger asChild>
                <SidebarMenuAction className="data-[state=open]:rotate-90">
                  <ChevronRight />
                  <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="mr-0 pr-0">
                  {item.items.map((subItem) => (
                    <NavMenuItem key={subItem.title} item={subItem} isNested={true} />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </>
          )}
        </SidebarMenuSubItem>
      </Collapsible>
    );
  }

  // Render as top-level menu item
  return (
    <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={item.title}>
          <a href={item.url}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </a>
        </SidebarMenuButton>
        {item.items && item.items.length > 0 && (
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRight />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="mr-0 pr-0">
                {item.items.map((subItem) => (
                  <NavMenuItem key={subItem.title} item={subItem} isNested={true} />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <NavMenuItem key={item.title} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
