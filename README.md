# biakfit.com

Web de BiakFit: la página es el mapa del Viaje de Draki. Estática, sin build y sin dependencias:
HTML + CSS + JS a mano, fuentes y recursos alojados en el propio repo.

```
index.html            la página
404.html              «Por aquí no hay camino»
privacidad.html       política de privacidad (ES/EU/EN)
aviso-legal.html      aviso legal y responsabilidad sobre el ejercicio (ES/EU/EN)
CNAME                 biakfit.com (GitHub Pages)
assets/style.css      estilos (paleta y tipografías de docs/BRAND.md de la app)
assets/app.js         interacción, textos ES/EN y configuración del formulario
assets/exercises.js   los 54 ejercicios (generado desde assets/exercises/exercises.json + lib/l10n de la app)
assets/fonts/         Baloo 2 y Inter (OFL), sin Google Fonts
assets/img/           Draki, ejercicios (frames con fondo transparente), mundos, obstáculos, mapa muscular, marca
```

## Probar en local

```
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Storytelling

**Biak = «los dos» en euskera: tú y Draki.** Draki es un dragón pequeño que quiere volver a su volcán; solo se cansa,
contigo avanza. Cada sesión es un paso suyo y, si un día no puedes, te espera en el camino.

La web se recorre igual que el Viaje de la app: **hacia abajo**, por los cinco mundos. Draki camina por el sendero al
ritmo del scroll y, cuando paras, se pone a entrenar. Cada mundo enseña una idea del producto con una demo que se puede tocar:

| Mundo | Mensaje | Demo |
|---|---|---|
| 1 Valle | Con lo que tienes en casa | Eliges tu material y Draki hace un ejercicio que puedes hacer; cuenta real de ejercicios disponibles |
| 2 Río | Sin cronómetro. Sin culpa | «Hoy no he podido»: la sesión pasa al siguiente día de entreno |
| 3 Montaña | Tu coach te escucha | Muy fácil / Retador / No he podido, con pesas rusas reales (8-12-16-20) y la regla del salto >15 % |
| 4 Nieve | Tu progreso, en Draki | Mapa muscular frente/espalda con giro 3D |
| 5 Volcán | Cada tres sesiones, un nivel | Anillo de 3 sesiones, medalla y celebración |

Después, la biblioteca (33 de los 54 ejercicios; el resto «en la app») y la lista para la beta.

## Antes de publicar

1. **«Avisadme».** El botón abre el correo del visitante con asunto y texto ya escritos (ES/EU/EN) hacia
   `CONFIG.contactEmail` = `biak@biakfit.com`. El buzón tiene que existir (iCloud+ con dominio propio) antes de publicar.
2. **DNS del correo (iCloud+).** En Squarespace: MX `mx01.mail.icloud.com` y `mx02.mail.icloud.com` (prioridad 10),
   TXT de verificación de Apple, TXT SPF `v=spf1 include:icloud.com ~all` y CNAME DKIM `sig1._domainkey`.
3. **Legal.** `privacidad.html` y `aviso-legal.html` (ES/EU/EN, prevalece el castellano). Titular: Alberto Conde Mellado.
   Antes de publicar, rellenar los huecos marcados en amarillo: `[NIF]` y `[Domicilio]` (los pide el art. 10 de la LSSI).
4. **Idiomas.** ES, EU y EN, en el objeto `T` de `assets/app.js`. El euskera usa la terminología de `lib/l10n/app_eu.arb` de la app
   (ibilbidea, saioa, maila, domina, bolada, Errazegia / Erronka handia / Ezin izan dut…). El idioma se elige por el
   navegador y se recuerda en el dispositivo.

## Publicar en GitHub Pages con biakfit.com

1. Repo **público** `biakfit-web` (Pages en repos privados requiere plan de pago).
2. Settings → Pages → Source: *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
3. Settings → Pages → Custom domain: `biakfit.com` (el fichero `CNAME` ya lo lleva). Recomendable verificar el dominio
   en Settings de la cuenta → Pages → *Add a domain* antes de tocar DNS.
4. En Squarespace → Domains → biakfit.com → DNS:
   - Borrar los registros por defecto de Squarespace para `@` y `www` (si existen).
   - `A` `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` `@` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME` `www` → `acondemellado.github.io`
   - No tocar MX/TXT si hay correo en el dominio.
5. Cuando GitHub valide el DNS (minutos a 24-48 h), activar **Enforce HTTPS**.
