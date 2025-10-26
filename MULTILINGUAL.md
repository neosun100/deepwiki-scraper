# 多语言支持说明

## 支持的语言

- 🇨🇳 简体中文 (zh-CN)
- 🇹🇼 繁體中文 (zh-TW)
- 🇺🇸 English (en)
- 🇯🇵 日本語 (ja)

## 功能特性

### 1. Web UI 语言切换

- **位置**：页面右上角的语言选择器
- **持久化**：选择的语言自动保存到 localStorage
- **实时切换**：切换语言后立即更新所有界面文本
- **无需刷新**：语言切换不需要刷新页面

### 2. README 多语言版本

- `README.md` - 主文档（简体中文）+ 语言导航
- `README.zh-CN.md` - 简体中文完整版
- `README.zh-TW.md` - 繁體中文版
- `README.en.md` - English version
- `README.ja.md` - 日本語版

### 3. 翻译覆盖范围

所有 UI 元素都支持多语言：

- ✅ 页面标题和副标题
- ✅ API 密钥配置区域
- ✅ URL 输入提示
- ✅ 高级选项标签
- ✅ 按钮文本
- ✅ 进度提示信息
- ✅ 结果统计标签
- ✅ 错误提示信息
- ✅ 页脚文本

## 技术实现

### 文件结构

```
deepwiki-scraper/
├── i18n.js              # 多语言配置和翻译函数
├── index.html           # HTML 带 data-i18n 标记
├── app.js               # 集成多语言功能
├── style.css            # 语言选择器样式
├── README.md            # 主文档 + 语言导航
├── README.zh-CN.md      # 简体中文
├── README.zh-TW.md      # 繁體中文
├── README.en.md         # English
└── README.ja.md         # 日本語
```

### 核心机制

1. **翻译配置** (`i18n.js`)
   ```javascript
   const translations = {
       'zh-CN': { ... },
       'zh-TW': { ... },
       'en': { ... },
       'ja': { ... }
   };
   ```

2. **HTML 标记**
   ```html
   <h2 data-i18n="apiKeyTitle">🔑 API 密钥配置</h2>
   ```

3. **动态更新**
   ```javascript
   function updateUI() {
       document.querySelectorAll('[data-i18n]').forEach(el => {
           el.textContent = t(key);
       });
   }
   ```

4. **localStorage 持久化**
   ```javascript
   localStorage.setItem('language', lang);
   ```

## 使用方法

### 切换语言

1. 点击页面右上角的语言选择器
2. 选择你想要的语言
3. 界面立即切换到选择的语言
4. 语言选择会被记住，下次访问自动应用

### 添加新语言

1. 在 `i18n.js` 中添加新语言的翻译：
   ```javascript
   translations['新语言代码'] = {
       title: '翻译文本',
       // ... 其他翻译
   };
   ```

2. 在 `index.html` 的语言选择器中添加选项：
   ```html
   <option value="新语言代码">语言名称</option>
   ```

3. 创建对应的 README 文件：
   ```bash
   cp README.md README.新语言代码.md
   # 翻译内容
   ```

4. 更新所有 README 的语言导航链接

## 最佳实践

1. **保持一致性**：所有语言版本的功能描述应保持一致
2. **文化适配**：考虑不同语言的文化习惯和表达方式
3. **及时更新**：添加新功能时同步更新所有语言版本
4. **测试验证**：切换每种语言确保显示正常

## 故障排除

### 语言未切换

1. 检查浏览器是否禁用 localStorage
2. 清除浏览器缓存后重试
3. 检查浏览器控制台是否有错误

### 部分文本未翻译

1. 检查 HTML 元素是否有 `data-i18n` 属性
2. 检查 `i18n.js` 中是否有对应的翻译键
3. 确保 `i18n.js` 在 `app.js` 之前加载

### 添加新文本

1. 在 `i18n.js` 的所有语言中添加翻译键
2. 在 HTML 中添加 `data-i18n` 属性
3. 调用 `updateUI()` 刷新界面

---

Made with ❤️ by Neo Sun
