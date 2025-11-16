import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import {
  CategoriaGasto,
  Deuda,
  Gasto,
  Meta,
  PerfilFinanciero,
  TipoAgrupador,
  TipoDeuda,
  TipoMeta,
  TipoVivienda
} from '../types/financial';

const buildDefaultGasto = (id: string, nombre: string, categoria: CategoriaGasto, tipo: TipoAgrupador, fijo = true): Gasto => ({
  id,
  nombre,
  monto_mensual: 0,
  categoria_principal: categoria,
  tipo_agrupador: tipo,
  fijo
});

const defaultProfile: PerfilFinanciero = {
  usuario: {
    nombre: '',
    edad: 0,
    ciudad: '',
    adultos: 1,
    ninos: 0,
    tipo_vivienda: TipoVivienda.ARRENDADA
  },
  ingreso: {
    sueldo_neto: 0,
    bonos_mensualizados: 0,
    otros_ingresos: 0,
    otros_ingresos_tipo: 'OTROS',
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
      buildDefaultGasto('isapre', 'Plan de salud', CategoriaGasto.SALUD, TipoAgrupador.NV),
      buildDefaultGasto('seguro_salud', 'Seguro salud', CategoriaGasto.SALUD, TipoAgrupador.NV),
      buildDefaultGasto('medicamentos', 'Medicamentos crónicos', CategoriaGasto.SALUD, TipoAgrupador.NV),
      buildDefaultGasto('credito_auto', 'Crédito auto', CategoriaGasto.TRANSPORTE, TipoAgrupador.DM),
      buildDefaultGasto('seguro_auto', 'Seguro auto', CategoriaGasto.TRANSPORTE, TipoAgrupador.NV),
      buildDefaultGasto('seguro_obligatorio', 'Seguro obligatorio', CategoriaGasto.TRANSPORTE, TipoAgrupador.NV),
      buildDefaultGasto('tag', 'TAG', CategoriaGasto.TRANSPORTE, TipoAgrupador.NV),
      buildDefaultGasto('colegios', 'Colegios', CategoriaGasto.EDUCACION, TipoAgrupador.NV),
      buildDefaultGasto('preuniversitario', 'Preuniversitario obligatorio', CategoriaGasto.EDUCACION, TipoAgrupador.NV),
      buildDefaultGasto('matriculas', 'Matrículas prorrateadas', CategoriaGasto.EDUCACION, TipoAgrupador.NV),
      buildDefaultGasto('supermercado', 'Supermercado', CategoriaGasto.ALIMENTACION, TipoAgrupador.NV, false),
      buildDefaultGasto('verduleria', 'Verdulería', CategoriaGasto.ALIMENTACION, TipoAgrupador.NV, false),
      buildDefaultGasto('carnes', 'Carnes', CategoriaGasto.ALIMENTACION, TipoAgrupador.NV, false),
      buildDefaultGasto('delivery', 'Delivery comida', CategoriaGasto.DIVERSION, TipoAgrupador.EV, false),
      buildDefaultGasto('bencina', 'Bencina', CategoriaGasto.TRANSPORTE, TipoAgrupador.NV, false),
      buildDefaultGasto('transporte_publico', 'Transporte público', CategoriaGasto.TRANSPORTE, TipoAgrupador.NV, false),
      buildDefaultGasto('uber', 'Uber/Taxi', CategoriaGasto.TRANSPORTE, TipoAgrupador.NV, false),
      buildDefaultGasto('aseo', 'Aseo hogar', CategoriaGasto.OTROS, TipoAgrupador.NV, false),
      buildDefaultGasto('mantencion', 'Mantención hogar', CategoriaGasto.OTROS, TipoAgrupador.IM, false),
      buildDefaultGasto('reparaciones', 'Reparaciones', CategoriaGasto.OTROS, TipoAgrupador.IM, false),
      buildDefaultGasto('restaurantes', 'Restaurantes', CategoriaGasto.DIVERSION, TipoAgrupador.EV, false),
      buildDefaultGasto('cine', 'Cine y streaming', CategoriaGasto.DIVERSION, TipoAgrupador.EV, false),
      buildDefaultGasto('gimnasio', 'Gimnasio', CategoriaGasto.DIVERSION, TipoAgrupador.EV, false),
      buildDefaultGasto('viajes', 'Viajes', CategoriaGasto.DIVERSION, TipoAgrupador.EV, false),
      buildDefaultGasto('actividades_hijos', 'Actividades hijos', CategoriaGasto.HIJOS, TipoAgrupador.NV, false),
      buildDefaultGasto('ropa_hijos', 'Ropa hijos', CategoriaGasto.HIJOS, TipoAgrupador.NV, false),
      buildDefaultGasto('mesada', 'Mesada', CategoriaGasto.HIJOS, TipoAgrupador.EV, false),
      buildDefaultGasto('alimento_mascotas', 'Alimento mascotas', CategoriaGasto.MASCOTAS, TipoAgrupador.NV, false),
      buildDefaultGasto('veterinario', 'Veterinario', CategoriaGasto.MASCOTAS, TipoAgrupador.IM, false),
      buildDefaultGasto('aseo_mascotas', 'Aseo mascotas', CategoriaGasto.MASCOTAS, TipoAgrupador.IM, false)
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
    ahorro_mensual_liquido: 0,
    ahorro_mensual_largo_plazo: 0,
    ahorro_mensual_cripto: 0,
    ahorro_mensual_total: 0,
    fondo_emergencia_actual: 0,
    inversiones_largo_plazo_actuales: 0
  },
  metas: {
    lista_metas: []
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
      meses_fondo_emergencia: 0
    },
    alertas: [],
    recomendaciones: []
  }
};

const recalcIngreso = (ingreso: PerfilFinanciero['ingreso']) => ({
  ...ingreso,
  ingreso_total: Math.max(
    0,
    Number(ingreso.sueldo_neto) + Number(ingreso.bonos_mensualizados) + Number(ingreso.otros_ingresos)
  )
});

const recalcAhorro = (ahorro: PerfilFinanciero['ahorro']) => ({
  ...ahorro,
  ahorro_mensual_total: Math.max(
    0,
    Number(ahorro.ahorro_mensual_liquido) +
      Number(ahorro.ahorro_mensual_largo_plazo) +
      Number(ahorro.ahorro_mensual_cripto)
  )
});

interface FinancialContextValue {
  perfil: PerfilFinanciero;
  setPerfil: React.Dispatch<React.SetStateAction<PerfilFinanciero>>;
  updateIngreso: (updates: Partial<PerfilFinanciero['ingreso']>) => void;
  updateAhorro: (updates: Partial<PerfilFinanciero['ahorro']>) => void;
  upsertGasto: (gasto: Gasto) => void;
  removeGasto: (id: string) => void;
  upsertDeuda: (deuda: Deuda) => void;
  removeDeuda: (id: string) => void;
  upsertMeta: (meta: Meta) => void;
  removeMeta: (id: string) => void;
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
    },
    upsertMeta: (meta) => {
      setPerfil((prev) => {
        const exists = prev.metas.lista_metas.some((m) => m.id === meta.id);
        const lista = exists
          ? prev.metas.lista_metas.map((m) => (m.id === meta.id ? { ...m, ...meta } : m))
          : [...prev.metas.lista_metas, meta];
        return { ...prev, metas: { lista_metas: lista } };
      });
    },
    removeMeta: (id) => {
      setPerfil((prev) => ({
        ...prev,
        metas: { lista_metas: prev.metas.lista_metas.filter((m) => m.id !== id) }
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
