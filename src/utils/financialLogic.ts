import { PerfilFinanciero, TipoAgrupador } from '../types/financial';

export interface Totales {
  ingreso: number;
  total_NV: number;
  total_DM: number;
  total_DB: number;
  total_EV: number;
  total_IM: number;
  total_AI: number;
  total_gasto_ahorro: number;
  diferencia: number;
  valido: boolean;
}

export interface Ratios {
  p_NV: number;
  p_DM: number;
  p_DB: number;
  p_AI: number;
  p_EV: number;
  p_IM: number;
  cf: number;
  cf_dm: number;
  ra: number;
  nv_ratio: number;
  meses_fondo_emergencia: number;
  meses_objetivo: number;
  fondo_emergencia_objetivo: number;
  gap_fondo_emergencia: number;
}

const safeDiv = (num: number, den: number) => {
  if (!den || den === 0) {
    return 0;
  }
  return num / den;
};

export const calcularTotales = (perfil: PerfilFinanciero): Totales => {
  const ingreso = Number(perfil.ingreso.ingreso_total) || 0;

  const totals = perfil.gastos.lista_items.reduce(
    (acc, gasto) => {
      const monto = Number(gasto.monto_mensual) || 0;
      switch (gasto.tipo_agrupador) {
        case TipoAgrupador.NV:
          acc.total_NV += monto;
          break;
        case TipoAgrupador.DM:
          acc.total_DM += monto;
          break;
        case TipoAgrupador.DB:
          acc.total_DB += monto;
          break;
        case TipoAgrupador.EV:
          acc.total_EV += monto;
          break;
        case TipoAgrupador.IM:
          acc.total_IM += monto;
          break;
        case TipoAgrupador.AI:
          acc.total_AI += monto;
          break;
        default:
          break;
      }
      return acc;
    },
    {
      ingreso,
      total_NV: 0,
      total_DM: 0,
      total_DB: 0,
      total_EV: 0,
      total_IM: 0,
      total_AI: 0,
      total_gasto_ahorro: 0,
      diferencia: 0,
      valido: true
    }
  );

  perfil.deudas.lista_deudas.forEach((deuda) => {
    const monto = Number(deuda.cuota_mensual) || 0;
    if (deuda.tipo_agrupador === TipoAgrupador.DM) {
      totals.total_DM += monto;
    } else {
      totals.total_DB += monto;
    }
  });

  totals.total_AI += Number(perfil.ahorro.ahorro_mensual_total) || 0;

  totals.total_gasto_ahorro =
    totals.total_NV + totals.total_DM + totals.total_DB + totals.total_EV + totals.total_IM + totals.total_AI;
  totals.diferencia = ingreso - totals.total_gasto_ahorro;
  totals.valido = Math.abs(totals.diferencia) <= ingreso * 0.01;

  return totals;
};

export const calcularRatios = (perfil: PerfilFinanciero, totales: Totales): Ratios => {
  const ingreso = totales.ingreso;
  const p_NV = safeDiv(totales.total_NV, ingreso);
  const p_DM = safeDiv(totales.total_DM, ingreso);
  const p_DB = safeDiv(totales.total_DB, ingreso);
  const p_EV = safeDiv(totales.total_EV, ingreso);
  const p_IM = safeDiv(totales.total_IM, ingreso);
  const p_AI = safeDiv(totales.total_AI, ingreso);
  const cf = safeDiv(totales.total_DM + totales.total_DB, ingreso);
  const cf_dm = safeDiv(totales.total_DM, ingreso);
  const ra = p_AI;
  const nv_ratio = p_NV;
  const meses_objetivo = perfil.usuario.ninos > 0 ? 6 : 3;
  const meses_fondo_emergencia = safeDiv(perfil.ahorro.fondo_emergencia_actual, totales.total_NV);
  const fondo_emergencia_objetivo = totales.total_NV * meses_objetivo;
  const gap_fondo_emergencia = Math.max(0, fondo_emergencia_objetivo - perfil.ahorro.fondo_emergencia_actual);

  return {
    p_NV,
    p_DM,
    p_DB,
    p_AI,
    p_EV,
    p_IM,
    cf,
    cf_dm,
    ra,
    nv_ratio,
    meses_fondo_emergencia,
    meses_objetivo,
    fondo_emergencia_objetivo,
    gap_fondo_emergencia
  };
};

