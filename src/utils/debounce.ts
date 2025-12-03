
// ===============================
// Debounce Function
// ===============================
// Purpose: Prevents a function from being called too often.
// ===============================


export function debounce<fn extends (...args: any[]) => void>(
  call_back: fn, 
  delay = 300
): (...args: Parameters<fn>) => void {

  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<fn>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      call_back(...args);
    }, delay);
  };

}
