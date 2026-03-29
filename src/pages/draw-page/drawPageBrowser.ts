import type { DrawResult } from '../../types';

interface DownloadWindowLike {
  URL: {
    createObjectURL: (blob: Blob) => string;
    revokeObjectURL: (url: string) => void;
  };
}

interface DownloadDocumentLike {
  createElement: (tagName: 'a') => {
    href: string;
    download: string;
    click: () => void;
  };
}

interface ScrollWindowLike {
  navigator: {
    userAgent: string;
  };
  scrollTo: (options: ScrollToOptions) => void;
}

export function createResultDownloadFileName(timestamp: DrawResult['timestamp']) {
  return `resultado-sorteio-${timestamp}.json`;
}

export function shouldUseSmoothScroll(userAgent: string) {
  return !userAgent.toLowerCase().includes('jsdom');
}

export function downloadDrawResultJson(
  result: DrawResult,
  windowRef: DownloadWindowLike,
  documentRef: DownloadDocumentLike
) {
  const json = JSON.stringify(result, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = windowRef.URL.createObjectURL(blob);
  const anchor = documentRef.createElement('a');

  anchor.href = url;
  anchor.download = createResultDownloadFileName(result.timestamp);
  anchor.click();

  windowRef.URL.revokeObjectURL(url);
}

export function scrollToPageTopIfSupported(windowRef: ScrollWindowLike) {
  if (!shouldUseSmoothScroll(windowRef.navigator.userAgent)) {
    return;
  }

  windowRef.scrollTo({ top: 0, behavior: 'smooth' });
}
