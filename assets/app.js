/* BiakFit · web. Sin dependencias. */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Configuración
  // contactEmail: a donde llegan los «Avisadme». El botón abre el correo del
  // visitante con el asunto y el texto ya escritos; solo tiene que enviarlo.
  // ---------------------------------------------------------------------------
  var CONFIG = {
    contactEmail: 'biak@biakfit.com'
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(pointer: fine)').matches;

  var EX = {};
  (window.BK_EXERCISES || []).forEach(function (e) { EX[e.id] = e; });
  var TOTAL_EX = (window.BK_EXERCISES || []).length;

  // Ejercicios con frames publicados en la web (el resto se queda para la app)
  var ONSITE = ('bodyweight_squat push_up jump_squat burpee plank glute_bridge mountain_climber bird_dog ' +
    'bodyweight_lunge superman side_plank dumbbell_biceps_curl dumbbell_shoulder_press dumbbell_lateral_raise ' +
    'dumbbell_thruster dumbbell_goblet_squat dumbbell_romanian_deadlift kettlebell_swing kettlebell_goblet_squat ' +
    'kettlebell_around_the_world russian_twist kettlebell_lateral_squat barbell_back_squat barbell_deadlift ' +
    'barbell_overhead_press barbell_bent_over_row dumbbell_bench_press bulgarian_split_squat bench_triceps_dip ' +
    'incline_dumbbell_press dumbbell_step_up pull_up dead_hang').split(' ');

  var IMG = 'assets/img/';

  // ---------------------------------------------------------------------------
  // Textos (es / eu / en). Terminología en euskera alineada con lib/l10n/app_eu.arb de la app.
  // ---------------------------------------------------------------------------
  var T = {
    es: {
      'nav.journey': 'El viaje', 'nav.library': 'Ejercicios', 'nav.cta': 'Quiero probarla',
      'hero.def': 'En euskera, «biak» significa «los dos».',
      'hero.lema': 'Tú y Draki. Entrenamos juntos.',
      'hero.sub': 'BiakFit es la app de fuerza que convierte tu entrenamiento en una aventura sin presiones. En casa con lo que tengas o en el gimnasio: el lugar lo eliges tú, y Draki siempre está listo para ser la otra mitad de «biak».',
      'hero.cta1': 'Quiero probarla', 'hero.cta2': 'Empieza el viaje',
      'hero.soon': 'Primero en iPhone. Android, después.',
      'hero.tap': 'Toca a Draki para cambiar de ejercicio',
      'prologue': 'Draki es un dragón pequeño con un plan grande: volver a su volcán. El camino cruza un valle, un río, una montaña y la nieve. Solo se cansa. Contigo avanza. Cada sesión que haces es un paso suyo, y si un día no puedes, te espera en el camino.',
      'prologue.hint': 'Baja y camina con él.',
      'w.kicker': 'Mundo {n}', 'walk.home': '¡En casa!',
      'w1.name': 'Valle', 'w2.name': 'Río', 'w3.name': 'Montaña', 'w4.name': 'Nieve', 'w5.name': 'Volcán',
      'w1.title': 'Donde tú elijas.',
      'w1.body': 'En casa con un par de mancuernas, en el gimnasio o solo con tu cuerpo: dile a BiakFit qué tienes a mano y el plan sale de ahí. Las cargas se redondean a los pesos que de verdad puedes montar.',
      'w1.q': '¿Qué tienes a mano?', 'w1.count': 'ejercicios para ti', 'w1.next': 'Otro ejercicio',
      'eq.none': 'Peso corporal', 'eq.dumbbell': 'Mancuernas', 'eq.kettlebell': 'Pesa rusa', 'eq.barbell': 'Barra y discos',
      'eq.bench': 'Banco', 'eq.pull_up_bar': 'Barra de dominadas', 'eq.rack': 'Rack', 'eq.plate': 'Disco',
      'w2.title': 'Una aventura sin presiones.',
      'w2.body': 'Tú marcas el ritmo. Ves tus series, las haces y marcas la sesión al terminar. ¿Hoy no has podido? La sesión no se pierde: pasa a tu siguiente día de entreno.',
      'w2.days': 'L M X J V S D', 'w2.next': '+',
      'w2.dayNames': 'el lunes|el martes|el miércoles|el jueves|el viernes|el sábado|el domingo|el lunes que viene',
      'w2.s1': 'Cuerpo entero', 'w2.s2': 'Empuje y bisagra', 'w2.s3': 'Tracción y core',
      'w2.idle': 'Hoy toca: {s}.', 'w2.skipped': 'Lo de hoy te espera {d}. No pasa nada.', 'w2.doneMsg': 'Hecho por hoy. ¡Bien!',
      'w2.count': '{n} de 3 esta semana', 'w2.countNext': '{n} de 3 esta semana. Una pasa a la siguiente, sin perderse.',
      'w2.skip': 'Hoy no he podido', 'w2.done': 'Sesión hecha', 'w2.reset': 'Volver a empezar',
      'w3.title': 'Tu coach te escucha.',
      'w3.body': 'Al terminar, dile qué tal cada ejercicio. BiakFit ajusta la carga sin saltos que no puedas mover. Repetir el mismo peso varias semanas es lo normal: así se gana fuerza.',
      'w3.q': '¿Qué tal ha ido?', 'w3.easy': 'Muy fácil', 'w3.ok': 'Retador', 'w3.hard': 'No he podido',
      'w3.bells': 'Tus pesas rusas',
      'w3.start': 'Tus pesas rusas son de 8, 12, 16 y 20 kg. BiakFit solo te propone esas.',
      'w3.easyReps': 'Subir a {next} kg sería un salto del {pct} %. Mejor subimos repeticiones: 3 × {reps}.',
      'w3.easyLoad': 'Ya dominas las {prev}. Ahora sí: {kg} kg y volvemos a 3 × {reps}.',
      'w3.easyStep': 'Subimos a {kg} kg.', 'w3.easyMax': 'Es tu pesa más grande. Subimos repeticiones: 3 × {reps}.',
      'w3.okMsg': 'Mantenemos {kg} kg. Justo donde tienes que estar.',
      'w3.hardMsg': 'Bajamos a {kg} kg. Seguimos.', 'w3.hardMin': 'Lo dejamos en {kg} kg con menos repeticiones: 3 × {reps}.',
      'w4.title': 'Tu progreso, en Draki.',
      'w4.body': 'El mapa muscular de Draki se colorea con lo que entrenas. Y la racha cuenta semanas cumplidas, no kilos, porque la constancia es lo que te cambia.',
      'w4.q': 'Toca un ejercicio', 'w4.turn': 'Date la vuelta', 'w4.primary': 'Principal', 'w4.secondary': 'Secundario',
      'w4.streak': 'semanas de racha', 'w4.example': '(ejemplo)',
      'mm.kettlebell_goblet_squat': 'Sentadilla goblet', 'mm.push_up': 'Flexión', 'mm.pull_up': 'Dominada',
      'mm.kettlebell_swing': 'Swing', 'mm.dumbbell_shoulder_press': 'Press de hombro', 'mm.plank': 'Plancha',
      'w5.title': 'Cada tres sesiones, un nivel.',
      'w5.body': 'Tu plan es un viaje de cinco mundos. Cada sesión cierra un tramo del anillo, cada nivel te da una medalla y al final Draki llega a su volcán. Después, otro viaje.',
      'w5.btn': 'Completar sesión', 'w5.again': 'Siguiente nivel',
      'w5.level': 'Nivel {n}', 'w5.left1': 'Falta 1 sesión para la medalla.', 'w5.leftN': 'Faltan {k} sesiones para la medalla.',
      'w5.won': '¡Nivel {n} superado!', 'w5.wonSub': 'Medalla nueva. Draki avanza hasta el siguiente obstáculo.',
      'lib.title': 'Más de 50 ejercicios, y Draki te enseña cada uno.',
      'lib.body': 'Cada ejercicio tiene su animación y sus claves técnicas, con variantes para barra, mancuernas, pesa rusa o tu propio peso. Aquí tienes unos cuantos. El resto te espera en la app.',
      'lib.more': 'en la app',
      'beta.title': 'Entrena con Draki antes que nadie.',
      'beta.body': 'Estamos terminando la beta para iPhone. Pulsa el botón, envía el correo que se abre y te avisamos en cuanto esté lista.',
      'beta.subject': 'Quiero probar BiakFit', 'beta.btn': 'Avisadme',
      'beta.mailBody': 'Hola, estoy interesado en probar BiakFit. Avisadme cuando abra la beta.',
      'beta.alt': '¿No se abre tu correo? Escríbenos a', 'beta.copy': 'Copiar', 'beta.copied': 'Copiado',
      'beta.privacy': 'Solo usaremos tu email para avisarte del lanzamiento.',
      'foot.lema': 'Entrenamos juntos.', 'foot.legal': '© 2026 Alberto Conde Mellado. Hecho en Donostia.', 'foot.privacy': 'Privacidad', 'foot.notice': 'Aviso legal', 'foot.safety': 'Entrena con seguridad', 'beta.more': 'Política de privacidad'
    },
    eu: {
      'nav.journey': 'Ibilbidea', 'nav.library': 'Ariketak', 'nav.cta': 'Probatu nahi dut',
      'hero.def': 'Izenak dena dio: biak.',
      'hero.lema': 'Zu eta Draki. Elkarrekin entrenatzen dugu.',
      'hero.sub': 'BiakFit indar-entrenamendurako aplikazioa da, eta zure entrenamendua presiorik gabeko abentura bihurtzen du. Etxean daukazunarekin edo gimnasioan: lekua zuk aukeratzen duzu, eta Draki beti prest dago «biak»-en beste erdia izateko.',
      'hero.cta1': 'Probatu nahi dut', 'hero.cta2': 'Hasi ibilbidea',
      'hero.soon': 'Lehenik iPhonen. Gero, Androiden.',
      'hero.tap': 'Sakatu Draki ariketaz aldatzeko',
      'prologue': 'Draki herensuge txiki bat da, asmo handi batekin: bere sumendira itzultzea. Bideak haran bat, ibai bat, mendi bat eta elurra zeharkatzen ditu. Bakarrik, nekatu egiten da. Zurekin, aurrera egiten du. Egiten duzun saio bakoitza urrats bat da beretzat, eta egunen batean ezin baduzu, bidean zain izango duzu.',
      'prologue.hint': 'Jaitsi eta ibili berarekin.',
      'w.kicker': '{n}. mundua',
      'w1.name': 'Harana', 'w2.name': 'Ibaia', 'w3.name': 'Mendia', 'w4.name': 'Elurte', 'w5.name': 'Sumendia',
      'w1.title': 'Zuk aukeratzen duzun lekuan.',
      'w1.body': 'Etxean mankuerna pare batekin, gimnasioan edo zure gorputzarekin bakarrik: esaiozu BiakFiti zer duzun eskura, eta handik aterako da plana. Kargak benetan osa ditzakezun pisuetara biribiltzen dira.',
      'w1.q': 'Zer duzu eskura?', 'w1.count': 'ariketa zuretzat', 'w1.next': 'Beste ariketa bat',
      'eq.none': 'Gorputz-pisua', 'eq.dumbbell': 'Mankuernak', 'eq.kettlebell': 'Kettlebell', 'eq.barbell': 'Barra eta diskoak',
      'eq.bench': 'Bankua', 'eq.pull_up_bar': 'Dominada-barra', 'eq.rack': 'Racka', 'eq.plate': 'Pisuzko diskoa',
      'w2.title': 'Presiorik gabeko abentura.',
      'w2.body': 'Erritmoa zuk jartzen duzu. Zure serieak ikusi, egin eta saioa markatzen duzu amaitzean. Gaur ezin izan duzu? Saioa ez da galtzen: hurrengo entrenamendu-egunera pasatzen da.',
      'w2.days': 'Al Ar Az Og Or Lr Ig', 'w2.next': '+',
      'w2.dayNames': 'astelehenean|asteartean|asteazkenean|ostegunean|ostiralean|larunbatean|igandean|datorren astelehenean',
      'w2.s1': 'Gorputz osoa', 'w2.s2': 'Bultzada eta bisagra', 'w2.s3': 'Tiraketa eta corea',
      'w2.idle': 'Gaur: {s}.', 'w2.skipped': 'Gaurko saioa {d} izango duzu zain. Ez da ezer.', 'w2.doneMsg': 'Eginda gaurkoz. Ondo!',
      'w2.count': '3tik {n} aste honetan', 'w2.countNext': '3tik {n} aste honetan. Bat hurrengo astera pasatzen da, galdu gabe.',
      'w2.skip': 'Gaur ezin izan dut', 'w2.done': 'Saioa eginda', 'w2.reset': 'Hasi berriro',
      'w3.title': 'Zure entrenatzaileak entzun egiten dizu.',
      'w3.body': 'Amaitzean, esan zer moduz joan den ariketa bakoitza. BiakFitek karga doitzen du, mugi ezin ditzakezun jauzirik gabe. Pisu bera hainbat astez errepikatzea normala da: horrela irabazten da indarra.',
      'w3.q': 'Zer moduz joan da?', 'w3.easy': 'Errazegia', 'w3.ok': 'Erronka handia', 'w3.hard': 'Ezin izan dut',
      'w3.bells': 'Zure kettlebellak',
      'w3.start': 'Zure kettlebellak 8, 12, 16 eta 20 kg-koak dira. BiakFitek horiek baino ez dizkizu proposatuko.',
      'w3.easyReps': '{next} kg-ra igotzea % {pct}eko jauzia litzateke. Hobe errepikapenak gehitzea: 3 × {reps}.',
      'w3.easyLoad': '{prev} errepikapenak menderatzen dituzu. Orain bai: {kg} kg eta berriro 3 × {reps}.',
      'w3.easyStep': '{kg} kg-ra igoko gara.', 'w3.easyMax': 'Hori da zure kettlebell astunena. Errepikapen gehiago: 3 × {reps}.',
      'w3.okMsg': '{kg} kg-ri eutsiko diogu. Hor egon behar duzu, hain zuzen.',
      'w3.hardMsg': '{kg} kg-ra jaitsiko gara. Jarraituko dugu.', 'w3.hardMin': '{kg} kg-ri eutsiko diogu, errepikapen gutxiagorekin: 3 × {reps}.',
      'w4.title': 'Zure aurrerapena, Drakiren gorputzean.',
      'w4.body': 'Drakiren muskulu-mapa landu duzunaren arabera koloreztatzen da. Eta boladak bete dituzun asteak zenbatzen ditu, ez kiloak, konstantziak aldatzen zaituelako.',
      'w4.q': 'Sakatu ariketa bat', 'w4.turn': 'Eman buelta', 'w4.primary': 'Nagusia', 'w4.secondary': 'Bigarren mailakoa',
      'w4.streak': 'asteko bolada', 'w4.example': '(adibidea)',
      'mm.kettlebell_goblet_squat': 'Goblet sentadilla', 'mm.push_up': 'Flexioak', 'mm.pull_up': 'Dominadak',
      'mm.kettlebell_swing': 'Swinga', 'mm.dumbbell_shoulder_press': 'Sorbaldako pressa', 'mm.plank': 'Plantxa',
      'w5.title': 'Hiru saio, maila bat.',
      'w5.body': 'Zure plana bost munduko ibilbidea da. Saio bakoitzak eraztunaren zati bat ixten du, maila bakoitzak domina bat ematen dizu eta, azkenean, Draki bere sumendira iristen da. Gero, beste ibilbide bat.',
      'w5.btn': 'Osatu saioa', 'w5.again': 'Hurrengo maila',
      'w5.level': '{n}. maila', 'w5.left1': 'Saio bat falta da dominarako.', 'w5.leftN': '{k} saio falta dira dominarako.',
      'w5.won': '{n}. maila gaindituta!', 'w5.wonSub': 'Domina berria. Draki hurrengo oztoporaino doa.',
      'lib.title': '50 ariketa baino gehiago, eta Drakik denak erakusten dizkizu.',
      'lib.body': 'Ariketa bakoitzak bere animazioa eta gako teknikoak ditu, barrarekin, mankuernekin, kettlebellarekin edo gorputz-pisuarekin egiteko aldaerekin. Hona hemen batzuk. Gainerakoak aplikazioan dituzu zain.',
      'lib.more': 'aplikazioan',
      'beta.title': 'Entrenatu Drakirekin beste inork baino lehen.',
      'beta.body': 'iPhonerako beta amaitzen ari gara. Sakatu botoia, bidali irekitzen den mezua eta prest dagoenean abisatuko dizugu.',
      'beta.subject': 'BiakFit probatu nahi dut', 'beta.btn': 'Abisatu',
      'beta.mailBody': 'Kaixo, BiakFit probatzeko interesa dut. Abisatu beta irekitzen denean.',
      'beta.alt': 'Ez da posta irekitzen? Idatzi helbide honetara:', 'beta.copy': 'Kopiatu', 'beta.copied': 'Kopiatuta',
      'beta.privacy': 'Zure emaila abiaraztearen berri emateko baino ez dugu erabiliko.',
      'walk.home': 'Etxean!',
      'foot.lema': 'Elkarrekin entrenatzen dugu.', 'foot.legal': '© 2026 Alberto Conde Mellado. Donostian egina.', 'foot.privacy': 'Pribatutasuna', 'foot.notice': 'Lege-oharra', 'foot.safety': 'Entrenatu seguru', 'beta.more': 'Pribatutasun-politika'
    },
    en: {
      'nav.journey': 'The journey', 'nav.library': 'Exercises', 'nav.cta': 'I want to try it',
      'hero.def': 'In Basque, “biak” means “the two of us”.',
      'hero.lema': 'You and Draki. Training together.',
      'hero.sub': 'BiakFit is the strength app that turns your training into an adventure with no pressure. At home with whatever you have or at the gym: you choose the place, and Draki is always ready to be the other half of “biak”.',
      'hero.cta1': 'I want to try it', 'hero.cta2': 'Start the journey',
      'hero.soon': 'iPhone first. Android next.',
      'hero.tap': 'Tap Draki to switch exercise',
      'prologue': 'Draki is a small dragon with a big plan: getting back to his volcano. The path crosses a valley, a river, a mountain and the snow. Alone, he gets tired. With you, he keeps going. Every session you do is a step for him, and if one day you can’t make it, he waits for you on the path.',
      'prologue.hint': 'Scroll down and walk with him.',
      'w.kicker': 'World {n}', 'walk.home': 'Home!',
      'w1.name': 'Valley', 'w2.name': 'River', 'w3.name': 'Mountain', 'w4.name': 'Snow', 'w5.name': 'Volcano',
      'w1.title': 'Wherever you choose.',
      'w1.body': 'At home with a pair of dumbbells, at the gym or with nothing but your body: tell BiakFit what you have to hand and your plan is built from it. Loads are rounded to the weights you can actually load.',
      'w1.q': 'What do you have to hand?', 'w1.count': 'exercises for you', 'w1.next': 'Another exercise',
      'eq.none': 'Bodyweight', 'eq.dumbbell': 'Dumbbells', 'eq.kettlebell': 'Kettlebell', 'eq.barbell': 'Barbell and plates',
      'eq.bench': 'Bench', 'eq.pull_up_bar': 'Pull-up bar', 'eq.rack': 'Rack', 'eq.plate': 'Plate',
      'w2.title': 'An adventure with no pressure.',
      'w2.body': 'You set the pace. You see your sets, do them and tick the session off when you’re done. Couldn’t make it today? The session isn’t lost. It moves to your next training day.',
      'w2.days': 'M T W T F S S', 'w2.next': '+',
      'w2.dayNames': 'on Monday|on Tuesday|on Wednesday|on Thursday|on Friday|on Saturday|on Sunday|next Monday',
      'w2.s1': 'Full body', 'w2.s2': 'Push and hinge', 'w2.s3': 'Pull and core',
      'w2.idle': 'Today: {s}.', 'w2.skipped': 'Today’s session waits for you {d}. No big deal.', 'w2.doneMsg': 'Done for today. Nice!',
      'w2.count': '{n} of 3 this week', 'w2.countNext': '{n} of 3 this week. One moves to next week, nothing lost.',
      'w2.skip': 'I couldn’t today', 'w2.done': 'Session done', 'w2.reset': 'Start over',
      'w3.title': 'Your coach listens.',
      'w3.body': 'When you finish, tell it how each exercise felt. BiakFit adjusts the load without jumps you can’t move. Staying on the same weight for a few weeks is normal: that’s how strength is built.',
      'w3.q': 'How did it go?', 'w3.easy': 'Too easy', 'w3.ok': 'Challenging', 'w3.hard': 'Couldn’t do it',
      'w3.bells': 'Your kettlebells',
      'w3.start': 'Your kettlebells are 8, 12, 16 and 20 kg. BiakFit only suggests those.',
      'w3.easyReps': 'Going up to {next} kg would be a {pct}% jump. Let’s add reps instead: 3 × {reps}.',
      'w3.easyLoad': 'You own those {prev} reps. Now: {kg} kg and back to 3 × {reps}.',
      'w3.easyStep': 'Up to {kg} kg.', 'w3.easyMax': 'That’s your heaviest bell. More reps: 3 × {reps}.',
      'w3.okMsg': 'We stay at {kg} kg. Right where you should be.',
      'w3.hardMsg': 'Down to {kg} kg. Keep going.', 'w3.hardMin': 'We stay at {kg} kg with fewer reps: 3 × {reps}.',
      'w4.title': 'Your progress, on Draki.',
      'w4.body': 'Draki’s muscle map lights up with what you train. And your streak counts weeks completed, not kilos, because consistency is what changes you.',
      'w4.q': 'Tap an exercise', 'w4.turn': 'Turn around', 'w4.primary': 'Primary', 'w4.secondary': 'Secondary',
      'w4.streak': 'week streak', 'w4.example': '(example)',
      'mm.kettlebell_goblet_squat': 'Goblet squat', 'mm.push_up': 'Push-up', 'mm.pull_up': 'Pull-up',
      'mm.kettlebell_swing': 'Swing', 'mm.dumbbell_shoulder_press': 'Shoulder press', 'mm.plank': 'Plank',
      'w5.title': 'Every three sessions, a level.',
      'w5.body': 'Your plan is a journey through five worlds. Each session closes part of the ring, each level earns a medal and in the end Draki makes it home to his volcano. Then, a new journey.',
      'w5.btn': 'Complete session', 'w5.again': 'Next level',
      'w5.level': 'Level {n}', 'w5.left1': '1 session left for the medal.', 'w5.leftN': '{k} sessions left for the medal.',
      'w5.won': 'Level {n} cleared!', 'w5.wonSub': 'New medal. Draki moves on to the next obstacle.',
      'lib.title': '50+ exercises, and Draki shows you every one.',
      'lib.body': 'Every exercise has its own animation and technique cues, with variations for barbell, dumbbells, kettlebell or bodyweight. Here are a few. The rest are waiting in the app.',
      'lib.more': 'in the app',
      'beta.title': 'Train with Draki before anyone else.',
      'beta.body': 'We’re finishing the iPhone beta. Tap the button, send the email that opens and we’ll let you know as soon as it’s ready.',
      'beta.subject': 'I want to try BiakFit', 'beta.btn': 'Let me know',
      'beta.mailBody': 'Hi, I’m interested in trying BiakFit. Let me know when the beta opens.',
      'beta.alt': 'Mail app didn’t open? Write to', 'beta.copy': 'Copy', 'beta.copied': 'Copied',
      'beta.privacy': 'We’ll only use your email to tell you about the launch.',
      'foot.lema': 'Training together.', 'foot.legal': '© 2026 Alberto Conde Mellado. Made in Donostia.', 'foot.privacy': 'Privacy', 'foot.notice': 'Legal notice', 'foot.safety': 'Train safely', 'beta.more': 'Privacy policy'
    }
  };

  var lang = 'es';
  try { lang = localStorage.getItem('bk.lang') || ''; } catch (e) { lang = ''; }
  if (!T[lang]) {
    var nav = (navigator.language || 'es').toLowerCase().slice(0, 2);
    lang = T[nav] ? nav : 'es';
  }

  function t(k, v) {
    var s = (T[lang] && T[lang][k]) || T.es[k] || k;
    if (v) Object.keys(v).forEach(function (n) { s = s.split('{' + n + '}').join(v[n]); });
    return s;
  }
  function exName(id) { var e = EX[id]; return e ? (e[lang] || e.en) : id; }
  function exCue(id) { var e = EX[id]; return e ? (e['cue_' + lang] || e.cue_en || '') : ''; }

  // ---------------------------------------------------------------------------
  // Frames de ejercicio: alterna frames con fundido cada 0,8 s (igual que la app)
  // ---------------------------------------------------------------------------
  var anims = [];
  function Flip(el, id, opts) {
    this.el = el; this.visible = true; this.paused = !!(opts && opts.paused); this.id = null;
    anims.push(this);
    if (id) this.set(id);
  }
  Flip.prototype.set = function (id) {
    if (this.id === id) return;
    var e = EX[id]; if (!e) return;
    this.id = id; this.seq = e.s && e.s.length ? e.s : [1]; this.i = 0;
    this.el.innerHTML = ''; this.imgs = [];
    for (var f = 1; f <= e.f; f++) {
      var im = document.createElement('img');
      im.src = IMG + 'ex/' + id + '_f' + f + '.webp'; im.alt = ''; im.decoding = 'async'; im.className = 'fr';
      im.draggable = false;
      this.el.appendChild(im); this.imgs.push(im);
    }
    this.show();
  };
  Flip.prototype.show = function () {
    var fr = this.seq[this.i % this.seq.length];
    this.imgs.forEach(function (im, k) { im.classList.toggle('on', k === fr - 1); });
  };
  Flip.prototype.tick = function () {
    if (this.paused || !this.visible || !this.seq || this.seq.length < 2) return;
    this.i++; this.show();
  };
  if (!RM) setInterval(function () { anims.forEach(function (a) { a.tick(); }); }, 800);
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.target._flip) en.target._flip.visible = en.isIntersecting; });
  }, { rootMargin: '100px' }) : null;
  function watch(flip) { if (io) { flip.el._flip = flip; io.observe(flip.el); } return flip; }

  // ---------------------------------------------------------------------------
  // Chispas (Draki es un dragón): estela del cursor y ráfagas en los logros
  // ---------------------------------------------------------------------------
  var canvas = $('#sparks'), ctx = canvas.getContext('2d'), parts = [], running = false, dpr = 1;
  var COLORS = ['#F98A3D', '#FFD23F', '#F98A3D', '#14B4A4'];
  function sizeCanvas() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function spawn(x, y, vx, vy, life, r, g) {
    parts.push({ x: x, y: y, vx: vx, vy: vy, life: life, max: life, r: r, g: g, c: COLORS[(Math.random() * COLORS.length) | 0] });
    if (!running) { running = true; requestAnimationFrame(loop); }
  }
  function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= .985; p.life--;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      var a = p.life / p.max;
      ctx.globalAlpha = a; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.4 + a * 0.6), 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (parts.length) requestAnimationFrame(loop); else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  function burst(x, y, n) {
    if (RM) return;
    n = n || 26;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.283, s = 2 + Math.random() * 5;
      spawn(x, y, Math.cos(a) * s, Math.sin(a) * s - 2.5, 50 + Math.random() * 30, 2.5 + Math.random() * 3.5, .14);
    }
  }
  function burstAt(el, n) { var r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, n); }
  if (!RM) {
    sizeCanvas();
    addEventListener('resize', sizeCanvas);
    if (FINE) {
      var lastSpark = 0;
      addEventListener('pointermove', function (e) {
        var now = performance.now(); if (now - lastSpark < 28) return; lastSpark = now;
        spawn(e.clientX, e.clientY, (Math.random() - .5) * .8, -.6 - Math.random() * 1.2, 34 + Math.random() * 26, 1.6 + Math.random() * 2.2, -.01);
      }, { passive: true });
    }
  }

  // ---------------------------------------------------------------------------
  // Hero: Draki parte «Biak» en dos y cambia de ejercicio con un giro
  // ---------------------------------------------------------------------------
  var HERO = ['kettlebell_swing', 'pull_up', 'dumbbell_shoulder_press', 'jump_squat', 'barbell_deadlift', 'push_up', 'kettlebell_around_the_world', 'burpee'];
  var heroI = 0, heroFlip = watch(new Flip($('#heroFlip'), HERO[0])), heroTimer = null;
  function heroLabel() { $('#heroExName').textContent = exName(HERO[heroI]); }
  function heroNext(manual) {
    var el = $('#heroFlip');
    heroI = (heroI + 1) % HERO.length;
    if (RM) { heroFlip.set(HERO[heroI]); heroLabel(); return; }
    el.classList.remove('spin'); void el.offsetWidth; el.classList.add('spin');
    setTimeout(function () { heroFlip.set(HERO[heroI]); heroLabel(); }, 340);
    setTimeout(function () { el.classList.remove('spin'); }, 820);
    if (manual) { clearInterval(heroTimer); heroTimer = setInterval(heroNext, 4000); }
  }
  heroLabel();
  if (!RM) heroTimer = setInterval(heroNext, 4000);
  $('#heroDraki').addEventListener('click', function (e) {
    heroNext(true);
    burstAt(e.currentTarget, 30);
  });
  function ready() { document.body.classList.add('is-ready'); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(ready, 120); });
  setTimeout(ready, 900);

  // ---------------------------------------------------------------------------
  // Prólogo: el texto se enciende palabra a palabra con el scroll
  // ---------------------------------------------------------------------------
  var proWords = [];
  function splitPrologue() {
    var el = $('#prologueText');
    el.innerHTML = '';
    proWords = t('prologue').split(' ').map(function (w, i, arr) {
      var s = document.createElement('span');
      s.className = 'w' + (/^(Draki|volc|sumend|Contigo|Zurekin|With|camino|path|bidean)/i.test(w) ? ' key' : '');
      s.textContent = w;
      el.appendChild(s);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
      return s;
    });
  }
  function updatePrologue(vh) {
    var el = $('#prologueText'), r = el.getBoundingClientRect();
    var p = RM ? 1 : clamp((vh * 0.88 - r.top) / (r.height + vh * 0.32), 0, 1);
    var n = Math.round(p * proWords.length);
    for (var i = 0; i < proWords.length; i++) proWords[i].classList.toggle('lit', i < n);
  }

  // ---------------------------------------------------------------------------
  // El viaje: sendero, nodos con anillo de 3 sesiones y Draki caminando
  // ---------------------------------------------------------------------------
  var WORLD_EX = ['bodyweight_squat', 'bodyweight_lunge', 'pull_up', 'mountain_climber', 'kettlebell_swing'];
  var WORLD_OBS = ['obs_bridge', 'obs_stones', 'obs_ladder', 'obs_ice', 'obs_cave'];
  var journey = $('#viaje'), trail = $('#trail'), walker = $('#walker'), walkerBody = $('#walkerBody');
  var walkerPose = $('#walkerPose'), bubble = $('#walkerBubble');
  var walkerFlip = watch(new Flip($('#walkerEx'), WORLD_EX[0]));
  var worlds = $$('.world');
  var P = { W: 0, H: 0, xs: [], ys: [], ls: [], L: 0, end: 0, nodes: [] };

  function arc(cx, cy, r, a0, a1) {
    var rad = function (a) { return (a - 90) * Math.PI / 180; };
    var x0 = cx + r * Math.cos(rad(a0)), y0 = cy + r * Math.sin(rad(a0));
    var x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1));
    return 'M' + x0.toFixed(2) + ' ' + y0.toFixed(2) + ' A' + r + ' ' + r + ' 0 0 1 ' + x1.toFixed(2) + ' ' + y1.toFixed(2);
  }
  function ringSVG(c, r, cls) {
    var s = '';
    for (var k = 0; k < 3; k++) s += '<path class="' + cls + '" d="' + arc(c, c, r, k * 120 + 9, k * 120 + 111) + '"/>';
    return s;
  }

  function buildTrail() {
    if (getComputedStyle(trail).display === 'none') { P.W = 0; return; }
    var W = trail.clientWidth, H = W * 2.1667;
    P.W = W; P.H = H;
    var pts = [[0.5 * W, 0]];
    for (var i = 0; i < 5; i++) {
      var m = i % 2 ? -1 : 1;
      var rel = i < 4 ? [[.40, .16], [.60, .34], [.50, .55], [.40, .76], [.57, .94]] : [[.40, .16], [.60, .34], [.50, .55], [.42, .72], [.52, .86]];
      rel.forEach(function (q) { pts.push([(0.5 + (q[0] - 0.5) * m) * W, (i + q[1]) * H]); });
    }
    // Catmull-Rom → Bézier
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var j = 0; j < pts.length - 1; j++) {
      var p0 = pts[j - 1] || pts[j], p1 = pts[j], p2 = pts[j + 1], p3 = pts[j + 2] || p2;
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' +
        (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' +
        p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    var svg = $('#trailSvg'), todo = $('#pathTodo'), done = $('#pathDone');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + (5 * H));
    todo.setAttribute('d', d); done.setAttribute('d', d);
    var L = done.getTotalLength(); P.L = L; P.xs = []; P.ys = []; P.ls = [];
    var maxY = -1;
    for (var l = 0; l <= L; l += 4) {
      var pt = done.getPointAtLength(l);
      maxY = Math.max(maxY, pt.y);
      P.xs.push(pt.x); P.ys.push(maxY); P.ls.push(l);
    }
    P.end = maxY;
    // Nodos: un obstáculo por mundo, con el anillo de 3 sesiones
    var box = $('#nodes'); box.innerHTML = ''; P.nodes = [];
    for (var w = 0; w < 5; w++) {
      var nx = 0.5 * W, ny = (w + 0.55) * H;
      var n = document.createElement('div');
      n.className = 'node';
      n.style.left = nx + 'px'; n.style.top = ny + 'px';
      n.innerHTML = '<svg viewBox="0 0 150 150">' + ringSVG(75, 66, 'ring-bg') + ringSVG(75, 66, 'seg') + '</svg>' +
        '<img class="obs" src="' + IMG + 'obs/' + WORLD_OBS[w] + '.webp" alt="">' +
        '<img class="medal" src="' + IMG + 'obs/medal_level.webp" alt="">';
      box.appendChild(n);
      P.nodes.push({ el: n, segs: $$('.seg', n), y: ny, w: w, passed: false, top: w * H });
    }
  }

  function yToIndex(y) {
    var lo = 0, hi = P.ys.length - 1;
    while (lo < hi) { var mid = (lo + hi) >> 1; if (P.ys[mid] < y) lo = mid + 1; else hi = mid; }
    return lo;
  }

  var W_STATE = { lastY: -1, lastX: 0, dist: 0, dir: 1, world: -1, idle: null, mode: '' };
  function say(text, ms) {
    bubble.textContent = text; bubble.classList.add('show');
    clearTimeout(say._t); say._t = null;
    if (ms) say._t = setTimeout(function () { bubble.classList.remove('show'); }, ms);
  }
  function setPose(name) {
    var src = IMG + 'draki/' + name + '.webp';
    if (walkerPose.getAttribute('src') !== src) walkerPose.setAttribute('src', src);
  }
  function startTraining() {
    if (W_STATE.mode !== 'path') return;
    var w = clamp(W_STATE.world, 0, 4);
    walkerFlip.set(WORLD_EX[w]); walkerFlip.i = 0; walkerFlip.show();
    walker.classList.add('training');
    walkerBody.style.transform = 'scaleX(' + W_STATE.dir + ')';
    say((lang === 'es' ? '¡' : '') + exName(WORLD_EX[w]) + '!');
    W_STATE.talking = true;
  }

  function updateWalker(vh) {
    if (!P.W) return;
    var r = journey.getBoundingClientRect();
    var y = vh * 0.58 - r.top;
    var wy = clamp(y, 0, P.end);
    var idx = yToIndex(wy), x = P.xs[idx], l = P.ls[idx];
    $('#pathDone').style.strokeDasharray = l.toFixed(1) + ' ' + (P.L + 20).toFixed(0);
    walker.style.transform = 'translate(' + (x - 80).toFixed(1) + 'px,' + (wy - 158).toFixed(1) + 'px)';

    var mode = y <= 0 ? 'start' : (wy >= P.end - 2 ? 'end' : 'path');
    var world = clamp(Math.floor(wy / P.H), 0, 4);
    var dy = wy - W_STATE.lastY, dx = x - W_STATE.lastX;

    if (mode !== W_STATE.mode) {
      W_STATE.mode = mode;
      walker.classList.remove('training');
      if (mode === 'start') { setPose('warmup'); bubble.classList.remove('show'); }
      if (mode === 'end') { setPose('trophy'); walkerBody.style.transform = ''; say(t('walk.home')); }
      if (mode === 'path') setPose('happy');
    }
    if (mode === 'path' && Math.abs(dy) > 0.3) {
      if (Math.abs(dx) > 0.25) W_STATE.dir = dx > 0 ? 1 : -1;
      W_STATE.dist += Math.abs(dy);
      walker.classList.remove('training');
      if (!RM) {
        var ph = W_STATE.dist / 34;
        walkerBody.style.transform = 'translateY(' + (-Math.abs(Math.sin(ph)) * 9).toFixed(1) + 'px) rotate(' + (Math.sin(ph) * 7).toFixed(1) + 'deg) scaleX(' + W_STATE.dir + ')';
      }
      if (world !== W_STATE.world) {
        W_STATE.world = world; W_STATE.talking = false;
        say(t('w.kicker', { n: world + 1 }) + ': ' + t('w' + (world + 1) + '.name'), 1500);
      } else if (W_STATE.talking) {
        W_STATE.talking = false; bubble.classList.remove('show');
      }
      clearTimeout(W_STATE.idle);
      W_STATE.idle = setTimeout(startTraining, 650);
    }
    W_STATE.lastY = wy; W_STATE.lastX = x;

    // Anillos: cada tramo se cierra al pasar, la medalla aparece al llegar al obstáculo
    P.nodes.forEach(function (n) {
      var rel = (wy - n.top) / P.H;
      n.segs.forEach(function (s, k) { s.classList.toggle('on', rel >= 0.18 + k * 0.12 || wy >= n.y); });
      var passed = wy >= n.y;
      if (passed !== n.passed) {
        n.passed = passed; n.el.classList.toggle('passed', passed);
        if (passed && dy > 0) burstAt(n.el, 34);
      }
    });
  }

  // Móvil: cada mundo abre con su estampa y Draki entrenando en ella
  function buildBands() {
    worlds.forEach(function (w, i) {
      var band = $('.world-band', w);
      band.style.backgroundImage = 'url(' + IMG + 'world/world_' + (i + 1) + '.webp)';
      var f = document.createElement('span'); f.className = 'flip'; band.appendChild(f);
      var o = document.createElement('img'); o.className = 'obs'; o.src = IMG + 'obs/' + WORLD_OBS[i] + '.webp'; o.alt = ''; o.loading = 'lazy';
      band.appendChild(o);
      watch(new Flip(f, WORLD_EX[i]));
    });
  }

  // ---------------------------------------------------------------------------
  // Mundo 1: material
  // ---------------------------------------------------------------------------
  var ICONS = {
    none: '<circle cx="12" cy="5" r="2.2"/><path d="M12 7.5v6.5M7.5 10.5h9M12 14l-3.2 6M12 14l3.2 6"/>',
    dumbbell: '<path d="M3 9.5v5M6 7.5v9M18 7.5v9M21 9.5v5M6 12h12"/>',
    kettlebell: '<path d="M8.5 8.5a3.5 3.5 0 0 1 7 0"/><path d="M7.6 10h8.8l1.1 2.4a5.6 5.6 0 1 1-11 0z"/>',
    barbell: '<path d="M2 12h20M5 8.5v7M8 6.5v11M16 6.5v11M19 8.5v7"/>',
    bench: '<path d="M3 10.5h18M6.5 10.5v7M17.5 10.5v7M4.5 17.5h4M15.5 17.5h4"/>',
    pull_up_bar: '<path d="M3 5h18M6 5v15M18 5v15M10.5 5v4.5M13.5 5v4.5"/>'
  };
  var KIT_EQ = ['dumbbell', 'kettlebell', 'barbell', 'bench', 'pull_up_bar'];
  var kitSel = { dumbbell: true, kettlebell: true }, kitLast = 'kettlebell';
  var kitFlip = watch(new Flip($('#kitFlip'))), kitCur = null;
  function hasEq(q) { if (q === 'rack' || q === 'plate') return !!kitSel.barbell; return !!kitSel[q]; }
  function kitAvail(e) { return e.eq.every(hasEq); }
  function svgIco(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[k] + '</svg>'; }
  function renderKitChips() {
    var box = $('#kitChips');
    box.innerHTML = '<span class="chip fixed" aria-pressed="true">' + svgIco('none') + t('eq.none') + '</span>' +
      KIT_EQ.map(function (q) {
        return '<button type="button" class="chip" data-eq="' + q + '" aria-pressed="' + (!!kitSel[q]) + '">' + svgIco(q) + t('eq.' + q) + '</button>';
      }).join('');
  }
  function kitPick(prefer) {
    var pool = ONSITE.filter(function (id) { return EX[id] && kitAvail(EX[id]) && id !== kitCur; });
    var pref = prefer ? pool.filter(function (id) { return EX[id].eq.indexOf(prefer) >= 0; }) : [];
    var list = pref.length ? pref : pool;
    if (!list.length) return;
    kitCur = list[(Math.random() * list.length) | 0];
    kitFlip.set(kitCur);
    var el = $('#kitFlip'); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    renderKitText();
  }
  function renderKitText() {
    $('#kitName').textContent = kitCur ? exName(kitCur) : '';
    $('#kitCue').textContent = kitCur ? exCue(kitCur) : '';
    $('#kitCount').textContent = (window.BK_EXERCISES || []).filter(kitAvail).length;
  }
  $('#kitChips').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-eq]'); if (!b) return;
    var q = b.dataset.eq; kitSel[q] = !kitSel[q];
    b.setAttribute('aria-pressed', String(kitSel[q]));
    if (kitSel[q]) { kitLast = q; kitPick(q); }
    else { if (kitCur && !kitAvail(EX[kitCur])) kitPick(); else renderKitText(); }
    var c = $('#kitCount'); c.classList.remove('roll', 'up'); void c.offsetWidth; c.classList.add('roll', 'up');
  });
  $('#kitNext').addEventListener('click', function () { kitPick(); });

  // ---------------------------------------------------------------------------
  // Mundo 2: la semana (una sesión no hecha no se pierde, pasa al siguiente día)
  // ---------------------------------------------------------------------------
  var TRAIN_DAYS = [0, 2, 4, 7, 9, 11], TODAY = 2;
  var wk;
  function weekReset() {
    wk = { state: 'idle', s: [{ k: 1, n: 'w2.s1', slot: 0, done: true }, { k: 2, n: 'w2.s2', slot: 1 }, { k: 3, n: 'w2.s3', slot: 2 }] };
  }
  weekReset();
  function renderWeekStrip() {
    var strip = $('#weekStrip'), letters = t('w2.days').split(' ');
    var html = '';
    for (var d = 0; d < 8; d++) {
      var cls = 'day' + (d === TODAY ? ' today' : '') + (d === 7 ? ' next' : '');
      html += '<div class="' + cls + '"><span>' + (d < 7 ? letters[d] : t('w2.next')) + '</span><i class="slot"></i></div>';
    }
    wk.s.forEach(function (s) { html += '<span class="tok" data-k="' + s.k + '"><span>' + s.k + '</span></span>'; });
    strip.innerHTML = html;
    placeTokens();
  }
  function placeTokens() {
    var strip = $('#weekStrip'), days = $$('.day', strip);
    wk.s.forEach(function (s) {
      var tok = $('.tok[data-k="' + s.k + '"]', strip); if (!tok) return;
      var day = Math.min(TRAIN_DAYS[s.slot], 7), col = days[day], slot = $('.slot', col);
      tok.style.left = slot.offsetLeft + 'px';
      tok.style.top = slot.offsetTop + 'px';
      tok.classList.toggle('done', !!s.done);
      tok.classList.toggle('moved', !!s.moved && !s.done);
    });
  }
  function renderWeekText() {
    var today = wk.s.filter(function (s) { return TRAIN_DAYS[s.slot] === TODAY; })[0];
    var draki = $('#weekDraki'), img = 'encouraging', msg;
    if (wk.state === 'skipped') {
      var moved = wk.s[1], dn = t('w2.dayNames').split('|');
      msg = t('w2.skipped', { d: dn[Math.min(TRAIN_DAYS[moved.slot], 7)] }); img = 'shrug';
    } else if (wk.state === 'done') { msg = t('w2.doneMsg'); img = 'celebrating'; }
    else msg = t('w2.idle', { s: t(today ? today.n : 'w2.s2') });
    $('#weekMsg').textContent = msg;
    var src = IMG + 'draki/' + img + '.webp';
    if (draki.getAttribute('src') !== src) { draki.setAttribute('src', src); draki.classList.remove('bump'); void draki.offsetWidth; draki.classList.add('bump'); }
    var n = wk.s.filter(function (s) { return s.done && TRAIN_DAYS[s.slot] < 7; }).length;
    var pushed = wk.s.some(function (s) { return TRAIN_DAYS[s.slot] >= 7; });
    $('#weekCount').textContent = t(pushed ? 'w2.countNext' : 'w2.count', { n: n });
    $('#weekSkip').hidden = $('#weekDone').hidden = wk.state !== 'idle';
    $('#weekReset').hidden = wk.state === 'idle';
  }
  $('#weekSkip').addEventListener('click', function () {
    wk.s.forEach(function (s) { if (!s.done && TRAIN_DAYS[s.slot] >= TODAY) { s.slot++; s.moved = true; } });
    wk.state = 'skipped'; placeTokens(); renderWeekText();
  });
  $('#weekDone').addEventListener('click', function (e) {
    wk.s[1].done = true; wk.state = 'done'; placeTokens(); renderWeekText();
    burstAt($('.tok[data-k="2"]'), 22);
  });
  $('#weekReset').addEventListener('click', function () { weekReset(); renderWeekStrip(); renderWeekText(); });

  // ---------------------------------------------------------------------------
  // Mundo 3: feedback al coach (motor de SPEC §12, simplificado)
  // ---------------------------------------------------------------------------
  var BELLS = [8, 12, 16, 20], coach = { i: 2, reps: 12, msg: 'w3.start', v: {}, face: 'thinking', sel: null };
  var coachFlip = watch(new Flip($('#coachFlip'), 'kettlebell_goblet_squat'));
  function renderBells() {
    $('#coachBells').setAttribute('aria-label', t('w3.bells'));
    $('#coachBells').innerHTML = BELLS.map(function (b, k) {
      var s = 14 + k * 4;
      return '<span class="bell' + (k === coach.i ? ' cur' : '') + '"><i style="width:' + s + 'px;height:' + s + 'px"></i>' + b + '</span>';
    }).join('');
  }
  function renderCoach(dir) {
    $('#coachName').textContent = exName('kettlebell_goblet_squat');
    $('#coachSets').textContent = '3 × ' + coach.reps;
    var kg = $('#coachKg'); kg.textContent = BELLS[coach.i];
    if (dir) { kg.classList.remove('up', 'down'); void kg.offsetWidth; kg.classList.add(dir); }
    $('#coachMsg').textContent = t(coach.msg, coach.v);
    var face = $('#coachFace'), src = IMG + 'draki/' + coach.face + '.webp';
    if (face.getAttribute('src') !== src) { face.setAttribute('src', src); face.classList.remove('bump'); void face.offsetWidth; face.classList.add('bump'); }
    $$('.coach-btns .btn').forEach(function (b) { b.classList.toggle('sel', b.dataset.fb === coach.sel); });
    renderBells();
  }
  $('.coach-btns').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-fb]'); if (!b) return;
    var fb = b.dataset.fb, cur = BELLS[coach.i], dir = null;
    coach.sel = fb;
    if (fb === 'easy') {
      coach.face = 'surprised';
      if (coach.i === BELLS.length - 1) { coach.reps = Math.min(15, coach.reps + 2); coach.msg = 'w3.easyMax'; coach.v = { reps: coach.reps }; }
      else {
        var next = BELLS[coach.i + 1], jump = (next - cur) / cur;
        if (jump > 0.15 && coach.reps < 15) { coach.reps = Math.min(15, coach.reps + 2); coach.msg = 'w3.easyReps'; coach.v = { next: next, pct: Math.round(jump * 100), reps: coach.reps }; }
        else if (jump > 0.15) { var prev = coach.reps; coach.i++; coach.reps = 10; dir = 'up'; coach.msg = 'w3.easyLoad'; coach.v = { prev: prev, kg: BELLS[coach.i], reps: coach.reps }; coach.face = 'proud'; burstAt($('#coachKg'), 20); }
        else { coach.i++; dir = 'up'; coach.msg = 'w3.easyStep'; coach.v = { kg: BELLS[coach.i] }; }
      }
    } else if (fb === 'ok') {
      coach.face = 'encouraging'; coach.msg = 'w3.okMsg'; coach.v = { kg: cur };
    } else {
      coach.face = 'shrug';
      if (coach.i > 0) { coach.i--; coach.reps = 12; dir = 'down'; coach.msg = 'w3.hardMsg'; coach.v = { kg: BELLS[coach.i] }; }
      else { coach.reps = Math.max(8, coach.reps - 2); coach.msg = 'w3.hardMin'; coach.v = { kg: cur, reps: coach.reps }; }
    }
    renderCoach(dir);
  });

  // ---------------------------------------------------------------------------
  // Mundo 4: mapa muscular de Draki, con giro para ver la espalda
  // ---------------------------------------------------------------------------
  var MM_VIEWS = { front: ['biceps', 'chest', 'core', 'forearms', 'quads', 'shoulders'], back: ['back', 'calves', 'forearms', 'glutes', 'hamstrings', 'shoulders', 'triceps'] };
  var MM_EX = ['kettlebell_goblet_squat', 'push_up', 'pull_up', 'kettlebell_swing', 'dumbbell_shoulder_press', 'plank'];
  var mmSel = 'kettlebell_goblet_squat', mmBack = false;
  function buildMM() {
    ['front', 'back'].forEach(function (v) {
      var face = $(v === 'front' ? '#mmFront' : '#mmBack');
      face.innerHTML = MM_VIEWS[v].map(function (g) {
        var u = 'url(' + IMG + 'muscle/' + v + '_' + g + '.webp)';
        return '<i class="m" data-g="' + g + '" style="-webkit-mask-image:' + u + ';mask-image:' + u + '"></i>';
      }).join('') + '<img class="ol" src="' + IMG + 'muscle/' + v + '_outline.webp" alt="">';
    });
  }
  function renderMMChips() {
    $('#mmChips').innerHTML = MM_EX.map(function (id) {
      return '<button type="button" class="chip" data-ex="' + id + '" aria-pressed="' + (id === mmSel) + '">' + t('mm.' + id) + '</button>';
    }).join('');
  }
  function renderMM(autoTurn) {
    var e = EX[mmSel];
    $$('.mm-face .m').forEach(function (m) {
      var g = m.dataset.g;
      m.classList.toggle('p', e.pm.indexOf(g) >= 0);
      m.classList.toggle('s', e.pm.indexOf(g) < 0 && e.sm.indexOf(g) >= 0);
    });
    if (autoTurn) {
      var f = e.pm.filter(function (g) { return MM_VIEWS.front.indexOf(g) >= 0; }).length;
      var b = e.pm.filter(function (g) { return MM_VIEWS.back.indexOf(g) >= 0; }).length;
      if (!f && b) mmBack = true; else if (f && !b) mmBack = false;
    }
    $('#mmCard').classList.toggle('back', mmBack);
  }
  $('#mmChips').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-ex]'); if (!b) return;
    mmSel = b.dataset.ex;
    $$('#mmChips .chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); });
    renderMM(true);
  });
  $('#mmTurn').addEventListener('click', function () { mmBack = !mmBack; renderMM(false); });

  // ---------------------------------------------------------------------------
  // Mundo 5: anillo de 3 sesiones y medalla
  // ---------------------------------------------------------------------------
  var lvl = { n: 4, k: 0 };
  $('#levelRing').innerHTML = '<circle class="bg" cx="60" cy="60" r="38"/>' + ringSVG(60, 50, 'seg');
  function renderLevel() {
    var won = lvl.k >= 3, segs = $$('#levelRing .seg');
    segs.forEach(function (s, i) { s.classList.toggle('on', i < lvl.k); });
    $('.level').classList.toggle('won', won);
    $('#levelLeft').textContent = 3 - lvl.k;
    $('#levelTitle').textContent = won ? t('w5.won', { n: lvl.n }) : t('w5.level', { n: lvl.n });
    $('#levelSub').textContent = won ? t('w5.wonSub') : (3 - lvl.k === 1 ? t('w5.left1') : t('w5.leftN', { k: 3 - lvl.k }));
    $('#levelBtn').textContent = won ? t('w5.again') : t('w5.btn');
  }
  $('#levelBtn').addEventListener('click', function () {
    if (lvl.k >= 3) { lvl.n++; lvl.k = 0; }
    else { lvl.k++; if (lvl.k === 3) { burstAt($('.level-ring-wrap'), 60); setTimeout(function () { burstAt($('.level-ring-wrap'), 40); }, 220); } }
    renderLevel();
  });

  // ---------------------------------------------------------------------------
  // Biblioteca: dos cintas en direcciones opuestas. Pasa el ratón y Draki entrena
  // ---------------------------------------------------------------------------
  var libFlips = [];
  function eqLabel(e) { return e.eq.length ? t('eq.' + e.eq[0]) : t('eq.none'); }
  function buildLibrary() {
    var half = Math.ceil(ONSITE.length / 2);
    var rows = [ONSITE.slice(0, half), ONSITE.slice(half)];
    libFlips.forEach(function (f) { var i = anims.indexOf(f); if (i >= 0) anims.splice(i, 1); });
    libFlips = [];
    ['#marqueeA', '#marqueeB'].forEach(function (sel, r) {
      var box = $(sel); box.innerHTML = '';
      for (var copy = 0; copy < 2; copy++) {
        rows[r].forEach(function (id) {
          var e = EX[id]; if (!e) return;
          var c = document.createElement('button');
          c.type = 'button'; c.className = 'card';
          if (copy) { c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1; }
          c.innerHTML = '<span class="flip"></span><b></b><small></small>';
          $('b', c).textContent = exName(id); $('small', c).textContent = eqLabel(e);
          box.appendChild(c);
          var f = new Flip($('.flip', c), id, { paused: true }); libFlips.push(f);
          var on = function () { f.paused = false; f.tick(); }, off = function () { f.paused = true; f.i = 0; f.show(); };
          c.addEventListener('pointerenter', on); c.addEventListener('pointerleave', off);
          c.addEventListener('focus', on); c.addEventListener('blur', off);
          c.addEventListener('click', function () { if (f.paused) on(); else off(); });
        });
        if (r === 1) {
          var lk = document.createElement('div');
          lk.className = 'card locked'; if (copy) lk.setAttribute('aria-hidden', 'true');
          lk.innerHTML = '<img class="lock-draki" src="' + IMG + 'draki/thinking.webp" alt=""><b>+' + (TOTAL_EX - ONSITE.length) + '</b><small></small>';
          $('small', lk).textContent = t('lib.more');
          box.appendChild(lk);
        }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Beta
  // ---------------------------------------------------------------------------
  function renderBeta() {
    var href = 'mailto:' + CONFIG.contactEmail + '?subject=' + encodeURIComponent(t('beta.subject')) + '&body=' + encodeURIComponent(t('beta.mailBody'));
    $('#betaMail').setAttribute('href', href);
    $('#betaAddr').textContent = CONFIG.contactEmail;
  }
  $('#betaCopy').addEventListener('click', function (e) {
    var b = e.currentTarget, done = function () { b.textContent = t('beta.copied'); setTimeout(function () { b.textContent = t('beta.copy'); }, 1800); };
    var sel = function () { var r = document.createRange(); r.selectNodeContents($('#betaAddr')); var w = getSelection(); w.removeAllRanges(); w.addRange(r); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(CONFIG.contactEmail).then(done, sel); else sel();
  });
  $('#betaMail').addEventListener('click', function (e) { burstAt(e.currentTarget, 30); });

  // ---------------------------------------------------------------------------
  // Idioma
  // ---------------------------------------------------------------------------
  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    $$('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.dataset.i18nPh)); });
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    $$('.world').forEach(function (w, i) {
      var k = $('.world-kicker', w);
      k.innerHTML = '<span></span> <b></b>';
      $('span', k).textContent = t('w.kicker', { n: i + 1 });
      $('b', k).textContent = t('w' + (i + 1) + '.name');
    });
    splitPrologue(); heroLabel();
    renderKitChips(); renderKitText();
    renderWeekStrip(); renderWeekText();
    renderCoach(); renderMMChips(); renderMM(false); renderLevel(); buildLibrary();
    renderBeta();
    onScroll();
  }
  $$('.lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      lang = b.dataset.lang;
      try { localStorage.setItem('bk.lang', lang); } catch (e) { /* sin almacenamiento: no pasa nada */ }
      applyLang();
    });
  });

  // ---------------------------------------------------------------------------
  // Scroll
  // ---------------------------------------------------------------------------
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = innerHeight;
    $('#bar').classList.toggle('scrolled', scrollY > 16);
    updatePrologue(vh);
    updateWalker(vh);
    var v = $('#volcan').getBoundingClientRect();
    document.body.classList.toggle('night', v.top < vh * 0.45);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', onScroll, { passive: true });
  var rz;
  addEventListener('resize', function () {
    clearTimeout(rz);
    rz = setTimeout(function () { buildTrail(); placeTokens(); W_STATE.mode = ''; onScroll(); }, 120);
  });

  // Arranque
  buildMM(); buildBands(); kitPick('kettlebell'); buildTrail(); applyLang();
  addEventListener('load', function () { buildTrail(); placeTokens(); onScroll(); });
})();
