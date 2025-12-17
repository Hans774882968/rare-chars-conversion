import { describe, it, expect } from 'vitest';
import {
  getCandidateChars,
  convertCharToRareChar,
  convertTextToRareChars,
} from '@/lib/convertToRareChars.js';

describe('getCandidateChars', () => {
  it('should return s2 when selectMode is "rare-only" and s2 is not empty', () => {
    const s11 = ['册', '侧', '策'];
    const s2 = ['册', '策'];
    const s3 = ['侧'];
    expect(getCandidateChars('rare-only', s11, s2, s3)).toEqual(s2);
  });

  it('should return s11 when selectMode is "rare-only" and s2 is empty', () => {
    const s11 = ['室', '谥'];
    const s2 = [];
    const s3 = [];
    expect(getCandidateChars('rare-only', s11, s2, s3)).toEqual(s11);
  });

  it('should return s3 when selectMode is "common-only" and s3 is not empty', () => {
    const s11 = ['册', '侧', '策'];
    const s2 = ['册', '策'];
    const s3 = ['侧'];
    expect(getCandidateChars('common-only', s11, s2, s3)).toEqual(s3);
  });

  it('should return s11 when selectMode is "common-only" and s3 is empty', () => {
    const s11 = ['册', '策'];
    const s2 = ['册', '策'];
    const s3 = [];
    expect(getCandidateChars('common-only', s11, s2, s3)).toEqual(s11);
  });

  it('should return s11 when selectMode is "rare-and-common"', () => {
    const s11 = ['册', '侧', '策'];
    const s2 = ['册', '策'];
    const s3 = ['侧'];
    expect(getCandidateChars('rare-and-common', s11, s2, s3)).toEqual(s11);
  });

  it('should return an empty array for unknown selectMode', () => {
    const s11 = ['册', '侧', '策'];
    const s2 = ['册', '策'];
    const s3 = ['侧'];
    expect(getCandidateChars('unknown', s11, s2, s3)).toEqual([]);
  });
});

describe('convertCharToRareChar', () => {
  it('should return the original character for non-Chinese input', () => {
    expect(convertCharToRareChar('a', 'a')).toBe('a');
    expect(convertCharToRareChar('1', '1')).toBe('1');
  });

  it('should return the original character if pinyin is empty or null', () => {
    expect(convertCharToRareChar('汉', '')).toBe('汉');
    expect(convertCharToRareChar('汉', null)).toBe('汉');
    expect(convertCharToRareChar('汉', undefined)).toBe('汉');
    expect(convertCharToRareChar('汉')).toBe('汉');
  });

  it('should return the original character if no other candidates exist for its pinyin', () => {
    // 只有瘸读 qué ，没有其他同音字
    const char = '瘸';
    const charPinyin = 'qué';
    const res = convertCharToRareChar(char, charPinyin);
    expect(res).toBe(char);
  });

  it('should convert a character to a rare one if selectMode is "rare-only"', () => {
    const originalChar = '测';
    const charPinyin = 'cè';
    for (let _ = 0; _ < 1451; _++) {
      const result = convertCharToRareChar(originalChar, charPinyin, 'rare-only');
      expect(['㥽', '㨲', '㩍', '䇲', '䈟', '䊂', '䔴', '側', '冊', '厠', '墄', '廁', '恻', '惻', '憡', '拺', '敇', '測', '畟', '笧', '筞', '筴', '箣', '簎', '粣', '荝', '萗', '萴', '蓛', '𡍫', '𢿸', '𣌧', '𥠉', '𥬰', '𥰡', '𥳯', '𦔎', '𦣧', '𦵪', '𧵡', '𨶨', '𩒄', '𫭮', '𱲆']).toContain(result);
    }
  });

  it('should convert a character to a common one if selectMode is "common-only"', () => {
    const originalChar = '汉';
    const charPinyin = 'hàn';
    for (let _ = 0; _ < 32; _++) {
      const result = convertCharToRareChar(originalChar, charPinyin, 'common-only');
      expect(['悍', '憾', '捍', '撼', '旱', '汗', '焊', '翰']).toContain(result);
    }
  });

  it('should convert a character to a rare or common one if selectMode is "rare-and-common"', () => {
    const originalChar = '测';
    const charPinyin = 'cè';
    for (let _ = 0; _ < 1145; _++) {
      const result = convertCharToRareChar(originalChar, charPinyin, 'rare-and-common');
      expect(['㥽', '㨲', '㩍', '䇲', '䈟', '䊂', '䔴', '侧', '側', '冊', '册', '厕', '厠', '墄', '廁', '恻', '惻', '憡', '拺', '敇', '測', '畟', '笧', '策', '筞', '筴', '箣', '簎', '粣', '荝', '萗', '萴', '蓛', '𡍫', '𢿸', '𣌧', '𥠉', '𥬰', '𥰡', '𥳯', '𦔎', '𦣧', '𦵪', '𧵡', '𨶨', '𩒄', '𫭮', '𱲆']).toContain(result);
    }
  });

  it('should fallback to a larger candidate set if the specific set is empty', () => {
    // 且的唯一同音字是𠀃，它是生僻字，故回退到更大的候选集
    const originalChar = '且';
    const charPinyin = 'qiě';
    const res = convertCharToRareChar(originalChar, charPinyin, 'common-only');
    expect(res).toBe('𠀃');
  });

  it('“好”没有同音常用字，回退到更大的候选集', () => {
    const originalChar = '好';
    const charPinyin = 'hǎo';
    const res = convertCharToRareChar(originalChar, charPinyin, 'common-only');
    for (let _ = 0; _ < 12; _++) {
      expect(['郝', '𡥆', '𤫧']).toContain(res);
    }
  });

  it('should return the original character if an invalid selectMode leads to no candidates', () => {
    const originalChar = '测';
    const charPinyin = 'cè';
    const result = convertCharToRareChar(originalChar, charPinyin, 'invalid-mode');
    expect(result).toBe(originalChar);
  });
});

describe('convertTextToRareChars', () => {
  it('should handle an empty string', () => {
    expect(convertTextToRareChars('')).toBe('');
  });

  it('should return the same string if it contains only non-Chinese characters', () => {
    const text = 'hello world 123!';
    expect(convertTextToRareChars(text)).toBe(text);
  });

  it('带中文和非中文', () => {
    const text = '114514\n~瘸！1919810';
    expect(convertTextToRareChars(text)).toBe(text);
  });
});
