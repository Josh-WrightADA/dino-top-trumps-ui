import { describe, it, expect } from 'vitest';
import { extractErrorMessage } from './extractErrorMessage';

describe('extractErrorMessage', () => {
  it('returns detail when present', () => {
    const err = { response: { data: { detail: 'Not found.' } } };
    expect(extractErrorMessage(err, 'fallback')).toBe('Not found.');
  });

  it('returns message when detail is absent', () => {
    const err = { response: { data: { message: 'Bad request.' } } };
    expect(extractErrorMessage(err, 'fallback')).toBe('Bad request.');
  });

  it('prefers detail over message', () => {
    const err = { response: { data: { detail: 'Detail wins.', message: 'Message loses.' } } };
    expect(extractErrorMessage(err, 'fallback')).toBe('Detail wins.');
  });

  it('returns fallback when no detail or message', () => {
    const err = { response: { data: {} } };
    expect(extractErrorMessage(err, 'Custom fallback.')).toBe('Custom fallback.');
  });

  it('returns fallback when response is undefined', () => {
    expect(extractErrorMessage({}, 'Network error.')).toBe('Network error.');
  });

  it('returns fallback when err is null', () => {
    expect(extractErrorMessage(null, 'Oops.')).toBe('Oops.');
  });

  it('returns default fallback when none provided', () => {
    expect(extractErrorMessage(null)).toBe('Something went wrong.');
  });
});
