"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, apiRawFetch } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { formatDeliveryDate, formatMoney, mapApiStatus, statusCssClass } from "@/lib/formatters";
import { createClient } from "@/lib/supabase/client";
import type { ChaveApiCriada, ChaveApiListada, ComprovanteDetalhe, ComprovanteSummary, ComprovantesResponse, ConfiguracoesTenant, CriarEntregaBody, CriarEntregaResponse, DisplayStatus, ImportacaoLoteResponse, MeResponse, MidiaUrlResponse, Motorista, MotoristasResponse, PainelAdminResponse, PendenciasResponse, TaxaComprovacaoItem, TaxaComprovacaoResponse, TokenPublicoResponse, WebhookEvento } from "@/types/api";

type IconName = "home" | "clock" | "check" | "alert" | "money" | "plus" | "download" | "link" | "rows" | "document" | "search" | "chevron" | "arrow" | "close" | "cloud" | "file" | "send" | "refresh" | "chart" | "users" | "upload" | "gear" | "key" | "toggle" | "phone" | "image" | "edit" | "trash" | "eye";
type View = "metricas" | "rastreamento" | "motoristas" | "importacao" | "configuracoes";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></>, clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>, check: <path d="m5 12 4 4L19 6"/>, alert: <><path d="M12 3 2.7 20h18.6L12 3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>, money: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h.01M17 15h.01"/><circle cx="12" cy="12" r="2.5"/></>, plus: <path d="M12 5v14M5 12h14"/>, download: <><path d="M12 3v12m0 0 5-5m-5 5-5-5"/><path d="M4 19h16"/></>, link: <><path d="m9 15 6-6"/><path d="M7.5 17H6a4 4 0 0 1 0-8h3M16.5 7H18a4 4 0 0 1 0 8h-3"/></>, rows: <path d="M4 6h16M4 12h16M4 18h16"/>, document: <><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/></>, search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>, chevron: <path d="m9 7 5 5-5 5"/>, arrow: <path d="M5 12h14m-5-5 5 5-5 5"/>, close: <path d="m6 6 12 12M18 6 6 18"/>, cloud: <><path d="M6 18h12a4 4 0 0 0 .5-8A7 7 0 0 0 5 8.5 4.8 4.8 0 0 0 6 18Z"/><path d="m9 13 2 2 4-4"/></>, file: <><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/></>, send: <><path d="m3 3 18 9-18 9 4-9-4-9Z"/><path d="M7 12h14"/></>, refresh: <><path d="M20 11a8 8 0 1 0 2 5"/><path d="M20 4v7h-7"/></>, chart: <><path d="M4 20V10"/><path d="M9 20V4"/><path d="M14 20v-7"/><path d="M19 20v-4"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></>,
    gear: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>,
    key: <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></>,
    toggle: <><rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="3"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

type Proof = { id: string; note: string; customer: string; document: string; driver: string; amount: number; status: DisplayStatus; createdAt: string; protocol: string; mediaStatus: string | null; hash: string | null };
const filters: ("Todas" | DisplayStatus)[] = ["Todas", "Pendente", "Atenção", "Lacrada"];
const moneyInputToNumber = (value: string) => Number(value.replace(/[^\d,]/g, "").replace(",", "."));

function LacreMark() { return <span className="lacre-mark" aria-hidden="true"><span className="lacre-stub"/><span className="lacre-perf"><i/><i/><i/><i/><i/></span><span className="lacre-note"/></span>; }
function firstRelation<T>(value: T | T[] | null | undefined): T | null { return Array.isArray(value) ? value[0] ?? null : value ?? null; }