export const calcularSubnotas = (ratios: Ratios): {
  sub_ahorro: number;
  sub_deuda: number;
  sub_necesidades: number;
  sub_estilo: number;
  sub_fondo: number;
} => {
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const { ra, cf_dm, nv_ratio, p_EV, meses_fondo_emergencia, meses_objetivo } = ratios;

  const sub_ahorro =
    ra <= 0 ? 0 : ra >= 0.3 ? 30 : clamp((ra / 0.3) * 30, 0, 30);

  let sub_deuda = 0;
  if (cf_dm >= 0.3) sub_deuda = 0;
  else if (cf_dm <= 0.1) sub_deuda = 30;
  else sub_deuda = clamp(((0.3 - cf_dm) / 0.2) * 30, 0, 30);

  const distancia = Math.abs(nv_ratio - 0.5);
  const sub_necesidades = distancia >= 0.5 ? 0 : clamp(((0.5 - distancia) / 0.5) * 20, 0, 20);

  let sub_estilo = 0;
  if (p_EV <= 0.1) sub_estilo = 10;
  else if (p_EV >= 0.4) sub_estilo = 0;
  else sub_estilo = clamp(((0.4 - p_EV) / 0.3) * 10, 0, 10);

  let sub_fondo = 0;
  if (meses_fondo_emergencia >= meses_objetivo) sub_fondo = 10;
  else if (meses_fondo_emergencia <= 0) sub_fondo = 0;
  else sub_fondo = clamp((meses_fondo_emergencia / meses_objetivo) * 10, 0, 10);

  return { sub_ahorro, sub_deuda, sub_necesidades, sub_estilo, sub_fondo };
};

export const generarAlertas = (
  perfil: PerfilFinanciero,
  totales: Totales,
  ratios: Ratios
): string[] => {
  const alertas: string[] = [];
  const ingreso = totales.ingreso;

  if (totales.total_gasto_ahorro > ingreso) {
    alertas.push(`Estás gastando más de lo que ganas. Déficit mensual: ${(totales.total_gasto_ahorro - ingreso).toFixed(0)}.`);
  }

  if (ratios.cf_dm > 0.2) {
    alertas.push(
      `Tu deuda de consumo es ${(ratios.cf_dm * 100).toFixed(1)} % del ingreso, sobre el máximo recomendado de 20 %.`
    );
  }

  if (ratios.ra < 0.1 && totales.total_gasto_ahorro <= ingreso) {
    alertas.push(
      `Tu ahorro mensual es ${(ratios.ra * 100).toFixed(1)} %, bajo el mínimo recomendado de 10 %.`
    );
  }

  if (ratios.meses_fondo_emergencia < ratios.meses_objetivo) {
    alertas.push(
      `Tu fondo de emergencia cubre ${ratios.meses_fondo_emergencia.toFixed(1)} meses. Se recomienda cubrir ${ratios.meses_objetivo} meses.`
    );
  }

  if (ratios.p_EV > 0.3) {
    alertas.push(
      `Tus gastos en estilo de vida son ${(ratios.p_EV * 100).toFixed(1)} % del ingreso. Esto limita tu capacidad de ahorro.`
    );
  }

  if (ratios.cf > 0.35) {
    alertas.push(
      `Tus cuotas de deuda total representan ${(ratios.cf * 100).toFixed(1)} % de tu ingreso. Es un nivel de riesgo elevado.`
    );
  }

  return alertas;
};

