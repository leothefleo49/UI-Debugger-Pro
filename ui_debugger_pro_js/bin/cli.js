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

function recursiveFindFiles(dir, patterns, maxDepth = 5, currentDepth = 0) {
  if (currentDepth > maxDepth) return [];
  
  let results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      // Skip node_modules, .git, dist, build
      if (['node_modules', '.git', 'dist', 'build', '.next', 'out'].includes(entry.name)) {
        continue;
      }
      
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        results = results.concat(recursiveFindFiles(fullPath, patterns, maxDepth, currentDepth + 1));
      } else if (entry.isFile()) {
        for (const pattern of patterns) {
          if (entry.name === pattern || entry.name.match(pattern)) {
            results.push(fullPath);
          }
        }
      }
    }
  } catch (e) {
    // Skip directories we can't read
  }
  
  return results;
}

function findEntryFile() {
  // Priority order for entry files
  const candidates = [
    // Next.js patterns
    { pattern: 'layout.tsx', priority: 10, type: 'nextjs-app' },
    { pattern: 'layout.js', priority: 10, type: 'nextjs-app' },
    { pattern: '_app.tsx', priority: 9, type: 'nextjs-pages' },
    { pattern: '_app.js', priority: 9, type: 'nextjs-pages' },
    
    // React patterns (Vite, CRA, Webpack)
    { pattern: /^main\.(tsx|ts|jsx|js)$/, priority: 8, type: 'vite' },
    { pattern: /^index\.(tsx|ts|jsx|js)$/, priority: 7, type: 'react' },
    { pattern: /^App\.(tsx|ts|jsx|js)$/, priority: 6, type: 'react' },
    
    // Vue patterns
    { pattern: /^main\.(ts|js)$/, priority: 5, type: 'vue' },
    { pattern: /^App\.vue$/, priority: 5, type: 'vue' },
    
    // Angular patterns
    { pattern: /^main\.ts$/, priority: 4, type: 'angular' },
    
    // Static HTML/PHP
    { pattern: /^index\.html$/, priority: 3, type: 'html' },
    { pattern: /^index\.php$/, priority: 2, type: 'php' },
  ];
  
  log('🔍 Scanning project structure...', 'info');
  
  // Search recursively
  for (const candidate of candidates) {
    const files = recursiveFindFiles('.', [candidate.pattern], 4);
    
    if (files.length > 0) {
      // Prefer files in src/, app/, or root
      const sorted = files.sort((a, b) => {
        const aDepth = a.split(path.sep).length;
        const bDepth = b.split(path.sep).length;
        const aInSrc = a.includes('src') || a.includes('app') || a.includes('App');
        const bInSrc = b.includes('src') || b.includes('app') || b.includes('App');
        
        if (aInSrc && !bInSrc) return -1;
        if (!aInSrc && bInSrc) return 1;
        return aDepth - bDepth;
      });
      
      const selectedFile = sorted[0];
      log(`✅ Detected ${candidate.type} project: ${selectedFile}`, 'success');
      return { file: selectedFile, type: candidate.type };
    }
  }
  
  return null;
}

function detectDevCommand() {
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    return null;
  }
  
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const scripts = pkg.scripts || {};
    
    // Priority order for dev commands
    const devScripts = ['dev', 'start', 'serve', 'vite', 'next dev', 'ng serve', 'vue-cli-service serve'];
    
    for (const scriptName of devScripts) {
      if (scripts[scriptName]) {
        log(`✅ Detected dev script: ${scriptName}`, 'success');
        return scriptName;
      }
    }
    
    // If no standard script found, check for any script with 'dev' or 'start' in the name
    const scriptNames = Object.keys(scripts);
    const devScript = scriptNames.find(name => name.includes('dev') || name.includes('start'));
    
    if (devScript) {
      log(`✅ Detected dev script: ${devScript}`, 'success');
      return devScript;
    }
    
    log('⚠️ No dev script found in package.json', 'warn');
    return null;
  } catch (e) {
    log('⚠️ Could not parse package.json', 'warn');
    return null;
  }
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
  const result = findEntryFile();
  
  if (!result) {
    log('⚠️ Could not automatically find entry file in your project.', 'warn');
    log('💡 Please manually add to your root component:', 'info');
    log(`   1. ${IMPORT_STATEMENT}`, 'info');
    log(`   2. ${COMPONENT_TAG}`, 'info');
    return false;
  }

  const { file, type } = result;

  // Check if it's an HTML/PHP file
  if (type === 'html' || type === 'php') {
    return injectIntoHTML(file);
  }

  log(`📝 Injecting into ${file}...`, 'info');
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('ui-debugger-pro')) {
    log('✅ UI Debugger already present in this file', 'success');
    return true;
  }

  // Inject Import
  if (content.includes('import')) {
    // Add after the first import block
    const lines = content.split('\n');
    let lastImportIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import')) {
        lastImportIndex = i;
      }
    }
    lines.splice(lastImportIndex + 1, 0, IMPORT_STATEMENT);
    content = lines.join('\n');
  } else {
    content = IMPORT_STATEMENT + '\n' + content;
  }

  // Inject Component based on detected type
  if (type === 'nextjs-app') {
    // Next.js App Router: Insert before </body> or after {children}
    if (content.includes('</body>')) {
      content = content.replace('</body>', `  ${COMPONENT_TAG}\n      </body>`);
    } else if (content.includes('{children}')) {
      content = content.replace('{children}', `{children}\n        ${COMPONENT_TAG}`);
    }
  } else if (type === 'nextjs-pages') {
    // Next.js Pages Router: Insert after <Component ... />
    if (content.includes('<Component')) {
      content = content.replace(/<Component\s+\{\.\.\.pageProps\}\s*\/?>/, `$&\n      ${COMPONENT_TAG}`);
    }
  } else if (type === 'vite' || type === 'react') {
    // Vite/CRA: Usually root.render(<App />) or <StrictMode><App /></StrictMode>
    if (content.includes('<App />') && !content.includes('<App />\n')) {
      content = content.replace('<App />', `<>\n    <App />\n    ${COMPONENT_TAG}\n  </>`);
    } else if (content.includes('<App/>')) {
      content = content.replace('<App/>', `<>\n    <App/>\n    ${COMPONENT_TAG}\n  </>`);
    } else if (content.includes('</StrictMode>')) {
      content = content.replace('</StrictMode>', `  ${COMPONENT_TAG}\n  </StrictMode>`);
    }
  } else if (type === 'vue') {
    // Vue: Add to App.vue template or main.ts with global component
    log('⚠️ Vue detected. Please add <UIDebugger /> to your App.vue template', 'warn');
    return false;
  } else if (type === 'angular') {
    // Angular: Add to app.component.html
    log('⚠️ Angular detected. Please add <ui-debugger></ui-debugger> to your app.component.html', 'warn');
    return false;
  }

  fs.writeFileSync(file, content);
  log(`✅ Successfully injected into ${file}`, 'success');
  return true;
}

