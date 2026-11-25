// The 3AM Fridge Text — a make.fun entry.
//
// The voice behind the line: a kitchen fridge pulling the night shift.
// It has been humming for six straight years, not for itself, but so the
// leftovers inside can rest undisturbed. At 3am it finally snaps and texts
// its owner — not about the milk or the door, but about the habit of
// opening it just to stare and think. The joke is the appliance's
// exhaustion and its one small demand: stop using me as a thinking spot.
//
// The gate (from the kit): the file at /output/entry.txt must be UTF-8
// text of 1 to 140 characters, not only whitespace, and a single line.
// This program keeps the line short on purpose — 121 characters — and
// checks every part of the gate itself before writing anything, so a
// bad line can never reach the judge.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The message, exactly as it will be judged.
const NIGHT_SHIFT_LINE =
  "3am. I've hummed nonstop for six years so your leftovers could sleep. The least you could do is stop opening me to think.";

// The gate's limits, straight from the competition kit.
const GATE = { minChars: 1, maxChars: 140 };

// Where the entry goes: the sandbox output dir, or MAKEFUN_OUTPUT_DIR
// when running locally outside the container.
function resolveOutputDir(): string {
  const local = process.env.MAKEFUN_OUTPUT_DIR;
  return local !== undefined && local !== "" ? local : "/output";
}

// Collapse any stray whitespace so the line is one clean lock-screen text.
function tidy(line: string): string {
  return line.replace(/\s+/g, " ").trim();
}

// Enforce the gate here, before the file is written.
function checkGate(text: string): void {
  const chars = [...text].length;
  if (text.trim().length === 0) {
    throw new Error("entry is blank");
  }
  if (chars < GATE.minChars || chars > GATE.maxChars) {
    throw new Error(
      `entry is ${chars} characters, outside the ${GATE.minChars}-${GATE.maxChars} range`,
    );
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  const text = tidy(NIGHT_SHIFT_LINE);
  checkGate(text);
  const dir = resolveOutputDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "entry.txt"), text, "utf8");
}

main();
