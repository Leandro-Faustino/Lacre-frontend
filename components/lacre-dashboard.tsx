"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";

type IconName =
  | "home" | "clock" | "check" | "alert" | "money" | "truck" | "chart"
  | "plus" | "filter" | "calendar" | "message" | "download" | "link"
  | "rows" | "document" | "search" | "help" | "bell" | "chevron"
  | "arrow" | "close" | "cloud" | "more" | "file" | "send" | "menu";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    alert: <><path d="M12 3 2.7 20h18.6L12 3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
    money: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h.01M17 15h.01"/><circle cx="12" cy="12" r="2.5"/></>,
    truck: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
    message: <><path d="M20 15a4 4 0 0 1-4 4H8l-5 3 1.5-5A7 7 0 0 1 3 13V8a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v7Z"/></>,
    download: <><path d="M12 3v12m0 0 5-5m-5 5-5-5"/><path d="M4 19h16"/></>,
    link: <><path d="m9 15 6-6"/><path d="M7.5 17H6a4 4 0 0 1 0-8h3M16.5 7H18a4 4 0 0 1 0 8h-3"/></>,
    rows: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    document: <><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.3 2.3 0 1 1 3 2.2c-.8.35-.8 1.2-.8 1.8M12 17h.01"/></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M10 20h4"/></>,
    chevron: <><path d="m9 7 5 5-5 5"/></>,
    arrow: <><path d="M5 12h14m-5-5 5 5-5 5"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    cloud: <><path d="M6 18h12a4 4 0 0 0 .5-8A7 7 0 0 0 5 8.5 4.8 4.8 0 0 0 6 18Z"/><path d="m9 13 2 2 4-4"/></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></>,
    file: <><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/></>,
    send: <><path d="m3 3 18 9-18 9 4-9-4-9Z"/><path d="M7 12h14"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  };

  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

type Status = "Lacrada" | "Pendente" | "Atenção";

type Proof = {
  id: number;
  note: string;
  customer: string;
  document: string;
  driver: string;
  delivery: string;
  city: string;
  amount: number;
  status: Status;
  receiver: string;
  receivedAt: string;
  protocol: string;
};

// Registros inteiramente fictícios para a demonstração pública da interface.
const initialProofs: Proof[] = [
  { id: 1, note: "NF DEMO-521", customer: "Cliente Alfa", document: "Cadastro demonstrativo A", driver: "Motorista 01", delivery: "Hoje, 10:42", city: "Rota Norte · SC", amount: 28400, status: "Pendente", receiver: "—", receivedAt: "Aguardando foto", protocol: "DEMO-521-0815" },
  { id: 2, note: "NF DEMO-517", customer: "Cliente Beta", document: "Cadastro demonstrativo B", driver: "Motorista 02", delivery: "Hoje, 09:18", city: "Rota Vale · SC", amount: 19420, status: "Atenção", receiver: "—", receivedAt: "Prazo excedido em 1h", protocol: "DEMO-517-0815" },
  { id: 3, note: "NF DEMO-509", customer: "Cliente Gama", document: "Cadastro demonstrativo C", driver: "Motorista 03", delivery: "Hoje, 08:05", city: "Rota Centro · SC", amount: 11320, status: "Lacrada", receiver: "Recebedor A", receivedAt: "Hoje, 08:13", protocol: "DEMO-509-0815" },
  { id: 4, note: "NF DEMO-498", customer: "Cliente Delta", document: "Cadastro demonstrativo D", driver: "Motorista 01", delivery: "Ontem, 17:26", city: "Rota Serra · SC", amount: 9700, status: "Lacrada", receiver: "Recebedor B", receivedAt: "Ontem, 17:32", protocol: "DEMO-498-0814" },
  { id: 5, note: "NF DEMO-492", customer: "Cliente Épsilon", document: "Cadastro demonstrativo E", driver: "Motorista 04", delivery: "Ontem, 16:11", city: "Rota Litoral · SC", amount: 34750, status: "Pendente", receiver: "—", receivedAt: "Aguardando foto", protocol: "DEMO-492-0814" },
  { id: 6, note: "NF DEMO-481", customer: "Cliente Zeta", document: "Cadastro demonstrativo F", driver: "Motorista 02", delivery: "Ontem, 14:52", city: "Rota Norte · SC", amount: 17890, status: "Lacrada", receiver: "Recebedor C", receivedAt: "Ontem, 15:01", protocol: "DEMO-481-0814" },
];

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const navItems: { icon: IconName; label: string; badge?: string }[] = [
  { icon: "home", label: "Visão geral" },
  { icon: "clock", label: "Volta da prova", badge: "12" },
  { icon: "check", label: "Lacradas" },
  { icon: "alert", label: "Pendentes", badge: "23" },
  { icon: "money", label: "Exposição" },
];

