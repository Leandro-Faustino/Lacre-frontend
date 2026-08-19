export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isUnauthorized() { return this.status === 401; }
  get isForbidden()    { return this.status === 403; }
  get isNotFound()     { return this.status === 404; }
  get isConflict()     { return this.status === 409; }
  get isServerError()  { return this.status >= 500; }
}

export async function parseApiError(response: Response): Promise<ApiError> {
  let message = `Erro ${response.status}`;
  let details: unknown;
  try {
    const body = await response.json();
    message = body?.message ?? body?.error ?? message;
    details = body?.detalhes;
  } catch {
    // resposta sem JSON válido — mantém mensagem padrão
  }
  return new ApiError(response.status, message, details);
}
