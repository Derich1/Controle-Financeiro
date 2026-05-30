import { useState, useEffect, useCallback } from "react";
import {
  PieChart, Pie, Cell,
  ResponsiveContainer,
} from "recharts";

// Em dev o Vite proxeia /api → localhost:8080 (veja vite.config.js).
// Em produção defina VITE_API_BASE no .env (ex: https://meu-backend.com/api/v1).
const API_BASE = import.meta.env.VITE_API_BASE ?? "/api/v1";

const MONTHS = [
  { value: "JANUARY",   label: "Janeiro",   short: "Jan" },
  { value: "FEBRUARY",  label: "Fevereiro", short: "Fev" },
  { value: "MARCH",     label: "Março",     short: "Mar" },
  { value: "APRIL",     label: "Abril",     short: "Abr" },
  { value: "MAY",       label: "Maio",      short: "Mai" },
  { value: "JUNE",      label: "Junho",     short: "Jun" },
  { value: "JULY",      label: "Julho",     short: "Jul" },
  { value: "AUGUST",    label: "Agosto",    short: "Ago" },
  { value: "SEPTEMBER", label: "Setembro",  short: "Set" },
  { value: "OCTOBER",   label: "Outubro",   short: "Out" },
  { value: "NOVEMBER",  label: "Novembro",  short: "Nov" },
  { value: "DECEMBER",  label: "Dezembro",  short: "Dez" },
];

const TIPOS = [
  "Alimentação", "Transporte", "Saúde", "Lazer",
  "Educação", "Moradia", "Vestuário", "Tecnologia", "Outros",
];

// Faturas: gera MM/YYYY para o ano atual e o próximo
const FATURAS = (() => {
  const year = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, i) => {
    const mm = String(i + 1).padStart(2, "0");
    return `${mm}/${year}`;
  });
})();

const COLORS = [
  "#4f46e5", "#0ea5e9", "#10b981", "#f59e0b",
  "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

// Formata valor em BRL
const fmt = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v ?? 0);

// Calcula percentual
const pct = (part, total) =>
  total > 0 ? ((part / total) * 100).toFixed(1) : "0.0";

// Converte "MM/YYYY" → "YYYY-MM-01" (LocalDate esperado pelo backend)
const faturaToISODate = (fatura) => {
  const [mm, yyyy] = fatura.split("/");
  return `${yyyy}-${mm}-01`;
};

const currentMonthValue = MONTHS[new Date().getMonth()].value;

// ─── API ─────────────────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

// ─── Design tokens / estilos inline ─────────────────────────────────────────

