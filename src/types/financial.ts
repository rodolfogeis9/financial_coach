export enum TipoVivienda {
  PROPIA_HIPOTECA = 'PROPIA_HIPOTECA',
  PROPIA_PAGADA = 'PROPIA_PAGADA',
  ARRENDADA = 'ARRENDADA',
  PRESTADA = 'PRESTADA'
}

export enum CategoriaGasto {
  VIVIENDA = 'VIVIENDA',
  SERVICIOS_BASICOS = 'SERVICIOS_BASICOS',
  ALIMENTACION = 'ALIMENTACION',
  TRANSPORTE = 'TRANSPORTE',
  SALUD = 'SALUD',
  EDUCACION = 'EDUCACION',
  DIVERSION = 'DIVERSION',
  HIJOS = 'HIJOS',
  MASCOTAS = 'MASCOTAS',
  OTROS = 'OTROS'
}

export enum TipoAgrupador {
  NV = 'NV',
  DM = 'DM',
  DB = 'DB',
  AI = 'AI',
  EV = 'EV',
  IM = 'IM'
}

export enum TipoDeuda {
  CONSUMO = 'CONSUMO',
  AUTO = 'AUTO',
  HIPOTECA = 'HIPOTECA',
  EDUCATIVA = 'EDUCATIVA',
  OTRA = 'OTRA'
}

export enum TipoMeta {
  FONDO_EMERGENCIA = 'FONDO_EMERGENCIA',
  PAGAR_DEUDAS = 'PAGAR_DEUDAS',
  COMPRAR_VIVIENDA = 'COMPRAR_VIVIENDA',
  COMPRAR_AUTO = 'COMPRAR_AUTO',
  VIAJE = 'VIAJE',
  JUBILACION = 'JUBILACION'
}

export interface Usuario {
  nombre: string;
  edad: number;
  ciudad: string;
  adultos: number;
  ninos: number;
  tipo_vivienda: TipoVivienda;
}

export type TipoOtroIngreso = 'ARRIENDOS' | 'FREELANCE' | 'PENSION' | 'OTROS';

export interface Ingreso {
  sueldo_neto: number;
  bonos_mensualizados: number;
  otros_ingresos: number;
  otros_ingresos_tipo: TipoOtroIngreso;
  ingreso_total: number;
}

export interface Gasto {
  id: string;
  nombre: string;
  monto_mensual: number;
  categoria_principal: CategoriaGasto;
  tipo_agrupador: TipoAgrupador;
  fijo: boolean;
}

export interface Deuda {
  id: string;
  nombre: string;
  cuota_mensual: number;
  tipo_deuda: TipoDeuda;
  tipo_agrupador: TipoAgrupador.DM | TipoAgrupador.DB;
  saldo_total?: number;
}

export interface Ahorro {
  ahorro_mensual_liquido: number;
  ahorro_mensual_largo_plazo: number;
  ahorro_mensual_cripto: number;
  ahorro_mensual_total: number;
  fondo_emergencia_actual: number;
  inversiones_largo_plazo_actuales: number;
}

export interface Meta {
  id: string;
  tipo: TipoMeta;
  monto_objetivo?: number;
  plazo_meses?: number;
}

export interface Diagnostico {
  nota_global: number;
  subnotas: {
    sub_ahorro: number;
    sub_deuda: number;
    sub_necesidades: number;
    sub_estilo: number;
    sub_fondo: number;
  };
  ratios: {
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
  };
  alertas: string[];
  recomendaciones: string[];
}

export interface PerfilFinanciero {
  usuario: Usuario;
  ingreso: Ingreso;
  gastos: {
    lista_items: Gasto[];
  };
  deudas: {
    lista_deudas: Deuda[];
  };
  ahorro: Ahorro;
  metas: {
    lista_metas: Meta[];
  };
  diagnostico: Diagnostico;
}

export type SeccionClave =
  | 'inicio'
  | 'ingresos'
  | 'gastos_fijos'
  | 'gastos_variables'
  | 'deudas'
  | 'ahorro'
  | 'metas'
  | 'resultado'
  | 'simulador';
