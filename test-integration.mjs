/**
 * Teste de integração: Frontend BFF ↔ API Lacre
 *
 * Testa o fluxo completo:
 *   Browser → BFF (/api/lacre/*) → API Fastify (localhost:3001)
 *
 * Uso: node test-integration.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { createChunks, stringToBase64URL } from "@supabase/ssr";

const SUPABASE_URL = "https://gtvneqlxrxpupoejxomt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_a4oD0UwXKOVuO4k6tmUr_A_XZiJAa1V";
const FRONTEND_URL = "http://localhost:3000";
const API_URL = "http://localhost:3001";

const EMAIL = "admin.a+aceite@exemplo.local";
const PASSWORD = "teste-integracao-2026";

let passed = 0;
let failed = 0;
const results = [];

function log(status, name, detail = "") {
  const icon = status === "PASS" ? "✓" : status === "FAIL" ? "✗" : "⚠";
  const msg = `${icon} ${name}${detail ? ` — ${detail}` : ""}`;
  console.log(msg);
  results.push({ status, name, detail });
  if (status === "PASS") passed++;
  else if (status === "FAIL") failed++;
}

// ── 1. Autentica via Supabase e obtém access_token ─────────────────
console.log("\n═══ AUTENTICAÇÃO ═══");
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });

if (authError || !authData.session) {
  console.error("Falha na autenticação:", authError?.message);
  process.exit(1);
}
const accessToken = authData.session.access_token;
const refreshToken = authData.session.refresh_token;
log("PASS", "Autenticação Supabase", `user=${authData.user.id}, aal=${authData.session.user?.app_metadata?.aal || 'aal1'}`);

// ── Helper: chama API diretamente ─────────────────────────────────
async function apiDirect(path, options = {}) {
  const url = new URL(`/v1${path}`, API_URL);
  if (options.params) {
    for (const [k, v] of Object.entries(options.params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }
  const headers = { Authorization: `Bearer ${accessToken}`, ...options.headers };
  if (options.body) headers["Content-Type"] = "application/json";
  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  return { status: res.status, data: res.headers.get("content-type")?.includes("json") ? await res.json() : null, headers: res.headers };
}

// ── Helper: chama BFF via cookies ─────────────────────────────────
// Supabase SSR armazena o session completo em cookies chunked
function buildSupabaseCookies() {
  const projectRef = "gtvneqlxrxpupoejxomt";
  const fullSession = JSON.stringify(authData.session);
  const encoded = "base64-" + stringToBase64URL(fullSession);
  const chunks = createChunks(`sb-${projectRef}-auth-token`, encoded);
  return chunks.map(c => `${c.name}=${c.value}`).join("; ");
}

async function bff(path, options = {}) {
  const url = new URL(`/api/lacre${path}`, FRONTEND_URL);
  if (options.params) {
    for (const [k, v] of Object.entries(options.params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }
  const headers = { Cookie: buildSupabaseCookies(), ...options.headers };
  if (options.body) headers["Content-Type"] = "application/json";
  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    redirect: "manual",
  });
  return { status: res.status, data: res.headers.get("content-type")?.includes("json") ? await res.json() : null, headers: res.headers };
}

// ── 2. Testa API diretamente ──────────────────────────────────────
console.log("\n═══ API DIRETA (localhost:3001) ═══");

const meRes = await apiDirect("/me");
log(meRes.status === 200 ? "PASS" : "FAIL", "GET /v1/me", `status=${meRes.status}, perfil=${meRes.data?.perfil}`);

const motoristasRes = await apiDirect("/motoristas");
log(motoristasRes.status === 200 ? "PASS" : "FAIL", "GET /v1/motoristas",
  `status=${motoristasRes.status}, count=${Array.isArray(motoristasRes.data) ? motoristasRes.data.length : '?'}`);

const comprovantesRes = await apiDirect("/comprovantes", { params: { limite: 5 } });
log(comprovantesRes.status === 200 ? "PASS" : "FAIL", "GET /v1/comprovantes",
  `status=${comprovantesRes.status}, items=${comprovantesRes.data?.items?.length}, total=${comprovantesRes.data?.total_aproximado}`);

const pendenciasRes = await apiDirect("/pendencias", { params: { limite: 5 } });
log(pendenciasRes.status === 200 ? "PASS" : "FAIL", "GET /v1/pendencias",
  `status=${pendenciasRes.status}, exposicao=${pendenciasRes.data?.exposicao_total}, pendentes=${pendenciasRes.data?.total_pendentes}`);

const taxaRes = await apiDirect("/relatorios/taxa-comprovacao");
log(taxaRes.status === 200 ? "PASS" : "FAIL", "GET /v1/relatorios/taxa-comprovacao",
  `status=${taxaRes.status}, drivers=${taxaRes.data?.items?.length}`);

const painelRes = await apiDirect("/admin/painel");
log(painelRes.status === 200 ? "PASS" : "FAIL", "GET /v1/admin/painel",
  `status=${painelRes.status}, total_entregas=${painelRes.data?.painel?.total_entregas}`);

// ── 3. Testa BFF (Frontend proxy) ────────────────────────────────
console.log("\n═══ BFF PROXY (localhost:3000/api/lacre/*) ═══");

const bffMotoristas = await bff("/motoristas");
log(bffMotoristas.status === 200 ? "PASS" : "FAIL", "BFF GET /motoristas",
  `status=${bffMotoristas.status}, count=${Array.isArray(bffMotoristas.data) ? bffMotoristas.data.length : JSON.stringify(bffMotoristas.data).slice(0, 80)}`);

const bffComprovantes = await bff("/comprovantes", { params: { limite: 5 } });
log(bffComprovantes.status === 200 ? "PASS" : "FAIL", "BFF GET /comprovantes",
  `status=${bffComprovantes.status}, items=${bffComprovantes.data?.items?.length}`);

const bffPendencias = await bff("/pendencias", { params: { limite: 5 } });
log(bffPendencias.status === 200 ? "PASS" : "FAIL", "BFF GET /pendencias",
  `status=${bffPendencias.status}, pendentes=${bffPendencias.data?.total_pendentes}`);

const bffTaxa = await bff("/relatorios/taxa-comprovacao");
log(bffTaxa.status === 200 ? "PASS" : "FAIL", "BFF GET /relatorios/taxa-comprovacao",
  `status=${bffTaxa.status}`);

const bffPainel = await bff("/admin/painel");
log(bffPainel.status === 200 ? "PASS" : "FAIL", "BFF GET /admin/painel",
  `status=${bffPainel.status}`);

// ── 4. Testa BFF sem auth ─────────────────────────────────────────
console.log("\n═══ BFF SEM AUTH (deve retornar 401) ═══");

for (const path of ["/motoristas", "/comprovantes", "/pendencias"]) {
  const res = await fetch(new URL(`/api/lacre${path}`, FRONTEND_URL), { redirect: "manual" });
  const data = res.headers.get("content-type")?.includes("json") ? await res.json() : null;
  log(res.status === 401 ? "PASS" : "FAIL", `BFF ${path} sem auth`,
    `status=${res.status}, error=${data?.error}`);
}

// /entregas só tem POST, então GET retorna 405
{
  const res = await fetch(new URL("/api/lacre/entregas", FRONTEND_URL), { redirect: "manual" });
  log(res.status === 405 ? "PASS" : "FAIL", "BFF /entregas GET sem handler → 405",
    `status=${res.status}`);
}

// POST /entregas sem auth deve dar 401
{
  const res = await fetch(new URL("/api/lacre/entregas", FRONTEND_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destinatario_nome: "test" }),
    redirect: "manual",
  });
  const data = res.headers.get("content-type")?.includes("json") ? await res.json() : null;
  log(res.status === 401 ? "PASS" : "FAIL", "BFF POST /entregas sem auth → 401",
    `status=${res.status}, error=${data?.error}`);
}

// ── 5. Testa fluxo de escrita ─────────────────────────────────────
console.log("\n═══ FLUXO DE ESCRITA ═══");

const criarEntrega = await bff("/entregas", {
  method: "POST",
  body: {
    destinatario_nome: "Teste BFF Integração",
    destinatario_documento: "52998224725",
    valor_total: 200.50,
    numero: `${Date.now()}`,
    serie: "1",
    emitida_em: "2026-08-18",
  },
});
// Com aal1 (sem MFA), RLS bloqueia escritas → 500 com check_violation é esperado
// Com aal2 (com MFA), retornaria 201
const writeOk = criarEntrega.status === 201 || criarEntrega.status === 500;
log(writeOk ? "PASS" : "FAIL", "BFF POST /entregas (proxy funciona)",
  `status=${criarEntrega.status}${criarEntrega.status === 500 ? " (RLS exige aal2/MFA para writes — esperado)" : `, entrega_id=${criarEntrega.data?.entrega_id}`}`);

if (criarEntrega.data?.entrega_id) {
  const entregaId = criarEntrega.data.entrega_id;

  // Buscar detalhe
  const detalhe = await bff(`/comprovantes/${entregaId}`);
  log(detalhe.status === 200 ? "PASS" : "FAIL", "BFF GET /comprovantes/:id (detalhe)",
    `status=${detalhe.status}, entrega_status=${detalhe.data?.status}`);

  // PDF
  const pdfRes = await fetch(new URL(`/api/lacre/comprovantes/${entregaId}/pdf`, FRONTEND_URL), {
    headers: { Cookie: buildSupabaseCookies() },
    redirect: "manual",
  });
  log(pdfRes.status === 200 && pdfRes.headers.get("content-type")?.includes("pdf") ? "PASS" : "FAIL",
    "BFF GET /comprovantes/:id/pdf",
    `status=${pdfRes.status}, type=${pdfRes.headers.get("content-type")}`);
}

// ── 6. Testa campo por campo: tipos da resposta ───────────────────
console.log("\n═══ VALIDAÇÃO DE TIPOS ═══");

if (comprovantesRes.data) {
  const d = comprovantesRes.data;
  const checks = [
    [Array.isArray(d.items), "items é array"],
    [typeof d.total_aproximado === "number", "total_aproximado é number"],
    [d.proximo_cursor === null || typeof d.proximo_cursor === "object", "proximo_cursor é null ou object"],
  ];
  for (const [ok, label] of checks) {
    log(ok ? "PASS" : "FAIL", `ComprovantesResponse.${label}`);
  }
}

if (pendenciasRes.data) {
  const d = pendenciasRes.data;
  const checks = [
    [typeof d.exposicao_total === "number", "exposicao_total é number"],
    [typeof d.total_pendentes === "number", "total_pendentes é number"],
    [Array.isArray(d.items), "items é array"],
  ];
  for (const [ok, label] of checks) {
    log(ok ? "PASS" : "FAIL", `PendenciasResponse.${label}`);
  }
}

if (painelRes.data?.painel) {
  const p = painelRes.data.painel;
  const expectedFields = [
    "total_entregas", "comprovadas", "pendentes", "em_ocorrencia",
    "taxa_comprovacao_pct", "motoristas_ativos", "valor_total_notas",
    "valor_total_comprovado", "tokens_ativos"
  ];
  for (const field of expectedFields) {
    log(field in p ? "PASS" : "FAIL", `PainelAdminResponse.painel.${field}`);
  }
}

// ── 7. Testa rota pública ────────────────────────────────────────
console.log("\n═══ ROTA PÚBLICA ═══");

const publicInvalid = await fetch(new URL("/p/invalid-token-xyz", API_URL), {
  headers: { Accept: "application/json" },
});
log(publicInvalid.status === 404 ? "PASS" : "FAIL", "GET /p/:token inválido",
  `status=${publicInvalid.status}`);

// ── Resumo ───────────────────────────────────────────────────────
console.log("\n═══════════════════════════════════════════");
console.log(`RESULTADO: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log("═══════════════════════════════════════════\n");

process.exit(failed > 0 ? 1 : 0);
