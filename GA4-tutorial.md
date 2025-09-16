# Google Analytics 4 (GA4) – Tutorial Rápido para Landing Page

## 1. Como criar uma conta e propriedade no GA4

1. Acesse: [https://analytics.google.com/](https://analytics.google.com/)
2. Faça login com sua conta Google.
3. Clique em **Administração** (ícone de engrenagem, canto inferior esquerdo).
4. Em **Conta**, clique em **Criar conta** (se ainda não tiver uma).
5. Em **Propriedade**, clique em **Criar propriedade**.
   - Dê um nome (ex: "ProcessadorXML").
   - Defina o fuso horário e moeda.
   - Clique em **Avançar** e preencha as informações do negócio.
   - Clique em **Criar**.
6. Escolha **Web** como plataforma.
   - Informe a URL do seu site (ex: `https://processador-xml-zip.vercel.app`).
   - Dê um nome para o fluxo (ex: "Landing Page").
   - Clique em **Criar fluxo**.
7. Copie o **Measurement ID** (ex: `G-XXXXXXXXXX`).
   - Use esse ID no seu HTML, substituindo no snippet do GA4.

---

## 2. Como personalizar eventos do GA4 (purchase, generate_lead, etc.)

### a) Adicionando eventos personalizados via JavaScript

No seu arquivo `js/script.js`, use o comando `gtag('event', ...)` para disparar eventos:

```js
// Exemplo: clique em "Adquirir Agora" (purchase)
document.querySelectorAll("a.btn.btn-primary").forEach((btn) => {
  btn.addEventListener("click", function () {
    gtag("event", "purchase", {
      currency: "BRL",
      value: 97.0,
      item_id: "pro-vitalicio",
      item_name: "Licença Vitalícia",
      page_location: window.location.href,
    });
  });
});

// Exemplo: clique em "Baixar Grátis" (generate_lead)
document.querySelectorAll("a.btn.btn-outline-primary").forEach((btn) => {
  btn.addEventListener("click", function () {
    gtag("event", "generate_lead", {
      item_id: "free",
      item_name: "Plano Gratuito",
      page_location: window.location.href,
    });
  });
});
```

> **Dica:** Você pode adaptar os seletores para os botões/plano desejados.

### b) Eventos recomendados pelo GA4

- `purchase`: para compras/conversões.
- `generate_lead`: para geração de leads (ex: download, cadastro, contato).
- `select_item`: para seleção de planos.
- `sign_up`: para cadastro.

Veja a lista completa: [GA4 Recommended Events](https://support.google.com/analytics/answer/9267735?hl=pt-BR)

---

## 3. Como visualizar eventos no GA4

1. No painel do GA4, vá em **Relatórios > Engajamento > Eventos**.
2. Os eventos personalizados aparecerão na lista conforme forem disparados.
3. Para testar em tempo real, acesse **Relatórios > Tempo real** e realize ações no seu site.

---

## 4. Dicas finais

- Sempre use o Measurement ID correto no HTML.
- Teste os eventos no modo "Tempo real" do GA4.
- Para eventos de formulário, use o evento `generate_lead` no submit.
- Documente os eventos implementados para facilitar análise futura.

---

**Referências:**

- [Documentação oficial GA4](https://support.google.com/analytics/answer/10089681?hl=pt-BR)
- [Eventos recomendados GA4](https://support.google.com/analytics/answer/9267735?hl=pt-BR)
