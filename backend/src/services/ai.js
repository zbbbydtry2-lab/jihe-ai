const OpenAI = require('openai');

async function generateImage({ prompt, model = 'dalle3', count = 1, ratio, resolution, apiKey }) {
  const key = apiKey || process.env.OPENAI_API_KEY;
  
  if (!key) {
    console.log('No API key configured, returning placeholders');
    return Array.from({ length: count }, (_, i) =>
      'https://placehold.co/' + (ratio === 'smart-1-1' ? '800x800' : '800x1200') +
      '/1a1a2e/e0e0ff?text=请配置API+Key'
    );
  }

  const results = [];
  
  try {
    if (model === 'dalle3' || model === 'midjourney') {
      return await generateWithDalle({ prompt, count, ratio, apiKey: key });
    } else if (model === 'sd') {
      return await generateWithStabilityAI({ prompt, count, ratio, apiKey: key });
    }
  } catch (err) {
    console.error('AI generation error:', err.message);
    throw err;
  }
  
  return results;
}

async function generateWithDalle({ prompt, count, ratio, apiKey }) {
  const openai = new OpenAI({ apiKey });
  const size = ratio === 'smart-1-1' ? '1024x1024' : '1024x1792';
  
  const enhancedPrompt = '电商详情页设计，高端商业摄影风格，中文排版，白色背景，产品展示：' + prompt;
  
  const results = [];
  for (let i = 0; i < Math.min(count, 4); i++) {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: size,
      quality: 'hd',
      style: 'vivid',
    });
    if (response.data[0]?.url) {
      results.push(response.data[0].url);
    }
  }
  return results;
}

async function generateWithStabilityAI({ prompt, count, ratio, apiKey }) {
  const width = ratio === 'smart-1-1' ? 1024 : 768;
  const height = ratio === 'smart-1-1' ? 1024 : 1344;
  
  const results = [];
  for (let i = 0; i < Math.min(count, 4); i++) {
    const formData = new FormData();
    formData.append('prompt', 'E-commerce product detail page design, professional commercial photography: ' + prompt);
    formData.append('output_format', 'jpeg');
    
    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Accept': 'application/json' },
      body: formData,
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.image) {
        results.push('data:image/jpeg;base64,' + data.image);
      }
    } else {
      const err = await response.json();
      throw new Error(err.message || 'Stability AI error');
    }
  }
  return results;
}

module.exports = { generateImage };
