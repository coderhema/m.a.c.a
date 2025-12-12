#!/usr/bin/env node
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

console.log('🔑 API Key Validation Tests\n');
console.log('='.repeat(50));

// Test results
const results = [];

// 1. Test OpenAI API (Whisper)
async function testOpenAI() {
  console.log('\n📍 Testing OpenAI API (Whisper STT)...');
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ OPENAI_API_KEY not set');
    return { name: 'OpenAI', status: 'NOT_SET' };
  }
  
  console.log(`   Key: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 4)}`);
  
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      const hasWhisper = data.data?.some(m => m.id.includes('whisper'));
      console.log(`✅ OpenAI API: Connected (Whisper available: ${hasWhisper})`);
      return { name: 'OpenAI', status: 'OK', hasWhisper };
    } else {
      const error = await response.json();
      console.log(`❌ OpenAI API: ${error.error?.message || response.status}`);
      return { name: 'OpenAI', status: 'ERROR', error: error.error?.message };
    }
  } catch (err) {
    console.log(`❌ OpenAI API: ${err.message}`);
    return { name: 'OpenAI', status: 'ERROR', error: err.message };
  }
}

// 2. Test Gemini API
async function testGemini() {
  console.log('\n📍 Testing Gemini API (LLM)...');
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ GEMINI_API_KEY not set');
    return { name: 'Gemini', status: 'NOT_SET' };
  }
  
  console.log(`   Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (response.ok) {
      const data = await response.json();
      const modelCount = data.models?.length || 0;
      console.log(`✅ Gemini API: Connected (${modelCount} models available)`);
      return { name: 'Gemini', status: 'OK', modelCount };
    } else {
      const error = await response.json();
      console.log(`❌ Gemini API: ${error.error?.message || response.status}`);
      return { name: 'Gemini', status: 'ERROR', error: error.error?.message };
    }
  } catch (err) {
    console.log(`❌ Gemini API: ${err.message}`);
    return { name: 'Gemini', status: 'ERROR', error: err.message };
  }
}

// 3. Test YarnGPT API (TTS)
async function testYarnGPT() {
  console.log('\n📍 Testing YarnGPT API (TTS)...');
  const apiKey = process.env.YARNGPT_API_KEY;
  
  if (!apiKey) {
    console.log('❌ YARNGPT_API_KEY not set');
    return { name: 'YarnGPT', status: 'NOT_SET' };
  }
  
  console.log(`   Key: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 4)}`);
  
  try {
    // Test with a simple TTS request
    const response = await fetch('https://yarngpt.ai/api/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Test',
        voice: 'Idera',
        response_format: 'wav',
      }),
    });
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      console.log(`✅ YarnGPT API: Connected (${contentType})`);
      return { name: 'YarnGPT', status: 'OK' };
    } else {
      const error = await response.text();
      console.log(`❌ YarnGPT API: ${response.status} - ${error.substring(0, 100)}`);
      return { name: 'YarnGPT', status: 'ERROR', error };
    }
  } catch (err) {
    console.log(`❌ YarnGPT API: ${err.message}`);
    return { name: 'YarnGPT', status: 'ERROR', error: err.message };
  }
}

// 4. Test LiveAvatar API
async function testLiveAvatar() {
  console.log('\n📍 Testing LiveAvatar API (HeyGen)...');
  const apiKey = process.env.LIVEAVATAR_API_KEY;
  const avatarId = process.env.LIVEAVATAR_AVATAR_ID;
  
  if (!apiKey) {
    console.log('❌ LIVEAVATAR_API_KEY not set');
    return { name: 'LiveAvatar', status: 'NOT_SET' };
  }
  
  console.log(`   API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`   Avatar ID: ${avatarId || 'NOT SET'}`);
  
  try {
    // Test token creation endpoint
    const response = await fetch('https://api.liveavatar.com/v1/sessions/token', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'CUSTOM',
        avatar_id: avatarId,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ LiveAvatar API: Connected (Session ID: ${data.data?.session_id?.substring(0, 8)}...)`);
      return { name: 'LiveAvatar', status: 'OK', sessionId: data.data?.session_id };
    } else {
      const error = await response.text();
      console.log(`❌ LiveAvatar API: ${response.status} - ${error.substring(0, 100)}`);
      return { name: 'LiveAvatar', status: 'ERROR', error };
    }
  } catch (err) {
    console.log(`❌ LiveAvatar API: ${err.message}`);
    return { name: 'LiveAvatar', status: 'ERROR', error: err.message };
  }
}

// Run all tests
async function runTests() {
  results.push(await testOpenAI());
  results.push(await testGemini());
  results.push(await testYarnGPT());
  results.push(await testLiveAvatar());
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 SUMMARY:\n');
  
  results.forEach(r => {
    const icon = r.status === 'OK' ? '✅' : r.status === 'NOT_SET' ? '⚠️' : '❌';
    console.log(`   ${icon} ${r.name}: ${r.status}`);
  });
  
  const allOk = results.every(r => r.status === 'OK');
  console.log(`\n${allOk ? '🎉 All APIs are working!' : '⚠️  Some APIs need attention'}\n`);
}

runTests();
