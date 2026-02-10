// servidor-tiktok.js
// Servidor simples para resolver CORS e chamar APIs

const express = require(‘express’);
const cors = require(‘cors’);
const fetch = require(‘node-fetch’);

const app = express();
const PORT = 3000;

// Permitir CORS
app.use(cors());
app.use(express.json());

// Rota para Gemini API
app.post(’/api/gemini’, async (req, res) => {
try {
const { apiKey, prompt } = req.body;

```
    console.log('📝 Gerando roteiro com Gemini...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        console.error('❌ Erro Gemini:', data);
        return res.status(response.status).json(data);
    }
    
    console.log('✅ Roteiro gerado com sucesso!');
    res.json(data);
    
} catch (error) {
    console.error('❌ Erro:', error.message);
    res.status(500).json({ error: error.message });
}
```

});

// Rota para Leonardo AI - Criar geração
app.post(’/api/leonardo/generate’, async (req, res) => {
try {
const { apiKey, prompt, modelId } = req.body;

```
    console.log('🎨 Gerando imagem com Leonardo...');
    
    const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            prompt: prompt,
            modelId: modelId,
            width: 768,
            height: 1344,
            num_images: 1,
            negative_prompt: 'blurry, low quality, distorted',
            guidance_scale: 7,
            alchemy: true
        })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        console.error('❌ Erro Leonardo:', data);
        return res.status(response.status).json(data);
    }
    
    console.log('✅ Geração iniciada:', data.sdGenerationJob.generationId);
    res.json(data);
    
} catch (error) {
    console.error('❌ Erro:', error.message);
    res.status(500).json({ error: error.message });
}
```

});

// Rota para Leonardo AI - Checar status
app.get(’/api/leonardo/status/:generationId’, async (req, res) => {
try {
const { generationId } = req.params;
const apiKey = req.headers.authorization?.replace(’Bearer ’, ‘’);

```
    const response = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        console.error('❌ Erro status:', data);
        return res.status(response.status).json(data);
    }
    
    if (data.generations_by_pk?.status === 'COMPLETE') {
        console.log('✅ Imagem pronta!');
    }
    
    res.json(data);
    
} catch (error) {
    console.error('❌ Erro:', error.message);
    res.status(500).json({ error: error.message });
}
```

});

// Rota de teste
app.get(’/api/test’, (req, res) => {
res.json({
status: ‘OK’,
message: ‘Servidor TikTok Studio rodando!’,
timestamp: new Date().toISOString()
});
});

// Iniciar servidor
app.listen(PORT, () => {
console.log(`
╔══════════════════════════════════════════╗
║   🚀 SERVIDOR TIKTOK STUDIO ATIVO!      ║
╚══════════════════════════════════════════╝

✅ Rodando em: http://localhost:${PORT}
✅ Gemini API: POST /api/gemini
✅ Leonardo API: POST /api/leonardo/generate
✅ Status: GET /api/leonardo/status/:id
✅ Teste: GET /api/test

📱 Abra a aplicação e use normalmente!
🔧 CORS resolvido!
`);
});
