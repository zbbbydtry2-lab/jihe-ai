const fs = require('fs');
const file = 'frontend/src/pages/AiWorkbench.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Fix import
code = code.replace(
  "import { ChevronDown, LayoutTemplate, Upload, Plus, Image, Sparkles } from 'lucide-react'",
  "import { ChevronDown, LayoutTemplate, Upload, Plus, Image, Sparkles, X, Package, Camera, Check, ImagePlus } from 'lucide-react'"
);

// 2. Replace tools array
code = code.replace(
  /const tools: Tool\[\] = \[[\s\S]*?\];/,
  "const tools: Tool[] = [\n" +
  "  { id: 'ai-detail-page', name: 'AI\u8BE6\u60C5\u9875\u751F\u6210', icon: LayoutTemplate },\n" +
  "  { id: 'ai-main-image-set', name: 'AI\u4E3B\u56FE\u5957\u56FE', icon: Package },\n" +
  "  { id: 'ai-scene', name: 'AI\u573A\u666F\u56FE', icon: Camera },\n" +
  "];"
);

console.log('Patched, size:', code.length);
fs.writeFileSync(file, code, 'utf8');