function removeCode() {
  const result = findEntryFile();
  if (!result) {
    log('⚠️ Could not find entry file to clean up', 'warn');
    return;
  }
  
  const { file } = result;
  
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('ui-debugger-pro')) {
    // For HTML files, remove CDN scripts
    if (file.endsWith('.html') || file.endsWith('.php')) {
      content = content.replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/ui-debugger-pro@latest\/dist\/index\.global\.js"><\/script>/g, '');
      content = content.replace(/<script>[\s\S]*?if \(window\.UIDebuggerPro[\s\S]*?<\/script>/g, '');
    } else {
      // For JS/TS files, remove imports and components
      content = content.replace(new RegExp(IMPORT_STATEMENT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\n?', 'g'), '');
      content = content.replace(new RegExp(COMPONENT_TAG.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
      
      // Clean up fragments if we added them
      content = content.replace('<>\n    <App />\n    \n  </>', '<App />');
      content = content.replace('<>\n    <App/>\n    \n  </>', '<App/>');
      
      // Remove empty lines that might have been created
      content = content.replace(/\n\n\n+/g, '\n\n');
    }

    fs.writeFileSync(file, content);
    log(`✅ Cleaned up ${file}`, 'success');
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

function findProjectRoot() {
  // Search for package.json in current dir and subdirectories
  const searchDirs = [
    '.',
    './app', './App',
    './src',
    './client',
    './frontend',
    './web',
  ];
  
  for (const dir of searchDirs) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.scripts && Object.keys(pkg.scripts).length > 0) {
          log(`✅ Found project in: ${dir}`, 'success');
          return dir;
        }
      } catch (e) {
        // Skip invalid package.json
      }
    }
  }
  
  return null;
}

function start() {
  log('🚀 Starting UI Debugger Pro - Universal Zero-Config Mode...', 'info');
  log('🔎 Auto-detecting project type and configuration...', 'info');
  
  // 0. Find the actual project directory
  const projectRoot = findProjectRoot();
  
  if (projectRoot && projectRoot !== '.') {
    log(`📂 Detected project in subdirectory: ${projectRoot}`, 'info');
    log(`🔄 Switching to project directory...`, 'info');
    process.chdir(projectRoot);
  }
  
  // 1. Inject
  const injected = injectCode();
  
  if (!injected) {
    log('⚠️ Could not auto-inject. Please add <UIDebugger /> manually.', 'warn');
  }
  
  // 2. Detect and Run Dev Server
  const devScript = detectDevCommand();
  
  if (!devScript) {
    log('❌ Could not detect dev command. Please run your dev server manually.', 'error');
    log('💡 Add a "dev" or "start" script to your package.json', 'info');
    return;
  }
  
  const pm = detectPackageManager();
  const runCmd = pm === 'npm' ? `npm run ${devScript}` : 
                 pm === 'yarn' ? `yarn ${devScript}` : 
                 `pnpm ${devScript}`;
                 
  log(`▶️  Running: ${runCmd}`, 'info');
  log('⚠️  Press Ctrl+C to stop and auto-cleanup', 'warn');
  
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