export const generarRecomendaciones = (
  perfil: PerfilFinanciero,
  totales: Totales,
  ratios: Ratios
): string[] => {
  const recomendaciones: string[] = [];
  const ingreso = totales.ingreso || 1;

  const ra_objetivo = 0.2;
  const ahorro_objetivo = ingreso * ra_objetivo;
  const delta_ahorro = ahorro_objetivo - totales.total_AI;
  if (delta_ahorro > 0) {
    const monto_deseos_ajustado = Math.max(totales.total_EV - delta_ahorro, 0);
    recomendaciones.push(
      `Para que tu ahorro mensual alcance el 20 % de tu ingreso, deberías ahorrar ${ahorro_objetivo.toFixed(
        0
      )}. Hoy ahorras ${totales.total_AI.toFixed(0)}. Si reduces tus gastos de estilo de vida desde ${totales.total_EV.toFixed(
        0
      )} a ${monto_deseos_ajustado.toFixed(0)}, podrías lograrlo.`
    );
  }

  const cf_dm_objetivo = 0.2;
  const cuota_DM_objetivo = ingreso * cf_dm_objetivo;
  const exceso_cuota_DM = totales.total_DM - cuota_DM_objetivo;
  if (exceso_cuota_DM > 0) {
    recomendaciones.push(
      `Tus cuotas mensuales de deuda de consumo son ${totales.total_DM.toFixed(
        0
      )}, equivalentes a ${(ratios.cf_dm * 100).toFixed(
        1
      )} % de tu ingreso. Para llevarlas al 20 %, reduce esa cuota en ${exceso_cuota_DM.toFixed(0)}.`
    );
  }

  if (ratios.gap_fondo_emergencia > 0) {
    const aporte_mensual_sugerido = ratios.gap_fondo_emergencia / 12;
    const meses_estimados = ratios.gap_fondo_emergencia / (aporte_mensual_sugerido || 1);
    recomendaciones.push(
      `Para alcanzar un fondo de emergencia de ${ratios.meses_objetivo} meses necesitas ${ratios.fondo_emergencia_objetivo.toFixed(
        0
      )}. Hoy tienes ${perfil.ahorro.fondo_emergencia_actual.toFixed(0)} y te faltan ${ratios.gap_fondo_emergencia.toFixed(
        0
      )}. Si ahorras ${aporte_mensual_sugerido.toFixed(0)} al mes, lo lograrías en aproximadamente ${meses_estimados.toFixed(
        0
      )} meses.`
    );
  }

  if (totales.total_gasto_ahorro > ingreso) {
    recomendaciones.push(
      `Reduce tus gastos en ${Math.abs(totales.diferencia).toFixed(0)} para equilibrar tu presupuesto mensual antes de avanzar en nuevas metas.`
    );
  }

  if (ratios.p_EV > 0.3) {
    const estilo_meta = ingreso * 0.25;
    const recorte = Math.max(0, totales.total_EV - estilo_meta);
    if (recorte > 0) {
      recomendaciones.push(
        `Destina máximo 25 % de tu ingreso a estilo de vida (${estilo_meta.toFixed(
          0
        )}). Reducir ${recorte.toFixed(0)} en entretenimiento liberará espacio para tus metas.`
      );
    }
  }

  if (recomendaciones.length < 3) {
    recomendaciones.push(
      `Mantén tus necesidades vitales bajo el 50 % del ingreso. Hoy representan ${(ratios.p_NV * 100).toFixed(
        1
      )} %. Ajustarlas en ${Math.max(0, totales.total_NV - ingreso * 0.5).toFixed(0)} te dará más flexibilidad.`
    );
  }

  if (recomendaciones.length < 3) {
    recomendaciones.push(
      `Reserva al menos ${(ingreso * 0.05).toFixed(0)} al mes para imprevistos. Actualmente destinas ${totales.total_IM.toFixed(
        0
      )}.`
    );
  }

  if (recomendaciones.length < 3) {
    recomendaciones.push(
      `Evalúa prepagar deuda buena agregando ${(totales.total_DB * 0.1).toFixed(
        0
      )} extra a tus cuotas para reducir intereses.`
    );
  }

  return recomendaciones.slice(0, 5);
};

export interface DiagnosticoResultado {
  totales: Totales;
  ratios?: Ratios;
  diagnostico: PerfilFinanciero['diagnostico'];
  error?: string;
}

export const construirDiagnostico = (perfil: PerfilFinanciero): DiagnosticoResultado => {
  const totales = calcularTotales(perfil);
  if (totales.ingreso <= 0) {
    return { totales, diagnostico: perfil.diagnostico, error: 'Debes ingresar un ingreso mensual válido.' };
  }
  if (!totales.valido) {
    const mensaje =
      totales.diferencia > 0
        ? `Te falta asignar ${totales.diferencia.toFixed(0)} para llegar al 100 % del ingreso.`
        : `Estás excediendo tu ingreso en ${Math.abs(totales.diferencia).toFixed(0)}.`;
    return { totales, diagnostico: perfil.diagnostico, error: mensaje };
  }

  const ratios = calcularRatios(perfil, totales);
  const subnotas = calcularSubnotas(ratios);
  const nota_global = Math.round(
    subnotas.sub_ahorro + subnotas.sub_deuda + subnotas.sub_necesidades + subnotas.sub_estilo + subnotas.sub_fondo
  );
  const alertas = generarAlertas(perfil, totales, ratios);
  const recomendaciones = generarRecomendaciones(perfil, totales, ratios);

  return {
    totales,
    ratios,
    diagnostico: {
      nota_global,
      subnotas,
      ratios: {
        p_NV: ratios.p_NV,
        p_DM: ratios.p_DM,
        p_DB: ratios.p_DB,
        p_AI: ratios.p_AI,
        p_EV: ratios.p_EV,
        p_IM: ratios.p_IM,
        cf: ratios.cf,
        cf_dm: ratios.cf_dm,
        ra: ratios.ra,
        nv_ratio: ratios.nv_ratio,
        meses_fondo_emergencia: ratios.meses_fondo_emergencia
      },
      alertas,
      recomendaciones
    }
  };
};
