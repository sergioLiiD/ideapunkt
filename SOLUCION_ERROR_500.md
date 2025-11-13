# 🔧 Solución: Internal Server Error (500)

## 🔍 Problema
Al acceder a `https://ideapunkt.de/diagnostico.html` obtienes "Internal Server Error".

## 🎯 Causa Probable
El error 500 generalmente es causado por:
1. **Sintaxis incorrecta en `.htaccess`**
2. **Módulos de Apache no habilitados** (mod_rewrite, mod_headers)
3. **Conflictos con la configuración de Passenger**
4. **Permisos incorrectos del archivo**

## ✅ Solución: Simplificar .htaccess

He simplificado el `.htaccess` para evitar errores. La nueva versión:
- ✅ Mantiene la configuración de Passenger
- ✅ Deshabilita caché (lo más importante)
- ❌ Remueve las reglas de RewriteEngine que pueden causar conflictos

## 📋 Pasos Inmediatos

### Paso 1: Subir .htaccess Simplificado

Sube el nuevo `.htaccess` (ya simplificado) al servidor.

### Paso 2: Verificar que diagnostico.html Está en la Raíz

En File Manager de DreamHost:
- Debe estar en: `~/ideapunkt.de/diagnostico.html`
- NO debe estar en: `~/ideapunkt.de/public/diagnostico.html`

### Paso 3: Verificar Permisos

El archivo `diagnostico.html` debe tener permisos de lectura:
- Permisos: `644` o `755`

**En File Manager:**
- Click derecho en `diagnostico.html`
- Verifica permisos
- Debe ser legible por el servidor web

### Paso 4: Probar de Nuevo

Después de subir el `.htaccess` simplificado:
```
https://ideapunkt.de/diagnostico.html
```

**Si funciona:**
- ✅ El problema era la configuración de `.htaccess`
- ✅ Ahora puedes verificar la versión

**Si sigue dando error:**
- Verifica los logs del servidor (ver abajo)
- O prueba sin Passenger (ver abajo)

## 🔍 Verificar Logs del Servidor

**Si tienes acceso SSH:**
```bash
ssh tu_usuario@ideapunkt.de
tail -f ~/logs/error.log
# O
tail -f ~/logs/ideapunkt.de/error.log
```

Luego intenta acceder a `diagnostico.html` y observa qué error aparece en los logs.

## 💡 Alternativa: Probar Sin Passenger

Si el problema persiste, puede ser un conflicto con Passenger. Prueba temporalmente deshabilitar Passenger:

**Crea un `.htaccess` de prueba (temporal):**
```apache
# Temporal: Deshabilitar Passenger para probar
# PassengerEnabled off

# Deshabilitar caché
<IfModule mod_headers.c>
  <FilesMatch "\.(html|htm|txt)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate, max-age=0"
  </FilesMatch>
</IfModule>
```

**Si esto funciona:**
- El problema es con la configuración de Passenger
- Necesitas ajustar la configuración de Passenger en el panel de DreamHost

## 📋 Checklist

- [ ] Subí el `.htaccess` simplificado
- [ ] `diagnostico.html` está en la raíz (no en public/)
- [ ] Permisos del archivo son correctos (644 o 755)
- [ ] Probé acceder a `https://ideapunkt.de/diagnostico.html`
- [ ] Si sigue dando error, revisé los logs del servidor

## 🚨 Si Nada Funciona

1. **Verifica la configuración del dominio en DreamHost:**
   - Panel → Domains → Manage Domains
   - Selecciona `ideapunkt.de`
   - Verifica que la configuración sea correcta

2. **Contacta soporte de DreamHost:**
   - Menciona que obtienes "Internal Server Error" al acceder a archivos HTML
   - Menciona que usas Passenger con Next.js
   - Pregunta si hay algún problema con la configuración

3. **Prueba acceder directamente a la página principal:**
   - `https://ideapunkt.de`
   - ¿Funciona? → El problema es solo con archivos estáticos
   - ¿No funciona? → Hay un problema más general

## 💡 Próximos Pasos

1. **Sube el `.htaccess` simplificado**
2. **Prueba `https://ideapunkt.de/diagnostico.html`**
3. **Dime qué pasa:**
   - ¿Funciona ahora?
   - ¿Sigue dando error 500?
   - ¿Qué error específico ves?

Con esta información podré ayudarte a resolver el problema.

