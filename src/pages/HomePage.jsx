import { useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
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

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function HomePage() {
  const user = useSelector((s) => s.auth.user);
  const moneda = user?.moneda ?? "$";
  const { list, filtros } = useSelector((s) => s.movimientos);
  const categorias = useSelector((s) => s.categorias.list);

  const mesMovs = list.filter((m) => {
    const d = new Date(m.fecha);
    return d.getMonth() + 1 === filtros.mes && d.getFullYear() === filtros.anio;
  });

  const totalMes = mesMovs.reduce((a, m) => a + m.monto, 0);
  const pagadosMes = mesMovs
    .filter((m) => m.estado === 1)
    .reduce((a, m) => a + m.monto, 0);
  const pctPagado =
    totalMes > 0 ? Math.round((pagadosMes / totalMes) * 100) : 0;

  const topCats = useMemo(() => {
    const map = {};
    mesMovs.forEach((m) => {
      const cat = categorias.find((c) => c.id === m.categoriaId);
      const key = m.categoriaId;
      if (!map[key]) map[key] = { cat, total: 0, count: 0 };
      map[key].total += m.monto;
      map[key].count += 1;
    });
    return Object.values(map)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [mesMovs, categorias]);

  const maxCat = topCats[0]?.total ?? 1;

  const semanas = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 4 }, (_, i) => {
      const start = new Date(now);
      start.setDate(now.getDate() - (3 - i) * 7 - 6);
      const end = new Date(now);
      end.setDate(now.getDate() - (3 - i) * 7);
      const s = start.toLocaleDateString("es", {
        day: "2-digit",
        month: "short",
      });
      const value = list
        .filter((m) => {
          const d = new Date(m.fecha);
          return d >= start && d <= end;
        })
        .reduce((a, m) => a + m.monto, 0);
      return { label: s, value };
    });
  }, [list]);
  const maxSem = Math.max(...semanas.map((s) => s.value), 1);

  const hora = new Date().getHours();
  const saludo =
    hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <PageShell>
      {/* Bienvenida */}
      <WelcomeCard>
        <WelcomeGlow />
        <WelcomeLeft>
          <Saludo>{saludo},</Saludo>
          <UserName>{user?.nombre} 👋</UserName>
          <WelcomeSub>
            {MESES[filtros.mes - 1]} {filtros.anio} · {mesMovs.length}{" "}
            movimientos registrados
          </WelcomeSub>
        </WelcomeLeft>
        <WelcomeRight>
          <BigMonto $color="#5b8dee">
            {moneda} {totalMes.toLocaleString()}
          </BigMonto>
          <BigLabel>Total del mes</BigLabel>
        </WelcomeRight>
      </WelcomeCard>

      <TwoCol>
        {/* Estado de pagos */}
        <SectionCard>
          <CardTitle>💳 Estado de pagos</CardTitle>
          <ProgressWrap>
            <ProgRow>
              <ProgLabel>Pagados</ProgLabel>
              <ProgVal $color="#43e97b">
                {moneda} {pagadosMes.toLocaleString()}
              </ProgVal>
            </ProgRow>
            <ProgressBar>
              <ProgressFill $pct={pctPagado} $color="#43e97b" />
            </ProgressBar>
            <ProgRow>
              <ProgLabel>Pendientes</ProgLabel>
              <ProgVal $color="#ffcb05">
                {moneda} {(totalMes - pagadosMes).toLocaleString()}
              </ProgVal>
            </ProgRow>
            <ProgressBar>
              <ProgressFill $pct={100 - pctPagado} $color="#ffcb05" />
            </ProgressBar>
            <PctBadge $color={pctPagado > 70 ? "#43e97b" : "#ffcb05"}>
              {pctPagado}% pagado
            </PctBadge>
          </ProgressWrap>
        </SectionCard>

        {/* Actividad semanal */}
        <SectionCard>
          <CardTitle>📅 Actividad semanal</CardTitle>
          <WeekBars>
            {semanas.map((s, i) => (
              <WeekCol key={i}>
                <WeekBar $pct={maxSem > 0 ? (s.value / maxSem) * 100 : 0} />
                <WeekLabel>{s.label}</WeekLabel>
                <WeekVal>
                  {moneda}{" "}
                  {s.value > 999
                    ? (s.value / 1000).toFixed(1) + "k"
                    : s.value.toLocaleString()}
                </WeekVal>
              </WeekCol>
            ))}
          </WeekBars>
        </SectionCard>
      </TwoCol>

      {/* Top categorías */}
      <SectionCard>
        <CardTitle>🏆 Top categorías del mes</CardTitle>
        {topCats.length > 0 ? (
          <CatList>
            {topCats.map(({ cat, total, count }, i) => (
              <CatRow key={i}>
                <CatRank>
                  {i === 0
                    ? "🥇"
                    : i === 1
                      ? "🥈"
                      : i === 2
                        ? "🥉"
                        : `#${i + 1}`}
                </CatRank>
                <CatIcon>{cat?.icono ?? "📦"}</CatIcon>
                <CatInfo>
                  <CatName>{cat?.nombre ?? "Sin categoría"}</CatName>
                  <CatSub>
                    {count} movimiento{count !== 1 ? "s" : ""}
                  </CatSub>
                </CatInfo>
                <CatBarWrap>
                  <CatBarFill
                    $pct={(total / maxCat) * 100}
                    $color={cat?.color ?? "#7b8db8"}
                  />
                </CatBarWrap>
                <CatTotal $color={cat?.color ?? "#7b8db8"}>
                  {moneda} {total.toLocaleString()}
                </CatTotal>
              </CatRow>
            ))}
          </CatList>
        ) : (
          <Empty>Sin movimientos este mes.</Empty>
        )}
      </SectionCard>

      {/* Resumen global — reutiliza StatGrid / StatItem */}
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

