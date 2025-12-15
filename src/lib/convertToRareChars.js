/**
 * 将文本中的每个汉字随机替换为同音生僻字（若存在）
 * 非中文字符保持不变
 */
export function convertTextToRareChars(
  text,
  chineseDict,
  pinyinDict
) {
  return text
    .split('')
    .map(char => {
      if (!/[\u4e00-\u9fff]/.test(char)) return char;

      // 获取该字的拼音列表（chineseDict[char] 是 string[]）
      const charPinyinList = chineseDict[char];
      if (!charPinyinList || charPinyinList.length === 0) return char;

      // 任选一个拼音（通常只有一个，但多音字可能多个）
      const randomPinyin = charPinyinList[Math.floor(Math.random() * charPinyinList.length)];

      // 获取该拼音对应的所有汉字（含生僻字）
      const candidates = pinyinDict[randomPinyin] || [];
      if (candidates.length === 0) return char;

      // 从候选字中随机选一个（包括原字，也可能选到生僻字）
      return candidates[Math.floor(Math.random() * candidates.length)];
    })
    .join('');
}
