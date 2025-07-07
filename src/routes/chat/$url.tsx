;
import AssistantChat from '~/components/chat/assistant-chat';
import { FileTree } from '~/components/file-tree';
import { useState, useRef, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';
import { FileCode, Eye, X, Plus, ChevronDown } from 'lucide-react';

export const Route = createFileRoute({
  component: ChatRoute,
});

function ChatRoute() {
  const [leftPanelWidth, setLeftPanelWidth] = useState(30); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState<'chat' | 'design'>('chat');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [openFiles, setOpenFiles] = useState<Array<{ id: string; name: string; path: string }>>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 20% and 70%
      if (newWidth >= 20 && newWidth <= 70) {
        setLeftPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Mock function to handle file selection from FileTree
  const handleFileOpen = (file: { id: string; name: string; path: string }) => {
    if (!openFiles.find(f => f.id === file.id)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFileId(file.id);
  };

  const handleFileClose = (fileId: string) => {
    const newFiles = openFiles.filter(f => f.id !== fileId);
    setOpenFiles(newFiles);
    if (activeFileId === fileId && newFiles.length > 0) {
      setActiveFileId(newFiles[newFiles.length - 1].id);
    } else if (newFiles.length === 0) {
      setActiveFileId(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-screen overflow-visible md:px-2 md:pb-2 flex flex-row h-full bg-background"
      id="block-panel-group"
      data-panel-group=""
      data-panel-group-direction="horizontal"
      data-panel-group-id="block-panel-group"
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        overflow: 'hidden',
        width: '100%',
        cursor: isResizing ? 'col-resize' : 'default',
      }}
    >
      {/* Left Panel - Chat */}
      <div
        className="relative h-full min-w-[300px] border-x-0 border-b-0 bg-background md:border-x md:border-b mr-1 shadow-sm"
        id="block-panel-left"
        data-panel=""
        data-panel-group-id="block-panel-group"
        data-panel-id="block-panel-left"
        data-panel-size={leftPanelWidth}
        style={{
          flex: `${leftPanelWidth} 1 0px`,
          overflow: 'hidden',
        }}
      >
        <div className="relative flex h-full flex-col">
          {/* Tab Header */}
          <div className="flex h-12 items-center gap-2 border-b px-3 bg-muted/30">
            <div className="relative flex w-fit min-w-0 flex-1 items-center gap-2 overflow-x-auto">
              <button
                className={cn(
                  "group h-7 max-w-56 select-none whitespace-nowrap rounded-md px-3 text-sm font-medium transition-all",
                  activeLeftTab === 'chat'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'hover:bg-muted/50 bg-transparent text-muted-foreground'
                )}
                data-active-tab={activeLeftTab === 'chat'}
                onClick={() => setActiveLeftTab('chat')}
              >
                <div className="truncate">Chat</div>
              </button>
              <button
                className={cn(
                  "group h-7 max-w-56 select-none whitespace-nowrap rounded-md px-3 text-sm font-medium transition-all",
                  activeLeftTab === 'design'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'hover:bg-muted/50 bg-transparent text-muted-foreground'
                )}
                data-active-tab={activeLeftTab === 'design'}
                onClick={() => setActiveLeftTab('design')}
              >
                <div className="truncate">Design</div>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="relative flex h-full min-w-0 flex-1 flex-col">
            {activeLeftTab === 'chat' ? (
              <div className="flex-1 overflow-hidden">
                <AssistantChat />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">Design view coming soon</div>
                  <div className="text-sm">Visual design tools will appear here</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="group z-20 w-0 overflow-visible outline-hidden ring-0 relative"
        role="separator"
        tabIndex={0}
        data-panel-group-direction="horizontal"
        data-panel-group-id="block-panel-group"
        data-resize-handle=""
        data-resize-handle-state={isResizing ? 'drag' : 'inactive'}
        data-panel-resize-handle-enabled="true"
        data-panel-resize-handle-id="resize-handle"
        aria-controls="block-panel-left"
        onMouseDown={handleMouseDown}
        style={{
          touchAction: 'none',
          userSelect: 'none',
          cursor: 'col-resize',
        }}
      >
        <div className="absolute inset-0 h-full w-3 translate-x-[-50%] outline-0 ring-0"></div>
        <div
          className={cn(
            "absolute inset-0 h-full w-0 translate-x-[-50%] outline-0 ring-0 transition-all duration-200",
            isResizing ? 'w-[3px] bg-primary/50' : 'group-hover:w-[3px] group-hover:bg-border',
            "group-data-[resize-handle-active=keyboard]:w-[3px]",
            "group-data-[resize-handle-state=drag]:w-[3px]",
            "group-data-[resize-handle-state=hover]:w-[3px]",
            "group-data-[resize-handle-active=keyboard]:bg-primary/50",
            "group-data-[resize-handle-state=drag]:bg-primary/50",
            "group-data-[resize-handle-state=hover]:bg-border"
          )}
        />
      </div>

      {/* Right Panel - Code Editor and Preview */}
      <div
        className="sticky top-0 h-full min-w-[420px] text-sm z-10 flex-1 bg-background shadow-sm"
        id="block-panel-right"
        data-panel=""
        data-panel-group-id="block-panel-group"
        data-panel-id="block-panel-right"
        data-panel-size={100 - leftPanelWidth}
        style={{
          flex: `${100 - leftPanelWidth} 1 0px`,
          overflow: 'hidden',
        }}
      >
        <div className="h-full w-full border-l flex flex-col">
          {/* Tabs Header */}
          <div className="flex h-12 items-center justify-between border-b bg-muted/30 px-3">
            <Tabs value={activeRightTab} onValueChange={setActiveRightTab} className="w-full">
              <div className="flex items-center justify-between w-full">
                <TabsList className="h-7 bg-transparent p-0 gap-2">
                  <TabsTrigger 
                    value="code" 
                    className="h-7 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <FileCode className="w-3.5 h-3.5 mr-1.5" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preview" 
                    className="h-7 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Tabs>
          </div>

          {/* File Tabs */}
          {openFiles.length > 0 && (
            <div className="flex h-10 items-center border-b overflow-x-auto scrollbar-hide bg-muted/10">
              <div className="flex items-center px-2">
                {openFiles.map((file) => (
                  <div
                    key={file.id}
                    className={cn(
                      "group flex items-center gap-2 px-3 py-1.5 mr-1 rounded-t cursor-pointer transition-all",
                      "hover:bg-muted/50",
                      activeFileId === file.id && "bg-background border-b-background"
                    )}
                    onClick={() => setActiveFileId(file.id)}
                  >
                    <FileCode className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm">{file.name}</span>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileClose(file.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeRightTab} className="h-full">
              <TabsContent value="code" className="h-full m-0">
                <div className="h-full flex">
                  {/* File Tree */}
                  <div className="w-64 border-r h-full overflow-y-auto">
                    <FileTree />
                  </div>
                  {/* Code Editor Area */}
                  <div className="flex-1 h-full overflow-hidden">
                    {activeFileId ? (
                      <div className="h-full p-4">
                        <div className="h-full bg-muted/20 rounded-lg flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <FileCode className="w-12 h-12 mx-auto mb-3" />
                            <p className="text-sm">Code editor placeholder</p>
                            <p className="text-xs mt-1">Selected file will be displayed here</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <p className="text-sm">Select a file to start editing</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="preview" className="h-full m-0">
                <div className="h-full flex items-center justify-center bg-white">
                  <div className="text-center text-muted-foreground">
                    <Eye className="w-12 h-12 mx-auto mb-3" />
                    <p className="text-sm">Preview will be displayed here</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}