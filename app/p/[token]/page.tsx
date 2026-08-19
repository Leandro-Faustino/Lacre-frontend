import { notFound } from "next/navigation";
import { formatMoney } from "@/lib/formatters";

type PublicProof = {
  status: string;
  nota: {
    numero: string | null;
    serie: string | null;
    emitidaEm: string | null;
    valorTotal: number | null;
    destinatarioNome: string | null;
  };
  motorista: string | null;
  integridade: { sha256: string | null; confianca: number | null };
  linhaDoTempo: { momento: string; evento: string }[];
};

export default async function PublicProofPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const apiBaseUrl = process.env.LACRE_API_URL;
  if (!apiBaseUrl) throw new Error("LACRE_API_URL não configurada");

  const response = await fetch(new URL(`/p/${encodeURIComponent(token)}`, apiBaseUrl), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("Não foi possível consultar este comprovante.");
  const proof = await response.json() as PublicProof;

  return <main className="public-proof">
    <span className="eyebrow">LACRE · COMPROVANTE PÚBLICO</span>
    <h1>Comprovante de entrega</h1>
    <p className="public-proof-status">Status: <strong>{proof.status}</strong></p>
    <dl>
      <div><dt>Nota fiscal</dt><dd>{proof.nota.numero ?? "—"} · Série {proof.nota.serie ?? "—"}</dd></div>
      <div><dt>Destinatário</dt><dd>{proof.nota.destinatarioNome ?? "—"}</dd></div>
      <div><dt>Valor</dt><dd>{formatMoney(proof.nota.valorTotal ?? 0)}</dd></div>
      <div><dt>Motorista</dt><dd>{proof.motorista ?? "Não informado"}</dd></div>
      <div><dt>Integridade</dt><dd>{proof.integridade.sha256 ? `SHA-256 ${proof.integridade.sha256}` : "Aguardando mídia"}</dd></div>
    </dl>
    <h2>Linha do tempo</h2>
    <ol>{proof.linhaDoTempo.map((event, index) => <li key={`${event.momento}-${index}`}><strong>{event.evento}</strong><span>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(event.momento))}</span></li>)}</ol>
    <a className="primary-button" href={`/p/${encodeURIComponent(token)}/pdf`}>Baixar PDF</a>
  </main>;
}