/* ── Styled locales ── */
const WelcomeCard = styled.div`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #13162a 0%, #181c38 60%, #1a1040 100%);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px;
`;
const WelcomeGlow = styled.div`
  position: absolute;
  top: -60px;
  right: -60px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(91, 141, 238, 0.18) 0%,
    transparent 70%
  );
  pointer-events: none;
`;
const WelcomeLeft = styled.div``;
const Saludo = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-bottom: 2px;
`;
const UserName = styled.h2`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  color: ${({ theme }) => theme.colors.text1};
`;
const WelcomeSub = styled.p`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-top: 4px;
`;
const WelcomeRight = styled.div`
  text-align: right;
`;
const BigMonto = styled.div`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  color: ${({ $color }) => $color};
`;
const BigLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const ProgressWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const ProgRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ProgLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text2};
`;
const ProgVal = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.85rem;
  color: ${({ $color }) => $color};
`;
const ProgressBar = styled.div`
  height: 8px;
  border-radius: 99px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;
const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  border-radius: 99px;
  transition: width 0.6s ease;
`;
const PctBadge = styled.div`
  align-self: flex-start;
  margin-top: 4px;
  padding: 3px 12px;
  border-radius: 99px;
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.75rem;
  background: ${({ $color }) => $color}18;
  border: 1px solid ${({ $color }) => $color}44;
  color: ${({ $color }) => $color};
`;
const WeekBars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 110px;
`;
const WeekCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
`;
const WeekBar = styled.div`
  width: 100%;
  flex: 1;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 6px 6px 0 0;
  overflow: hidden;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${({ $pct }) => $pct}%;
    background: linear-gradient(180deg, #5b8dee 0%, #3d5fb5 100%);
    border-radius: 6px 6px 0 0;
    transition: height 0.5s ease;
  }
`;
const WeekLabel = styled.span`
  font-size: 0.62rem;
  color: ${({ theme }) => theme.colors.text3};
  text-align: center;
`;
const WeekVal = styled.span`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.text2};
  font-weight: 600;
`;

const CatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const CatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const CatRank = styled.span`
  font-size: 0.8rem;
  min-width: 24px;
  text-align: center;
`;
const CatIcon = styled.span`
  font-size: 1.1rem;
`;
const CatInfo = styled.div`
  min-width: 90px;
`;
const CatName = styled.p`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 600;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text1};
`;
const CatSub = styled.p`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text3};
`;
const CatBarWrap = styled.div`
  flex: 1;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 99px;
  overflow: hidden;
`;
const CatBarFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  border-radius: 99px;
  transition: width 0.5s ease;
`;
const CatTotal = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.82rem;
  color: ${({ $color }) => $color};
  white-space: nowrap;
  min-width: 70px;
  text-align: right;
`;
const Empty = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text3};
  text-align: center;
  padding: 20px 0;
`;
