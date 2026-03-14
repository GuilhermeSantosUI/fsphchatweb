/**
 * Detecta se o app está rodando dentro de um iframe (modo embed).
 * Também aceita o query param ?embed para facilitar testes locais.
 */
export function isEmbedMode(): boolean {
  try {
    if (window.self !== window.top) return true;
  } catch {
    // Acesso bloqueado por cross-origin → definitivamente está em iframe
    return true;
  }
  return new URLSearchParams(window.location.search).has('embed');
}
