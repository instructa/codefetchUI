// import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border-subtle bg-surface-elevated/50 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-6">
        <SidebarTrigger className="-ml-1 h-8 w-8 rounded-md hover:bg-accent/10 transition-colors" />
        <Separator orientation="vertical" className="mx-2 h-5 bg-border-subtle" />
        {/* <h1 className="text-title">Documents</h1> */}
        <div className="ml-auto flex items-center gap-3">
          {/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex button-ghost rounded-md">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="text-body-sm"
            >
              GitHub
            </a>
          </Button> */}
        </div>
      </div>
    </header>
  );
}
