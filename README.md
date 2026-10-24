# Navalha & Cia — página de barbearia

Landing page de barbearia, mobile-first, em HTML + CSS + JavaScript puros (sem build, sem dependências).
Hospede em qualquer lugar (GitHub Pages, Netlify, Vercel) ou abra o `index.html` direto no navegador.

## Telas
| Abertura | Serviços | Agendamento |
|---|---|---|
| ![Abertura](prints/01-abertura.jpg) | ![Serviços](prints/02-servicos.jpg) | ![Agendamento](prints/03-agendamento.jpg) |

## O que tem
- Abertura com poste de barbeiro animado e título que entra por etapas; o conteúdo se afasta conforme o scroll.
- Serviços com preço e duração, equipe, tabela de horários com o dia de hoje destacado e selo "Aberto agora".
- **Agendamento:** o cliente escolhe serviço, barbeiro, data e horário. Os horários respeitam o expediente e a duração do serviço, e o botão abre o **WhatsApp** com a mensagem pronta. Não há backend: a confirmação é feita pela barbearia.
- Barra de progresso, revelação ao rolar, menu mobile e botão flutuante "Agendar".
- Acessibilidade: botões de 48 px, rótulos reais, foco visível e `prefers-reduced-motion` respeitado.

## Personalizar
Tudo está no objeto `CONFIG`, no topo do `script.js`: nome, WhatsApp (só dígitos, com DDI e DDD), endereço, serviços, barbeiros, horários e intervalo entre horários.
Para trocar cores, edite as variáveis no início do `style.css` (`--ouro`, `--bg`...).

## Decisões
- **Sem backend:** uma barbearia pequena já confirma pelo WhatsApp; um sistema de agenda próprio só vale a pena quando houver volume.
- **Sem depoimentos nem números inventados:** a página não afirma o que não pode comprovar. Adicione avaliações reais quando existirem.
- **Sem fotos de terceiros:** o mapa e o visual são SVG/CSS. Troque por fotos reais da barbearia quando tiver.

## Próximos passos
- Galeria com fotos reais dos trabalhos
- Agenda com horários ocupados (precisaria de backend; ver o projeto `cardapio-digital` como referência de Supabase + RLS)
- Avaliações reais e link do Instagram
