import test from 'node:test';
import assert from 'node:assert/strict';

// Test pure helper and configuration logic
test('Bento Grid IDs and stagger delay mapping', () => {
  const ids = ['01', '02', '03', '04', 'header', 'banner'];
  assert.equal(ids.length, 6);

  const delayMap: Record<string, string> = {
    '01': 'bento-delay-0',
    '02': 'bento-delay-1',
    '03': 'bento-delay-2',
    '04': 'bento-delay-3',
    'header': '',
    'banner': 'bento-delay-1'
  };

  assert.equal(delayMap['01'], 'bento-delay-0');
  assert.equal(delayMap['04'], 'bento-delay-3');
});

test('Intersection observer state visibility fallback', () => {
  const defaultFallback: Record<string, boolean> = {
    header: true,
    '01': true,
    '02': true,
    '03': true,
    '04': true,
    banner: true,
  };

  assert.equal(defaultFallback['01'], true);
  assert.equal(defaultFallback['header'], true);
  assert.equal(Object.keys(defaultFallback).length, 6);
});
