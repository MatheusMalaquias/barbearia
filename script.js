/* ===== Configuração da barbearia: edite aqui ===== */
const CONFIG = {
  nome: "Navalha & Cia",
  whatsapp: "5511999999999",              // DDI + DDD + número, só dígitos
  endereco: "Rua Exemplo, 123 — Centro, São Paulo, SP",
  intervalo: 30,                          // minutos entre horários
  almoco: ["12:00", "13:00"],             // pausa sem atendimento (ou null)
  diasVisiveis: 14,                       // quantos dias aparecem para agendar
  servicos: [
    { nome: "Corte", desc: "Tesoura ou máquina, finalizado com pomada.", preco: 45, min: 40 },
    { nome: "Barba", desc: "Toalha quente, navalha e hidratação.", preco: 35, min: 30 },
    { nome: "Corte + Barba", desc: "O combo completo, com desconto.", preco: 70, min: 70, destaque: "Mais pedido" },
    { nome: "Sobrancelha", desc: "Alinhamento na navalha.", preco: 15, min: 10 },
    { nome: "Pigmentação", desc: "Realce de barba ou cabelo.", preco: 60, min: 40 },
    { nome: "Hidratação", desc: "Tratamento capilar com massagem.", preco: 40, min: 30 },
  ],
  barbeiros: [
    { nome: "Rafael", especialidade: "Degradê e cortes clássicos" },
    { nome: "Diego", especialidade: "Barba e navalha" },
    { nome: "Lucas", especialidade: "Cortes modernos e pigmentação" },
  ],
  // 0 = domingo ... 6 = sábado. null = fechado
  horarios: {
    0: null,
    1: ["09:00", "19:00"], 2: ["09:00", "19:00"], 3: ["09:00", "19:00"],
    4: ["09:00", "20:00"], 5: ["09:00", "20:00"], 6: ["09:00", "17:00"],
  },
};

const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const $ = (s) => document.querySelector(s);
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
const minutos = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const hhmm = (min) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/* ===== Conteúdo ===== */
$("#listaServicos").innerHTML = CONFIG.servicos.map((s, i) => `
  <li class="servico rv" style="--d:${(i % 2) * 80}ms">
    ${s.destaque ? `<span class="tag">${s.destaque}</span>` : ""}
    <div><h3>${s.nome}</h3><p>${s.desc}</p></div>
    <div><span class="preco">${brl(s.preco)}</span><span class="tempo">${s.min} min</span></div>
  </li>`).join("");

$("#listaEquipe").innerHTML = CONFIG.barbeiros.map((b, i) => `
  <li class="barbeiro rv" style="--d:${i * 90}ms">
    <div class="avatar" aria-hidden="true">${b.nome[0]}</div>
    <h3>${b.nome}</h3><p>${b.especialidade}</p>
  </li>`).join("");

const hoje = new Date().getDay();
$("#tabelaHorarios").innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
  const h = CONFIG.horarios[d];
  return `<tr class="${d === hoje ? "hoje" : ""}"><td>${DIAS[d]}</td><td>${h ? `${h[0]} às ${h[1]}` : "Fechado"}</td></tr>`;
}).join("");

$("#endereco").textContent = CONFIG.endereco.split(",")[0];
$("#cidade").textContent = CONFIG.endereco.split(",").slice(1).join(",").trim();
$("#linkMapa").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.endereco)}`;
$("#linkZap").href = `https://wa.me/${CONFIG.whatsapp}`;
$("#ano").textContent = new Date().getFullYear();

/* aberto agora? */
(function status() {
  const agora = new Date(), h = CONFIG.horarios[agora.getDay()], el = $("#statusAberto");
  const min = agora.getHours() * 60 + agora.getMinutes();
  if (h && min >= minutos(h[0]) && min < minutos(h[1])) el.textContent = `Aberto agora · até ${h[1]}`;
  else { el.textContent = h ? `Fechado agora · hoje ${h[0]} às ${h[1]}` : "Fechado hoje"; el.parentElement.classList.add("fechado"); }
})();

