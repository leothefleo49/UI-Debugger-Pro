#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const command = args[0];

const PACKAGE_NAME = 'ui-debugger-pro';
const IMPORT_STATEMENT = "import { UIDebugger } from 'ui-debugger-pro';";
const COMPONENT_TAG = "<UIDebugger />";

function log(msg, type = 'info') {
  const colors = {
    info: '\x1b[36m%s\x1b[0m',
    success: '\x1b[32m%s\x1b[0m',
    warn: '\x1b[33m%s\x1b[0m',
    error: '\x1b[31m%s\x1b[0m',
  };
  console.log(colors[type] || colors.info, msg);
}

function detectPackageManager() {
  if (fs.existsSync('yarn.lock')) return 'yarn';
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  return 'npm';
}

function findEntryFile() {
  const candidates = [
    'app/layout.tsx', 'app/layout.js', // Next.js App Router
    'pages/_app.tsx', 'pages/_app.js', // Next.js Pages Router
    'src/main.tsx', 'src/main.js',     // Vite
    'src/index.tsx', 'src/index.js',   // CRA / Webpack
    'index.html', 'index.php'          // Static HTML / PHP
  ];
  
  for (const file of candidates) {
    if (fs.existsSync(file)) return file;
  }
  return null;
}

function injectIntoHTML(file) {
  log(`📝 Injecting into ${file}...`, 'info');
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('ui-debugger-pro')) {
    log('⚠️ UI Debugger seems to be already installed in this file.', 'warn');
    return false;
  }
  
  // Inject CDN script
  const script = `
  <script src="https://cdn.jsdelivr.net/npm/ui-debugger-pro@latest/dist/index.global.js"></script>
  <script>
    if (window.UIDebuggerPro && window.UIDebuggerPro.UIDebugger) {
      const container = document.createElement('div');
      container.id = '__ui_debugger_pro__';
      document.body.appendChild(container);
      
      if (window.React && window.ReactDOM) {
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(window.UIDebuggerPro.UIDebugger));
      }
    }
  </script>`;
  
  if (content.includes('</body>')) {
    content = content.replace('</body>', `${script}\n</body>`);
  } else if (content.includes('</html>')) {
    content = content.replace('</html>', `${script}\n</html>`);
  } else {
    content += script;
  }
  
  fs.writeFileSync(file, content);
  log(`✅ Successfully injected UI Debugger into ${file}`, 'success');
  return true;
}

function install() {
  log('📦 Installing ui-debugger-pro...', 'info');
  const pm = detectPackageManager();
  const cmd = pm === 'npm' ? 'npm install ui-debugger-pro' : 
              pm === 'yarn' ? 'yarn add ui-debugger-pro' : 'pnpm add ui-debugger-pro';
  
  try {
    execSync(cmd, { stdio: 'inherit' });
    log('✅ Package installed successfully.', 'success');
  } catch (e) {
    log('❌ Failed to install package.', 'error');
    process.exit(1);
  }
}

function injectCode() {
  const file = findEntryFile();
  if (!file) {
    log('⚠️ Could not automatically find entry file (app/layout.tsx, pages/_app.tsx, src/main.tsx, index.html).', 'warn');
    log('Please manually add the following to your root component:', 'info');
    log(`1. ${IMPORT_STATEMENT}`);
    log(`2. ${COMPONENT_TAG}`);
    return;
  }

  // Check if it's an HTML file
  if (file.endsWith('.html') || file.endsWith('.php')) {
    return injectIntoHTML(file);
  }

  log(`📝 Modifying ${file}...`, 'info');
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('ui-debugger-pro')) {
    log('⚠️ UI Debugger seems to be already installed in this file.', 'warn');
    return;
  }

  // Inject Import
  if (content.includes('import')) {
    content = IMPORT_STATEMENT + '\n' + content;
  } else {
    content = IMPORT_STATEMENT + '\n' + content;
  }

  // Inject Component
  // Strategy: Look for <body> (Next.js App) or return ( (React)
  if (file.includes('layout')) {
    // Next.js App Router: Insert before </body> or children
    if (content.includes('</body>')) {
      content = content.replace('</body>', `  ${COMPONENT_TAG}\n      </body>`);
    } else if (content.includes('{children}')) {
      content = content.replace('{children}', `{children}\n        ${COMPONENT_TAG}`);
    }
  } else if (file.includes('_app')) {
    // Next.js Pages Router: Insert after <Component ... />
    // Usually inside return ( ... )
    // This is hard to regex safely, so we append to fragment or div
    if (content.includes('<Component')) {
      content = content.replace(/<Component\s+\{\.\.\.pageProps\}\s*\/?>/, `$& \n      ${COMPONENT_TAG}`);
      // If it was self-closing and not wrapped, this might break if not in a fragment.
      // Warn user to check.
      log('⚠️ Injected into _app.js. Please verify the syntax (ensure it is wrapped in a Fragment <>...</> if needed).', 'warn');
    }
  } else {
    // Vite/CRA: Usually root.render(<App />) or <React.StrictMode>
    if (content.includes('<App />')) {
      content = content.replace('<App />', `<>\n    <App />\n    ${COMPONENT_TAG}\n  </>`);
    } else if (content.includes('<App/>')) {
      content = content.replace('<App/>', `<>\n    <App/>\n    ${COMPONENT_TAG}\n  </>`);
    }
  }

  fs.writeFileSync(file, content);
  log(`✅ Successfully injected UI Debugger into ${file}`, 'success');
}

