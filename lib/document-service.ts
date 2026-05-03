/**
 * Servicio para consultar documentos (DNI/RUC) en Perú.
 * Soporta integración con APIs como apisperu.dev o similares.
 */

export interface DocumentData {
  success: boolean;
  data: {
    numero: string;
    nombre: string;
    razonSocial?: string;
    nombreComercial?: string;
    direccion?: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    estado?: string;
    condicion?: string;
    ubigeo?: string;
  };
  source: string;
  error?: string;
}

export async function consultDocument(type: 'dni' | 'ruc', number: string): Promise<DocumentData> {
  const token = process.env.DOCUMENT_API_TOKEN;
  
  // Si no hay token, devolvemos un mock para demostración
  if (!token) {
    console.warn('DOCUMENT_API_TOKEN no configurado. Usando modo de simulación.');
    await new Promise(resolve => setTimeout(resolve, 800)); // Simular latencia

    if (type === 'dni') {
      return {
        success: true,
        source: 'MOCK-RENIEC',
        data: {
          numero: number,
          nombre: number === '12345678' ? 'JUAN PEREZ GARCIA' : 'USUARIO DE PRUEBA',
        }
      };
    } else {
      return {
        success: true,
        source: 'MOCK-SUNAT',
        data: {
          numero: number,
          nombre: 'EMPRESA DE PRUEBA SAC',
          razonSocial: 'EMPRESA DE PRUEBA SAC',
          nombreComercial: 'MI NEGOCIO TEST',
          direccion: 'AV. LAS MAGNOLIAS 123',
          distrito: 'SAN ISIDRO',
          provincia: 'LIMA',
          departamento: 'LIMA',
          estado: 'ACTIVO',
          condicion: 'HABIDO',
        }
      };
    }
  }

  // Intentar con ambos proveedores populares (apiperu.dev y apisperu.com)
  try {
    // 1. Intentar con APIPERU.DEV (Método POST)
    const resDev = await fetch(`https://apiperu.dev/api/${type}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ [type]: number })
    });
    
    if (resDev.ok) {
      const result = await resDev.json();
      if (result.success) {
        const d = result.data;
        return {
          success: true,
          source: 'APIPERU.DEV',
          data: {
            numero: d.numero || d.dni || d.ruc,
            nombre: d.nombre || d.nombre_completo || d.razon_social || d.nombre_o_razon_social,
            razonSocial: d.razon_social || d.nombre_o_razon_social || d.nombre || d.nombre_completo,
            nombreComercial: d.nombre_comercial,
            direccion: d.direccion || d.direccion_completa,
            distrito: d.distrito,
            provincia: d.provincia,
            departamento: d.departamento,
            estado: d.estado,
            condicion: d.condicion,
          }
        };
      }
    }

    // 2. Si falló o no es el proveedor, intentar con APISPERU.COM (Método GET)
    const resCom = await fetch(`https://dniruc.apisperu.com/api/v1/${type}/${number}?token=${token}`);
    if (resCom.ok) {
      const result = await resCom.json();
      if (result.success || result.dni || result.ruc) {
        const d = result.data || result;
        return {
          success: true,
          source: 'APISPERU.COM',
          data: {
            numero: d.numero || d.dni || d.ruc,
            nombre: d.nombre || d.nombre_completo || d.razon_social || d.nombre_o_razon_social,
            razonSocial: d.razon_social || d.nombre_o_razon_social || d.nombre || d.nombre_completo,
            nombreComercial: d.nombre_comercial,
            direccion: d.direccion || d.direccion_completa,
            distrito: d.distrito,
            provincia: d.provincia,
            departamento: d.departamento,
            estado: d.estado,
            condicion: d.condicion,
          }
        };
      }
    }

    return {
      success: false,
      source: 'NONE',
      error: 'No se pudo obtener datos con el token proporcionado en ningún proveedor conocido.',
      data: {} as any
    };

  } catch (error) {
    console.error('Error consultando documento:', error);
    return {
        success: false,
        source: 'INTERNAL',
        error: 'Error de red o conexión al servicio de validación',
        data: {} as any
    };
  }
}
