import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { CategoriaGasto, Deuda, Gasto, HorizonteDetalle, PerfilFinanciero, TipoAgrupador, TipoDeuda, TipoVivienda } from '../types/financial';

const buildDefaultGasto = (id: string, nombre: string, categoria: CategoriaGasto, tipo: TipoAgrupador, fijo = true): Gasto => ({
  id,
  nombre,
  monto_mensual: 0,
  categoria_principal: categoria,
  tipo_agrupador: tipo,
  fijo
});

const buildDefaultHorizonte = (): HorizonteDetalle => ({
  monto_mensual: 0,
  instrumentos_mensuales: [],
  stock_actual: 0,
  instrumentos_stock: []
});

const defaultProfile: PerfilFinanciero = {
  usuario: {
    nombre: '',
    edad: 1,
    adultos: 1,
    ninos: 1,
    tipo_vivienda: TipoVivienda.ARRENDADA // TODO: utilizar para personalizar insights de vivienda en próximas iteraciones
  },
  ingreso: {
    sueldo_neto: 0,
    bonos_mensualizados: 0,
    otros_ingresos: [],
    ingreso_total: 0
  },
  gastos: {
    lista_items: [
      buildDefaultGasto('arriendo', 'Arriendo mensual', CategoriaGasto.VIVIENDA, TipoAgrupador.NV),
      buildDefaultGasto('dividendo', 'Dividendo hipotecario', CategoriaGasto.VIVIENDA, TipoAgrupador.DB),
      buildDefaultGasto('gastos_comunes', 'Gastos comunes', CategoriaGasto.VIVIENDA, TipoAgrupador.NV),
      buildDefaultGasto('contribuciones', 'Contribuciones prorrateadas', CategoriaGasto.VIVIENDA, TipoAgrupador.NV),
      buildDefaultGasto('seguro_hogar', 'Seguro hogar', CategoriaGasto.VIVIENDA, TipoAgrupador.NV),
      buildDefaultGasto('luz', 'Luz', CategoriaGasto.SERVICIOS_BASICOS, TipoAgrupador.NV),
      buildDefaultGasto('agua', 'Agua', CategoriaGasto.SERVICIOS_BASICOS, TipoAgrupador.NV),
      buildDefaultGasto('gas', 'Gas', CategoriaGasto.SERVICIOS_BASICOS, TipoAgrupador.NV),
      buildDefaultGasto('internet', 'Internet hogar', CategoriaGasto.SERVICIOS_BASICOS, TipoAgrupador.NV),
      buildDefaultGasto('celular', 'Celular plan', CategoriaGasto.SERVICIOS_BASICOS, TipoAgrupador.NV),
      buildDefaultGasto('tv_cable', 'TV cable', CategoriaGasto.SERVICIOS_BASICOS, TipoAgrupador.NV),
      buildDefaultGasto('salud_complementaria', 'Plan de salud complementario', CategoriaGasto.SALUD, TipoAgrupador.NV),
      buildDefaultGasto('seguro_escolar', 'Seguro escolar', CategoriaGasto.SALUD, TipoAgrupador.NV),
      buildDefaultGasto('medicamentos', 'Medicamentos crónicos', CategoriaGasto.SALUD, TipoAgrupador.NV),
      buildDefaultGasto('credito_auto', 'Crédito auto', CategoriaGasto.TRANSPORTE, TipoAgrupador.DM),
      buildDefaultGasto('seguro_auto', 'Seguro auto', CategoriaGasto.TRANSPORTE, TipoAgrupador.NV),
      buildDefaultGasto('bencina', 'Bencina / combustible mensual', CategoriaGasto.TRANSPORTE, TipoAgrupador.NV),
      buildDefaultGasto('tag', 'TAG / peajes', CategoriaGasto.TRANSPORTE, TipoAgrupador.NV),
      buildDefaultGasto('colegios', 'Colegios', CategoriaGasto.EDUCACION, TipoAgrupador.NV),
      buildDefaultGasto('preuniversitario', 'Preuniversitarios', CategoriaGasto.EDUCACION, TipoAgrupador.NV),
      buildDefaultGasto('matriculas', 'Matrículas prorrateadas', CategoriaGasto.EDUCACION, TipoAgrupador.NV),
      buildDefaultGasto('otros_educacion', 'Otros gastos educacionales', CategoriaGasto.EDUCACION, TipoAgrupador.NV),
      buildDefaultGasto('supermercado', 'Supermercado', CategoriaGasto.ALIMENTACION, TipoAgrupador.NV, false),
      buildDefaultGasto('verduleria', 'Verdulería', CategoriaGasto.ALIMENTACION, TipoAgrupador.NV, false),
      buildDefaultGasto('carnes', 'Carnes', CategoriaGasto.ALIMENTACION, TipoAgrupador.NV, false),
      buildDefaultGasto('delivery', 'Delivery comida', CategoriaGasto.DIVERSION, TipoAgrupador.EV, false),
      buildDefaultGasto('transporte_publico', 'Transporte público', CategoriaGasto.TRANSPORTE, TipoAgrupador.NV, false),
      buildDefaultGasto('uber', 'Uber/Taxi', CategoriaGasto.TRANSPORTE, TipoAgrupador.NV, false),
      buildDefaultGasto('aseo', 'Aseo hogar', CategoriaGasto.OTROS, TipoAgrupador.NV, false),
      buildDefaultGasto('mantencion', 'Mantención hogar', CategoriaGasto.OTROS, TipoAgrupador.IM, false),
      buildDefaultGasto('reparaciones', 'Reparaciones', CategoriaGasto.OTROS, TipoAgrupador.IM, false),
      buildDefaultGasto('restaurantes', 'Restaurantes', CategoriaGasto.DIVERSION, TipoAgrupador.EV, false),
      buildDefaultGasto('cine', 'Cine / panoramas', CategoriaGasto.DIVERSION, TipoAgrupador.EV, false),
      buildDefaultGasto('streaming', 'Streaming hogar', CategoriaGasto.DIVERSION, TipoAgrupador.EV, false),
      buildDefaultGasto('gimnasio', 'Gimnasio', CategoriaGasto.DIVERSION, TipoAgrupador.EV, false),
      buildDefaultGasto('viajes', 'Viajes', CategoriaGasto.DIVERSION, TipoAgrupador.EV, false),
      buildDefaultGasto('mesada', 'Mesada', CategoriaGasto.DIVERSION, TipoAgrupador.EV, false),
      buildDefaultGasto('actividades_hijos', 'Actividades hijos', CategoriaGasto.HIJOS, TipoAgrupador.NV, false),
      buildDefaultGasto('ropa_hijos', 'Ropa hijos', CategoriaGasto.HIJOS, TipoAgrupador.NV, false),
      buildDefaultGasto('alimento_mascotas', 'Alimento mascotas', CategoriaGasto.MASCOTAS, TipoAgrupador.NV, false),
      buildDefaultGasto('veterinario', 'Veterinario', CategoriaGasto.MASCOTAS, TipoAgrupador.IM, false),
      buildDefaultGasto('aseo_mascotas', 'Aseo / grooming', CategoriaGasto.MASCOTAS, TipoAgrupador.IM, false),
      buildDefaultGasto('paseo_mascotas', 'Paseo mascotas', CategoriaGasto.MASCOTAS, TipoAgrupador.EV, false)
    ]
  },
  deudas: {
    lista_deudas: [
      {
        id: 'consumo_1',
        nombre: 'Crédito de consumo',
        cuota_mensual: 0,
        tipo_deuda: TipoDeuda.CONSUMO,
        tipo_agrupador: TipoAgrupador.DM
      },
      {
        id: 'tarjeta',
        nombre: 'Tarjeta de crédito',
        cuota_mensual: 0,
        tipo_deuda: TipoDeuda.CONSUMO,
        tipo_agrupador: TipoAgrupador.DM
      },
      {
        id: 'auto',
        nombre: 'Cuota auto',
        cuota_mensual: 0,
        tipo_deuda: TipoDeuda.AUTO,
        tipo_agrupador: TipoAgrupador.DM
      },
      {
        id: 'hipoteca',
        nombre: 'Dividendo hipotecario',
        cuota_mensual: 0,
        tipo_deuda: TipoDeuda.HIPOTECA,
        tipo_agrupador: TipoAgrupador.DB
      },
      {
        id: 'educativa',
        nombre: 'Crédito educativo',
        cuota_mensual: 0,
        tipo_deuda: TipoDeuda.EDUCATIVA,
        tipo_agrupador: TipoAgrupador.DB
      }
    ]
  },
  ahorro: {
    horizontes: {
      corto: buildDefaultHorizonte(),
      mediano: buildDefaultHorizonte(),
      largo: buildDefaultHorizonte()
    },
    ahorro_mensual_total: 0,
    fondo_emergencia_actual: 0,
    inversiones_largo_plazo_actuales: 0
  },
  diagnostico: {
    nota_global: 0,
    subnotas: {
      sub_ahorro: 0,
      sub_deuda: 0,
      sub_necesidades: 0,
      sub_estilo: 0,
      sub_fondo: 0
    },
    insights: [],
    ratios: {
      p_NV: 0,
      p_DM: 0,
      p_DB: 0,
      p_AI: 0,
      p_EV: 0,
      p_IM: 0,
      cf: 0,
      cf_dm: 0,
      ra: 0,
      nv_ratio: 0,
      meses_fondo_emergencia: 0,
      meses_objetivo: 0,
      gap_fondo_emergencia: 0
    },
    alertas: [],
    recomendaciones: []
  }
};

