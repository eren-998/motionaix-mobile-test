import { useState, useEffect, RefObject } from 'react';

export function usePlayWhenInView(isPlaying: boolean, inView: boolean): boolean {
  return isPlaying && inView;
}