function removeCode() {
  const file = findEntryFile();
  if (file) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('ui-debugger-pro')) {
      // For HTML files, remove CDN scripts
      if (file.endsWith('.html') || file.endsWith('.php')) {
        // Remove the entire script block we added
        content = content.replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/ui-debugger-pro@latest\/dist\/index\.global\.js"><\/script>/g, '');
        content = content.replace(/<script>[\s\S]*?if \(window\.UIDebuggerPro[\s\S]*?<\/script>/g, '');
      } else {
        // For JS/TS files, remove imports and components
        content = content.replace(IMPORT_STATEMENT + '\n', '');
        content = content.replace(IMPORT_STATEMENT, '');
        content = content.replace(COMPONENT_TAG, '');
        
        // Attempt to clean up fragments if we added them
        content = content.replace('<>\n    <App />\n    \n  </>', '<App />');
        content = content.replace('<>\n    <App/>\n    \n  </>', '<App/>');
      }

      fs.writeFileSync(file, content);
      log(`✅ Removed code from ${file}`, 'success');
    }
  }
}

function remove() {
  log('🗑️ Removing ui-debugger-pro...', 'info');
  
  // 1. Remove Code
  removeCode();

  // 2. Uninstall Package
  const pm = detectPackageManager();
  const cmd = pm === 'npm' ? 'npm uninstall ui-debugger-pro' : 
              pm === 'yarn' ? 'yarn remove ui-debugger-pro' : 'pnpm remove ui-debugger-pro';
  
  try {
    execSync(cmd, { stdio: 'inherit' });
    log('✅ Package uninstalled successfully.', 'success');
  } catch (e) {
    log('❌ Failed to uninstall package.', 'error');
  }
}

function start() {
  log('🚀 Starting UI Debugger Pro in Zero-Config Mode...', 'info');
  
  // 1. Inject
  injectCode();
  
  // 2. Run Dev Server
  const pm = detectPackageManager();
  const runCmd = pm === 'npm' ? 'npm run dev' : 
                 pm === 'yarn' ? 'yarn dev' : 'pnpm dev';
                 
  log(`▶️  Running ${runCmd}...`, 'info');
  log('⚠️  Press Ctrl+C to stop the server and remove the debugger.', 'warn');
  
  const child = require('child_process').spawn(runCmd, { 
    shell: true, 
    stdio: 'inherit' 
  });
  
  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    log('\n🛑 Stopping and cleaning up...', 'info');
    removeCode();
    process.exit();
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  // process.on('exit', cleanup); // Avoid double cleanup on normal exit
  
  child.on('exit', (code) => {
    cleanup();
  });
}

if (command === 'init') {
  install();
  injectCode();
  log('\n🎉 Setup Complete! Start your dev server to see the debugger.', 'success');
} else if (command === 'start') {
  start();
} else if (command === 'remove') {
  remove();
  log('\n👋 UI Debugger Pro has been removed.', 'success');
} else if (command === 'help') {
  remove();
  log('\n👋 UI Debugger Pro has been removed.', 'success');
} else if (command === 'help') {
  log('\n📖 Opening documentation...', 'info');
  const url = 'https://github.com/leothefleo49/ui-debugger-pro';
  const start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
  try {
    require('child_process').exec(start + ' ' + url);
  } catch(e) {
    log(`Could not open browser. Visit: ${url}`, 'info');
  }
} else if (command === 'commands') {
  log('\n🛠️  Available Commands:', 'info');
  log('   init      - Install and configure the debugger in your project', 'info');
  log('   start     - Run your app with the debugger injected (Zero Config)', 'info');
  log('   remove    - Uninstall and remove all traces from your project', 'info');
  log('   help      - Open the documentation on GitHub', 'info');
  log('   commands  - Show this list', 'info');
} else {
  log(`\n❌ Unknown command: "${command || ''}"`, 'error');
  log('👉 Type "npx ui-debugger-pro commands" to see what you can do.', 'warn');
}
