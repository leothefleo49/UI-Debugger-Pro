#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function findProjectRoot() {
  // First, search UP the directory tree for package.json
  let currentDir = process.cwd();
  const root = path.parse(currentDir).root;
  
  while (currentDir !== root) {
    const pkgPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.scripts && Object.keys(pkg.scripts).length > 0) {
          const relativePath = path.relative(process.cwd(), currentDir);
          if (relativePath) {
            log(`✅ Found project in parent directory: ${relativePath || currentDir}`, 'success');
          }
          return currentDir;
        }
      } catch (e) {
        // Skip invalid package.json
      }
    }
    currentDir = path.dirname(currentDir);
  }
  
  // If not found above, search DOWN in common subdirectories
  const searchDirs = [
    '.',
    'app', 'App',
    'src',
    'client',
    'frontend',
    'web',
  ];
  
  for (const dir of searchDirs) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.scripts && Object.keys(pkg.scripts).length > 0) {
          const fullPath = path.resolve(dir);
          if (dir !== '.') {
            log(`✅ Found project in subdirectory: ${dir}`, 'success');
          }
          return fullPath;
        }
      } catch (e) {
        // Skip invalid package.json
      }
    }
  }
  
  return null;
}

function detectPackageManager(projectRoot = '.') {
  const oldCwd = process.cwd();
  if (projectRoot !== '.') {
    process.chdir(projectRoot);
  }
  
  let pm = 'npm';
  if (fs.existsSync('yarn.lock')) pm = 'yarn';
  else if (fs.existsSync('pnpm-lock.yaml')) pm = 'pnpm';
  
  process.chdir(oldCwd);
  return pm;
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

function detectDevCommand(projectRoot = '.') {
  const pkgPath = path.join(projectRoot, 'package.json');
  
  if (!fs.existsSync(pkgPath)) {
    return null;
  }
  
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
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
  
  // Inject Script (Localhost -> CDN Fallback)
  const script = `
  <script>
    (function() {
      const init = () => {
        if (window.UIDebuggerPro && window.UIDebuggerPro.UIDebugger) {
          const container = document.createElement('div');
          container.id = '__ui_debugger_pro__';
          document.body.appendChild(container);
          
          if (window.React && window.ReactDOM) {
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(window.UIDebuggerPro.UIDebugger));
          }
        }
      };

      const load = (src) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = init;
        s.onerror = () => {
          if (src.includes('localhost')) load('https://cdn.jsdelivr.net/npm/ui-debugger-pro@latest/dist/index.global.js');
        };
        document.body.appendChild(s);
      };
      load('http://localhost:8989/bundle.js');
    })();
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
  
  let packageToInstall = 'ui-debugger-pro';
  
  // Smart Local Dev: If running from source (not node_modules), install from local path
  if (!__dirname.includes('node_modules')) {
     const sourceRoot = path.resolve(__dirname, '..');
     if (fs.existsSync(path.join(sourceRoot, 'package.json'))) {
        packageToInstall = sourceRoot;
        log(`📦 Detected local source. Installing from ${packageToInstall}...`, 'info');
     }
  }

  const cmd = pm === 'npm' ? `npm install ${packageToInstall}` : 
              pm === 'yarn' ? `yarn add ${packageToInstall}` : `pnpm add ${packageToInstall}`;
  
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
    // Vite/CRA: Find createRoot().render() and inject inside
    // Strategy: Add UIDebugger as sibling to App inside StrictMode
    
    // Look for root.render(<StrictMode>...<App />...</StrictMode>)
    if (content.includes('<StrictMode>') && content.includes('<App')) {
      // Add UIDebugger right after App component inside StrictMode
      const appRegex = /(<App\s*\/>|<App><\/App>)/;
      if (appRegex.test(content)) {
        content = content.replace(appRegex, `$1\n      ${COMPONENT_TAG}`);
      }
    } else if (content.includes('root.render(') && content.includes('<App')) {
      // No StrictMode, just root.render(<App />)
      // Wrap in fragment to add debugger
      const appRegex = /(root\.render\(\s*)(<App\s*\/?>)/;
      if (appRegex.test(content)) {
        content = content.replace(appRegex, `$1<>\n    $2\n    ${COMPONENT_TAG}\n  </>`);
      }
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
      content = content.replace(/<>\s*\n\s*(<[^>]+\s*\/>)\s*\n\s*\n\s*<\/>/g, '$1');
      content = content.replace(/<>\s*\n\s*(<[^>]+>)/g, '$1');
      content = content.replace(/<\/StrictMode>\s*\n\s*<\/>/g, '</StrictMode>');
      
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
  log('🔎 Searching for project (checking parent & child directories)...', 'info');
  
  // Save original directory to restore later
  const originalCwd = process.cwd();
  
  // 0. Find the actual project directory (search up and down)
  const projectRoot = findProjectRoot();
  
  if (!projectRoot) {
    log('❌ Could not find a Node.js project with scripts', 'error');
    log('💡 Make sure you\'re near a project with package.json containing scripts', 'info');
    log('💡 Searched: parent directories and subdirectories (app/, App/, src/, client/, frontend/, web/)', 'info');
    return;
  }
  
  // Switch to project directory
  const relativePath = path.relative(process.cwd(), projectRoot);
  if (relativePath && relativePath !== '.') {
    log(`📂 Switching to project directory: ${relativePath}`, 'info');
  }
  process.chdir(projectRoot);
  
  // 1. Ensure Package is Installed
  const pmForInstall = detectPackageManager('.');
  const pkgPath = path.join(process.cwd(), 'package.json');
  let pkg = {};
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (e) {}

  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  let wasInstalledByStart = false;

  if (!deps['ui-debugger-pro']) {
    log('📦 Installing temporary dependency (ui-debugger-pro)...', 'info');
    
    let packageToInstall = 'ui-debugger-pro';
    // Smart Local Dev: If running from source, install from local path
    if (!__dirname.includes('node_modules')) {
       const sourceRoot = path.resolve(__dirname, '..');
       if (fs.existsSync(path.join(sourceRoot, 'package.json'))) {
          packageToInstall = sourceRoot;
       }
    }

    const installCmd = pmForInstall === 'npm' ? `npm install ${packageToInstall} --no-save` : 
                       pmForInstall === 'yarn' ? `yarn add ${packageToInstall} --dev` : 
                       `pnpm add ${packageToInstall} -D`;
    try {
      execSync(installCmd, { stdio: 'inherit' });
      wasInstalledByStart = true;
      log('✅ Dependency installed.', 'success');
    } catch (e) {
      log('❌ Failed to install dependency. The app might crash.', 'error');
    }
  }

  // 2. Inject
  const injected = injectCode();
  
  if (!injected) {
    log('⚠️ Could not auto-inject. Please add <UIDebugger /> manually.', 'warn');
  }

  // 3. Start Control Server (for API & Tools)
  const http = require('http');
  const server = http.createServer((req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', version: '7.8.0' }));
      return;
    }

    // Serve local bundle for development
    if (req.url === '/bundle.js') {
      const bundlePath = path.join(__dirname, '../dist/index.global.js');
      if (fs.existsSync(bundlePath)) {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        fs.createReadStream(bundlePath).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Bundle not found');
      }
      return;
    }

    if (req.url === '/logs' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const logs = JSON.parse(body);
          const logDir = path.join(process.cwd(), 'ui-debug-logs');
          if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
          const logFile = path.join(logDir, `session-${Date.now()}.json`);
          fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
          log(`💾 Saved ${logs.length} logs to ${logFile}`, 'success');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, path: logFile }));
        } catch (e) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.url === '/save-snippet' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const { code, type, selector } = JSON.parse(body);
          const snippetDir = path.join(process.cwd(), 'ui-debug-snippets');
          if (!fs.existsSync(snippetDir)) fs.mkdirSync(snippetDir);
          
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const filename = `snippet-${timestamp}.${type === 'css' ? 'css' : 'txt'}`;
          const filePath = path.join(snippetDir, filename);
          
          const content = `/* Selector: ${selector} */\n${code}\n`;
          
          fs.writeFileSync(filePath, content);
          log(`💾 Saved snippet to ${filePath}`, 'success');
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, path: filePath }));
        } catch (e) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    res.writeHead(404);
    res.end();
  });

  const PORT = 8989;
  server.listen(PORT, () => {
    // log(`🔌 Control Server running on port ${PORT}`, 'info');
  });

  // 4. Detect and Run Dev Server
  const devScript = detectDevCommand('.');
  
  if (!devScript) {
    log('❌ Could not detect dev command. Please run your dev server manually.', 'error');
    log('💡 Add a "dev" or "start" script to your package.json', 'info');
    return;
  }
  
  const pm = detectPackageManager('.');
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
    
    if (wasInstalledByStart) {
      log('🗑️ Removing temporary dependency...', 'info');
      const removeCmd = pmForInstall === 'npm' ? 'npm uninstall ui-debugger-pro' : 
                        pmForInstall === 'yarn' ? 'yarn remove ui-debugger-pro' : 
                        'pnpm remove ui-debugger-pro';
      try {
        execSync(removeCmd, { stdio: 'ignore' });
      } catch (e) {}
    }

    // Restore original directory
    try {
      process.chdir(originalCwd);
    } catch (e) {
      // Ignore if original directory no longer exists
    }
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