/* ===== Movimento ligado ao scroll ===== */
const hero = $("#inicio"), topo = $("#topo"), flutuante = $("#zapFlutuante");
let ticking = false;
function aoRolar() {
  ticking = false;
  const vh = innerHeight, sy = scrollY;
  const p = reduzir ? 0 : Math.min(1, Math.max(0, sy / Math.max(1, hero.offsetHeight - vh)));
  hero.style.setProperty("--p", p.toFixed(3));
  document.documentElement.style.setProperty("--sp", (sy / Math.max(1, document.documentElement.scrollHeight - vh)).toFixed(3));
  topo.classList.toggle("solido", sy > 40);
  const aposHero = sy > hero.offsetHeight - vh;
  const noForm = $("#agendar").getBoundingClientRect().top < vh * 0.8 && $("#agendar").getBoundingClientRect().bottom > 0;
  flutuante.classList.toggle("visivel", aposHero && !noForm);
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(aoRolar); } }, { passive: true });
addEventListener("resize", aoRolar);
aoRolar();

const io = !("IntersectionObserver" in window) ? { observe: (n) => n.classList.add("in"), unobserve() {} } : new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".rv").forEach((n) => io.observe(n));
window.__animacaoOk = true;   // confirma ao HTML que as animações de entrada estão ativas

/* menu mobile */
const burger = $("#burger"), menu = $("#menu");
burger.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  burger.setAttribute("aria-expanded", aberto);
  burger.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
  menu.classList.remove("aberto"); burger.setAttribute("aria-expanded", false);
}));

