import Link from "next/link";

export default function PoliticaPrivacidadePage() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Link href="/sign-in" className="legal-back">Voltar</Link>
        <div className="legal-brand">
          <span className="lacre-mark" aria-hidden="true">
            <span className="lacre-stub" />
            <span className="lacre-perf"><i /><i /><i /><i /><i /></span>
            <span className="lacre-note" />
          </span>
          <span>Lacre</span>
        </div>
      </div>

      <article className="legal-content">
        <h1>Política de Privacidade</h1>
        <p className="legal-updated">Última atualização: 19 de agosto de 2026</p>

        <p>
          A <strong>Lacre</strong> (&quot;nós&quot;, &quot;nosso&quot;) respeita a sua privacidade e está comprometida
          com a proteção dos seus dados pessoais, em conformidade com a Lei Geral de Proteção de
          Dados Pessoais (Lei nº 13.709/2018 — LGPD) e demais legislações aplicáveis.
        </p>

        <h2>1. Dados pessoais que coletamos</h2>
        <p>Coletamos os seguintes dados pessoais para a prestação dos nossos serviços:</p>
        <ul>
          <li><strong>Dados de conta:</strong> nome, e-mail corporativo e senha (armazenada de forma criptografada).</li>
          <li><strong>Dados de entregas:</strong> nome e CPF/CNPJ do destinatário, número e valor da nota fiscal.</li>
          <li><strong>Dados de motoristas:</strong> nome e telefone celular (formato E.164).</li>
          <li><strong>Comprovantes de entrega:</strong> fotografias enviadas via WhatsApp, que podem conter imagens de pessoas e informações de geolocalização.</li>
          <li><strong>Dados de acesso:</strong> endereço IP, User-Agent do navegador e timestamps de acesso para fins de segurança e auditoria.</li>
          <li><strong>Cookies:</strong> utilizamos apenas cookies estritamente necessários para autenticação e sessão.</li>
        </ul>

        <h2>2. Finalidade do tratamento</h2>
        <p>Seus dados são tratados para as seguintes finalidades:</p>
        <ul>
          <li>Autenticação e controle de acesso ao sistema.</li>
          <li>Gestão de entregas e comprovantes digitais.</li>
          <li>Comunicação operacional com motoristas via WhatsApp.</li>
          <li>Geração de relatórios de taxa de comprovação e pendências financeiras.</li>
          <li>Envio de e-mails transacionais (recuperação de senha, alertas).</li>
          <li>Cumprimento de obrigações legais e fiscais.</li>
        </ul>

        <h2>3. Base legal</h2>
        <p>O tratamento dos seus dados é fundamentado nas seguintes bases legais (Art. 7 da LGPD):</p>
        <ul>
          <li><strong>Consentimento</strong> (Art. 7, I): para criação de conta e aceite desta política.</li>
          <li><strong>Execução de contrato</strong> (Art. 7, V): para a prestação dos serviços de prova de entrega.</li>
          <li><strong>Legítimo interesse</strong> (Art. 7, IX): para dados de motoristas tratados no contexto operacional e logs de segurança.</li>
          <li><strong>Cumprimento de obrigação legal</strong> (Art. 7, II): para retenção de dados fiscais conforme legislação tributária.</li>
        </ul>

        <h2>4. Compartilhamento de dados</h2>
        <p>Seus dados podem ser compartilhados com os seguintes terceiros (operadores):</p>
        <ul>
          <li><strong>Supabase Inc.</strong> — infraestrutura de banco de dados e autenticação (servidores nos EUA, conforme Art. 33 da LGPD para transferência internacional).</li>
          <li><strong>Resend Inc.</strong> — envio de e-mails transacionais.</li>
          <li><strong>Meta Platforms (WhatsApp Business API)</strong> — comunicação com motoristas para coleta de comprovantes.</li>
          <li><strong>Amazon Web Services (S3)</strong> — armazenamento de mídias (fotos de comprovantes).</li>
        </ul>
        <p>Não compartilhamos seus dados com terceiros para fins de marketing ou publicidade.</p>

        <h2>5. Retenção de dados</h2>
        <ul>
          <li><strong>Dados de conta:</strong> mantidos enquanto a conta estiver ativa. Excluídos em até 30 dias após solicitação de exclusão.</li>
          <li><strong>Dados fiscais (notas fiscais, comprovantes):</strong> retidos por 5 anos conforme Art. 195 do Código Tributário Nacional.</li>
          <li><strong>Mensagens WhatsApp:</strong> dados brutos retidos por até 6 meses para auditoria, depois anonimizados.</li>
          <li><strong>Logs de acesso:</strong> retidos por 90 dias para fins de segurança.</li>
          <li><strong>Tokens públicos expirados:</strong> removidos em até 30 dias após expiração.</li>
        </ul>

        <h2>6. Seus direitos como titular (Art. 18 da LGPD)</h2>
        <p>Você tem direito a:</p>
        <ul>
          <li><strong>Acesso</strong> — solicitar cópia dos seus dados pessoais.</li>
          <li><strong>Correção</strong> — retificar dados incompletos, inexatos ou desatualizados.</li>
          <li><strong>Anonimização ou eliminação</strong> — de dados desnecessários ou tratados em desconformidade.</li>
          <li><strong>Portabilidade</strong> — transferir seus dados para outro fornecedor (via exportação).</li>
          <li><strong>Eliminação</strong> — solicitar a exclusão dos dados tratados com base no consentimento.</li>
          <li><strong>Informação</strong> — saber com quem seus dados foram compartilhados.</li>
          <li><strong>Revogação do consentimento</strong> — retirar o consentimento a qualquer momento.</li>
        </ul>
        <p>
          Para exercer qualquer desses direitos, utilize nosso{" "}
          <Link href="/dsar">formulário de solicitação de dados</Link> ou entre em contato
          com nosso Encarregado de Dados (DPO) pelo e-mail: <strong>privacidade@lacre.app</strong>.
        </p>

        <h2>7. Segurança</h2>
        <p>Adotamos medidas técnicas e organizacionais para proteger seus dados:</p>
        <ul>
          <li>Criptografia em trânsito (TLS/HTTPS) e em repouso.</li>
          <li>Chaves de API armazenadas com hash scrypt (nunca em texto puro).</li>
          <li>Tokens públicos armazenados como hash SHA-256.</li>
          <li>Autenticação multifator (MFA/TOTP) obrigatória para ações administrativas.</li>
          <li>Rate limiting contra abusos.</li>
          <li>Isolamento multi-tenant com filtro por organização em todas as consultas.</li>
          <li>Verificação de integridade de mídias com SHA-256.</li>
        </ul>

        <h2>8. Cookies</h2>
        <p>
          Utilizamos apenas cookies <strong>estritamente necessários</strong> para manter sua sessão
          de autenticação ativa. Não utilizamos cookies de rastreamento, analytics ou publicidade.
        </p>

        <h2>9. Encarregado de Dados (DPO)</h2>
        <p>
          Nosso Encarregado pelo Tratamento de Dados Pessoais pode ser contatado pelo e-mail:
          <strong> privacidade@lacre.app</strong>.
        </p>

        <h2>10. Alterações nesta política</h2>
        <p>
          Esta política pode ser atualizada periodicamente. Notificaremos os usuários sobre
          alterações significativas por e-mail ou aviso no sistema. A versão atual sempre
          estará disponível nesta página.
        </p>
      </article>

      <footer className="legal-footer">
        <p>Lacre &copy; 2026. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
