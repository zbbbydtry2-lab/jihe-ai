const fs = require('fs');
const file = 'frontend/src/pages/AiWorkbench.tsx';
let code = fs.readFileSync(file, 'utf8');

// ====== Patch 1: Change selectedTool type to include new tools ======
code = code.replace(
  "const [selectedTool, setSelectedTool] = useState('ai-detail-page')",
  "const [selectedTool, setSelectedTool] = useState<'ai-detail-page' | 'ai-main-image-set' | 'ai-scene'>('ai-detail-page')"
);

// ====== Patch 2: Add new state variables ======
code = code.replace(
  "const [isGenerating, setIsGenerating] = useState(false)",
  "const [isGenerating, setIsGenerating] = useState(false)\n" +
  "  const [platform, setPlatform] = useState('\u901A\u7528')\n" +  // 通用
  "  const [productImages, setProductImages] = useState<string[]>([])\n" +
  "  const [mainImageTypes, setMainImageTypes] = useState<SceneItem[]>([\n" +
  "    { id: '0', type: '\u9996\u9875\u4E3B\u56FE', size: '\u901A\u7528', selected: true },\n" +  // 首页主图
  "    { id: '1', type: '\u7EC6\u8282\u5C55\u793A', size: '\u901A\u7528', selected: false },\n" +
  "    { id: '2', type: '\u4F7F\u7528\u573A\u666F', size: '\u901A\u7528', selected: false },\n" +
  "    { id: '3', type: '\u6838\u5FC3\u5356\u70B9', size: '\u901A\u7528', selected: false },\n" +
  "    { id: '4', type: '\u4EA7\u54C1\u75DB\u70B9', size: '\u901A\u7528', selected: false },\n" +
  "    { id: '5', type: '\u6750\u8D28\u5C55\u793A', size: '\u901A\u7528', selected: false },\n" +
  "  ])\n" +
  "  const [mainSelectAll, setMainSelectAll] = useState(false)\n" +
  "  const fileInputRef = useRef<HTMLInputElement>(null)"
);

console.log('Patch 2 done');
fs.writeFileSync(file, code, 'utf8');