/* Se algo falhar no formulário, o resto da página continua funcionando */
try {
/* ===== Formulário: dia e horários livres ===== */
const selServ = $("#servico"), selBarb = $("#barbeiro"), boxDias = $("#dias"), boxHoras = $("#horas");
selServ.innerHTML = CONFIG.servicos.map((s, i) => `<option value="${i}">${s.nome} — ${brl(s.preco)}</option>`).join("");
selBarb.innerHTML = `<option value="">Sem preferência</option>` + CONFIG.barbeiros.map((b) => `<option>${b.nome}</option>`).join("");

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const doISO = (t) => new Date(t + "T12:00:00");
const estado = { dia: "", hora: "" };
let agenda = { fixos: {}, reservas: [] };   // ocupações vindas de agenda.json

/* ocupações de um barbeiro em um dia: [{ini, fim}] em minutos */
function ocupacoes(dataISO, barbeiro) {
  const dow = doISO(dataISO).getDay();
  const lista = [...(agenda.fixos[dow] || []), ...agenda.reservas.filter((r) => r.data === dataISO)];
  return lista.filter((r) => r.barbeiro === barbeiro).map((r) => ({ ini: minutos(r.hora), fim: minutos(r.hora) + (r.min || CONFIG.intervalo) }));
}
const sobrepoe = (ini, fim, lista) => lista.some((o) => ini < o.fim && fim > o.ini);

/* horários do dia para o serviço e barbeiro escolhidos: [{hora, livre, motivo}] */
function horariosDoDia(dataISO) {
  const h = CONFIG.horarios[doISO(dataISO).getDay()];
  if (!h) return [];
  const dur = CONFIG.servicos[selServ.value].min;
  const agora = new Date(), ehHoje = iso(agora) === dataISO, minAgora = agora.getHours() * 60 + agora.getMinutes();
  const escolhido = selBarb.value;
  const equipe = escolhido ? [escolhido] : CONFIG.barbeiros.map((b) => b.nome);
  const out = [];
  for (let m = minutos(h[0]); m + dur <= minutos(h[1]); m += CONFIG.intervalo) {
    const fim = m + dur;
    if (CONFIG.almoco && sobrepoe(m, fim, [{ ini: minutos(CONFIG.almoco[0]), fim: minutos(CONFIG.almoco[1]) }])) continue;
    if (ehHoje && m <= minAgora + 15) continue;
    const livre = equipe.some((b) => !sobrepoe(m, fim, ocupacoes(dataISO, b)));
    out.push({ hora: hhmm(m), livre });
  }
  return out;
}

function desenharDias() {
  const base = new Date(), chips = [];
  for (let i = 0; i < CONFIG.diasVisiveis; i++) {
    const d = new Date(base); d.setDate(base.getDate() + i);
    const t = iso(d), aberto = !!CONFIG.horarios[d.getDay()];
    const rotulo = i === 0 ? "Hoje" : i === 1 ? "Amanhã" : DIAS[d.getDay()].slice(0, 3);
    const livres = aberto ? horariosDoDia(t).filter((x) => x.livre).length : 0;
    const desab = !aberto || livres === 0;
    chips.push({ t, desab, html: `
      <label class="chip dia ${desab ? "off" : ""}">
        <input type="radio" name="dia" value="${t}" ${desab ? "disabled" : ""}>
        <small>${rotulo}</small><strong>${d.getDate()}</strong><small>${d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</small>
        <em>${!aberto ? "Fechado" : livres === 0 ? "Lotado" : `${livres} livres`}</em>
      </label>` });
  }
  if (!estado.dia || chips.find((c) => c.t === estado.dia)?.desab) estado.dia = chips.find((c) => !c.desab)?.t || "";
  boxDias.innerHTML = chips.map((c) => c.html.replace(`value="${c.t}"`, `value="${c.t}"${c.t === estado.dia ? " checked" : ""}`)).join("");
}

function desenharHoras() {
  const lista = estado.dia ? horariosDoDia(estado.dia) : [];
  const livres = lista.filter((x) => x.livre);
  if (!livres.some((x) => x.hora === estado.hora)) estado.hora = "";
  const periodo = (h) => (minutos(h) < 12 * 60 ? "Manhã" : minutos(h) < 18 * 60 ? "Tarde" : "Noite");
  const grupos = {};
  lista.forEach((x) => (grupos[periodo(x.hora)] = grupos[periodo(x.hora)] || []).push(x));
  boxHoras.innerHTML = Object.entries(grupos).map(([nome, itens]) => `
    <p class="periodo">${nome}</p>
    <div class="horas">${itens.map((x) => `
      <label class="chip hora ${x.livre ? "" : "off"}">
        <input type="radio" name="hora" value="${x.hora}" ${x.livre ? "" : "disabled"} ${estado.hora === x.hora ? "checked" : ""}>
        <span>${x.hora}</span>
      </label>`).join("")}</div>`).join("") || `<p class="vazio">Sem horários neste dia.</p>`;
  $("#legendaHoras").textContent = !lista.length ? "" : livres.length
    ? `${livres.length} ${livres.length === 1 ? "horário livre" : "horários livres"}${selBarb.value ? ` com ${selBarb.value}` : ""}.${lista.length > livres.length ? " Os apagados já estão ocupados." : ""}`
    : "Nenhum horário livre neste dia. Tente outro dia ou outro barbeiro.";
  atualizarResumo();
}

function atualizarResumo() {
  const s = CONFIG.servicos[selServ.value];
  let t = `${s.nome} · ${s.min} min · ${brl(s.preco)}`;
  if (estado.dia && estado.hora) {
    const fim = hhmm(minutos(estado.hora) + s.min);
    const dia = doISO(estado.dia).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
    t += ` — ${dia}, ${estado.hora} às ${fim}`;
  }
  $("#resumo").textContent = t;
}

function atualizarTudo() { desenharDias(); desenharHoras(); }
selServ.addEventListener("change", atualizarTudo);
selBarb.addEventListener("change", atualizarTudo);
boxDias.addEventListener("change", (e) => { estado.dia = e.target.value; estado.hora = ""; desenharHoras(); });
boxHoras.addEventListener("change", (e) => { estado.hora = e.target.value; atualizarResumo(); });

fetch("agenda.json").then((r) => (r.ok ? r.json() : null)).catch(() => null).then((j) => {
  if (j) agenda = { fixos: j.fixos || {}, reservas: j.reservas || [] };
  atualizarTudo();
});
atualizarTudo();

$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const erro = $("#erro"); erro.hidden = true;
  const msg = (t) => { erro.textContent = t; erro.hidden = false; };
  const nome = $("#nome").value.trim();
  if (nome.length < 2) return msg("Informe seu nome.");
  if (!estado.dia) return msg("Não há dias com horário livre. Chame a barbearia no WhatsApp.");
  if (!estado.hora) return msg("Escolha um dos horários livres.");
  const s = CONFIG.servicos[selServ.value];
  const data = doISO(estado.dia).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
  const texto = [
    `Olá! Quero agendar na ${CONFIG.nome}:`,
    `• Nome: ${nome}`,
    `• Serviço: ${s.nome} (${brl(s.preco)})`,
    `• Barbeiro: ${selBarb.value || "sem preferência"}`,
    `• Quando: ${data}, às ${estado.hora}`,
  ].join("\n");
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
});

} catch (err) {
  console.error("Erro no agendamento:", err);
  const e = document.getElementById("erro");
  e.textContent = "Não foi possível carregar os horários. Chame a barbearia no WhatsApp.";
  e.hidden = false;
}
