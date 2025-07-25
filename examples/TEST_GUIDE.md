# 🧪 OMX SDK Test Guide

## 🚀 Execution Methods

### 1. **Easiest Way**: pnpm test

```bash
cd examples
pnpm test
```

This command uses `tsx` to directly execute TypeScript files.

### 2. **Direct tsx usage**

```bash
cd examples
npx tsx example.ts
```

### 3. **Browser Testing**

```bash
cd examples
pnpm serve
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000/demo.html` in your browser

### 4. **Using VS Code Tasks**

1. In VS Code, press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Tasks: Run Task"
3. Select "Serve Examples"

## 🌍 Environment-specific Behavior

### Node.js Environment (when running pnpm test)

- ✅ **Working**: Email, Webhook, basic SDK initialization
- ⚠️ **Skipped**: Geolocation, Beacon, Push Notification (requires browser APIs)
- ⏱️ **Runtime**: Auto-terminates after 5 seconds

### Browser Environment (demo.html)

- ✅ **Working**: All features (simulated environment)
- 🌐 **Includes**: Geolocation, Beacon, Push Notification
- ⏱️ **Runtime**: Auto-terminates after 30 seconds

## 📊 Test Results

Recent execution results:

- ✅ SDK initialization successful
- ✅ Email sending simulation successful (with attachments)
- ✅ Email validation successful
- ✅ Webhook subscription creation successful
- ✅ External webhook test successful (httpbin.org)
- ✅ Analytics data collection successful
- ⚠️ Geolocation/Beacon/Push skipped in Node.js (normal behavior)

## 🎯 Key Verification Points

1. **Import Pattern**: `import OMX from 'omx-sdk';` ✅
2. **Initialization**: `await OMX.initialize(config)` ✅
3. **Service Access**: `omx.email`, `omx.webhook` etc. ✅
4. **Environment Detection**: Node.js vs Browser auto-detection ✅
5. **Error Handling**: Browser-only features safely skipped ✅

## 🔧 Customization

Modify the `example.ts` file to:

- Change API keys and configurations
- Select features to test
- Adjust execution time
- Add additional test cases

## 📝 Next Steps

For actual service integration:

1. Change `config.apiKey` to your actual API key
2. Change `config.baseUrl` to your actual service URL
3. Replace stub implementations in each package with actual API calls
