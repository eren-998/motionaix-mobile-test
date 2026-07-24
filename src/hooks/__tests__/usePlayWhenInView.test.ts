import { renderHook } from '@testing-library/react';
import { usePlayWhenInView } from '../usePlayWhenInView';
import { vi, describe, it, expect } from 'vitest';

describe('usePlayWhenInView', () => {
  it('should return false if not in view, even if isPlaying is true', () => {
    const { result } = renderHook(() => usePlayWhenInView(true, false));
    expect(result.current).toBe(false);
  });

  it('should return true if in view and isPlaying is true', () => {
    const { result } = renderHook(() => usePlayWhenInView(true, true));
    expect(result.current).toBe(true);
  });

  it('should return false if in view but isPlaying is false', () => {
    const { result } = renderHook(() => usePlayWhenInView(false, true));
    expect(result.current).toBe(false);
  });
});
