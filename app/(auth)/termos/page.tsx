import Link from "next/link";

export default function TermosPage() {
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
        <h1>Termos de Uso</h1>
        <p className="legal-updated">Última atualização: 19 de agosto de 2026</p>

        <p>
          Estes Termos de Uso (&quot;Termos&quot;) regem o acesso e uso da plataforma <strong>Lacre</strong>,
          destinada a transportadoras e distribuidores para gestão de provas de entrega digitais.
          Ao criar uma conta, você concorda com estes Termos integralmente.
        </p>

        <h2>1. Definições</h2>
        <ul>
          <li><strong>Plataforma:</strong> o sistema web Lacre, incluindo APIs, painel administrativo e integrações.</li>
          <li><strong>Usuário:</strong> pessoa física ou jurídica que cria conta e utiliza a Plataforma.</li>
          <li><strong>Motorista:</strong> profissional cadastrado pelo Usuário para envio de comprovantes via WhatsApp.</li>
          <li><strong>Entrega:</strong> operação logística registrada na Plataforma com nota fiscal associada.</li>
          <li><strong>Comprovante:</strong> fotografia ou documento digital que comprova a realização de uma entrega.</li>
        </ul>

        <h2>2. Cadastro e conta</h2>
        <ul>
          <li>O Usuário deve fornecer informações verdadeiras e mantê-las atualizadas.</li>
          <li>Cada conta é pessoal e intransferível. O Usuário é responsável pela segurança das suas credenciais.</li>
          <li>A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, números e caracteres especiais.</li>
          <li>Recomendamos a ativação da autenticação multifator (MFA) para maior segurança.</li>
        </ul>

        <h2>3. Uso permitido</h2>
        <p>A Plataforma deve ser utilizada exclusivamente para:</p>
        <ul>
          <li>Registro e acompanhamento de entregas.</li>
          <li>Coleta e armazenamento de comprovantes digitais.</li>
          <li>Gestão de motoristas e relatórios operacionais.</li>
          <li>Importação de notas fiscais eletrônicas (NF-e).</li>
          <li>Exportação de dados para fins contábeis e fiscais.</li>
        </ul>

        <h2>4. Uso proibido</h2>
        <p>É vedado ao Usuário:</p>
        <ul>
          <li>Utilizar a Plataforma para fins ilegais ou não autorizados.</li>
          <li>Compartilhar credenciais de acesso com terceiros.</li>
          <li>Tentar acessar dados de outros tenants/organizações.</li>
          <li>Realizar engenharia reversa, scraping ou abuso de API.</li>
          <li>Enviar conteúdo malicioso, ofensivo ou que viole direitos de terceiros.</li>
        </ul>

        <h2>5. Dados e privacidade</h2>
        <p>
          O tratamento de dados pessoais é regido pela nossa{" "}
          <Link href="/politica-privacidade">Política de Privacidade</Link>,
          que integra estes Termos. Ao utilizar a Plataforma, o Usuário declara ter
          lido e concordado com a Política de Privacidade.
        </p>
        <p>
          O Usuário é responsável por garantir que possui base legal adequada para
          cadastrar dados de motoristas e destinatários na Plataforma.
        </p>

        <h2>6. Propriedade intelectual</h2>
        <p>
          Todo o conteúdo da Plataforma (código-fonte, design, marca, logotipo) é de
          propriedade da Lacre ou de seus licenciadores. O Usuário não adquire nenhum
          direito de propriedade intelectual sobre a Plataforma.
        </p>

        <h2>7. Disponibilidade e suporte</h2>
        <ul>
          <li>A Plataforma é fornecida &quot;como está&quot; (as is), sem garantias de disponibilidade ininterrupta.</li>
          <li>Realizamos manutenções programadas com aviso prévio quando possível.</li>
          <li>O suporte técnico é fornecido por e-mail em horário comercial.</li>
        </ul>

        <h2>8. Limitação de responsabilidade</h2>
        <p>
          A Lacre não se responsabiliza por danos indiretos, lucros cessantes ou perdas
          decorrentes do uso ou impossibilidade de uso da Plataforma. Nossa responsabilidade
          total é limitada ao valor pago pelo Usuário nos últimos 12 meses.
        </p>

        <h2>9. Rescisão</h2>
        <ul>
          <li>O Usuário pode encerrar sua conta a qualquer momento contatando o suporte.</li>
          <li>A Lacre pode suspender ou encerrar contas que violem estes Termos.</li>
          <li>Após o encerramento, dados pessoais serão tratados conforme a Política de Privacidade.</li>
          <li>Dados fiscais serão retidos pelo prazo legal de 5 anos.</li>
        </ul>

        <h2>10. Alterações</h2>
        <p>
          Podemos atualizar estes Termos periodicamente. Alterações significativas serão
          comunicadas por e-mail ou aviso no sistema com antecedência mínima de 15 dias.
          O uso continuado após a notificação constitui aceitação dos novos Termos.
        </p>

        <h2>11. Legislação aplicável e foro</h2>
        <p>
          Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca
          da sede da Lacre para dirimir quaisquer questões decorrentes destes Termos,
          com renúncia a qualquer outro, por mais privilegiado que seja.
        </p>

        <h2>12. Contato</h2>
        <p>
          Para dúvidas sobre estes Termos, entre em contato pelo e-mail:{" "}
          <strong>contato@lacre.app</strong>.
        </p>
      </article>

      <footer className="legal-footer">
        <p>Lacre &copy; 2026. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
