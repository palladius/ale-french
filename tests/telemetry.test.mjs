import test from 'node:test';
import assert from 'node:assert/strict';
import {
  recordFrenchTelemetry,
  startFrenchQuestionTelemetry,
  getFrenchTelemetry,
  getFrenchTelemetrySummary,
  clearFrenchTelemetry
} from '../telemetry.js';

test('1. recordFrenchTelemetry stores valid records and caps hesitation calculation', () => {
  clearFrenchTelemetry();
  const rec = recordFrenchTelemetry({
    user: 'seby',
    exercise: 'number_tap',
    mode: 'choice',
    target: 'trois',
    userInput: 'trois',
    correct: true,
    durationMs: 1420,
    hintsUsed: 1
  });

  assert.equal(rec.user, 'seby');
  assert.equal(rec.target, 'trois');
  assert.equal(rec.correct, true);
  assert.equal(rec.durationMs, 1420);
  assert.equal(rec.hintsUsed, 1);
  // 1.42s + 1*2 = 3.42 -> 3.4
  assert.equal(rec.hesitationScore, 3.4);

  const stored = getFrenchTelemetry({ user: 'seby' });
  assert.equal(stored.length, 1);
  assert.equal(stored[0].id, rec.id);
});

test('2. startFrenchQuestionTelemetry tracks duration and audio hints', async () => {
  clearFrenchTelemetry();
  const tracker = startFrenchQuestionTelemetry({
    user: 'ale',
    exercise: 'verb_quiz',
    mode: 'typing',
    target: 'tu es'
  });

  tracker.markHint();
  tracker.markHint();
  assert.equal(tracker.getHintsCount(), 2);

  await new Promise(r => setTimeout(r, 20));

  const recorded = tracker.finish(true, 'tu es');
  assert.equal(recorded.user, 'ale');
  assert.equal(recorded.hintsUsed, 2);
  assert.equal(recorded.correct, true);
  assert.ok(recorded.durationMs >= 15, `Duration should be >= 15ms, got ${recorded.durationMs}`);
});

test('3. getFrenchTelemetrySummary correctly computes accuracy, avg duration and hardest items', () => {
  clearFrenchTelemetry();
  recordFrenchTelemetry({ user: 'ale', target: 'ils finissent', correct: false, durationMs: 4000 });
  recordFrenchTelemetry({ user: 'ale', target: 'ils finissent', correct: false, durationMs: 3500 });
  recordFrenchTelemetry({ user: 'ale', target: 'ils finissent', correct: true, durationMs: 2000 });
  recordFrenchTelemetry({ user: 'ale', target: 'je mange', correct: true, durationMs: 1000 });

  const summary = getFrenchTelemetrySummary('ale');
  assert.equal(summary.total, 4);
  assert.equal(summary.correctCount, 2);
  assert.equal(summary.accuracyPct, 50);
  assert.equal(summary.hardestItems.length, 1);
  assert.equal(summary.hardestItems[0].target, 'ils finissent');
  assert.equal(summary.hardestItems[0].errors, 2);
});
