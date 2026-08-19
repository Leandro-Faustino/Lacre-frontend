import type { DisplayStatus, EntregaStatus } from "@/types/api";

// ─── Status ──────────────────────────────────────────────────────────────────

const PRAZO_PADRAO_DIAS = 14;

export function mapApiStatus(
  status: EntregaStatus,
  diasAberto: number = 0,
  prazoDias: number = PRAZO_PADRAO_DIAS,
): DisplayStatus {
  switch (status) {
    case "COMPROVADA":
      return "Lacrada";
    case "AGUARDANDO_COMPROVANTE":
      return diasAberto > prazoDias ? "Atenção" : "Pendente";
    case "EM_REVISAO":
      return "Revisão";
    case "OCORRENCIA_NAO_ENTREGA":
      return "Ocorrência";
    case "NAO_APLICAVEL":
      return "N/A";
  }
}

/** Classe CSS para a badge de status (compatível com o globals.css existente). */
export function statusCssClass(display: DisplayStatus): string {
  const map: Record<DisplayStatus, string> = {
    Lacrada: "lacrada",
    Pendente: "pendente",
    "Atenção": "atencao",
    "Revisão": "revisao",
    "Ocorrência": "ocorrencia",
    "N/A": "na",
  };
  return map[display];
}

// ─── Moeda ───────────────────────────────────────────────────────────────────

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatMoney(value: number): string {
  return brl.format(value);
}

// ─── Datas ───────────────────────────────────────────────────────────────────

const dateShort = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

const timeShort = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

/** Retorna "Hoje, 10:42" / "Ontem, 17:26" / "14 ago" */
export function formatDeliveryDate(iso: string): { day: string; time: string } {
  const date = new Date(iso);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const day = isToday ? "Hoje" : isYesterday ? "Ontem" : dateShort.format(date);
  const time = timeShort.format(date);

  return { day, time };
}