const S = {
  app: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    minHeight: "100vh",
    background: "#0f1117",
    color: "#e2e8f0",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: "#161b27",
    borderBottom: "1px solid #1e2a3a",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: "flex", alignItems: "center", gap: 10,
    fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px", color: "#fff",
  },
  logoIcon: {
    width: 30, height: 30,
    background: "linear-gradient(135deg,#4f46e5,#0ea5e9)",
    borderRadius: 8, display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 14,
  },
  nav: { display: "flex", gap: 4 },
  navBtn: (active) => ({
    padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 500,
    background: active ? "#1e2a3a" : "transparent",
    color: active ? "#60a5fa" : "#94a3b8",
    transition: "all .15s",
  }),
  btn: (variant = "primary") => ({
    primary: {
      background: "#4f46e5", color: "#fff", border: "none",
      borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600,
      cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
    },
    secondary: {
      background: "#1e2a3a", color: "#94a3b8",
      border: "1px solid #2d3748", borderRadius: 8, padding: "8px 16px",
      fontSize: 13, fontWeight: 500, cursor: "pointer",
    },
    danger: {
      background: "#7f1d1d", color: "#fca5a5", border: "none",
      borderRadius: 8, padding: "8px 16px", fontSize: 13,
      fontWeight: 500, cursor: "pointer",
    },
    ghost: {
      background: "transparent", color: "#94a3b8", border: "none",
      borderRadius: 8, padding: "8px 12px", fontSize: 13, cursor: "pointer",
    },
  }[variant]),
  main: { flex: 1, padding: "24px", maxWidth: 1200, margin: "0 auto", width: "100%" },
  card: {
    background: "#161b27", border: "1px solid #1e2a3a",
    borderRadius: 12, padding: "20px",
  },
  metricCard: (accent = "#4f46e5") => ({
    background: "#161b27", border: "1px solid #1e2a3a",
    borderRadius: 12, padding: "20px 20px 16px",
    borderTop: `3px solid ${accent}`,
  }),
  label: {
    fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "#64748b",
  },
  value: {
    fontSize: 26, fontWeight: 700,
    letterSpacing: "-0.5px", fontVariantNumeric: "tabular-nums",
  },
  sub: { fontSize: 12, color: "#64748b", marginTop: 4 },
  input: {
    background: "#0f1117", border: "1px solid #2d3748", borderRadius: 8,
    padding: "9px 12px", fontSize: 14, color: "#e2e8f0",
    width: "100%", outline: "none", boxSizing: "border-box",
  },
  select: {
    background: "#0f1117", border: "1px solid #2d3748", borderRadius: 8,
    padding: "9px 12px", fontSize: 14, color: "#e2e8f0",
    width: "100%", outline: "none", cursor: "pointer", boxSizing: "border-box",
  },
  modal: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 200, padding: 16,
  },
  modalBox: {
    background: "#161b27", border: "1px solid #1e2a3a",
    borderRadius: 16, width: "100%", maxWidth: 480, padding: 28,
  },
  tag: (color) => ({
    background: color + "20", color, borderRadius: 6,
    padding: "2px 8px", fontSize: 11, fontWeight: 600,
  }),
  progress: { background: "#1e2a3a", borderRadius: 99, height: 6, overflow: "hidden" },
  progressBar: (p, color) => ({
    height: "100%", width: `${Math.min(p, 100)}%`,
    background: color, borderRadius: 99, transition: "width .6s ease",
  }),
};

// ─── Subcomponents ────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, accent, icon }) {
  const valueColor =
    accent === "#ef4444" ? "#f87171" :
    accent === "#10b981" ? "#34d399" : "#fff";
  return (
    <div style={S.metricCard(accent)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={S.label}>{label}</span>
        <span style={{ fontSize: 18, opacity: 0.7 }}>{icon}</span>
      </div>
      <div style={{ ...S.value, color: valueColor }}>{value}</div>
      {sub && <div style={S.sub}>{sub}</div>}
    </div>
  );
}

