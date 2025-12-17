import { commonlyUsedCharSet } from './commonlyUsedChars';

/**
 * 从完整拼音Dict中移除常用字，生成生僻字专用Dict
 * @param pinyinDict - 原始拼音字典 Record<string, string[]>
 * @returns 生僻字拼音字典 Record<string, string[]>
 */
export function buildPinyinDictWithoutCommonlyUsed(
  pinyinDict
) {
  const res = Object.entries(pinyinDict).reduce((res, [pinyin, charList]) => {
    const rareChars = charList.filter(char => !commonlyUsedCharSet.has(char));
    res[pinyin] = rareChars;
    return res;
  }, {});
  return res;
}