const recalcIngreso = (ingreso: PerfilFinanciero['ingreso']) => {
  const otros = ingreso.otros_ingresos.reduce((acc, item) => acc + Number(item.monto || 0), 0);
  return {
    ...ingreso,
    ingreso_total: Math.max(0, Number(ingreso.sueldo_neto) + Number(ingreso.bonos_mensualizados) + otros)
  };
};

const clampInstrumentos = (instrumentos: HorizonteDetalle['instrumentos_mensuales'], limite: number) => {
  const total = instrumentos.reduce((acc, item) => acc + Number(item.monto || 0), 0);
  if (total <= limite || limite === 0) {
    return instrumentos.map((inst) => ({ ...inst, monto: Math.max(0, inst.monto) }));
  }
  const factor = limite / (total || 1);
  return instrumentos.map((inst) => ({ ...inst, monto: Math.max(0, inst.monto) * factor }));
};

const normalizeHorizonte = (detalle: HorizonteDetalle): HorizonteDetalle => {
  const monto_mensual = Math.max(0, Number(detalle.monto_mensual) || 0);
  const stock_actual = Math.max(0, Number(detalle.stock_actual) || 0);
  return {
    ...detalle,
    monto_mensual,
    stock_actual,
    instrumentos_mensuales: clampInstrumentos(detalle.instrumentos_mensuales, monto_mensual),
    instrumentos_stock: clampInstrumentos(detalle.instrumentos_stock, stock_actual)
  };
};

