import { useHomeStats } from "../hooks/useHomeStats";
import { WelcomeBanner } from "../components/organismos/WelcomeBanner";
import { PaymentStatus } from "../components/moleculas/PaymentStatus";
import { WeeklyActivity } from "../components/moleculas/WeeklyActivity";
import { TopCategorias } from "../components/organismos/TopCategorias";
import {
  PageShell,
  SectionCard,
  CardTitle,
  TwoCol,
  StatGrid,
  StatItem,
  StatIcon,
  StatVal,
  StatLab,
} from "../components/ui/shared";

export function HomePage() {
  const {
    user,
    moneda,
    filtros,
    list,
    categorias,
    mesMovs,
    totalMes,
    pagadosMes,
    pctPagado,
    topCats,
    maxCat,
    semanas,
    maxSem,
    saludo,
  } = useHomeStats();

  return (
    <PageShell>
      {/* ── Bienvenida ── */}
      <WelcomeBanner
        saludo={saludo}
        nombre={user?.nombre}
        mes={filtros.mes}
        anio={filtros.anio}
        cantMovs={mesMovs.length}
        totalMes={totalMes}
        moneda={moneda}
      />

      <TwoCol>
        {/* ── Estado de pagos ── */}
        <SectionCard>
          <CardTitle>💳 Estado de pagos</CardTitle>
          <PaymentStatus
            pagados={pagadosMes}
            pendientes={totalMes - pagadosMes}
            pctPagado={pctPagado}
            moneda={moneda}
          />
        </SectionCard>

        {/* ── Actividad semanal ── */}
        <SectionCard>
          <CardTitle>📅 Actividad semanal</CardTitle>
          <WeeklyActivity semanas={semanas} maxSem={maxSem} moneda={moneda} />
        </SectionCard>
      </TwoCol>

      {/* ── Top categorías del mes ── */}
      <SectionCard>
        <CardTitle>🏆 Top categorías del mes</CardTitle>
        <TopCategorias topCats={topCats} maxCat={maxCat} moneda={moneda} />
      </SectionCard>

      {/* ── Resumen global (toda la historia) ── */}
      <StatGrid>
        <StatItem $color="#5b8dee">
          <StatIcon>📊</StatIcon>
          <StatVal $size="1.5rem">{list.length}</StatVal>
          <StatLab>Movimientos totales</StatLab>
        </StatItem>
        <StatItem $color="#43e97b">
          <StatIcon>✅</StatIcon>
          <StatVal $size="1.5rem">
            {list.filter((m) => m.estado === 1).length}
          </StatVal>
          <StatLab>Pagados en total</StatLab>
        </StatItem>
        <StatItem $color="#ffcb05">
          <StatIcon>⏳</StatIcon>
          <StatVal $size="1.5rem">
            {list.filter((m) => m.estado === 0).length}
          </StatVal>
          <StatLab>Pendientes en total</StatLab>
        </StatItem>
        <StatItem $color="#a78bfa">
          <StatIcon>🗂️</StatIcon>
          <StatVal $size="1.5rem">{categorias.length}</StatVal>
          <StatLab>Categorías activas</StatLab>
        </StatItem>
      </StatGrid>
    </PageShell>
  );
}
