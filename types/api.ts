// ─── Perfil do usuário ────────────────────────────────────────────────────────

export interface MeResponse {
  userId: string;
  tenantId: string;
  assuranceLevel: "aal1" | "aal2" | "desconhecido";
  perfil: "ADMINISTRADOR" | "FINANCEIRO" | "VISUALIZADOR";
}

// ─── Status de entrega ───────────────────────────────────────────────────────

export type EntregaStatus =
  | "AGUARDANDO_COMPROVANTE"
  | "COMPROVADA"
  | "EM_REVISAO"
  | "OCORRENCIA_NAO_ENTREGA"
  | "NAO_APLICAVEL";

// Status exibido na UI (derivado de EntregaStatus + dias_aberto)
export type DisplayStatus =
  | "Lacrada"
  | "Pendente"
  | "Atenção"
  | "Revisão"
  | "Ocorrência"
  | "N/A";

// ─── Pendências ───────────────────────────────────────────────────────────────

export interface PendenciaItem {
  entrega_id: string;
  nota_numero: string;
  nota_valor_total: number;
  destinatario_nome: string;
  motorista_nome: string | null;
  dias_aberto: number;
  ultima_cobranca_em: string | null;
}

export interface PendenciasResponse {
  exposicao_total: number;
  total_pendentes: number;
  items: PendenciaItem[];
  proximo_cursor: { cursor_dias: number; cursor_id: string } | null;
}

// ─── Comprovantes (lista) ─────────────────────────────────────────────────────

export interface ComprovanteSummary {
  entrega_id: string;
  status: EntregaStatus;
  nota_numero: string;
  nota_serie: string;
  nota_chave_acesso: string | null;
  nota_valor_total: number;
  destinatario_nome: string;
  motorista_nome: string | null;
  midia_sha256: string | null;
  midia_confianca: number | null;
  criado_em: string;
  atualizado_em: string;
  nota_emitida_em: string;
  destinatario_documento: string;
  midia_id: string | null;
  midia_status: string | null;
}

export interface ComprovantesResponse {
  items: ComprovanteSummary[];
  total_aproximado: number;
  proximo_cursor: { cursor_data: string; cursor_id: string } | null;
}

// ─── Comprovante (detalhe) ────────────────────────────────────────────────────

export interface TimelineEvent {
  momento: string;
  evento: string;
  detalhe: string | null;
}

export interface MidiaDetalhe {
  id: string;
  status: "PENDENTE" | "BAIXANDO" | "ARMAZENADA" | "FALHA";
  sha256_original: string | null;
  confianca_geral: number | null;
}

export interface ComprovanteDetalhe {
  id: string;
  status: EntregaStatus;
  notas_fiscais: {
    numero: string;
    serie: string;
    chave_acesso: string | null;
    emitida_em: string;
    valor_total: number;
    destinatario_nome: string;
    destinatario_documento: string;
  } | {
    numero: string;
    serie: string;
    chave_acesso: string | null;
    emitida_em: string;
    valor_total: number;
    destinatario_nome: string;
    destinatario_documento: string;
  }[] | null;
  motoristas: { nome: string; telefone: string } | { nome: string; telefone: string }[] | null;
  midias: MidiaDetalhe[];
  linha_do_tempo: TimelineEvent[];
}

// ─── Token público ────────────────────────────────────────────────────────────

export interface TokenPublicoResponse {
  tokenId: string;
  token: string;
  expiraEm: string;
  urlPublica: string;
}

// ─── Motoristas ───────────────────────────────────────────────────────────────

export interface Motorista {
  id: string;
  nome: string;
  telefone: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export type MotoristasResponse = Motorista[];

// ─── Criar entrega manual ─────────────────────────────────────────────────────

export interface CriarEntregaBody {
  destinatario_nome: string;
  destinatario_documento: string;
  valor_total: number;
  numero: string;
  serie: string;
  emitida_em: string;
  motorista_id?: string;
  data_saida_prevista?: string;
}

export interface CriarEntregaResponse {
  nota_id: string;
  entrega_id: string;
}

// ─── Atualizar entrega ────────────────────────────────────────────────────────

export interface AtualizarEntregaBody {
  motoristaId?: string;
  dataSaidaPrevista?: string;
  status?: "NAO_APLICAVEL" | "OCORRENCIA_NAO_ENTREGA";
}

// ─── URL de mídia ─────────────────────────────────────────────────────────────

export interface MidiaUrlResponse {
  url: string;
  expiresInSeconds: number;
}

// ─── Relatórios ───────────────────────────────────────────────────────────────

export interface TaxaComprovacaoItem {
  motorista_id: string;
  motorista_nome: string;
  total_entregas: number;
  comprovadas: number;
  pendentes: number;
  em_ocorrencia: number;
  taxa_comprovacao_pct: number | null;
}

export interface TaxaComprovacaoResponse {
  items: TaxaComprovacaoItem[];
}

// ─── Painel admin ─────────────────────────────────────────────────────────────

export interface PainelAdminResponse {
  painel: {
    total_entregas: number;
    comprovadas: number;
    pendentes: number;
    em_ocorrencia: number;
    taxa_comprovacao_pct: number | null;
    motoristas_ativos: number;
    motoristas_sem_comprovante: number;
    valor_total_notas: number;
    valor_total_comprovado: number;
    valor_total_pendente: number;
    cobrancas_enviadas_hoje: number;
    tokens_ativos: number;
  };
}

// ─── Configurações do tenant ─────────────────────────────────────────────────

export interface ConfiguracoesTenant {
  prazoCobrancaDias: number;
  limiarConfiancaOcr: number | null;
  horarioResumoDiario: string | null;
  destinatariosAlerta: string[];
}

// ─── Chaves de API ───────────────────────────────────────────────────────────

export interface ChaveApiListada {
  id: string;
  nome: string;
  escopos: string[];
  criadoEm: string;
  ultimaUtilizacaoEm: string | null;
  revogadaEm: string | null;
}

export interface ChaveApiCriada {
  id: string;
  nome: string;
  escopos: string[];
  chave: string;
}

// ─── Importação de notas ─────────────────────────────────────────────────────

export interface ImportacaoNotaResponse {
  notaId: string;
  entregaId: string;
  duplicada: boolean;
  chave_acesso?: string;
}

// ─── Webhook eventos (admin) ─────────────────────────────────────────────────

export interface WebhookEvento {
  id: string;
  tenant_id: string;
  config_id: string;
  tipo: string;
  payload: unknown;
  tentativas: number;
  proximo_em: string | null;
  entregue_em: string | null;
  falhou_em: string | null;
  criado_em: string;
}

export interface ImportacaoLoteResponse {
  total: number;
  aceitos: number;
  duplicados: number;
  invalidos: number;
  itens: { chaveAcesso?: string; resultado: "aceito" | "duplicado" | "invalido"; motivo: string | null }[];
}