const recalcAhorro = (ahorro: PerfilFinanciero['ahorro']) => {
  const horizontesNormalizados = {
    corto: normalizeHorizonte(ahorro.horizontes.corto),
    mediano: normalizeHorizonte(ahorro.horizontes.mediano),
    largo: normalizeHorizonte(ahorro.horizontes.largo)
  };
  const ahorro_mensual_total = (Object.values(horizontesNormalizados) as HorizonteDetalle[]).reduce(
    (acc, horizonte) => acc + Number(horizonte.monto_mensual || 0),
    0
  );
  const fondo_emergencia_actual = horizontesNormalizados.corto.stock_actual;
  const inversiones_largo_plazo_actuales = horizontesNormalizados.largo.stock_actual;
  return {
    ...ahorro,
    horizontes: horizontesNormalizados,
    ahorro_mensual_total,
    fondo_emergencia_actual,
    inversiones_largo_plazo_actuales
  };
};

interface FinancialContextValue {
  perfil: PerfilFinanciero;
  setPerfil: React.Dispatch<React.SetStateAction<PerfilFinanciero>>;
  updateIngreso: (updates: Partial<PerfilFinanciero['ingreso']>) => void;
  updateAhorro: (updates: Partial<PerfilFinanciero['ahorro']>) => void;
  upsertGasto: (gasto: Gasto) => void;
  removeGasto: (id: string) => void;
  upsertDeuda: (deuda: Deuda) => void;
  removeDeuda: (id: string) => void;
}

const FinancialContext = createContext<FinancialContextValue | undefined>(undefined);

export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  const [perfil, setPerfil] = useState<PerfilFinanciero>(defaultProfile);

  const value = useMemo<FinancialContextValue>(() => ({
    perfil,
    setPerfil,
    updateIngreso: (updates) => {
      setPerfil((prev) => ({ ...prev, ingreso: recalcIngreso({ ...prev.ingreso, ...updates }) }));
    },
    updateAhorro: (updates) => {
      setPerfil((prev) => ({ ...prev, ahorro: recalcAhorro({ ...prev.ahorro, ...updates }) }));
    },
    upsertGasto: (gasto) => {
      setPerfil((prev) => {
        const exists = prev.gastos.lista_items.some((g) => g.id === gasto.id);
        const lista = exists
          ? prev.gastos.lista_items.map((g) => (g.id === gasto.id ? { ...g, ...gasto } : g))
          : [...prev.gastos.lista_items, gasto];
        return {
          ...prev,
          gastos: {
            lista_items: lista
          }
        };
      });
    },
    removeGasto: (id) => {
      setPerfil((prev) => ({
        ...prev,
        gastos: { lista_items: prev.gastos.lista_items.filter((g) => g.id !== id) }
      }));
    },
    upsertDeuda: (deuda) => {
      setPerfil((prev) => {
        const exists = prev.deudas.lista_deudas.some((d) => d.id === deuda.id);
        const lista = exists
          ? prev.deudas.lista_deudas.map((d) => (d.id === deuda.id ? { ...d, ...deuda } : d))
          : [...prev.deudas.lista_deudas, deuda];
        return { ...prev, deudas: { lista_deudas: lista } };
      });
    },
    removeDeuda: (id) => {
      setPerfil((prev) => ({
        ...prev,
        deudas: { lista_deudas: prev.deudas.lista_deudas.filter((d) => d.id !== id) }
      }));
    }
  }), [perfil]);

  return <FinancialContext.Provider value={value}>{children}</FinancialContext.Provider>;
};

export const useFinancialContext = () => {
  const ctx = useContext(FinancialContext);
  if (!ctx) {
    throw new Error('FinancialContext debe usarse dentro de FinancialProvider');
  }
  return ctx;
};
