(() => {
  const header = document.getElementById('siteHeader');
  const button = document.getElementById('menuButton');
  const nav = document.getElementById('siteNav');
  const backdrop = document.getElementById('menuBackdrop');
  const topButton = document.getElementById('backToTop');
  const toast = document.getElementById('toast');

  const icon = (name, className = 'icon') => {
    const image = document.createElement('img');
    image.src = `assets/icons/${name}.svg`;
    image.className = className;
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    return image;
  };

  const addSharedNavigation = () => {
    const brand = document.querySelector('.brand');
    if (brand && !brand.querySelector('.brand-mark')) {
      const mark = document.createElement('span');
      mark.className = 'brand-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = 'AD';
      brand.prepend(mark);
    }

    const routeLink = nav?.querySelector(':scope > a[href="routes.html"]');
    if (routeLink) {
      const group = document.createElement('details');
      group.className = 'nav-menu-group';
      if (routeLink.classList.contains('active')) group.classList.add('active');

      const summary = document.createElement('summary');
      summary.className = 'nav-link';
      summary.append(icon('route', 'nav-icon'), document.createTextNode('מסלולים'));

      const submenu = document.createElement('div');
      submenu.className = 'nav-submenu';
      submenu.innerHTML = `
        <a href="routes.html">כל המסלולים</a>
        <a href="routes.html#old-town"><b>01</b><span>העיר העתיקה</span></a>
        <a href="routes.html#waterfront"><b>02</b><span>קו המים</span></a>
        <a href="routes.html#kadriorg"><b>03</b><span>קדיאורג</span></a>
        <a href="routes.html#modern-history"><b>04</b><span>המאה ה־20</span></a>`;
      group.append(summary, submenu);
      routeLink.replaceWith(group);
    }

    if (nav && !nav.querySelector(':scope > a[href="offline.html"]')) {
      const offline = document.createElement('a');
      offline.className = `nav-link${document.body.dataset.page === 'offline.html' ? ' active' : ''}`;
      offline.href = 'offline.html';
      offline.append(icon('wifi', 'nav-icon'), document.createTextNode('אופליין'));
      const about = nav.querySelector(':scope > a[href="about.html"]');
      nav.insertBefore(offline, about || null);
    }
  };

  addSharedNavigation();

  const menu = (open) => {
    if (!button || !nav || !backdrop) return;
    button.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    backdrop.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) nav.querySelectorAll('.nav-menu-group').forEach((item) => { item.open = false; });
  };

  button?.addEventListener('click', () => menu(!nav.classList.contains('open')));
  backdrop?.addEventListener('click', () => menu(false));
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => menu(false)));
  addEventListener('keydown', (event) => { if (event.key === 'Escape') menu(false); });

  let compact = false;
  const onScroll = () => {
    const next = scrollY > 28;
    if (next !== compact) {
      header?.classList.toggle('compact', next);
      compact = next;
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  topButton?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  const say = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(say.timer);
    say.timer = setTimeout(() => toast.classList.remove('show'), 2100);
  };

  document.querySelectorAll('[data-copy]').forEach((copyButton) => copyButton.addEventListener('click', async () => {
    const value = copyButton.dataset.copy || '';
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const field = document.createElement('textarea');
      field.value = value;
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    say('הועתק ללוח');
  }));

  document.querySelectorAll('[data-route-toggle]').forEach((toggle) => toggle.addEventListener('click', () => {
    const section = toggle.closest('.route-section');
    if (!section) return;
    const open = toggle.dataset.routeToggle === 'open';
    section.querySelectorAll('details.stop-card, details.micro-accordion').forEach((details) => { details.open = open; });
    say(open ? 'כל התחנות נפתחו' : 'כל התחנות נסגרו');
  }));

  const stopEnhancements = {
    'r1-s01': ['Lossi plats 10, Tallinn', 'הקתדרלה נבנתה בשנים 1894–1900 בסגנון התחייה הרוסית, ובראשה חמש כיפות ובמגדליה אחד־עשר פעמונים. המיקום מול טירת טומפאה מדגיש היטב את המתח ההיסטורי בין השלטון הרוסי לבין העצמאות האסטונית.'],
    'r1-s02': ['Toom-Kooli 6, Tallinn', 'זוהי הכנסייה העתיקה ביותר בעיר העליונה, ושורשיה מגיעים למאה ה־13. בפנים בולטים מצבות עתיקות וסמלי אצולה רבים, שמספרים מי החזיק בכוח בטומפאה לאורך הדורות.'],
    'r1-s03': ['Rahukohtu 5, Tallinn', 'המדרגות שמתחת לתצפית נבנו ב־1903 ויש בהן 157 מדרגות, אבל המסלול הזה נשאר במפלס העליון. מכאן קל להבין את טבעת החומה ואת הקשר בין העיר העתיקה, תחנת הרכבת והמפרץ.'],
    'r1-s04': ['Kohtu 12, Tallinn', 'זוהי אחת התצפיות הרחבות ביותר בעיר על גגות החרס, צריחי הכנסיות והנמל. היא משלימה את Patkuli: שם רואים טוב יותר את החומה, וכאן את העיר התחתונה כמכלול.'],
    'r1-s05': ['Lühike jalg 9A, Tallinn', 'לפי האגדה המקומית, הדגל הדני Dannebrog ירד מן השמים כאן במהלך קרב ב־1219. הגן הציבורי עוצב במאה ה־19, והיום הוא נקודת מעבר אינטימית בין החומה, מגדלי ההגנה והעיר התחתונה.'],
    'r1-s06': ['Niguliste 3, Tallinn', 'הכנסייה מן המאה ה־13 משמשת כיום מוזיאון לאמנות כנסייתית, ובו קטע מפורסם מן היצירה „מחול המוות”. מעלית זכוכית עולה לכ־50 מטר ומאפשרת תצפית בלי לטפס במדרגות מגדל ארוכות.'],
    'r1-s07': ['Raekoja plats 1, Tallinn', 'הכיכר הייתה מרכז המסחר והשלטון של העיר ההנזאית. כדאי להסתכל על חזיתות בתי הסוחרים, על בית העירייה הגותי ועל שבשבת Old Thomas שבראש המגדל.'],
    'r1-s08': ['Raekoja plats 11, Tallinn', 'בית המרקחת מתועד לפחות משנת 1422 ופועל ברציפות באותו מבנה. משפחת Burchart ניהלה אותו במשך עשרה דורות, והתצוגה הקטנה חושפת תרופות, כלים ושיטות ריפוי מתקופות אחרות.'],
    'r1-s09': ['Vene 6, Tallinn', 'מאחורי הכניסה הצנועה מסתתרת חצר משוחזרת של בתי מלאכה, גלריות ובית קפה. זו עצירה קצרה שמראה כיצד חללי השירות הצפופים של העיר העתיקה קיבלו חיים חדשים.'],
    'r1-s10': ['Katariina käik, Tallinn', 'המעבר מחבר בין רחוב Vene לרחוב Müürivahe ונצמד לשרידי מנזר סנט קתרין. לאורך הקירות משובצות מצבות עתיקות, ובסדנאות הקטנות אפשר לראות אמנים עובדים בחומר, זכוכית וטקסטיל.'],
    'r1-s11': ['Viru 20, Tallinn', 'שני המגדלים העגולים הם רק החלק הקדמי שנותר ממערכת שער גדולה יותר מן המאה ה־14. המעבר דרכם מסמן בצורה ברורה את היציאה מן העיר המבוצרת אל המרכז המודרני.'],
    'r2-s01': ['Peetri 12, Tallinn', 'נובלסנר נוסדה ב־1912 כמספנה לצוללות בידי עמנואל נובל וארתור לסנר. מבני התעשייה, הרציפים והמסילות שולבו כיום ברובע פתוח של אמנות, אוכל ומגורים, ולכן שווה להסתכל גם על המבנים ולא רק על הטיילת.'],
    'r2-s02': ['Vesilennuki 6, Tallinn', 'האנגרים הענקיים נבנו עבור מטוסי ים ונחשבו הישג הנדסי מוקדם בבטון מזוין. בפנים נמצאת בין היתר הצוללת Lembit, שאפשר להיכנס אליה ולהבין עד כמה צפופים היו החיים בצוללת.'],
    'r2-s03': ['Kalaranna 28, Tallinn', 'המתחם התחיל כמבצר ימי במאה ה־19 ושימש בהמשך ככלא במשך עשרות שנים. עבודות השימור וההסבה נמשכות והמתחם סגור לביקור עד 2027, לכן מתבוננים מבחוץ בלבד ומכבדים את הגידור.'],
    'r2-s04': ['Kalaranna 8, Tallinn', 'רצועת החוף העירונית מחזירה לציבור גישה ישירה לקו המים שהיה במשך שנים אזור תעשייה סגור. זו נקודה טובה לעצירה קצרה, אבל בימים סוערים הרוח מן המפרץ מורגשת מאוד.'],
    'r2-s05': ['Kursi 5, Tallinn', 'המוזיאון העצמאי מציג אמנות אסטונית ובינלאומית עכשווית בחלל תעשייתי מחוספס. התערוכות מתחלפות, ולכן כדאי לבדוק מראש מה מוצג; הכניסה כיום חופשית בשעות הפעילות.'],
    'r2-s06': ['Kalasadama 4, Tallinn', 'האולם נבנה לקראת תחרויות השיט של אולימפיאדת מוסקבה 1980. הצורה הנמוכה והמדורגת תוכננה כחלק מן הנוף, וכיום המבנה הסגור מרתק בעיקר כשריד אדריכלי — אין להיכנס לאזורים חסומים.'],
    'r2-s07': ['Logi 4/2, Tallinn', 'גג טרמינל הקרוזים הוא טיילת ציבורית באורך כ־850 מטר עם ישיבה, משחק ומבט פתוח לנמל. הוא פתוח לקהל ללא תשלום וממחיש כיצד תשתית נמל פעילה יכולה לשמש גם כמרחב עירוני.'],
    'r3-s01': ['A. Weizenbergi 33, Tallinn', 'הפארק נוסד ב־1718 סביב ארמון הקיץ של פיוטר הגדול והוא מכלול הבארוק הגדול באסטוניה. השבילים עוברים בין תכנון פורמלי לאזורים טבעיים יותר, ולכן לא צריך למהר ישר אל הארמון.'],
    'r3-s02': ['A. Weizenbergi 33, Tallinn', 'בריכת הברבורים היא נקודת ההתמצאות הקלאסית של הפארק, עם ביתן, ערוגות ועצים ותיקים. ממנה נפתח הציר אל הארמון, והיא טובה לעצירה קצרה לפני החלק האדריכלי של המסלול.'],
    'r3-s03': ['A. Weizenbergi 37, Tallinn', 'פיוטר הגדול יזם את הארמון ב־1718 עבור יקטרינה הראשונה, והחזית והגן שמאחור משקפים תכנון בארוקי רשמי. בפנים פועל מוזיאון לאמנות זרה; למי שנכנס, כדאי לחשב לפחות שעה נוספת.'],
    'r3-s04': ['A. Weizenbergi 39, Tallinn', 'הבניין הושלם ב־1938 ונועד מלכתחילה למוסד הנשיאותי. החזית שלו מהדהדת במכוון את הארמון הסמוך, כך ששני מבנים מתקופות שונות נראים כחלק מציר שלטוני אחד.'],
    'r3-s05': ['A. Weizenbergi 34, Tallinn', 'Kumu נפתח ב־2006 ותוכנן בידי האדריכל הפיני Pekka Vapaavuori כחלק מקשת החפורה במדרון. האוסף עוקב אחר אמנות אסטונית מן המאה ה־18 ועד ימינו, עם דגש חשוב על תקופת הכיבוש הסובייטי.'],
    'r3-s06': ['Kadri tee 3, Tallinn', 'הגן תוכנן בידי אדריכל הנוף היפני Masao Sone ונפתח ב־2011. האבנים, המים והצמחייה נבחרו כדי להשתנות לאורך העונות, ולכן החוויה היא של הליכה איטית ולא של אתר עם נקודת צילום יחידה.'],
    'r4-s01': ['Pirita tee 78, Tallinn', 'קיר „המסע” נושא יותר מ־22,000 שמות של קורבנות הטרור הקומוניסטי, והמעבר החשוך מוביל אל „גן הבית” הפתוח. עצי התפוח והדבורים בחלק המואר מסמלים חיים שנקטעו ואת התקווה לחזרה הביתה.'],
    'r4-s02': ['Pirita tee 78 → Pirita tee 56', 'ההליכה הקצרה מחברת בין אתר זיכרון עכשווי למתחם מוזיאלי שעוסק באותה מאה מזווית רחבה יותר. יש להישאר במעברים המסומנים לאורך Pirita tee ולא לחצות את הכביש מחוץ למעבר חציה.'],
    'r4-s03': ['Pirita tee 56, Tallinn', 'בתצוגת החוץ מרוכזים כיום 21 פסלים ומונומנטים סובייטיים שהוצאו מן המרחב הציבורי. ההצבה ללא הבמה המקורית שלהם מאפשרת לבחון אותם כאמצעי תעמולה ולא כאנדרטאות פעילות.'],
    'r4-s04': ['Pirita tee 56, Tallinn', 'הארמון נבנה כבית קיץ למשפחת אורלוב ומארח היום מרכז גילוי של מוזיאון ההיסטוריה האסטוני. מן החצר רואים את המפרץ, ובפנים התערוכה „My Free Country” עוסקת במאה שנות ריבונות אסטונית.']
  };

  const enhanceRoutes = () => {
    document.querySelectorAll('.route-section').forEach((section) => {
      const label = section.querySelector('.sticky-route-label');
      const cover = section.querySelector('.route-cover');
      if (label && cover) {
        label.classList.add('route-context-label');
        cover.after(label);
      }
    });

    Object.entries(stopEnhancements).forEach(([id, [address, text]]) => {
      const stop = document.getElementById(id);
      const body = stop?.querySelector('.stop-body');
      if (!body) return;

      const addressLine = document.createElement('p');
      addressLine.className = 'place-address';
      addressLine.append(icon('pin'), document.createTextNode(address));
      const notice = body.querySelector('.notice-box');
      (notice || body.firstElementChild)?.insertAdjacentElement('afterend', addressLine);

      const more = document.createElement('details');
      more.className = 'place-more';
      const summary = document.createElement('summary');
      summary.textContent = 'עוד על המקום';
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      more.append(summary, paragraph);
      const next = body.querySelector('.next-leg');
      body.insertBefore(more, next || body.querySelector('.stop-actions'));

      const actions = body.querySelector('.stop-actions');
      actions?.querySelectorAll('.btn').forEach((action) => action.classList.add('btn-small'));
      const map = actions?.querySelector('.btn-map');
      if (map) map.replaceChildren(icon('map'), document.createTextNode('הצג במפה'));
    });

    const optionalPlaces = {
      'Kiek in de Kök ומנהרות הבסטיון': ['Komandandi tee 2, Tallinn', 'Kiek in de Kök Tallinn'],
      'Vabamu': ['Toompea 8b, Tallinn', 'Vabamu Tallinn'],
      'מגדל סנט אולף': ['Lai 50, Tallinn', 'St Olaf Church Tallinn'],
      'מרכז האמנות Kai': ['Peetri 12, Tallinn', 'Kai Art Center Tallinn'],
      'Reval Café בלנוסדאם': ['Vesilennuki 6, Tallinn', 'Reval Cafe Lennusadam Tallinn'],
      'מוזיאון האמנות בארמון קדיאורג': ['A. Weizenbergi 37, Tallinn', 'Kadriorg Art Museum Tallinn'],
      'Song Festival Grounds': ['Narva mnt 95, Tallinn', 'Tallinn Song Festival Grounds'],
      'מוזיאון ההיסטוריה בארמון': ['Pirita tee 56, Tallinn', 'Maarjamae Palace Tallinn'],
      'בית הקפה בארמון': ['Pirita tee 56, Tallinn', 'Maarjamae Palace Cafe Tallinn'],
      'המשך לפיריטה': ['Pirita promenade, Tallinn', 'Pirita Promenade Tallinn']
    };
    document.querySelectorAll('.micro-accordion').forEach((item) => {
      const title = item.querySelector('summary strong')?.textContent.trim();
      if (title === 'קיצור המסלול') {
        item.remove();
        return;
      }
      const place = optionalPlaces[title];
      if (!place) return;
      const content = item.querySelector(':scope > div');
      const address = document.createElement('p');
      address.className = 'place-address';
      address.append(icon('pin'), document.createTextNode(place[0]));
      content?.querySelector('p')?.insertAdjacentElement('afterend', address);
      const row = content?.querySelector('.button-row') || document.createElement('div');
      row.classList.add('button-row');
      if (!row.parentElement) {
        const existingAction = content?.querySelector(':scope > .btn');
        if (existingAction) row.append(existingAction);
        content?.append(row);
      }
      const map = document.createElement('a');
      map.className = 'btn btn-map btn-small';
      map.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place[1])}`;
      map.target = '_blank';
      map.rel = 'noopener';
      map.append(icon('map'), document.createTextNode('הצג במפה'));
      row.prepend(map);
      row.querySelectorAll('.btn').forEach((action) => action.classList.add('btn-small'));
    });

    const addDecision = (afterId, title, text, href, label) => {
      const stop = document.getElementById(afterId);
      if (!stop || stop.nextElementSibling?.classList.contains('route-decision')) return;
      const box = document.createElement('aside');
      box.className = 'route-decision';
      const symbol = document.createElement('span');
      symbol.append(icon('route'));
      const copy = document.createElement('div');
      const heading = document.createElement('h3');
      heading.textContent = title;
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      const link = document.createElement('a');
      link.className = 'btn btn-secondary btn-small';
      link.href = href;
      link.append(icon('route'), document.createTextNode(label));
      copy.append(heading, paragraph, link);
      box.append(symbol, copy);
      stop.after(box);
    };
    addDecision('r2-s01', 'רוצים להתחיל ישר במוזיאון?', 'אם נובלסנר פחות מעניין או שהזמן קצר, אפשר לדלג לתחנה 02 ולהתחיל בלנוסדאם. משם ממשיכים ברגל לאורך קו המים.', '#r2-s02', 'לתחנה 02');
    addDecision('r2-s06', 'נקודת החלטה לפני הסיום', 'אפשר לסיים בלינהול ולחזור למרכז, או להוסיף את הטיילת שעל גג טרמינל הקרוזים — עוד כ־12 דקות הליכה לכל כיוון.', '#r2-s07', 'להמשיך לטרמינל');

    document.querySelectorAll('.route-summary .button-stack').forEach((stack) => stack.querySelectorAll('a').forEach((action, index) => {
      action.classList.remove('btn-primary', 'btn-secondary', 'btn-map');
      action.classList.add(index === 0 ? 'btn-primary' : 'btn-map', 'btn-small');
      const text = action.textContent.trim();
      if (index === 0) action.replaceChildren(icon('pin'), document.createTextNode('ניווט להתחלה'));
      else action.replaceChildren(icon('map'), document.createTextNode(text.replace(/^מפה · /, '')));
    }));
  };

  enhanceRoutes();

  const mustSeeAddresses = {
    'must-01': 'Lossi plats 10, Tallinn',
    'must-02': 'Vesilennuki 6, Tallinn',
    'must-03': 'A. Weizenbergi 37, Tallinn',
    'must-04': 'Niguliste 3, Tallinn',
    'must-05': 'Peetri 12, Tallinn',
    'must-06': 'A. Weizenbergi 34, Tallinn',
    'must-07': 'Logi 4/2, Tallinn',
    'must-08': 'Pirita tee 78, Tallinn'
  };
  Object.entries(mustSeeAddresses).forEach(([id, address]) => {
    const card = document.getElementById(id);
    const actions = card?.querySelector('.button-row');
    if (!card || !actions) return;
    const line = document.createElement('p');
    line.className = 'poi-address';
    line.append(icon('pin'), document.createTextNode(address));
    actions.before(line);
  });

  const openHash = (smooth = false) => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const element = document.getElementById(id);
    if (!element) return;
    if (element.tagName === 'DETAILS') element.open = true;
    let parent = element.parentElement;
    while (parent) {
      if (parent.tagName === 'DETAILS') parent.open = true;
      parent = parent.parentElement;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const headerHeight = header?.getBoundingClientRect().height || 72;
      const routeLabel = element.matches('.route-section') ? null : element.closest('.route-section')?.querySelector('.route-context-label');
      const offset = headerHeight + (routeLabel?.getBoundingClientRect().height || 0) + 12;
      const y = Math.max(0, element.getBoundingClientRect().top + scrollY - offset);
      scrollTo({ top: y, behavior: smooth ? 'smooth' : 'instant' });
    }));
  };
  addEventListener('hashchange', () => openHash(true));
  addEventListener('load', () => openHash(false));

  const weatherText = (code) => {
    if (code === 0) return 'בהיר';
    if (code <= 2) return 'בהיר חלקית';
    if (code === 3) return 'מעונן';
    if (code <= 48) return 'ערפל';
    if (code <= 57) return 'טפטוף';
    if (code <= 67) return 'גשם';
    if (code <= 77) return 'שלג';
    if (code <= 82) return 'ממטרים';
    if (code <= 86) return 'ממטרי שלג';
    return 'סופות רעמים';
  };

  const loadWeather = async () => {
    const forecast = document.getElementById('weatherForecast');
    if (!forecast) return;
    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=59.437&longitude=24.7536&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FTallinn&forecast_days=3';
      const response = await fetch(url, { signal: AbortSignal.timeout(7000) });
      if (!response.ok) throw new Error('weather');
      const data = await response.json();
      forecast.replaceChildren();
      data.daily.time.forEach((date, index) => {
        const day = document.createElement('article');
        const heading = document.createElement('strong');
        heading.textContent = index === 0 ? 'היום' : new Intl.DateTimeFormat('he-IL', { weekday: 'short' }).format(new Date(`${date}T12:00:00`));
        const condition = document.createElement('span');
        condition.textContent = weatherText(data.daily.weather_code[index]);
        const temperatures = document.createElement('b');
        temperatures.dir = 'ltr';
        temperatures.textContent = `${Math.round(data.daily.temperature_2m_max[index])}° / ${Math.round(data.daily.temperature_2m_min[index])}°`;
        const rain = document.createElement('small');
        rain.textContent = `סיכוי לגשם ${data.daily.precipitation_probability_max[index]}%`;
        day.append(heading, condition, temperatures, rain);
        forecast.append(day);
      });
      forecast.setAttribute('aria-busy', 'false');
    } catch {
      forecast.classList.add('weather-fallback');
      forecast.innerHTML = '<p>התחזית החיה אינה זמינה כרגע. אפשר לפתוח את התחזית בעברית בקישור שמתחת.</p>';
      forecast.setAttribute('aria-busy', 'false');
    }
  };
  loadWeather();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }
})();