export function LacreDashboard() {
  const router = useRouter();
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [drivers, setDrivers] = useState<MotoristasResponse>([]);
  const [panel, setPanel] = useState<PainelAdminResponse["painel"] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ComprovanteDetalhe | null>(null);
  const [filter, setFilter] = useState<"Todas" | DisplayStatus>("Todas");
  const [query, setQuery] = useState("");
  const [compact] = useState(false);
  const [view, setView] = useState<View>("metricas");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Motoristas view
  const [allDrivers, setAllDrivers] = useState<Motorista[]>([]);
  const [driverModalOpen, setDriverModalOpen] = useState(false);

  // Importação view
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportacaoLoteResponse | null>(null);
  const xmlInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  // Configurações view
  const [config, setConfig] = useState<ConfiguracoesTenant | null>(null);
  const [apiKeys, setApiKeys] = useState<ChaveApiListada[]>([]);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [webhookEventos, setWebhookEventos] = useState<WebhookEvento[]>([]);
  const [webhookFilter, setWebhookFilter] = useState<"PENDENTE" | "ENTREGUE" | "FALHA">("PENDENTE");

  // Taxa comprovação (métricas)
  const [taxaReport, setTaxaReport] = useState<TaxaComprovacaoItem[]>([]);

  // Exportação
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Perfil do usuário
  const [userProfile, setUserProfile] = useState<MeResponse | null>(null);

  // Preview panel extras
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [editingEntrega, setEditingEntrega] = useState(false);

  const notify = useCallback((message: string) => { setToast(message); window.setTimeout(() => setToast(null), 3600); }, []);
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [comprovantes, pendencias, motoristas, adminPanel] = await Promise.all([
        apiFetch<ComprovantesResponse>("/comprovantes", { params: { limite: 100 } }),
        apiFetch<PendenciasResponse>("/pendencias", { params: { limite: 200 } }),
        apiFetch<MotoristasResponse>("/motoristas"),
        apiFetch<PainelAdminResponse>("/admin/painel").catch((error: unknown) => { if (error instanceof ApiError && error.isForbidden) return null; throw error; }),
      ]);
      const pendingDays = new Map(pendencias.items.map((item) => [item.entrega_id, item.dias_aberto]));
      const nextProofs = comprovantes.items.map((item: ComprovanteSummary): Proof => ({ id: item.entrega_id, note: `NF ${item.nota_numero}`, customer: item.destinatario_nome, document: item.destinatario_documento, driver: item.motorista_nome ?? "Motorista não atribuído", amount: item.nota_valor_total, status: mapApiStatus(item.status, pendingDays.get(item.entrega_id)), createdAt: item.criado_em, protocol: item.nota_chave_acesso ?? item.entrega_id, mediaStatus: item.midia_status, hash: item.midia_sha256 }));
      setProofs(nextProofs); setDrivers(motoristas.filter((m) => m.ativo)); setAllDrivers(motoristas); setPanel(adminPanel?.painel ?? null);
      setSelectedId((current) => current && nextProofs.some((p) => p.id === current) ? current : nextProofs[0]?.id ?? null);
    } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível carregar os dados da API."); } finally { setLoading(false); }
  }, [notify]);

  useEffect(() => { const t = window.setTimeout(() => { void loadDashboard(); }); return () => window.clearTimeout(t); }, [loadDashboard]);
  useEffect(() => { void apiFetch<MeResponse>("/me").then(setUserProfile).catch(() => {}); }, []);

  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    setMediaUrl(null); setEditingEntrega(false);
    void apiFetch<ComprovanteDetalhe>(`/comprovantes/${selectedId}`).then((r) => {
      if (!active) return;
      setDetail(r);
      // Load media URL if available
      const midiaArmazenada = r.midias?.find((m) => m.status === "ARMAZENADA");
      if (midiaArmazenada) {
        void apiFetch<MidiaUrlResponse>(`/midias/${midiaArmazenada.id}/url`).then((u) => { if (active) setMediaUrl(u.url); }).catch(() => {});
      }
    }).catch((e: unknown) => { if (active) notify(e instanceof Error ? e.message : "Não foi possível abrir o comprovante."); });
    return () => { active = false; };
  }, [notify, selectedId]);

  // Load view-specific data
  useEffect(() => {
    if (view === "metricas") {
      void apiFetch<TaxaComprovacaoResponse>("/relatorios/taxa-comprovacao").then((r) => setTaxaReport(r.items)).catch(() => {});
    } else if (view === "configuracoes") {
      void Promise.all([
        apiFetch<ConfiguracoesTenant>("/configuracoes").then(setConfig).catch(() => {}),
        apiFetch<ChaveApiListada[]>("/chaves-api").then(setApiKeys).catch(() => setApiKeys([])),
        apiFetch<WebhookEvento[]>("/admin/webhook-eventos", { params: { status: "PENDENTE", limite: 50 } }).then(setWebhookEventos).catch(() => setWebhookEventos([])),
      ]);
    }
  }, [view]);

  const selected = proofs.find((p) => p.id === selectedId) ?? null;
  const visibleProofs = useMemo(() => { const n = query.trim().toLowerCase(); return proofs.filter((p) => (filter === "Todas" || p.status === filter) && (!n || [p.note, p.customer, p.driver, p.document].some((v) => v.toLowerCase().includes(n)))); }, [filter, proofs, query]);
  const pending = panel?.pendentes ?? proofs.filter((p) => p.status === "Pendente" || p.status === "Atenção").length;
  const proven = panel?.comprovadas ?? proofs.filter((p) => p.status === "Lacrada").length;
  const exposure = panel?.valor_total_pendente ?? proofs.filter((p) => p.status === "Pendente" || p.status === "Atenção").reduce((t, p) => t + p.amount, 0);
  const detailNote = firstRelation(detail?.notas_fiscais); const detailDriver = firstRelation(detail?.motoristas);

  async function handleSignOut() { await createClient().auth.signOut(); router.push("/sign-in"); router.refresh(); }
  function selectProof(id: string) { setDetail(null); setSelectedId(id); }
  async function copyPublicLink() { if (!selected) return; try { const token = await apiFetch<TokenPublicoResponse>(`/comprovantes/${selected.id}/token`, { method: "POST", body: { expiraDias: 30 } }); await navigator.clipboard.writeText(new URL(token.urlPublica, window.location.origin).toString()); notify("Link público criado e copiado. Expira em 30 dias."); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível criar o link público."); } }
  function downloadPdf() { if (selected) window.open(`/api/lacre/comprovantes/${selected.id}/pdf`, "_blank", "noopener,noreferrer"); }

  async function updateEntrega(event: FormEvent<HTMLFormElement>) {
    if (!selected) return; event.preventDefault();
    const form = new FormData(event.currentTarget);
    const motoristaId = String(form.get("motorista_id") ?? "") || undefined;
    const status = String(form.get("status") ?? "") || undefined;
    const body: Record<string, unknown> = {};
    if (motoristaId) body.motoristaId = motoristaId;
    if (status) body.status = status;
    if (Object.keys(body).length === 0) { notify("Nenhuma alteração informada."); return; }
    setSaving(true);
    try { await apiFetch(`/entregas/${selected.id}`, { method: "PATCH", body }); setEditingEntrega(false); await loadDashboard(); notify("Entrega atualizada."); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível atualizar."); } finally { setSaving(false); }
  }

  async function reprocessMedia() {
    if (!detail) return;
    const midia = detail.midias?.[0];
    if (!midia) { notify("Nenhuma mídia para reprocessar."); return; }
    try { await apiFetch(`/midias/${midia.id}/processar`, { method: "POST" }); notify("Reprocessamento enfileirado."); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível reprocessar."); }
  }

  async function reviewMedia(entregaId: string) {
    if (!detail) return;
    const midia = detail.midias?.[0];
    if (!midia) return;
    try { await apiFetch(`/revisoes/${midia.id}`, { method: "PATCH", body: { entregaId } }); notify("Revisão registrada."); await loadDashboard(); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível registrar revisão."); }
  }

  async function cancelFiscalEvent() {
    if (!selected) return;
    const justificativa = window.prompt("Informe a justificativa (mín. 15 caracteres):");
    if (!justificativa || justificativa.length < 15) { notify("Justificativa deve ter ao menos 15 caracteres."); return; }
    try { await apiFetch(`/eventos-fiscais/${selected.id}/cancelar`, { method: "POST", body: { justificativa } }); notify("Evento fiscal cancelado."); await loadDashboard(); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível cancelar."); }
  }

  async function revokePublicToken() {
    if (!detail) return;
    const tokenId = window.prompt("Informe o ID do token a revogar:");
    if (!tokenId) return;
    try { await apiFetch(`/tokens/${tokenId}`, { method: "DELETE" }); notify("Link público revogado."); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível revogar o link."); }
  }

  async function importFromUrl(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const url = String(form.get("url") ?? "").trim();
    if (!url) return;
    setImporting(true);
    try { await apiFetch("/notas/enfileirar-url", { method: "POST", body: { url } }); notify("XML enfileirado para importação."); (event.target as HTMLFormElement).reset(); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível enfileirar."); } finally { setImporting(false); }
  }

  async function createProof(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const amount = moneyInputToNumber(String(form.get("amount") ?? ""));
    if (!Number.isFinite(amount) || amount < 0) { notify("Informe um valor válido para a nota."); return; }
    if (amount > 9_999_999_999_999.99) { notify("O valor da nota excede o limite permitido."); return; }
    const numero = String(form.get("numero") ?? "").trim();
    const serie = String(form.get("serie") ?? "").trim();
    const destinatarioNome = String(form.get("destinatario_nome") ?? "").trim();
    const destinatarioDocumento = String(form.get("destinatario_documento") ?? "").replace(/\D/g, "");
    if (!/^\d{1,9}$/.test(numero)) { notify("O número da nota deve ter entre 1 e 9 dígitos."); return; }
    if (!/^\d{1,3}$/.test(serie)) { notify("A série deve ter entre 1 e 3 dígitos."); return; }
    if (!/^\d{11}$|^\d{14}$/.test(destinatarioDocumento)) { notify("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos)."); return; }
    if (!destinatarioNome || destinatarioNome.length > 200) { notify("Informe um destinatário com até 200 caracteres."); return; }
    const motoristaId = String(form.get("motorista_id") ?? "");
    const body: CriarEntregaBody = { numero, serie, destinatario_nome: destinatarioNome, destinatario_documento: destinatarioDocumento, valor_total: amount, emitida_em: String(form.get("emitida_em") ?? ""), ...(motoristaId ? { motorista_id: motoristaId } : {}) };
    setSaving(true); try { const created = await apiFetch<CriarEntregaResponse>("/entregas", { method: "POST", body }); setModalOpen(false); await loadDashboard(); setSelectedId(created.entrega_id); notify("Entrega registrada. Aguardando comprovante do motorista."); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível criar a entrega."); } finally { setSaving(false); }
  }

  async function toggleDriver(id: string, ativo: boolean) {
    try { await apiFetch<Motorista>(`/motoristas/${id}/ativo`, { method: "PATCH", body: { ativo } }); setAllDrivers((prev) => prev.map((d) => d.id === id ? { ...d, ativo } : d)); notify(ativo ? "Motorista ativado." : "Motorista desativado."); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível alterar o status."); }
  }

  async function createDriver(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const nome = String(form.get("nome") ?? "").trim();
    const telefone = String(form.get("telefone") ?? "").trim();
    if (!nome) { notify("Informe o nome do motorista."); return; }
    if (!telefone) { notify("Informe o telefone do motorista."); return; }
    setSaving(true);
    try { const created = await apiFetch<Motorista>("/motoristas", { method: "POST", body: { nome, telefone } }); setAllDrivers((prev) => [...prev, created]); setDrivers((prev) => [...prev, created]); setDriverModalOpen(false); notify("Motorista cadastrado."); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível cadastrar o motorista."); } finally { setSaving(false); }
  }

  async function handleImportXml(file: File) {
    setImporting(true); setImportResult(null);
    try {
      const res = await apiRawFetch("/notas", { method: "POST", body: file, headers: { "Content-Type": "application/xml" } });
      if (!res.ok) { const err = await res.json().catch(() => null); throw new Error((err as { message?: string })?.message ?? `Erro ${res.status}`); }
      const data = await res.json();
      notify(data.duplicada ? "Nota já importada anteriormente." : "Nota fiscal importada com sucesso.");
      await loadDashboard();
    } catch (error) { notify(error instanceof Error ? error.message : "Falha ao importar XML."); } finally { setImporting(false); }
  }

  async function handleImportZip(file: File) {
    setImporting(true); setImportResult(null);
    try {
      const res = await apiRawFetch("/notas/zip", { method: "POST", body: file, headers: { "Content-Type": "application/zip" } });
      if (!res.ok) { const err = await res.json().catch(() => null); throw new Error((err as { message?: string })?.message ?? `Erro ${res.status}`); }
      const data: ImportacaoLoteResponse = await res.json();
      setImportResult(data);
      notify(`Importação concluída: ${data.aceitos} aceitas, ${data.duplicados} duplicadas, ${data.invalidos} inválidas.`);
      await loadDashboard();
    } catch (error) { notify(error instanceof Error ? error.message : "Falha ao importar ZIP."); } finally { setImporting(false); }
  }

  async function saveConfig(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const body = {
      prazoCobrancaDias: Number(form.get("prazoCobrancaDias")),
      limiarConfiancaOcr: form.get("limiarConfiancaOcr") ? Number(form.get("limiarConfiancaOcr")) : null,
      horarioResumoDiario: String(form.get("horarioResumoDiario") ?? "") || null,
      destinatariosAlerta: String(form.get("destinatariosAlerta") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    };
    setSaving(true);
    try { const updated = await apiFetch<ConfiguracoesTenant>("/configuracoes", { method: "PUT", body }); setConfig(updated); notify("Configurações salvas."); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível salvar."); } finally { setSaving(false); }
  }

  async function createApiKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const nome = String(form.get("nome") ?? "").trim();
    if (!nome) return;
    setSaving(true);
    try { const created = await apiFetch<ChaveApiCriada>("/chaves-api", { method: "POST", body: { nome } }); setCreatedKey(created.chave); setApiKeys((prev) => [...prev, { id: created.id, nome: created.nome, escopos: created.escopos, criadoEm: new Date().toISOString(), ultimaUtilizacaoEm: null, revogadaEm: null }]); (event.target as HTMLFormElement).reset(); notify("Chave de API criada. Copie-a agora — ela não será exibida novamente."); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível criar a chave."); } finally { setSaving(false); }
  }

  async function revokeApiKey(id: string) {
    try { await apiFetch(`/chaves-api/${id}/revogar`, { method: "POST" }); setApiKeys((prev) => prev.map((k) => k.id === id ? { ...k, revogadaEm: new Date().toISOString() } : k)); notify("Chave revogada."); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível revogar."); }
  }

  async function loadWebhookEvents(status: "PENDENTE" | "ENTREGUE" | "FALHA") {
    setWebhookFilter(status);
    try { const events = await apiFetch<WebhookEvento[]>("/admin/webhook-eventos", { params: { status, limite: 50 } }); setWebhookEventos(events); } catch { setWebhookEventos([]); }
  }

  async function retryWebhook(id: string) {
    try { await apiFetch(`/admin/webhook-eventos/${id}/retentar`, { method: "POST" }); setWebhookEventos((prev) => prev.filter((e) => e.id !== id)); notify("Webhook reenfileirado para reenvio."); } catch (error) { notify(error instanceof Error ? error.message : "Não foi possível retentar."); }
  }

  function handleExport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const inicio = String(form.get("data_inicio") ?? "");
    const fim = String(form.get("data_fim") ?? "");
    if (!inicio || !fim) { notify("Informe as datas."); return; }
    window.open(`/api/lacre/exportacao?data_inicio=${inicio}&data_fim=${fim}`, "_blank", "noopener,noreferrer");
    setExportModalOpen(false); notify("Download da exportação iniciado.");
  }

  const fullWidthViews: View[] = ["metricas", "motoristas", "importacao", "configuracoes"];

  return <div className="app-shell">
    <header className="word-bar"><div className="brand-lockup"><LacreMark/><span className="brand-name">Lacre</span></div><div className="document-name"><strong>Central de operações</strong><span><Icon name="cloud" size={15}/> Conectado</span></div><label className="global-search"><Icon name="search" size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar NF, destinatário ou motorista…"/><kbd>⌘ K</kbd></label><div className="top-actions">{userProfile && <span className="user-badge"><span className="user-role">{userProfile.perfil}</span></span>}<button aria-label="Atualizar dados" onClick={() => void loadDashboard()}><Icon name="refresh"/></button><button aria-label="Sair" onClick={handleSignOut} className="sign-out-btn"><Icon name="arrow" size={16}/></button></div></header>

    <section className="ribbon" aria-label="Faixa de comandos">
      <div className="ribbon-group primary-command"><button onClick={() => setModalOpen(true)}><span><Icon name="plus" size={24}/></span>Nova entrega</button><small>REGISTRAR</small></div>
      <div className="ribbon-group view-group"><div className="ribbon-buttons">
        <button className={view === "metricas" ? "selected" : ""} onClick={() => setView("metricas")}><Icon name="chart"/><span>Métricas</span></button>
        <button className={view === "rastreamento" ? "selected" : ""} onClick={() => setView("rastreamento")}><Icon name="search"/><span>Rastreamento</span></button>
        <button className={view === "motoristas" ? "selected" : ""} onClick={() => setView("motoristas")}><Icon name="users"/><span>Motoristas</span></button>
        <button className={view === "importacao" ? "selected" : ""} onClick={() => setView("importacao")}><Icon name="upload"/><span>Importação</span></button>
        <button className={view === "configuracoes" ? "selected" : ""} onClick={() => setView("configuracoes")}><Icon name="gear"/><span>Configurações</span></button>
      </div><small>EXIBIR</small></div>
      <div className="ribbon-group"><div className="ribbon-buttons">
        <button onClick={() => setExportModalOpen(true)}><Icon name="download"/><span>Exportar</span></button>
      </div><small>AÇÕES</small></div>
      <span className="ribbon-date">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date())}</span>
    </section>

    <div className={`workspace ${fullWidthViews.includes(view) ? "workspace-full" : ""}`}>
      <main className="main-content">

        {/* ── MÉTRICAS ──────────────────────────────────────────────── */}
        {view === "metricas" && <div id="metrics-section">
          <section className="welcome-row"><div><span className="eyebrow">GESTÃO DE ENTREGAS</span><h1>Controle de comprovantes</h1><p>Rastreamento em tempo real de provas de entrega da sua operação logística.</p></div></section>
          <section className="summary-grid" aria-label="Indicadores operacionais">
            <article className="metric-card exposure"><div className="metric-top"><span className="metric-icon"><Icon name="money"/></span><span className="metric-label">Exposição financeira</span></div><strong>{formatMoney(exposure)}</strong><p>valor em mercadorias sem comprovação</p><div className="metric-foot"><span>{pending}</span><span>entregas sem retorno de canhoto</span></div></article>
            <article className="metric-card"><div className="metric-top"><span className="metric-icon amber"><Icon name="clock"/></span><span className="metric-label">Aguardando retorno</span></div><strong>{pending}</strong><p>canhotos pendentes de devolução</p><div className="metric-foot"><span>Coleta via WhatsApp do motorista</span></div></article>
            <article className="metric-card"><div className="metric-top"><span className="metric-icon green"><Icon name="check"/></span><span className="metric-label">Comprovadas</span></div><strong>{proven}</strong><p>entregas com prova digital íntegra</p><div className="metric-foot"><span>{panel?.taxa_comprovacao_pct ?? 0}%</span><span>taxa de comprovação</span></div></article>
          </section>
          <button className="priority-line" onClick={() => { setFilter("Atenção"); setView("rastreamento"); }}><span className="priority-icon"><Icon name="alert"/></span><span><strong>Ação necessária:</strong> entregas com prazo de comprovação vencido precisam de acompanhamento.</span><b>Ver pendências <Icon name="arrow" size={16}/></b></button>
          {taxaReport.length > 0 && <section className="proof-panel"><div className="panel-heading"><div><span className="eyebrow">RELATÓRIO</span><h2>Taxa de comprovação por motorista</h2></div></div><div className="proof-table"><div className="table-row table-head" style={{ gridTemplateColumns: "1.5fr 80px 80px 80px 100px" }}><span>Motorista</span><span>Entregas</span><span>Comprovadas</span><span>Pendentes</span><span>Taxa</span></div>{taxaReport.map((item) => <div className="table-row" key={item.motorista_id} style={{ gridTemplateColumns: "1.5fr 80px 80px 80px 100px" }}><span><strong>{item.motorista_nome}</strong></span><span><strong>{item.total_entregas}</strong></span><span><strong>{item.comprovadas}</strong></span><span><strong>{item.pendentes}</strong></span><span><i className={`status ${(item.taxa_comprovacao_pct ?? 0) >= 80 ? "lacrada" : (item.taxa_comprovacao_pct ?? 0) >= 50 ? "pendente" : "atencao"}`}>{item.taxa_comprovacao_pct ?? 0}%</i></span></div>)}</div></section>}
        </div>}

        {/* ── RASTREAMENTO ──────────────────────────────────────────── */}
        {view === "rastreamento" && <section className="proof-panel" id="proof-list">
          <div className="panel-heading"><div><span className="eyebrow">RASTREAMENTO</span><h2>Entregas recentes</h2></div><div className="filter-pills" role="group" aria-label="Filtrar entregas">{filters.map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
          <div className={`proof-table ${compact ? "compact" : ""}`}><div className="table-row table-head"><span>NF / Destinatário</span><span>Motorista</span><span>Data</span><span>Valor NF</span><span>Status</span><span/></div>{loading ? <div className="empty-state"><Icon name="refresh" size={26}/><strong>Carregando entregas…</strong></div> : visibleProofs.length ? visibleProofs.map((proof) => { const date = formatDeliveryDate(proof.createdAt); return <button className={`table-row ${selected?.id === proof.id ? "selected" : ""}`} key={proof.id} onClick={() => selectProof(proof.id)}><span className="customer-cell"><i className="note-icon"><Icon name="file" size={17}/></i><span><strong>{proof.note}</strong><small>{proof.customer}</small></span></span><span><strong>{proof.driver}</strong><small>Série {proof.protocol.slice(0, 12)}</small></span><span><strong>{date.day}</strong><small>{date.time}</small></span><span className="amount">{formatMoney(proof.amount)}</span><span><i className={`status ${statusCssClass(proof.status)}`}>{proof.status === "Lacrada" && <Icon name="check" size={13}/>} {proof.status}</i></span><span className="row-action"><Icon name="chevron" size={17}/></span></button>; }) : <div className="empty-state"><Icon name="search" size={26}/><strong>Nenhuma entrega encontrada</strong><span>Tente outro termo ou ajuste os filtros.</span></div>}</div>
          <div className="panel-footer"><span>Mostrando {visibleProofs.length} de {proofs.length} entregas</span><button onClick={() => { setFilter("Todas"); setQuery(""); }}>Limpar filtros <Icon name="arrow" size={14}/></button></div>
        </section>}

        {/* ── MOTORISTAS ────────────────────────────────────────────── */}
        {view === "motoristas" && <div>
          <section className="welcome-row"><div><span className="eyebrow">FROTA</span><h1>Motoristas</h1><p>Gerencie os motoristas vinculados à sua operação.</p></div><button className="primary-button" onClick={() => setDriverModalOpen(true)}><Icon name="plus"/> Novo motorista</button></section>
          <section className="proof-panel"><div className="panel-heading"><div><span className="eyebrow">CADASTRO</span><h2>Motoristas da operação</h2></div></div>
            <div className="proof-table"><div className="table-row table-head" style={{ gridTemplateColumns: "1.5fr 1fr 100px 80px" }}><span>Nome</span><span>Telefone</span><span>Status</span><span>Ação</span></div>
            {allDrivers.length ? allDrivers.map((d) => <div className="table-row" key={d.id} style={{ gridTemplateColumns: "1.5fr 1fr 100px 80px" }}><span><strong>{d.nome}</strong></span><span><strong>{d.telefone}</strong></span><span><i className={`status ${d.ativo ? "lacrada" : "atencao"}`}>{d.ativo ? "Ativo" : "Inativo"}</i></span><span><button className="secondary-button" style={{ minHeight: 28, fontSize: 10, padding: "0 10px" }} onClick={() => void toggleDriver(d.id, !d.ativo)}>{d.ativo ? "Desativar" : "Ativar"}</button></span></div>) : <div className="empty-state"><Icon name="users" size={26}/><strong>Nenhum motorista cadastrado</strong></div>}
            </div>
            <div className="panel-footer"><span>{allDrivers.length} motoristas cadastrados · {allDrivers.filter((d) => d.ativo).length} ativos</span></div>
          </section>
        </div>}

        {/* ── IMPORTAÇÃO ────────────────────────────────────────────── */}
        {view === "importacao" && <div>
          <section className="welcome-row"><div><span className="eyebrow">IMPORTAÇÃO</span><h1>Notas fiscais</h1><p>Importe XML de NF-e individuais ou lotes em ZIP para criar entregas automaticamente.</p></div></section>
          <section className="summary-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <article className="metric-card"><div className="metric-top"><span className="metric-icon"><Icon name="file"/></span><span className="metric-label">XML individual</span></div><p style={{ margin: "14px 0 16px" }}>Importe um arquivo XML de NF-e. A entrega será criada automaticamente com os dados da nota.</p><input ref={xmlInputRef} type="file" accept=".xml,application/xml" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleImportXml(f); e.target.value = ""; }}/><button className="primary-button" disabled={importing} onClick={() => xmlInputRef.current?.click()}><Icon name="upload"/> {importing ? "Importando…" : "Selecionar XML"}</button></article>
            <article className="metric-card"><div className="metric-top"><span className="metric-icon amber"><Icon name="download"/></span><span className="metric-label">Lote ZIP</span></div><p style={{ margin: "14px 0 16px" }}>Importe um arquivo ZIP contendo múltiplos XMLs de NF-e. Até 5.000 notas por lote (máx. 50 MB).</p><input ref={zipInputRef} type="file" accept=".zip,application/zip" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleImportZip(f); e.target.value = ""; }}/><button className="primary-button" disabled={importing} onClick={() => zipInputRef.current?.click()}><Icon name="upload"/> {importing ? "Processando…" : "Selecionar ZIP"}</button></article>
          </section>
          <section className="proof-panel" style={{ marginTop: 18 }}><div className="panel-heading"><div><span className="eyebrow">IMPORTAR VIA URL</span><h2>XML remoto</h2></div></div>
            <form onSubmit={(e) => void importFromUrl(e)} style={{ padding: 16, display: "flex", gap: 8, alignItems: "end" }}>
              <label className="config-label" style={{ flex: 1, marginBottom: 0 }}>URL do XML de NF-e (HTTPS)<input name="url" type="url" placeholder="https://exemplo.com/nfe/35...xml" required/></label>
              <button className="primary-button" type="submit" disabled={importing} style={{ minHeight: 38 }}><Icon name="upload"/> Importar</button>
            </form>
          </section>
          {importResult && <section className="proof-panel" style={{ marginTop: 18 }}><div className="panel-heading"><div><span className="eyebrow">RESULTADO DA IMPORTAÇÃO</span><h2>{importResult.aceitos} aceitas · {importResult.duplicados} duplicadas · {importResult.invalidos} inválidas</h2></div></div>
            <div className="summary-grid" style={{ padding: 16, gridTemplateColumns: "repeat(3, 1fr)" }}>
              <article className="metric-card" style={{ minHeight: "auto" }}><div className="metric-top"><span className="metric-icon green"><Icon name="check"/></span><span className="metric-label">Aceitas</span></div><strong>{importResult.aceitos}</strong></article>
              <article className="metric-card" style={{ minHeight: "auto" }}><div className="metric-top"><span className="metric-icon amber"><Icon name="clock"/></span><span className="metric-label">Duplicadas</span></div><strong>{importResult.duplicados}</strong></article>
              <article className="metric-card" style={{ minHeight: "auto" }}><div className="metric-top"><span className="metric-icon" style={{ background: "var(--red-bg)", color: "var(--red)" }}><Icon name="alert"/></span><span className="metric-label">Inválidas</span></div><strong>{importResult.invalidos}</strong></article>
            </div>
            {importResult.itens.length > 0 && <div className="proof-table"><div className="table-row table-head" style={{ gridTemplateColumns: "1fr 100px 1.5fr" }}><span>Chave de acesso</span><span>Resultado</span><span>Motivo</span></div>{importResult.itens.slice(0, 50).map((item, i) => <div className="table-row" key={i} style={{ gridTemplateColumns: "1fr 100px 1.5fr" }}><span><strong style={{ fontFamily: "monospace", fontSize: 9 }}>{item.chaveAcesso ?? "—"}</strong></span><span><i className={`status ${item.resultado === "aceito" ? "lacrada" : item.resultado === "duplicado" ? "pendente" : "atencao"}`}>{item.resultado}</i></span><span><small>{item.motivo ?? "—"}</small></span></div>)}</div>}
          </section>}
        </div>}

        {/* ── CONFIGURAÇÕES ─────────────────────────────────────────── */}
        {view === "configuracoes" && <div>
          <section className="welcome-row"><div><span className="eyebrow">ADMINISTRAÇÃO</span><h1>Configurações</h1><p>Ajuste os parâmetros operacionais e gerencie as chaves de integração da sua conta.</p></div></section>
          <div className="summary-grid" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
            {/* Config form */}
            <section className="proof-panel"><div className="panel-heading"><div><span className="eyebrow">OPERACIONAL</span><h2>Parâmetros</h2></div></div>
              {config ? <form onSubmit={(e) => void saveConfig(e)} style={{ padding: 16 }}>
                <label className="config-label">Prazo de cobrança (dias)<input name="prazoCobrancaDias" type="number" min={0} max={365} defaultValue={config.prazoCobrancaDias}/></label>
                <label className="config-label">Limiar de confiança OCR (0 a 1)<input name="limiarConfiancaOcr" type="number" step="0.01" min={0} max={1} defaultValue={config.limiarConfiancaOcr ?? ""} placeholder="Automático"/></label>
                <label className="config-label">Horário do resumo diário<input name="horarioResumoDiario" type="time" defaultValue={config.horarioResumoDiario ?? ""}/></label>
                <label className="config-label">E-mails de alerta (separados por vírgula)<input name="destinatariosAlerta" defaultValue={config.destinatariosAlerta.join(", ")} placeholder="email@empresa.com"/></label>
                <button className="primary-button" type="submit" disabled={saving} style={{ marginTop: 8 }}><Icon name="check"/> {saving ? "Salvando…" : "Salvar configurações"}</button>
              </form> : <div className="empty-state" style={{ minHeight: 120 }}><Icon name="refresh" size={26}/><strong>Carregando configurações…</strong></div>}
            </section>
            {/* API Keys */}
            <section className="proof-panel"><div className="panel-heading"><div><span className="eyebrow">INTEGRAÇÃO ERP</span><h2>Chaves de API</h2></div></div>
              <form onSubmit={(e) => void createApiKey(e)} style={{ padding: "12px 16px", display: "flex", gap: 8, borderBottom: "1px solid var(--line)" }}>
                <input name="nome" placeholder="Nome da chave" required style={{ flex: 1, height: 36, padding: "0 10px", border: "1px solid var(--line)", borderRadius: 6, fontSize: 12 }}/>
                <button className="primary-button" type="submit" disabled={saving} style={{ minHeight: 36 }}><Icon name="plus" size={14}/> Criar</button>
              </form>
              {createdKey && <div className="modal-note" style={{ margin: 12 }}><span><Icon name="key" size={16}/></span><span><strong>Chave criada — copie agora</strong><small style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{createdKey}</small></span></div>}
              <div className="proof-table">{apiKeys.length ? apiKeys.map((k) => <div className="table-row" key={k.id} style={{ gridTemplateColumns: "1.2fr 100px 80px" }}><span><strong>{k.nome}</strong><small>{k.revogadaEm ? "Revogada" : `Criada em ${new Intl.DateTimeFormat("pt-BR").format(new Date(k.criadoEm))}`}</small></span><span><i className={`status ${k.revogadaEm ? "atencao" : "lacrada"}`}>{k.revogadaEm ? "Revogada" : "Ativa"}</i></span><span>{!k.revogadaEm && <button className="secondary-button" style={{ minHeight: 26, fontSize: 9, padding: "0 8px" }} onClick={() => void revokeApiKey(k.id)}>Revogar</button>}</span></div>) : <div className="empty-state" style={{ minHeight: 100 }}><Icon name="key" size={22}/><strong>Nenhuma chave criada</strong></div>}</div>
            </section>
          </div>
          {/* Webhook events */}
          <section className="proof-panel" style={{ marginTop: 18 }}><div className="panel-heading"><div><span className="eyebrow">WEBHOOKS</span><h2>Eventos de notificação</h2></div><div className="filter-pills" role="group">{(["PENDENTE", "ENTREGUE", "FALHA"] as const).map((s) => <button key={s} className={webhookFilter === s ? "active" : ""} onClick={() => void loadWebhookEvents(s)}>{s === "PENDENTE" ? "Pendentes" : s === "ENTREGUE" ? "Entregues" : "Com falha"}</button>)}</div></div>
            <div className="proof-table">{webhookEventos.length ? webhookEventos.map((evt) => <div className="table-row" key={evt.id} style={{ gridTemplateColumns: "1fr 120px 100px 80px" }}><span><strong>{evt.tipo}</strong><small>Tentativas: {evt.tentativas} · {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(evt.criado_em))}</small></span><span><i className={`status ${evt.entregue_em ? "lacrada" : evt.falhou_em ? "atencao" : "pendente"}`}>{evt.entregue_em ? "Entregue" : evt.falhou_em ? "Falha" : "Pendente"}</i></span><span><small>{evt.proximo_em ? `Próx.: ${new Intl.DateTimeFormat("pt-BR", { timeStyle: "short" }).format(new Date(evt.proximo_em))}` : "—"}</small></span><span>{evt.falhou_em && <button className="secondary-button" style={{ minHeight: 26, fontSize: 9, padding: "0 8px" }} onClick={() => void retryWebhook(evt.id)}>Retentar</button>}</span></div>) : <div className="empty-state" style={{ minHeight: 100 }}><Icon name="send" size={22}/><strong>Nenhum evento {webhookFilter === "PENDENTE" ? "pendente" : webhookFilter === "ENTREGUE" ? "entregue" : "com falha"}</strong></div>}</div>
            <div className="panel-footer"><span>{webhookEventos.length} eventos listados</span></div>
          </section>
        </div>}

      </main>

      {/* ── PREVIEW PANEL (rastreamento only) ──────────────────────── */}
      {view === "rastreamento" && <aside className="preview-panel">{selected ? <>
        <div className="preview-heading"><span><small>COMPROVANTE SELECIONADO</small><strong>{selected.note}</strong></span><button aria-label="Editar entrega" onClick={() => setEditingEntrega((v) => !v)} title="Editar"><Icon name="edit" size={16}/></button></div>

        {/* Edit entrega form */}
        {editingEntrega && <form className="preview-edit" onSubmit={(e) => void updateEntrega(e)}>
          <label className="config-label">Motorista<select name="motorista_id" defaultValue=""><option value="">Manter atual</option>{drivers.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}</select></label>
          <label className="config-label">Alterar status<select name="status" defaultValue=""><option value="">Manter atual</option><option value="NAO_APLICAVEL">Não aplicável</option><option value="OCORRENCIA_NAO_ENTREGA">Ocorrência — não entregue</option></select></label>
          <div className="preview-actions"><button className="primary-button" type="submit" disabled={saving}><Icon name="check"/> Salvar</button><button type="button" className="secondary-button" onClick={() => setEditingEntrega(false)}>Cancelar</button></div>
        </form>}

        <div className="paper-wrap"><div className="proof-paper">
          <div className="paper-brand"><span><LacreMark/><b>Lacre</b></span><i className={`paper-seal ${selected.status === "Lacrada" ? "sealed" : "waiting"}`}><Icon name={selected.status === "Lacrada" ? "check" : "clock"} size={13}/>{selected.status}</i></div>
          <div className="paper-title"><small>COMPROVANTE DE ENTREGA</small><h3>{selected.note}</h3><span>{selected.protocol}</span></div>
          <dl className="paper-details"><div><dt>DESTINATÁRIO</dt><dd>{detailNote?.destinatario_nome ?? selected.customer}<small>{detailNote?.destinatario_documento ?? selected.document}</small></dd></div><div className="split"><span><dt>VALOR DA NOTA</dt><dd>{formatMoney(detailNote?.valor_total ?? selected.amount)}</dd></span><span><dt>EMISSÃO</dt><dd>{detailNote?.emitida_em ? new Intl.DateTimeFormat("pt-BR").format(new Date(detailNote.emitida_em)) : "—"}</dd></span></div><div><dt>MOTORISTA RESPONSÁVEL</dt><dd>{detailDriver?.nome ?? selected.driver}<small>{detailDriver?.telefone ?? ""}</small></dd></div></dl>

          {/* Foto do canhoto */}
          <div className={`proof-photo ${mediaUrl ? "has-photo" : ""}`}>
            {mediaUrl ? <a href={mediaUrl} target="_blank" rel="noopener noreferrer" style={{ display: "contents" }}><img src={mediaUrl} alt="Foto do canhoto" style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 3 }}/></a>
            : selected.mediaStatus === "ARMAZENADA" ? <><Icon name="image" size={30}/><span>Canhoto digitalizado</span><small>Clique em &quot;Ver foto&quot; abaixo.</small></>
            : <><Icon name="clock" size={30}/><span>Aguardando digitalização</span><small>O motorista enviará a foto do canhoto via WhatsApp.</small></>}
          </div>

          <div className="integrity-row"><span><Icon name="check" size={15}/></span><p><strong>{selected.hash ? "Prova íntegra" : "Aguardando verificação"}</strong><small>{selected.hash ? "Integridade garantida via hash SHA-256." : "A prova será verificada após o recebimento da mídia."}</small></p></div>
          {selected.hash && <div className="paper-hash">SHA-256 · {selected.hash.slice(0, 12)}…</div>}
        </div></div>

        {/* Primary actions */}
        <div className="preview-actions"><button className="primary-button" onClick={downloadPdf}><Icon name="download"/> Baixar PDF</button><button className="secondary-button" onClick={() => void copyPublicLink()}><Icon name="link"/> Link público</button></div>

        {/* Secondary actions */}
        <div className="preview-actions-secondary">
          {detail?.midias?.[0]?.status === "ARMAZENADA" && <button onClick={() => reprocessMedia()} title="Reprocessar OCR/visão"><Icon name="refresh" size={14}/> Reprocessar</button>}
          {selected.status === "Revisão" && <button onClick={() => void reviewMedia(selected.id)} title="Aprovar revisão"><Icon name="check" size={14}/> Aprovar revisão</button>}
          <button onClick={() => void revokePublicToken()} title="Revogar link público"><Icon name="trash" size={14}/> Revogar link</button>
          <button onClick={cancelFiscalEvent} title="Cancelar evento fiscal"><Icon name="close" size={14}/> Cancelar NF-e</button>
        </div>

        <p className="preview-caption"><span className="online-dot"/> Conectado ao sistema em tempo real</p>
      </> : <div className="empty-state"><Icon name="document" size={28}/><strong>Selecione uma entrega</strong><span>Os detalhes do comprovante aparecerão aqui.</span></div>}</aside>}
    </div>

    {/* ── MODAIS ───────────────────────────────────────────────────── */}
    {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.currentTarget === e.target && setModalOpen(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><span><small>NOVA ENTREGA</small><h2 id="modal-title">Registrar entrega</h2></span><button aria-label="Fechar" onClick={() => setModalOpen(false)}><Icon name="close"/></button></div><p>Cadastre os dados da nota fiscal para iniciar o rastreamento do comprovante de entrega.</p><form onSubmit={(e) => void createProof(e)}><div className="form-row"><label>Número da nota<input name="numero" inputMode="numeric" pattern="[0-9]{1,9}" maxLength={9} placeholder="Ex.: 084530" required/></label><label>Série<input name="serie" inputMode="numeric" pattern="[0-9]{1,3}" maxLength={3} placeholder="Ex.: 1" required/></label></div><label>Destinatário<input name="destinatario_nome" maxLength={200} placeholder="Razão social ou nome" required/></label><label>CPF ou CNPJ<input name="destinatario_documento" inputMode="numeric" pattern="[0-9]{11}|[0-9]{14}" maxLength={14} placeholder="Somente números" required/></label><div className="form-row"><label>Valor da nota<input name="amount" inputMode="decimal" placeholder="0,00" required/></label><label>Data de emissão<input name="emitida_em" type="date" required/></label></div><label>Motorista<select name="motorista_id" defaultValue=""><option value="">Atribuir depois</option>{drivers.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}</select></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancelar</button><button type="submit" className="primary-button" disabled={saving}><Icon name="send"/> {saving ? "Registrando…" : "Registrar entrega"}</button></div></form></section></div>}

    {driverModalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.currentTarget === e.target && setDriverModalOpen(false)}><section className="modal" role="dialog" aria-modal="true"><div className="modal-header"><span><small>NOVO MOTORISTA</small><h2>Cadastrar motorista</h2></span><button aria-label="Fechar" onClick={() => setDriverModalOpen(false)}><Icon name="close"/></button></div><p>Informe os dados do motorista para vinculá-lo à operação.</p><form onSubmit={(e) => void createDriver(e)}><label>Nome completo<input name="nome" maxLength={120} placeholder="Nome do motorista" required/></label><label>Telefone (WhatsApp)<input name="telefone" placeholder="+5511999999999" required/></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setDriverModalOpen(false)}>Cancelar</button><button type="submit" className="primary-button" disabled={saving}><Icon name="send"/> {saving ? "Cadastrando…" : "Cadastrar motorista"}</button></div></form></section></div>}

    {exportModalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.currentTarget === e.target && setExportModalOpen(false)}><section className="modal" role="dialog" aria-modal="true"><div className="modal-header"><span><small>EXPORTAÇÃO</small><h2>Exportar comprovantes</h2></span><button aria-label="Fechar" onClick={() => setExportModalOpen(false)}><Icon name="close"/></button></div><p>Selecione o período para exportar um ZIP contendo a planilha de índice e os PDFs dos comprovantes (máx. 500 registros).</p><form onSubmit={(e) => handleExport(e)}><div className="form-row"><label>Data início<input name="data_inicio" type="date" required/></label><label>Data fim<input name="data_fim" type="date" required/></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setExportModalOpen(false)}>Cancelar</button><button type="submit" className="primary-button"><Icon name="download"/> Exportar ZIP</button></div></form></section></div>}

    {toast && <div className="toast" role="status"><span><Icon name="check" size={16}/></span>{toast}</div>}
  </div>;
}