function LacreMark() {
  return (
    <span className="lacre-mark" aria-hidden="true">
      <span className="lacre-stub" />
      <span className="lacre-perf"><i/><i/><i/><i/><i/></span>
      <span className="lacre-note" />
    </span>
  );
}

export function LacreDashboard() {
  const [proofs, setProofs] = useState(initialProofs);
  const [selectedId, setSelectedId] = useState(3);
  const [activeNav, setActiveNav] = useState("Visão geral");
  const [filter, setFilter] = useState<"Todas" | Status>("Todas");
  const [query, setQuery] = useState("");
  const [compact, setCompact] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const selected = proofs.find((proof) => proof.id === selectedId) ?? proofs[0];
  const visibleProofs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return proofs.filter((proof) => {
      const matchesFilter = filter === "Todas" || proof.status === filter;
      const matchesQuery = !normalized || [proof.note, proof.customer, proof.driver, proof.city]
        .some((value) => value.toLowerCase().includes(normalized));
      return matchesFilter && matchesQuery;
    });
  }, [filter, proofs, query]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }

  function sealSelected() {
    setProofs((items) => items.map((item) => item.id === selected.id
      ? { ...item, status: "Lacrada", receiver: "Recebedor confirmado", receivedAt: "Agora" }
      : item));
    notify(`${selected.note} foi marcada como lacrada.`);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`https://lacre.app/p/${selected.protocol}`);
      notify("Link público copiado.");
    } catch {
      notify("Link pronto para compartilhar.");
    }
  }

  function createProof(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const amount = Number(String(data.get("amount") ?? "0").replace(/\D/g, "")) / 100;
    const id = Math.max(...proofs.map((proof) => proof.id)) + 1;
    const next: Proof = {
      id,
      note: String(data.get("note") || "Nova nota"),
      customer: String(data.get("customer") || "Cliente"),
      document: "CNPJ não informado",
      driver: String(data.get("driver") || "A definir"),
      delivery: "Agora",
      city: "Rota a confirmar",
      amount,
      status: "Pendente",
      receiver: "—",
      receivedAt: "Aguardando foto",
      protocol: `DEMO-${Date.now().toString().slice(-8)}`,
    };
    setProofs((items) => [next, ...items]);
    setSelectedId(id);
    setFilter("Todas");
    setModalOpen(false);
    notify("Canhoto criado e enviado para acompanhamento.");
  }

  return (
    <div className="app-shell">
      <header className="word-bar">
        <div className="brand-lockup">
          <button className="mobile-menu" aria-label="Abrir navegação" onClick={() => setSidebarOpen(true)}><Icon name="menu" /></button>
          <LacreMark />
          <span className="brand-name">Lacre</span>
        </div>
        <div className="document-name">
          <strong>Painel de provas</strong>
          <span><Icon name="cloud" size={15}/> Salvo agora</span>
        </div>
        <label className="global-search">
          <Icon name="search" size={16}/>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar nota, cliente ou motorista" />
          <kbd>⌘ K</kbd>
        </label>
        <div className="top-actions">
          <button aria-label="Ajuda"><Icon name="help" /></button>
          <button aria-label="Notificações" className="notification"><Icon name="bell"/><span /></button>
          <div className="avatar" title="Equipe financeira">FI</div>
        </div>
      </header>

      <nav className="tab-bar" aria-label="Abas do painel">
        {['Arquivo', 'Início', 'Canhotos', 'Cobrança', 'Motoristas', 'Relatórios'].map((tab) => (
          <button key={tab} className={tab === 'Início' ? 'active' : ''}>{tab}</button>
        ))}
        <span className="tab-date">15 de agosto de 2026</span>
      </nav>

      <section className="ribbon" aria-label="Faixa de comandos">
        <div className="ribbon-group primary-command">
          <button onClick={() => setModalOpen(true)}><span><Icon name="plus" size={24}/></span>Novo canhoto</button>
          <small>CRIAR</small>
        </div>
        <div className="ribbon-group">
          <div className="ribbon-buttons">
            <button onClick={() => setFilter("Pendente")} className={filter === "Pendente" ? "selected" : ""}><Icon name="filter"/><span>Pendentes</span></button>
            <button onClick={() => setFilter("Lacrada")} className={filter === "Lacrada" ? "selected" : ""}><Icon name="check"/><span>Lacradas</span></button>
            <button onClick={() => notify("Período ajustado para os últimos 7 dias.")}><Icon name="calendar"/><span>Período</span></button>
          </div>
          <small>LOCALIZAR</small>
        </div>
        <div className="ribbon-group">
          <div className="ribbon-buttons">
            <button onClick={() => notify(`Lembrete enviado a ${selected.driver}.`)}><Icon name="message"/><span>Cobrar prova</span></button>
            <button onClick={() => notify("Relatório em PDF preparado.")}><Icon name="download"/><span>Exportar PDF</span></button>
            <button onClick={copyLink}><Icon name="link"/><span>Copiar link</span></button>
          </div>
          <small>AGIR</small>
        </div>
        <div className="ribbon-group view-group">
          <div className="ribbon-buttons">
            <button className={compact ? "selected" : ""} onClick={() => setCompact(true)}><Icon name="rows"/><span>Compacta</span></button>
            <button className={!compact ? "selected" : ""} onClick={() => setCompact(false)}><Icon name="document"/><span>Confortável</span></button>
          </div>
          <small>EXIBIR</small>
        </div>
      </section>

      <div className="workspace">
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <button className="sidebar-close" aria-label="Fechar navegação" onClick={() => setSidebarOpen(false)}><Icon name="close"/></button>
          <div className="company-switcher">
            <span className="company-avatar">TD</span>
            <span><strong>Transportadora Demo</strong><small>Ambiente demonstrativo</small></span>
            <Icon name="chevron" size={15}/>
          </div>
          <nav className="side-nav" aria-label="Navegação principal">
            <p>PAINEL</p>
            {navItems.map((item) => (
              <button key={item.label} className={activeNav === item.label ? "active" : ""} onClick={() => { setActiveNav(item.label); setSidebarOpen(false); }}>
                <Icon name={item.icon}/><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}
              </button>
            ))}
            <p>OPERAÇÃO</p>
            <button><Icon name="truck"/><span>Motoristas</span></button>
            <button><Icon name="chart"/><span>Relatórios</span></button>
          </nav>
          <div className="whatsapp-card">
            <span><Icon name="message"/></span>
            <strong>WhatsApp conectado</strong>
            <p>Última prova recebida há 7 min.</p>
            <button onClick={() => notify("Canal do WhatsApp está saudável.")}>Ver canal <Icon name="arrow" size={14}/></button>
          </div>
          <div className="sidebar-user"><div className="avatar light">FI</div><span><strong>Equipe financeira</strong><small>Dados fictícios</small></span><Icon name="more"/></div>
        </aside>

        {sidebarOpen && <button className="sidebar-backdrop" aria-label="Fechar navegação" onClick={() => setSidebarOpen(false)} />}

        <main className="main-content">
          <section className="welcome-row">
            <div><span className="eyebrow">RESUMO DE HOJE · DEMONSTRAÇÃO</span><h1>Bom dia, Financeiro.</h1><p>Veja primeiro o que pode travar a cobrança.</p></div>
            <button className="secondary-button" onClick={() => notify("Resumo atualizado com os dados mais recentes.")}><Icon name="clock"/> Atualizado agora</button>
          </section>

          <section className="summary-grid" aria-label="Resumo diário">
            <article className="metric-card exposure">
              <div className="metric-top"><span className="metric-icon"><Icon name="money"/></span><span className="metric-label">Exposição</span><button aria-label="Mais opções"><Icon name="more"/></button></div>
              <strong>R$ 128.460</strong>
              <p>em notas entregues ainda sem prova</p>
              <div className="metric-foot"><span className="trend down">↓ 18%</span><span>desde ontem</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span className="metric-icon amber"><Icon name="clock"/></span><span className="metric-label">Aguardando volta</span><button aria-label="Mais opções"><Icon name="more"/></button></div>
              <strong>23</strong>
              <p>canhotos em acompanhamento</p>
              <div className="metric-foot"><b>12</b><span>precisam voltar hoje</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span className="metric-icon green"><Icon name="check"/></span><span className="metric-label">Lacradas hoje</span><button aria-label="Mais opções"><Icon name="more"/></button></div>
              <strong>47</strong>
              <p>provas íntegras e prontas</p>
              <div className="metric-foot"><span className="trend up">↑ 9%</span><span>acima da média</span></div>
            </article>
          </section>

          <button className="priority-line" onClick={() => { setFilter("Atenção"); document.getElementById("proof-list")?.scrollIntoView({ behavior: "smooth" }); }}>
            <span className="priority-icon"><Icon name="alert"/></span>
            <span><strong>Comece por aqui:</strong> 3 provas vencem o prazo e somam R$ 47.820.</span>
            <b>Ver prioridade <Icon name="arrow" size={16}/></b>
          </button>

          <section className="proof-panel" id="proof-list">
            <div className="panel-heading">
              <div><span className="eyebrow">VOLTA DA PROVA</span><h2>Canhotos recentes</h2></div>
              <div className="filter-pills" role="group" aria-label="Filtrar canhotos">
                {(["Todas", "Pendente", "Atenção", "Lacrada"] as const).map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
              </div>
            </div>
            <div className={`proof-table ${compact ? "compact" : ""}`}>
              <div className="table-row table-head"><span>Nota / cliente</span><span>Motorista</span><span>Entrega</span><span>Valor</span><span>Situação</span><span /></div>
              {visibleProofs.length ? visibleProofs.map((proof) => (
                <button className={`table-row ${selected.id === proof.id ? "selected" : ""}`} key={proof.id} onClick={() => setSelectedId(proof.id)}>
                  <span className="customer-cell"><i className="note-icon"><Icon name="file" size={17}/></i><span><strong>{proof.note}</strong><small>{proof.customer}</small></span></span>
                  <span><strong>{proof.driver}</strong><small>{proof.city}</small></span>
                  <span><strong>{proof.delivery.split(", ")[0]}</strong><small>{proof.delivery.split(", ")[1]}</small></span>
                  <span className="amount">{money.format(proof.amount)}</span>
                  <span><i className={`status ${proof.status.toLowerCase().replace("ç", "c")}`}>{proof.status === "Lacrada" && <Icon name="check" size={13}/>} {proof.status}</i></span>
                  <span className="row-action"><Icon name="chevron" size={17}/></span>
                </button>
              )) : <div className="empty-state"><Icon name="search" size={26}/><strong>Nenhum canhoto encontrado</strong><span>Tente outro termo ou filtro.</span></div>}
            </div>
            <div className="panel-footer"><span>Mostrando {visibleProofs.length} de 83 canhotos</span><button onClick={() => { setFilter("Todas"); setQuery(""); }}>Ver todos <Icon name="arrow" size={14}/></button></div>
          </section>
        </main>

        <aside className="preview-panel">
          <div className="preview-heading"><span><small>PROVA SELECIONADA</small><strong>{selected.note}</strong></span><button aria-label="Mais opções"><Icon name="more"/></button></div>
          <div className="paper-wrap">
            <div className="proof-paper">
              <div className="paper-brand"><span><LacreMark/><b>Lacre</b></span><i className={`paper-seal ${selected.status === "Lacrada" ? "sealed" : "waiting"}`}><Icon name={selected.status === "Lacrada" ? "check" : "clock"} size={13}/>{selected.status === "Lacrada" ? "Lacrada" : "Pendente"}</i></div>
              <div className="paper-title"><small>COMPROVANTE DE ENTREGA</small><h3>{selected.note}</h3><span>{selected.protocol}</span></div>
              <dl className="paper-details">
                <div><dt>DESTINATÁRIO</dt><dd>{selected.customer}<small>{selected.document}</small></dd></div>
                <div className="split"><span><dt>VALOR DA NOTA</dt><dd>{money.format(selected.amount)}</dd></span><span><dt>ENTREGA</dt><dd>{selected.delivery}</dd></span></div>
                <div><dt>LOCAL</dt><dd>{selected.city}</dd></div>
                <div className="split"><span><dt>MOTORISTA</dt><dd>{selected.driver}</dd></span><span><dt>RECEBEDOR</dt><dd>{selected.receiver}</dd></span></div>
              </dl>
              <div className={`proof-photo ${selected.status === "Lacrada" ? "has-photo" : ""}`}>
                {selected.status === "Lacrada" ? <><Icon name="document" size={38}/><span>Imagem do canhoto</span><small>Recebida via WhatsApp</small></> : <><Icon name="clock" size={30}/><span>Aguardando a foto</span><small>Um lembrete pode ser enviado ao motorista.</small></>}
              </div>
              <div className="integrity-row"><span><Icon name="check" size={15}/></span><p><strong>Registro íntegro</strong><small>Carimbo de tempo e origem preservados.</small></p></div>
              <div className="paper-hash">SHA-256 · 9af3c8e2…d081</div>
            </div>
          </div>
          <div className="preview-actions">
            {selected.status !== "Lacrada" ? <button className="primary-button" onClick={sealSelected}><Icon name="check"/> Marcar como lacrada</button> : <button className="primary-button" onClick={() => notify("Comprovante aberto para impressão.")}><Icon name="download"/> Baixar comprovante</button>}
            <button className="secondary-button" onClick={copyLink}><Icon name="link"/> Copiar link</button>
          </div>
          <p className="preview-caption"><span className="online-dot"/> O financeiro encontra esta prova em menos de um minuto.</p>
        </aside>
      </div>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && setModalOpen(false)}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-header"><span><small>NOVO REGISTRO</small><h2 id="modal-title">Acompanhar um canhoto</h2></span><button aria-label="Fechar" onClick={() => setModalOpen(false)}><Icon name="close"/></button></div>
          <p>Cadastre a nota e o motorista. A Lacre cuida da volta da prova pelo WhatsApp.</p>
          <form onSubmit={createProof}>
            <label>Número da nota<input name="note" placeholder="Ex.: NF 084.530" required /></label>
            <label>Cliente<input name="customer" placeholder="Razão social ou nome fantasia" required /></label>
            <div className="form-row"><label>Motorista<input name="driver" placeholder="Nome do motorista" required /></label><label>Valor da nota<input name="amount" inputMode="numeric" placeholder="R$ 0,00" required /></label></div>
            <div className="modal-note"><Icon name="message"/><span><strong>Sem app para o motorista.</strong><small>Ele recebe e envia tudo pelo WhatsApp.</small></span></div>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancelar</button><button type="submit" className="primary-button"><Icon name="send"/> Criar acompanhamento</button></div>
          </form>
        </section>
      </div>}

      {toast && <div className="toast" role="status"><span><Icon name="check" size={16}/></span>{toast}</div>}
    </div>
  );
}
