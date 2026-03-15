import { clsx } from 'clsx';

import type { ClassValue } from 'clsx';

import { twMerge } from 'tailwind-merge';

export { isEmbedMode } from './is-embed-mode';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
