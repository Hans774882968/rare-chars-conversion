import { toast, Toaster } from 'sonner';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { getWebsiteBasePath } from './lib/routeUtils';
import NavigateForGitHubPages from './NavigateForGitHubPages';
import { chineseDict, pinyinDict } from './lib/pinyinDictCompressedData';
import { useState } from 'react';
import { convertTextToRareChars } from './lib/convertToRareChars';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CopyIcon, ShuffleIcon } from 'lucide-react';

const basePath = getWebsiteBasePath();

export function RareCharConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [autoConvert, setAutoConvert] = useState(false);

  const handleConvert = () => {
    if (!inputText.trim()) {
      toast.warning('请输入中文文本');
      return;
    }

    const result = convertTextToRareChars(inputText, chineseDict, pinyinDict);
    setOutputText(result);
    toast.success('转换成功！生僻字已生成');
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      toast.success('已复制到剪贴板');
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <div className="space-y-2">
        <Label htmlFor="input" className="text-lg font-semibold">
          输入文本
        </Label>
        <Textarea
          id="input"
          placeholder="请输入中文文本，例如：今天天气真好！"
          value={inputText}
          onChange={e => {
            setInputText(e.target.value);
            if (autoConvert) {
              if (!e.target.value.trim()) {
                setOutputText('');
                return;
              }
              const result = convertTextToRareChars(e.target.value, chineseDict, pinyinDict);
              setOutputText(result);
            }
          }}
          className="min-h-[120px] font-mono text-foreground"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="auto-convert"
          checked={autoConvert}
          onCheckedChange={setAutoConvert}
        />
        <Label htmlFor="auto-convert">自动转换</Label>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleConvert}
          disabled={!inputText.trim()}
          className="flex-1"
        >
          <ShuffleIcon className="mr-2 h-4 w-4" />
          转换为生僻字
        </Button>

        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!outputText}
        >
          <CopyIcon className="mr-2 h-4 w-4" />
          复制
        </Button>
      </div>

      {outputText && (
        <div className="space-y-2">
          <Label className="text-lg font-semibold">转换结果</Label>
          <Textarea
            readOnly
            value={outputText}
            className="min-h-[120px] font-mono bg-muted/30 text-foreground"
          />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router basename={basePath}>
      <Toaster
        position='top-center'
        toastOptions={{
          style: {
            color: 'var(--foreground)',
            background: 'var(--background)',
            borderColor: 'var(--border)',
          },
          classNames: {
            title: '!font-bold !text-base',
            description: '!text-foreground',
            actionButton: '!bg-primary !text-primary-foreground !font-bold hover:!bg-primary/85',
          },
        }}
      />
      <NavigateForGitHubPages>
        <RareCharConverter />
      </NavigateForGitHubPages>
    </Router>
  );
}
