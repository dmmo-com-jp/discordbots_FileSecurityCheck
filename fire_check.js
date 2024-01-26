#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function checkWebhookUsage(filePath, webhookRegexes) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');

  let matches = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const regex of webhookRegexes) {
      if (regex.test(line)||regex.test(Buffer.from(line, 'base64').toString('utf8'))) {
        matches.push({ lineIndex: i + 1, lineContent: line ,filePath:filePath});

      }

    }
  }

  return matches;
}

function exploreDirectory(directory, webhookRegexes) {
  const files = fs.readdirSync(directory);
  let matches = [];

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      matches = matches.concat(exploreDirectory(filePath, webhookRegexes)); // サブディレクトリに再帰的に処理を行う
    } else if (stats.isFile()) {
      const fileMatches = checkWebhookUsage(filePath, webhookRegexes);
      matches = matches.concat(fileMatches);
    }
  }

  return matches;
}

function printMatches(matches) {
  if (matches.length === 0) {
    console.log('No security issues');
  } else {
    console.log('There is a security problem:');
    matches.forEach((match) => {
      console.log(`File: ${match.filePath}`);
      console.log(`Line ${match.lineIndex}: ${match.lineContent}`);
      console.log('---------------------------');
    });
  }
}

function findWebhookUrls(directory, webhookRegexes) {
  const currentDirectory = directory || process.cwd(); // カレントディレクトリのパスを取得

  const matches = exploreDirectory(currentDirectory, webhookRegexes);

  printMatches(matches);
}

// コマンドライン引数の解析
const args = process.argv.slice(2);
const directory = args[0];
const Regexes = [
/https?:\/\/(?:canary|ptb)?\.?discord(?:app)?\.com\/api\/webhooks\/([0-9]{17,19})\/([A-Za-z0-9_\-]+)/,
/[\w-]{24}\.[\w-]{6}\.[\w-]{27}|mfa\.[\w-]{84}/]
console.log("Scan Now")
findWebhookUrls(directory, Regexes);