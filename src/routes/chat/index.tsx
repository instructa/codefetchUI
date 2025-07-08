import { } from '@tanstack/react-router';
import { Button } from '~/components/ui/button';
import { useState } from 'react';
import { Upload, FolderSync, ChevronRight, Sparkles, Paperclip, ArrowUp } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '~/lib/utils';

export const Route = createFileRoute({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, buttonId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      // Handle zip file upload
      console.log('Uploading zip file:', file.name);
      // TODO: Implement file upload logic
    }
  };

  const handleSyncLocal = () => {
    // Handle sync from local
    console.log('Syncing from local');
    // TODO: Implement local sync logic
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      // Navigate to chat with the prompt
      // For now, just log
      console.log('Submitting prompt:', prompt);
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-4 pt-32 lg:pt-48">
      {/* Top Notification Pill */}
      <div className="mx-auto max-w-3xl overflow-hidden rounded-full bg-white shadow-sm transition-all duration-200 hover:shadow-md">
        <button className="group flex items-center justify-between overflow-hidden whitespace-nowrap px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <div className="pointer-events-none inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border ring-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 border-teal-100 bg-teal-100 text-teal-700 hover:border-teal-100 hover:bg-teal-100 focus:border-teal-100 focus:bg-teal-100 focus-visible:border-teal-100 focus-visible:bg-teal-100 h-5 px-1.5 text-[11px] font-medium">
              New
            </div>
            <span className="text-sm font-medium text-gray-900">Chat with your codebase</span>
          </div>
          <div className="flex items-center pl-1.5 text-sm font-medium text-gray-500 group-hover:text-gray-700">
            <span className="mr-0.5">Start now</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
      </div>

      {/* Main Title */}
      <h1
        data-testid="app-title"
        className="font-heading text-pretty text-center font-semibold tracking-tighter text-gray-900 sm:text-[32px] md:text-[46px] text-[29px]"
      >
        What can I help you build?
      </h1>

      {/* Form Container */}
      <div className="group/form-container content-center relative mx-auto w-full max-w-3xl">
        <div className="relative z-10 flex w-full flex-col">
          <div
            className="peer relative rounded-t-xl bg-gray-100 text-gray-600"
            style={{ opacity: 1, height: 'auto' }}
          ></div>
          <div className="rounded-b-xl peer-has-[.banner-error]:bg-red-50 peer-has-[.banner-regular]:bg-gray-100">
            <form
              onSubmit={handleSubmit}
              className="focus-within:border-gray-600 bg-gray-50 relative rounded-xl border border-gray-400 shadow-sm transition-shadow overflow-visible"
            >
              <div className="@container/textarea bg-gray-50 relative z-10 grid p-3 min-h-0 rounded-xl">
                {/* Textarea */}
                <div
                  spellCheck="false"
                  className="text-sm h-full w-full overflow-y-auto max-h-[200px] min-h-[44px] pb-2"
                >
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask CodeFetch to analyze..."
                    className="w-full h-full outline-none bg-transparent resize-none"
                    rows={2}
                  />
                </div>

                {/* Toolbar */}
                <div className="@container/prompt-form-toolbar flex items-center gap-1">
                  <div className="flex items-end gap-0.5 sm:gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="flex h-7 justify-start rounded-md text-[12px] text-gray-500 hover:text-gray-900 sm:text-[13px] pl-2 pr-1"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span className="hidden @sm/prompt-form-toolbar:inline">AI Model</span>
                      </div>
                      <ChevronRight className="h-4 w-4 ml-1 rotate-90" />
                    </Button>
                  </div>

                  <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md hover:bg-gray-100"
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-[-2px] h-7 w-7 rounded-md hover:bg-gray-100"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>

                    <Button
                      type="submit"
                      disabled={!prompt.trim()}
                      className="ml-1 h-7 w-7 rounded-md bg-gray-900 text-white hover:bg-gray-700 disabled:bg-gray-300"
                      size="icon"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex min-h-0 shrink-0 items-center justify-center">
        <div
          className="flex max-w-[1000px] flex-wrap justify-center gap-3"
          role="list"
          style={{ opacity: 1 }}
        >
          <h2 className="sr-only">Quick Actions</h2>

          {/* Upload Files Button */}
          <div
            className="relative"
            onMouseEnter={() => setIsHovering('upload')}
            onMouseLeave={() => setIsHovering(null)}
            onMouseMove={(e) => handleMouseMove(e, 'upload')}
          >
            <div
              className="pointer-events-none absolute -inset-px rounded-full"
              style={{
                opacity: isHovering === 'upload' ? 1 : 0,
                background: 'transparent',
                transition: 'opacity 0.15s',
              }}
            >
              <div
                className="absolute inset-0 rounded-full border border-[rgba(68,225,211,0.9)] dark:border-[rgba(68,225,211,0.5)]"
                style={{
                  background: 'transparent',
                  clipPath: 'inset(0px round 9999px)',
                  maskImage:
                    isHovering === 'upload'
                      ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, black, transparent 100%)`
                      : undefined,
                  WebkitMaskImage:
                    isHovering === 'upload'
                      ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, black, transparent 100%)`
                      : undefined,
                }}
              />
            </div>
            <label htmlFor="file-upload">
              <Button
                variant="outline"
                className="focus:border-gray-400 focus-visible:border-gray-400 disabled:border-gray-300 border-gray-400 hover:border-gray-400 focus-visible:ring-offset-background aria-disabled:border-gray-300 outline-hidden has-focus-visible:ring-2 inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium ring-blue-600 transition focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 aria-disabled:cursor-not-allowed aria-disabled:bg-gray-100 aria-disabled:text-gray-400 aria-disabled:ring-0 bg-gray-50 hover:bg-gray-100 focus:bg-gray-100 focus-visible:bg-gray-100 h-8 px-3 rounded-full border-none text-[13px] text-gray-600 shadow-sm hover:text-gray-900"
                asChild
              >
                <span>
                  <Upload className="h-[14px] w-[14px] mr-1.5" />
                  Upload files (.zip)
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".zip"
              className="sr-only"
              onChange={handleFileUpload}
            />
          </div>

          {/* Sync from Local Button */}
          <div
            className="relative"
            onMouseEnter={() => setIsHovering('sync')}
            onMouseLeave={() => setIsHovering(null)}
            onMouseMove={(e) => handleMouseMove(e, 'sync')}
          >
            <div
              className="pointer-events-none absolute -inset-px rounded-full"
              style={{
                opacity: isHovering === 'sync' ? 1 : 0,
                background: 'transparent',
                transition: 'opacity 0.15s',
              }}
            >
              <div
                className="absolute inset-0 rounded-full border border-[rgba(68,225,211,0.9)] dark:border-[rgba(68,225,211,0.5)]"
                style={{
                  background: 'transparent',
                  clipPath: 'inset(0px round 9999px)',
                  maskImage:
                    isHovering === 'sync'
                      ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, black, transparent 100%)`
                      : undefined,
                  WebkitMaskImage:
                    isHovering === 'sync'
                      ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, black, transparent 100%)`
                      : undefined,
                }}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleSyncLocal}
              className="focus:border-gray-400 focus-visible:border-gray-400 disabled:border-gray-300 border-gray-400 hover:border-gray-400 focus-visible:ring-offset-background aria-disabled:border-gray-300 outline-hidden has-focus-visible:ring-2 inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium ring-blue-600 transition focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 aria-disabled:cursor-not-allowed aria-disabled:bg-gray-100 aria-disabled:text-gray-400 aria-disabled:ring-0 bg-gray-50 hover:bg-gray-100 focus:bg-gray-100 focus-visible:bg-gray-100 h-8 px-3 rounded-full border-none text-[13px] text-gray-600 shadow-sm hover:text-gray-900"
            >
              <FolderSync className="h-[14px] w-[14px] mr-1.5" />
              Sync from local
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
