import {  Outlet, useNavigate, useParams } from '@tanstack/react-router';
import { AppSidebar } from '~/components/app-sidebar';
import { SiteHeader } from '~/components/site-header';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
// import { getSession } from '~/server/function/auth.server.func';
import { Input } from '~/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { isUrl } from '~/utils/is-url';
import { useEffect } from 'react';

const searchSchema = z.object({
  search: z.string().refine(isUrl, {
    message: 'Please enter a valid GitHub URL',
  }),
});

export const Route = createFileRoute({
  // All children (/dashboard, /dashboard/settings, etc.) inherit this guard
  // beforeLoad: async ({ location }) => {
  //   const session = await getSession();

  //   if (!session) {
  //     // Preserve deep link for redirect after sign-in
  //     const redirectPath = location.pathname + location.search;

  //     throw redirect({
  //       to: '/auth/$pathname',
  //       params: { pathname: 'sign-in' },
  //       search: { redirect: redirectPath },
  //     });
  //   }

  //   return {
  //     user: session.user,
  //   };
  // },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });

  // Get the URL from params if we're on a /$url route
  const currentUrl = params.url ? decodeURIComponent(params.url as string) : '';

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: currentUrl,
    },
  });

  // Update form when URL changes
  useEffect(() => {
    if (currentUrl && currentUrl !== form.getValues('search')) {
      form.setValue('search', currentUrl);
    }
  }, [currentUrl, form]);

  function onSubmit(values: z.infer<typeof searchSchema>) {
    const encodedUrl = encodeURIComponent(values.search);
    navigate({ to: `/${encodedUrl}` });
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="text" placeholder="Enter URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
