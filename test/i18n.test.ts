import { describe, expect, it } from 'vitest';
import { t, supportedLocales, type Locale } from '../src/i18n';

describe('i18n', () => {
  it('uses Korean as the default product language', () => {
    expect(t('startHint')).toBe('모서리를 잡고 낮게 당기세요');
  });

  it('supports English copy for the first implementation', () => {
    expect(t('retry', 'en')).toBe('Peel again');
  });

  it('includes a concise game guide in both supported locales', () => {
    expect(t('guideTitle', 'ko')).toBe('목표');
    expect(t('guideLow', 'en')).toContain('low');
  });

  it('localizes result labels and titles', () => {
    expect(t('ratingTorn', 'ko')).toBe('찢어짐');
    expect(t('clean', 'ko')).toBe('깔끔도');
  });

  it('falls back to Korean when an unknown locale is supplied', () => {
    expect(t('danger', 'jp' as Locale)).toBe('찢어질 수 있어요');
  });

  it('exposes the selectable locale list', () => {
    expect(supportedLocales).toEqual(['ko', 'en']);
  });
});
