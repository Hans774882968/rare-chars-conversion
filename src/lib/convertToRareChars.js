import isChinese from 'is-chinese';
import { sample } from 'lodash-es';
import { pinyin } from 'pinyin-pro';
import { pinyinDict, pinyinDictWithoutCommonlyUsed } from './pinyinDictCompressedData';
import { commonlyUsedCharSet } from './commonlyUsedChars';

export function getCandidateChars(selectMode, s11, s2, s3) {
  if (selectMode === 'rare-only') {
    if (s2.length > 0) {
      return s2;
    }
    return s11;
  } else if (selectMode === 'common-only') {
    if (s3.length > 0) {
      return s3;
    }
    return s11;
  } else if (selectMode === 'rare-and-common') {
    return s11;
  }
  return [];
}

/**
 * 将一个汉字随机替换为同音生僻字
 * @param {string} originalChar - 原字符
 * @param {string} pinyin - 该字符的拼音（由 pinyin-pro 提供）
 * @param {'rare-only' | 'rare-and-common' | 'common-only'} selectMode - 替换策略
 * @returns {string}
 */
export function convertCharToRareChar(originalChar, pinyin, selectMode = 'rare-only') {
  if (!isChinese(originalChar)) {
    return originalChar;
  }

  if (!pinyin || typeof pinyin !== 'string') {
    return originalChar;
  }

  // s1: 所有同音字
  const s1 = pinyinDict[pinyin] || [];
  // s11: 去掉 originalChar
  const s11 = s1.filter(c => c !== originalChar);

  // 只有 originalChar 是这个读音
  if (s11.length === 0) {
    return originalChar;
  }

  // s2: 无 originalChar 的生僻字
  const s2 = (pinyinDictWithoutCommonlyUsed[pinyin] || []).filter(c => c !== originalChar);
  // s3: 无 originalChar 的常用字
  const s3 = s11.filter(c => commonlyUsedCharSet.has(c));

  const candidates = getCandidateChars(selectMode, s11, s2, s3);
  if (candidates.length === 0) {
    return originalChar;
  }
  return sample(candidates);
}

/**
 * 将文本中的每个汉字随机替换为同音生僻字
 * 非中文字符保持不变
 */
export function convertTextToRareChars(
  text,
  selectMode = 'rare-only'
) {
  const pinyinResult = pinyin(text, { nonZh: 'consecutive', type: 'all' });

  return pinyinResult
    .map(({ origin: originalChar, pinyin }) => convertCharToRareChar(originalChar, pinyin, selectMode))
    .join('');
}
