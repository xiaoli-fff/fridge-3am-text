// The 3AM Fridge Text (Node 22, standard library only): writes the one line
// a smart fridge would text its owner at 3am to /output/entry.txt.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Deterministic: no network, no randomness, no time or environment input.
// Both runs write identical bytes.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The text: a fridge that has hummed nonstop for six years so the leftovers
// could sleep, finally snapping at the owner who keeps opening it just to
// think. Fresh angle (no milk, no ice, no door left open), appliance voice
// with an opinion, complete on a lock screen.
const ENTRY_TEXT =
  "3am. I've hummed nonstop for six years so your leftovers could sleep. The least you could do is stop opening me to think.";

// Gate (competition.yaml): /output/entry.txt must be UTF-8 text of 1-140
// characters, not only whitespace, and exactly one line.
const MAX_CHARS = 140;

function failGate(detail: string): never {
  throw new Error(`gate failed: ${detail}`);
}

function checkNotBlank(text: string): void {
  if (text.trim().length === 0) {
    failGate('entry must not be empty or only whitespace');
  }
}

function checkSingleLine(text: string): void {
  if (text.includes('\n') || text.includes('\r')) {
    failGate('entry must be exactly one line');
  }
}

function checkLength(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    failGate(`entry must be 1-${MAX_CHARS} characters, got ${chars}`);
  }
}

function checkNoTrailingSpace(text: string): void {
  if (text !== text.trimEnd()) {
    failGate('entry must not end with trailing whitespace');
  }
}

// validateEntry checks each gate item separately so a failure names the
// gate item that was missed instead of a bare character count.
function validateEntry(text: string): string {
  checkNotBlank(text);
  checkSingleLine(text);
  checkLength(text);
  checkNoTrailingSpace(text);
  return text + '\n';
}

const ENTRY = validateEntry(ENTRY_TEXT);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.txt'), ENTRY, 'utf8');
