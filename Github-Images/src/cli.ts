#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { renderStackGridSvg } from './stack-grid.js';
import { renderDividerSvg } from './divider.js';

function parseArgs() {
  const args = process.argv.slice(2);
  let stack = 'typescript,javascript,react,nextjs,nodejs,tailwind,docker,postgres';
  let outputDir = './output';
  let title = 'Core Tech Stack & Tools';
  let divider = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--stack' || arg === '-s') {
      stack = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      outputDir = args[++i];
    } else if (arg === '--title' || arg === '-t') {
      title = args[++i];
    } else if (arg === '--divider') {
      divider = true;
    }
  }

  return { stack, outputDir, title, divider };
}

async function main() {
  const config = parseArgs();
  const resolvedDir = path.resolve(process.cwd(), config.outputDir);
  if (!fs.existsSync(resolvedDir)) {
    fs.mkdirSync(resolvedDir, { recursive: true });
  }

  const techKeys = config.stack.split(',').map(s => s.trim()).filter(Boolean);
  console.log(`🎨 Generating Tech Stack Grid for: ${techKeys.join(', ')}`);

  const stackSvg = renderStackGridSvg(techKeys, { title: config.title });
  const stackPath = path.join(resolvedDir, 'tech-stack.svg');
  fs.writeFileSync(stackPath, stackSvg, 'utf-8');
  console.log(`✅ Saved: ${stackPath}`);

  if (config.divider) {
    const waveSvg = renderDividerSvg({ type: 'wave' });
    const wavePath = path.join(resolvedDir, 'wave-divider.svg');
    fs.writeFileSync(wavePath, waveSvg, 'utf-8');
    console.log(`✅ Saved: ${wavePath}`);
  }

  console.log('🎉 GitHub Images generation complete!');
}

main().catch(console.error);
