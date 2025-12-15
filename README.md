[TOC]

# 文本转生僻字演示平台

## 引言

> Unicode 是一种编码方式 (encoding, 比如 utf-8)，也是一种字符集 (charset)。 Unicode 的目标是收集地球上所有语言使用的字符

> Unihan 数据库是一个关于汉字的数据库, 收录了几万个汉字, 包含多种数据

从 Unihan 数据库下载拼音数据： https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip

架构：

- `scripts\read_rare_chars.js`：生成拼音到文字的映射、文字到拼音的映射和前端网页要引用的JS代码

## 参考资料

1. 从 Unicode 标准提取拼音数据： https://zhuanlan.zhihu.com/p/682228507
