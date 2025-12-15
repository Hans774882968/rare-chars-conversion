import { useState } from 'react';
import { chineseDict, pinyinDict } from '@/lib/pinyinDictCompressedData';
import { convertTextToRareChars } from '@/lib/convertToRareChars';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyIcon, ShuffleIcon, FileTextIcon, TextIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function RareCharConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const hasInputText = inputText.trim() !== '';
  const hasOutputText = outputText.trim() !== '';

  const handleConvert = () => {
    if (!hasInputText) {
      toast.warning('请输入文本');
      return;
    }

    const result = convertTextToRareChars(inputText, chineseDict, pinyinDict);
    setOutputText(result);
    toast.success('转换成功！');
  };

  const copyToClipboard = (text) => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text).then(() => {
      toast.success('已复制到剪贴板');
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TextIcon className="h-5 w-5" />
            文本转生僻字
          </CardTitle>
          <CardDescription>将普通汉字替换为同音生僻字</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="px-4 md:px-6 space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <FileTextIcon className="w-4 h-4" />
                    输入文本
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 cursor-copy"
                    onClick={() => copyToClipboard(inputText)}
                    disabled={!hasInputText}
                    aria-label="复制"
                    title="复制输入文本"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  id="input"
                  placeholder="请输入文本，例如：今天天气真好！"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="min-h-30 font-mono text-foreground w-full"
                />
                <div>
                  <Button
                    onClick={handleConvert}
                    disabled={!hasInputText}
                    className="w-full"
                  >
                    <ShuffleIcon className="w-4 h-4" />
                    转为生僻字
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="px-4 md:px-6 space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <TextIcon className="w-4 h-4" />
                    转换结果
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 cursor-copy"
                    onClick={() => copyToClipboard(outputText)}
                    disabled={!hasOutputText}
                    aria-label="复制"
                    title="复制转换结果"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </Button>
                </div>
                {hasOutputText ? (
                  <Textarea
                    readOnly
                    value={outputText}
                    className="min-h-30 font-mono bg-muted/30 text-foreground w-full"
                  />
                ) : (
                  <div className="min-h-30 flex items-center justify-center text-muted-foreground italic">
                    转换结果将显示在此处
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
