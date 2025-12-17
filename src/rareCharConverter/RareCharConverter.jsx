import { useState } from 'react';
import { convertTextToRareChars } from '@/lib/convertToRareChars';
import {
  FaDatabase,
  FaQuestionCircle,
} from 'react-icons/fa';
import { CopyIcon, ShuffleIcon, FileTextIcon, TextIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { commonlyUsedChars } from '@/lib/commonlyUsedChars';

const selectModeOptions = [
  { value: 'rare-only', label: '仅在生僻字中抽取' },
  { value: 'rare-and-common', label: '在生僻字和常用字中抽取' },
  { value: 'common-only', label: '仅在常用字中抽取' },
];

export default function RareCharConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const hasInputText = inputText.trim() !== '';
  const hasOutputText = outputText.trim() !== '';
  const [selectMode, setSelectMode] = useState('rare-only');

  const handleConvert = () => {
    if (!hasInputText) {
      toast.warning('请输入文本');
      return;
    }

    const result = convertTextToRareChars(inputText, selectMode);
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
          <CardDescription>将普通汉字随机替换为同音生僻字，其他字符保持不变</CardDescription>
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
                <div className="flex items-center gap-3">
                  <Select value={selectMode} onValueChange={setSelectMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择抽取模式" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectModeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FaQuestionCircle className="w-5 h-5 text-primary cursor-help" />
                    </PopoverTrigger>
                    <PopoverContent
                      side="top"
                      align="center"
                      className="bg-primary border-primary text-primary-foreground text-sm rounded-lg shadow-lg max-w-xs"
                    >
                      如果指定的集合为空，则会自动回退到“在生僻字和常用字中抽取”。如果仍为空，则返回原字符
                    </PopoverContent>
                  </Popover>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FaDatabase className="h-5 w-5" />
            附录：3500常用字
          </CardTitle>
        </CardHeader>
        <CardContent>
          {commonlyUsedChars}
        </CardContent>
      </Card>
    </div>
  );
}
