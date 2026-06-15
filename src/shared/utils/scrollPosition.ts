let scrollY = 0;

export function saveScrollPosition(): void {
  if (typeof window !== "undefined") {
    scrollY = window.scrollY;
  }
}

export function restoreScrollPosition(): void {
  if (scrollY > 0 && typeof window !== "undefined") {
    window.scrollTo(0, scrollY);
    scrollY = 0;
  }
}
