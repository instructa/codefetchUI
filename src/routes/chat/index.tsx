import { Button } from '~/components/ui/button';
import { useState, useCallback } from 'react';
import {
  ChevronRight,
  Sparkles,
  ArrowUp,
  Github,
  Upload,
  FileArchive,
  X,
  FolderSync,
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '~/lib/utils';
import { useDropzone } from 'react-dropzone';
import { Input } from '~/components/ui/input';

export const Route = createFileRoute({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const [githubUrl, setGithubUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, buttonId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  // Handle GitHub URL submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (githubUrl.trim()) {
      let processedUrl = githubUrl.trim();

      // Convert shorthand format to full URL
      if (!processedUrl.startsWith('http')) {
        // Check if it's in format user/repo
        if (processedUrl.includes('/') && !processedUrl.includes('github.com')) {
          processedUrl = `https://github.com/${processedUrl}`;
        } else if (!processedUrl.includes('/')) {
          setError('Please enter a valid GitHub repository (e.g., user/repo)');
          return;
        }
      }

      // Validate GitHub URL format
      const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+$/;
      if (!githubRegex.test(processedUrl)) {
        setError('Please enter a valid GitHub URL or repository name');
        return;
      }

      // Navigate to the chat/$url route
      navigate({
        to: '/chat/$url',
        params: { url: encodeURIComponent(processedUrl) },
      });
    } else if (uploadedFile) {
      // TODO: Implement file upload processing
      // For now, we'll show an error that this feature is coming soon
      setError('File upload processing is coming soon. Please use a GitHub URL for now.');
    }
  };

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      setError('Please upload a .zip file only');
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      // Clear GitHub URL when file is uploaded
      setGithubUrl('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    multiple: false,
    noClick: true, // We'll handle click through our own button
  });

  const handleFileRemove = () => {
    setUploadedFile(null);
    setError(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      setUploadedFile(file);
      setGithubUrl('');
      setError(null);
    }
  };

  const handleSyncLocal = () => {
    // Handle sync from local
    setError('Local sync feature is coming soon.');
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-4 pt-32 lg:pt-48 px-4">
      {/* Top Notification Pill */}
      <div className="mx-auto max-w-3xl overflow-hidden rounded-full bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 hover:shadow-md dark:shadow-gray-900/20">
        <button className="group flex items-center justify-between overflow-hidden whitespace-nowrap px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <div className="pointer-events-none inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border ring-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 border-teal-100 dark:border-teal-900 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 hover:border-teal-100 hover:bg-teal-100 focus:border-teal-100 focus:bg-teal-100 focus-visible:border-teal-100 focus-visible:bg-teal-100 h-5 px-1.5 text-[11px] font-medium">
              New
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Analyze any GitHub repository</span>
          </div>
          <div className="flex items-center pl-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
            <span className="mr-0.5">Start now</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
      </div>

      {/* Main Title */}
      <h1
        data-testid="app-title"
        className="font-heading text-pretty text-center font-semibold tracking-tighter text-gray-900 dark:text-gray-100 sm:text-[32px] md:text-[46px] text-[29px]"
      >
        Explore any codebase with AI
      </h1>

      {/* Form Container with Dropzone */}
      <div className="group/form-container content-center relative mx-auto w-full max-w-3xl">
        <div
          {...getRootProps()}
          className={cn(
            'relative z-10 flex w-full flex-col transition-all duration-200',
            isDragActive && 'scale-[1.02]'
          )}
        >
          <form
            onSubmit={handleSubmit}
            className={cn(
              'focus-within:border-gray-600 dark:focus-within:border-gray-400 bg-gray-50 dark:bg-gray-900/50 relative rounded-xl border-2 transition-all overflow-visible shadow-sm dark:shadow-gray-900/20',
              isDragActive
                ? 'border-teal-500 dark:border-teal-400 border-dashed bg-teal-50/50 dark:bg-teal-900/20 shadow-lg'
                : 'border-gray-200 dark:border-gray-700'
            )}
          >
            <input {...getInputProps()} />

            {/* Drag overlay */}
            {isDragActive && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-teal-50/90 dark:bg-teal-900/90 backdrop-blur-sm">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-teal-600 dark:text-teal-400 mb-2 animate-bounce" />
                  <p className="text-sm font-medium text-teal-900 dark:text-teal-100">Drop your project files here</p>
                  <p className="text-xs text-teal-700 dark:text-teal-300 mt-1">Only .zip files are supported</p>
                </div>
              </div>
            )}

            <div className="@container/textarea bg-transparent relative z-10 grid p-4 min-h-0 rounded-xl">
              {/* GitHub URL Input or File Display */}
              <div className="text-sm h-full w-full overflow-y-auto max-h-[200px] min-h-[44px]">
                {uploadedFile ? (
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <FileArchive className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleFileRemove}
                      className="h-7 w-7 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      value={githubUrl}
                      onChange={(e) => {
                        setGithubUrl(e.target.value);
                        setError(null);
                      }}
                      placeholder="regenrek/codefetch"
                      className="w-full h-11 pl-10 pr-3 bg-transparent border-0 focus:ring-0 text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
                      type="text"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 dark:bg-red-400 rounded-full"></span>
                  {error}
                </div>
              )}

              {/* Toolbar */}
              <div className="@container/prompt-form-toolbar flex items-center gap-1 border-t dark:border-gray-700 pt-3 mt-3">
                <div className="flex items-end gap-0.5 sm:gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex h-7 justify-start rounded-md text-[12px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 sm:text-[13px] pl-2 pr-1"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span className="hidden @sm/prompt-form-toolbar:inline">AI Analysis</span>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-1 rotate-90" />
                  </Button>
                </div>

                <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
                  <label htmlFor="file-upload-inline">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                      asChild
                    >
                      <span className="cursor-pointer">
                        <Upload className="h-4 w-4" />
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload-inline"
                    type="file"
                    accept=".zip"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedFile(file);
                        setGithubUrl('');
                        setError(null);
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    disabled={!githubUrl.trim() && !uploadedFile}
                    className="ml-1 h-7 px-3 rounded-md bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:opacity-50 flex items-center gap-1"
                    size="sm"
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs">Analyze</span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Drop zone hint */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter a GitHub URL like{' '}
            <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-gray-700 dark:text-gray-300">
              github.com/user/repo
            </code>{' '}
            or drag & drop a .zip file
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex min-h-0 shrink-0 items-center justify-center mt-8">
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
            <label htmlFor="file-upload-button">
              <Button
                variant="outline"
                className="focus:border-gray-400 focus-visible:border-gray-400 disabled:border-gray-300 border-gray-400 hover:border-gray-400 focus-visible:ring-offset-background aria-disabled:border-gray-300 outline-hidden has-focus-visible:ring-2 inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium ring-blue-600 transition focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 aria-disabled:cursor-not-allowed aria-disabled:bg-gray-100 aria-disabled:text-gray-400 aria-disabled:ring-0 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 focus-visible:bg-gray-100 h-8 px-3 rounded-full border-none text-[13px] text-gray-600 dark:text-gray-300 shadow-sm hover:text-gray-900 dark:hover:text-gray-100"
                asChild
              >
                <span>
                  <Upload className="h-[14px] w-[14px] mr-1.5" />
                  Upload files (.zip)
                </span>
              </Button>
            </label>
            <input
              id="file-upload-button"
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
              className="focus:border-gray-400 focus-visible:border-gray-400 disabled:border-gray-300 border-gray-400 hover:border-gray-400 focus-visible:ring-offset-background aria-disabled:border-gray-300 outline-hidden has-focus-visible:ring-2 inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium ring-blue-600 transition focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 aria-disabled:cursor-not-allowed aria-disabled:bg-gray-100 aria-disabled:text-gray-400 aria-disabled:ring-0 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 focus-visible:bg-gray-100 h-8 px-3 rounded-full border-none text-[13px] text-gray-600 dark:text-gray-300 shadow-sm hover:text-gray-900 dark:hover:text-gray-100"
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