function SpendingChart({ compras }) {
  const byTipo = compras.reduce((acc, c) => {
    acc[c.tipo] = (acc[c.tipo] || 0) + parseFloat(c.valor);
    return acc;
  }, {});
  const data = Object.entries(byTipo)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const total = data.reduce((s, d) => s + d.value, 0);

  if (!data.length)
    return (
      <div style={{ color: "#475569", fontSize: 14, textAlign: "center", padding: "40px 0" }}>
        Nenhuma compra registrada
      </div>
    );

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ width: 160, height: 160, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ flex: 1, minWidth: 180 }}>
        {data.slice(0, 6).map((d, i) => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 13 }}>{d.name}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>
              {pct(d.value, total)}%
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              {fmt(d.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PurchaseRow({ compra }) {
  const tipoColor = COLORS[TIPOS.indexOf(compra.tipo) % COLORS.length] || "#64748b";
  const date = compra.data
    ? new Date(compra.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    : "—";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #1a2234" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: tipoColor + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: tipoColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {compra.nomeProduto}
        </div>
        <div style={{ fontSize: 12, color: "#64748b" }}>{compra.descricao || compra.fatura}</div>
      </div>
      <span style={S.tag(tipoColor)}>{compra.tipo}</span>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#f87171", fontVariantNumeric: "tabular-nums" }}>
          -{fmt(compra.valor)}
        </div>
        <div style={{ fontSize: 11, color: "#64748b" }}>{date}</div>
      </div>
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ ...S.label, display: "block", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

// ─── Modal: Orçamento ─────────────────────────────────────────────────────────

function BudgetModal({ existing, selectedMonth, onClose, onSaved }) {
  const [form, setForm] = useState({
    mes: existing?.mes || selectedMonth,
    salario: existing?.salario ?? "",
    gastoRecorrente: existing?.gastoRecorrente ?? "",
    cartaoCredito: existing?.cartaoCredito ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.salario) return setErr("Informe o salário.");
    setSaving(true);
    setErr("");
    try {
      // OrcamentoRequestDTO: { mes, salario, gastoRecorrente, cartaoCredito }
      const body = {
        mes: form.mes,
        salario: parseFloat(form.salario),
        gastoRecorrente: parseFloat(form.gastoRecorrente) || 0,
        cartaoCredito: parseFloat(form.cartaoCredito) || 0,
      };
      let data;
      if (existing?.id) {
        // PUT /api/v1/orcamento/{id}
        data = await apiFetch(`/orcamento/${existing.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        // POST /api/v1/orcamento
        data = await apiFetch("/orcamento", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
      onSaved(data);
    } catch (e) {
      setErr("Erro ao salvar. Verifique se o backend está rodando em localhost:8080.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={S.modal} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>
          {existing ? "Editar Orçamento" : "Novo Orçamento"}
        </h2>

        <FieldRow label="Mês">
          <select style={S.select} value={form.mes} onChange={set("mes")}>
            {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </FieldRow>

        <FieldRow label="Salário (R$)">
          <input style={S.input} type="number" step="0.01" placeholder="Ex: 5000.00" value={form.salario} onChange={set("salario")} />
        </FieldRow>

        <FieldRow label="Gasto Recorrente (R$)">
          <input style={S.input} type="number" step="0.01" placeholder="Ex: 1200.00" value={form.gastoRecorrente} onChange={set("gastoRecorrente")} />
        </FieldRow>

        <FieldRow label="Cartão de Crédito – parcelas anteriores (R$)">
          <input style={S.input} type="number" step="0.01" placeholder="Ex: 300.00" value={form.cartaoCredito} onChange={set("cartaoCredito")} />
        </FieldRow>

        {err && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{err}</div>}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button style={S.btn("secondary")} onClick={onClose}>Cancelar</button>
          <button style={S.btn("primary")} onClick={save} disabled={saving}>
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Nova Compra ───────────────────────────────────────────────────────

function PurchaseModal({ orcamento, onClose, onSaved }) {
  const defaultFatura = FATURAS[new Date().getMonth()] ?? FATURAS[0];

  const [form, setForm] = useState({
    nomeProduto: "",
    valor: "",
    tipo: TIPOS[0],
    descricao: "",
    fatura: defaultFatura,
    quantidade: "1",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.nomeProduto || !form.valor) return setErr("Nome e valor são obrigatórios.");
    setSaving(true);
    setErr("");
    try {
      /*
       * Contrato: CompraDTO { orcamentoId, valor, nomeProduto, tipo, descricao, fatura (LocalDate) }
       *
       * Usamos POST /api/v1/compras (CompraController) porque
       * /orcamento/adicionarCompra está sem @RequestBody no backend.
       * Após salvar, o App re-fetcha o orçamento pelo mês para atualizar a UI.
       *
       * Nota: quantidade não está no CompraDTO mas é @NotNull na entidade Compra.
       * Adicione o campo ao record CompraDTO no backend para eliminar esse aviso.
       */
      const body = {
        orcamentoId: orcamento.id,
        valor: parseFloat(form.valor),
        nomeProduto: form.nomeProduto,
        tipo: form.tipo,
        descricao: form.descricao,
        // fatura: LocalDate no backend → ISO 8601: "YYYY-MM-DD"
        fatura: faturaToISODate(form.fatura),
        quantidade: parseInt(form.quantidade, 10) || 1,
      };
      await apiFetch("/compras", { method: "POST", body: JSON.stringify(body) });
      onSaved(); // sem argumento: App re-fetcha o orçamento inteiro
    } catch (e) {
      setErr("Erro ao salvar compra. Verifique se o servidor está rodando.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={S.modal} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>Adicionar Compra</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
          <div style={{ gridColumn: "span 2" }}>
            <FieldRow label="Nome do Produto">
              <input style={S.input} placeholder="Ex: Supermercado Extra" value={form.nomeProduto} onChange={set("nomeProduto")} />
            </FieldRow>
          </div>

          <FieldRow label="Valor (R$)">
            <input style={S.input} type="number" step="0.01" placeholder="0.00" value={form.valor} onChange={set("valor")} />
          </FieldRow>

          <FieldRow label="Quantidade">
            <input style={S.input} type="number" min="1" step="1" placeholder="1" value={form.quantidade} onChange={set("quantidade")} />
          </FieldRow>

          <FieldRow label="Tipo">
            <select style={S.select} value={form.tipo} onChange={set("tipo")}>
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </FieldRow>

          <FieldRow label="Fatura">
            <select style={S.select} value={form.fatura} onChange={set("fatura")}>
              {FATURAS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </FieldRow>

          <div style={{ gridColumn: "span 2" }}>
            <FieldRow label="Descrição (opcional)">
              <input style={S.input} placeholder="Detalhe adicional..." value={form.descricao} onChange={set("descricao")} />
            </FieldRow>
          </div>
        </div>

        {err && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{err}</div>}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button style={S.btn("secondary")} onClick={onClose}>Cancelar</button>
          <button style={S.btn("primary")} onClick={save} disabled={saving}>
            {saving ? "Salvando…" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ month, onCreateBudget }) {
  const monthLabel = MONTHS.find((m) => m.value === month)?.label || month;
  return (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>📊</div>
      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
        Sem orçamento para {monthLabel}
      </h2>
      <p style={{ color: "#64748b", marginBottom: 28, maxWidth: 360, margin: "0 auto 28px" }}>
        Crie um orçamento para começar a controlar suas finanças deste mês.
      </p>
      <button style={{ ...S.btn("primary"), margin: "0 auto" }} onClick={onCreateBudget}>
        <span>＋</span> Criar Orçamento
      </button>
    </div>
  );
}

// ─── App principal ────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedMonth, setSelectedMonth] = useState(currentMonthValue);
  const [orcamento, setOrcamento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("Todos");

  // Busca orçamento do mês selecionado
  const fetchOrcamento = useCallback(async (mes) => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await apiFetch(`/orcamento/mes/${mes}`);
      setOrcamento(data);
    } catch (e) {
      if (e.message.includes("404")) {
        setOrcamento(null); // mês sem orçamento → estado vazio
      } else {
        setApiError(
          "Não foi possível conectar ao backend. Certifique-se de que o Spring Boot está rodando em localhost:8080."
        );
        setOrcamento(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrcamento(selectedMonth);
  }, [selectedMonth, fetchOrcamento]);

  // Dados derivados
  const compras = orcamento?.compras ?? [];

  const filteredCompras = compras.filter((c) => {
    const matchSearch =
      !search ||
      c.nomeProduto?.toLowerCase().includes(search.toLowerCase()) ||
      c.tipo?.toLowerCase().includes(search.toLowerCase());
    const matchTipo = filterTipo === "Todos" || c.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  const totalGasto      = parseFloat(orcamento?.totalGasto      ?? 0);
  const saldo           = parseFloat(orcamento?.saldoDisponivel ?? 0);
  const salario         = parseFloat(orcamento?.salario         ?? 0);
  const gastoRecorrente = parseFloat(orcamento?.gastoRecorrente ?? 0);
  const cartaoCredito   = parseFloat(orcamento?.cartaoCredito   ?? 0);
  const gastoPercent    = salario > 0 ? (totalGasto / salario) * 100 : 0;

  const monthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label ?? selectedMonth;
  const tiposUsados = [...new Set(compras.map((c) => c.tipo))];

  return (
    <div style={S.app}>
      {/* ── Header ── */}
      <header style={S.header}>
        <div style={S.logo}>
          <div style={S.logoIcon}>💰</div>
          FinControl
        </div>

        <nav style={S.nav}>
          {[["dashboard", "Dashboard"], ["compras", "Compras"]].map(([id, label]) => (
            <button key={id} style={S.navBtn(activeTab === id)} onClick={() => setActiveTab(id)}>
              {label}
            </button>
          ))}
        </nav>

        <select
          style={{ ...S.select, width: "auto", fontSize: 13, padding: "6px 12px" }}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </header>

      {/* ── Main ── */}
      <main style={S.main}>
        {/* Banner de erro de conexão */}
        {apiError && (
          <div style={{ background: "#7f1d1d22", border: "1px solid #991b1b", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13, color: "#fca5a5" }}>{apiError}</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#64748b" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⟳</div>
            Carregando…
          </div>

        ) : !orcamento && activeTab === "dashboard" ? (
          <EmptyState month={selectedMonth} onCreateBudget={() => setShowBudgetModal(true)} />

        ) : activeTab === "dashboard" ? (
          <>
            {/* Título */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Orçamento — {monthLabel}</h1>
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>
                  {compras.length} transaç{compras.length === 1 ? "ão" : "ões"} registradas
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {orcamento && (
                  <button style={S.btn("secondary")} onClick={() => setShowBudgetModal(true)}>✏️ Editar</button>
                )}
                {orcamento && (
                  <button style={S.btn("primary")} onClick={() => setShowPurchaseModal(true)}>＋ Compra</button>
                )}
              </div>
            </div>

            {/* Cards de métricas */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
              <MetricCard label="Salário"           value={fmt(salario)}         sub="Renda mensal"           accent="#10b981" icon="💵" />
              <MetricCard label="Total Gasto"       value={fmt(totalGasto)}      sub={`${pct(totalGasto, salario)}% do salário`} accent="#ef4444" icon="🛒" />
              <MetricCard label="Saldo Disponível"  value={fmt(saldo)}           sub={saldo >= 0 ? "✓ No azul" : "⚠ No vermelho"} accent={saldo >= 0 ? "#10b981" : "#ef4444"} icon="💳" />
              <MetricCard label="Gasto Recorrente"  value={fmt(gastoRecorrente)} sub="Fixo mensal"             accent="#f59e0b" icon="🔁" />
              <MetricCard label="Cartão Crédito"    value={fmt(cartaoCredito)}   sub="Parcelas antigas"        accent="#8b5cf6" icon="💳" />
            </div>

            {/* Barra de progresso */}
            <div style={{ ...S.card, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={S.label}>Consumo do Salário</div>
                  <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>
                    {fmt(totalGasto)} de {fmt(salario)}
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: gastoPercent > 90 ? "#f87171" : gastoPercent > 70 ? "#fbbf24" : "#34d399" }}>
                  {gastoPercent.toFixed(1)}%
                </div>
              </div>
              <div style={S.progress}>
                <div style={S.progressBar(gastoPercent, gastoPercent > 90 ? "#ef4444" : gastoPercent > 70 ? "#f59e0b" : "#10b981")} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#475569" }}>
                <span>R$ 0</span>
                <span>Limite: {fmt(salario)}</span>
              </div>
            </div>

            {/* Gráfico + Resumo */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div style={S.card}>
                <div style={{ ...S.label, marginBottom: 16 }}>Gastos por Categoria</div>
                <SpendingChart compras={compras} />
              </div>
              <div style={S.card}>
                <div style={{ ...S.label, marginBottom: 16 }}>Resumo Financeiro</div>
                {[
                  { label: "Receita (Salário)",        value: salario,         color: "#10b981", sign: "+" },
                  { label: "Compras registradas",      value: -totalGasto,     color: "#ef4444", sign: "-" },
                  { label: "Gastos recorrentes",       value: -gastoRecorrente,color: "#f59e0b", sign: "-" },
                  { label: "Cartão (parcelas)",        value: -cartaoCredito,  color: "#8b5cf6", sign: "-" },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1a2234" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.color }} />
                      <span style={{ fontSize: 14, color: "#94a3b8" }}>{row.label}</span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 15, color: row.color, fontVariantNumeric: "tabular-nums" }}>
                      {row.sign}{fmt(Math.abs(row.value))}
                    </span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 0" }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Saldo Final</span>
                  <span style={{ fontWeight: 800, fontSize: 18, fontVariantNumeric: "tabular-nums", color: saldo >= 0 ? "#34d399" : "#f87171" }}>
                    {fmt(saldo)}
                  </span>
                </div>
              </div>
            </div>

            {/* Últimas compras */}
            {compras.length > 0 && (
              <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={S.label}>Últimas Compras</div>
                  <button style={S.btn("ghost")} onClick={() => setActiveTab("compras")}>Ver todas →</button>
                </div>
                {[...compras].reverse().slice(0, 5).map((c, i) => (
                  <PurchaseRow key={c.id ?? i} compra={c} />
                ))}
              </div>
            )}
          </>

        ) : (
          /* ── Tab Compras ── */
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Compras — {monthLabel}</h1>
              <div style={{ display: "flex", gap: 8 }}>
                {orcamento ? (
                  <button style={S.btn("primary")} onClick={() => setShowPurchaseModal(true)}>＋ Nova Compra</button>
                ) : (
                  <button style={S.btn("primary")} onClick={() => setShowBudgetModal(true)}>＋ Criar Orçamento</button>
                )}
              </div>
            </div>

            {orcamento ? (
              <>
                <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                  <input
                    style={{ ...S.input, width: 220 }}
                    placeholder="🔍 Buscar compra..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <select style={{ ...S.select, width: "auto" }} value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
                    <option>Todos</option>
                    {tiposUsados.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b" }}>
                    <span>{filteredCompras.length} item(s)</span>
                    <span style={{ color: "#f87171", fontWeight: 700 }}>
                      {fmt(filteredCompras.reduce((s, c) => s + parseFloat(c.valor), 0))}
                    </span>
                  </div>
                </div>

                <div style={S.card}>
                  {filteredCompras.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                      {search || filterTipo !== "Todos"
                        ? "Nenhuma compra encontrada para este filtro."
                        : "Nenhuma compra registrada ainda."}
                    </div>
                  ) : (
                    [...filteredCompras].reverse().map((c, i) => (
                      <PurchaseRow key={c.id ?? i} compra={c} />
                    ))
                  )}
                </div>
              </>
            ) : (
              <EmptyState month={selectedMonth} onCreateBudget={() => setShowBudgetModal(true)} />
            )}
          </>
        )}
      </main>

      {/* ── Modais ── */}
      {showBudgetModal && (
        <BudgetModal
          existing={orcamento}
          selectedMonth={selectedMonth}
          onClose={() => setShowBudgetModal(false)}
          onSaved={(data) => { setOrcamento(data); setShowBudgetModal(false); }}
        />
      )}
      {showPurchaseModal && orcamento && (
        <PurchaseModal
          orcamento={orcamento}
          onClose={() => setShowPurchaseModal(false)}
          // CompraController retorna CompraDTO, não OrcamentoResponseDTO.
          // Re-fetcha o orçamento para atualizar compras e saldos na tela.
          onSaved={() => { fetchOrcamento(selectedMonth); setShowPurchaseModal(false); }}
        />
      )}
    </div>
  );
}
