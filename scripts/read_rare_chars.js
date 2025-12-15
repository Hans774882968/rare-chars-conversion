import fs from 'fs';
import { compressToEncodedURIComponent } from 'lz-string';

function buildPinyinDictionary() {
  const inputFilePath = 'D:\\Unihan\\Unihan_Readings.txt';

  try {
    const inputFileContent = fs.readFileSync(inputFilePath, 'utf8');
    const fileLines = inputFileContent.split('\n');

    const pinyinDict = {};

    for (const line of fileLines) {
      if (line.startsWith('#')) {
        continue;
      }

      if (line.trim().length < 1) {
        continue;
      }

      const parts = line.split('	');
      if (parts[1] === 'kMandarin') {
        const codePoint = parseInt(parts[0].substring(2), 16);
        const character = String.fromCodePoint(codePoint);
        const pinyin = parts[2].toLowerCase();

        if (!pinyinDict[pinyin]) {
          if (!pinyin.includes(' ')) {
            pinyinDict[pinyin] = [character];
          }
        } else {
          pinyinDict[pinyin].push(character);
        }
      }
    }

    return pinyinDict;
  } catch (error) {
    console.error('处理文件时出错:', error.message);
    return {};
  }
}

function main() {
  const pinyinDict = buildPinyinDictionary();
  const pinyinDictStr = JSON.stringify(pinyinDict, null, 2);
  fs.writeFileSync('pinyin_dict.json', pinyinDictStr, 'utf8');
  const pinyinDictStrCompressed = compressToEncodedURIComponent(pinyinDictStr);
  const compressedPinyinDictContent = `
import { decompressFromEncodedURIComponent } from 'lz-string';

/**
 * 根据拼音字典反向构建汉字到拼音关键字的映射
 * @param pinyinDict - Record<string, string[]>，如 { "ai": ["爱", "艾", ...] }
 * @returns chineseDict - Record<string, string[]>，如 { "爱": ["ai"], "艾": ["ai"], ... }
 */
export function buildChineseDict(pinyinDict) {
  const chineseDict = {};

  for (const [key, charList] of Object.entries(pinyinDict)) {
    if (!Array.isArray(charList)) continue;

    for (const s of charList) {
      if (!chineseDict[s]) {
        chineseDict[s] = [key];
      } else {
        chineseDict[s].push(key);
      }
    }
  }

  return chineseDict;
}

export const pinyinDict = JSON.parse(decompressFromEncodedURIComponent('${pinyinDictStrCompressed}'));
export const chineseDict = buildChineseDict(pinyinDict);
`.trimStart();
  fs.writeFileSync('src/lib/pinyinDictCompressedData.js', compressedPinyinDictContent, 'utf8');
}

main();
