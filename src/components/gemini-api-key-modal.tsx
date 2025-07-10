import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Shield, Key, AlertCircle } from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey } from '~/utils/ast-grep-ai';

interface GeminiApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GeminiApiKeyModal({ open, onOpenChange }: GeminiApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    const existingKey = getGeminiApiKey();
    if (existingKey) {
      setHasExistingKey(true);
      setApiKey(''); // Don't show the actual key
    }
  }, [open]);

  const handleSave = () => {
    if (apiKey.trim()) {
      setGeminiApiKey(apiKey);
      onOpenChange(false);
    }
  };

  const handleRemove = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('geminiApiKey');
      setHasExistingKey(false);
      setApiKey('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Gemini API Key Settings
          </DialogTitle>
          <DialogDescription className="space-y-2 pt-2">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-green-500 mt-0.5" />
              <p className="text-sm">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Get your Gemini API key from{' '}
              <a
                href="https://ai.google.dev/gemini-api/docs/api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {hasExistingKey && !apiKey && (
            <div className="bg-muted p-3 rounded-md flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">API key already configured</p>
                <p className="text-xs text-muted-foreground">
                  Enter a new key to replace it or remove the existing one.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                placeholder={hasExistingKey ? 'Enter new API key' : 'Enter your Gemini API key'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? 'Hide' : 'Show'}
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Your key is stored in browser local storage</p>
            <p>• The key will persist across sessions</p>
            <p>• Clear your browser data to remove the key</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {hasExistingKey && (
            <Button variant="destructive" onClick={handleRemove}>
              Remove Key
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!apiKey.trim()}>
            Save Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
