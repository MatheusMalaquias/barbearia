/* ===== Configuração da barbearia: edite aqui ===== */
const CONFIG = {
  nome: "Navalha & Cia",
  whatsapp: "5511999999999",              // DDI + DDD + número, só dígitos
  endereco: "Rua Exemplo, 123 — Centro, São Paulo, SP",
  intervalo: 30,                          // minutos entre horários
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

/* ===== Formulário ===== */
const selServ = $("#servico"), selBarb = $("#barbeiro"), selHora = $("#hora"), inData = $("#data");
selServ.innerHTML = CONFIG.servicos.map((s, i) => `<option value="${i}">${s.nome} — ${brl(s.preco)}</option>`).join("");
selBarb.innerHTML = `<option value="">Sem preferência</option>` + CONFIG.barbeiros.map((b) => `<option>${b.nome}</option>`).join("");

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
inData.min = iso(new Date());
const primeiroDiaAberto = () => { const d = new Date(); while (!CONFIG.horarios[d.getDay()]) d.setDate(d.getDate() + 1); return d; };
inData.value = iso(primeiroDiaAberto());

function montarHorarios() {
  const d = new Date(inData.value + "T12:00:00");
  const h = CONFIG.horarios[d.getDay()];
  const duracao = CONFIG.servicos[selServ.value].min;
  if (!h) { selHora.innerHTML = `<option value="">Fechado neste dia</option>`; return; }
  const agora = new Date(), ehHoje = iso(agora) === inData.value, minAgora = agora.getHours() * 60 + agora.getMinutes();
  const opts = [];
  for (let m = minutos(h[0]); m + duracao <= minutos(h[1]); m += CONFIG.intervalo) {
    if (ehHoje && m <= minAgora + 15) continue;
    opts.push(`<option>${hhmm(m)}</option>`);
  }
  selHora.innerHTML = opts.length ? opts.join("") : `<option value="">Sem horários neste dia</option>`;
}

function atualizarResumo() {
  const s = CONFIG.servicos[selServ.value];
  $("#resumo").textContent = `${s.nome} · ${s.min} min · ${brl(s.preco)}`;
}
[selServ].forEach((e) => e.addEventListener("change", () => { montarHorarios(); atualizarResumo(); }));
inData.addEventListener("change", montarHorarios);
montarHorarios(); atualizarResumo();

$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const erro = $("#erro"); erro.hidden = true;
  const nome = $("#nome").value.trim();
  const msg = (t) => { erro.textContent = t; erro.hidden = false; };
  if (nome.length < 2) return msg("Informe seu nome.");
  if (!inData.value || !selHora.value) return msg("Escolha uma data e um horário disponíveis.");
  const s = CONFIG.servicos[selServ.value];
  const data = new Date(inData.value + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
  const texto = [
    `Olá! Quero agendar na ${CONFIG.nome}:`,
    `• Nome: ${nome}`,
    `• Serviço: ${s.nome} (${brl(s.preco)})`,
    `• Barbeiro: ${selBarb.value || "sem preferência"}`,
    `• Quando: ${data}, às ${selHora.value}`,
  ].join("\n");
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
});

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

const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".rv").forEach((n) => io.observe(n));

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
