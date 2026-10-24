import test from 'node:test';
import assert from 'node:assert/strict';
import { PILLARS_DATA, filterPillars, getPillarById, formatInquiryMailto } from './pillarData.ts';

test('PILLARS_DATA contains 4 distinct enterprise dimensions', () => {
  assert.equal(PILLARS_DATA.length, 4);
  const ids = PILLARS_DATA.map(p => p.id);
  assert.deepEqual(ids, ['01', '02', '03', '04']);
});

test('filterPillars handles ALL and specific IDs', () => {
  assert.equal(filterPillars('ALL').length, 4);
  const p1 = filterPillars('01');
  assert.equal(p1.length, 1);
  assert.equal(p1[0].category, 'Cyber & Digital');

  const p3 = filterPillars('03');
  assert.equal(p3.length, 1);
  assert.equal(p3[0].category, 'Komoditas & Agro');
});

test('getPillarById returns correct pillar or undefined', () => {
  const p2 = getPillarById('02');
  assert.ok(p2);
  assert.equal(p2?.num, '02');
  assert.match(p2?.title || '', /Enjinering/);

  const invalid = getPillarById('99');
  assert.equal(invalid, undefined);
});

test('formatInquiryMailto creates properly encoded mailto links', () => {
  const link = formatInquiryMailto('Teknologi Informasi, IoT & Keamanan Siber', 'PT Maju Bersama', 'Kebutuhan IoT telemetry');
  assert.ok(link.startsWith('mailto:halo@kriya.my.id?subject='));
  assert.ok(link.includes(encodeURIComponent('PT Maju Bersama')));
  assert.ok(link.includes(encodeURIComponent('Kebutuhan IoT telemetry')));
});

test('PILLARS_DATA uses captivating hook tags and has no KBLI or formal bureaucratic terms', () => {
  const jsonStr = JSON.stringify(PILLARS_DATA).toLowerCase();
  assert.equal(jsonStr.includes('kbli'), false, 'Should not contain KBLI');
  assert.equal(jsonStr.includes('resmi'), false, 'Should not contain resmi');
  assert.equal(jsonStr.includes('oss'), false, 'Should not contain oss');

  for (const pillar of PILLARS_DATA) {
    assert.ok(pillar.hookTag && pillar.hookTag.length > 5, 'Must have captivating hook tag');
    assert.match(pillar.hookTag, /CLOUD|ARCHITECTURE|HARVEST|FLEET/);
  }
});

