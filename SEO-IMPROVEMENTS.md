# تقرير إصلاح SEO وإعادة التوجيه

## الملخص

تم توحيد بنية الموقع على روابط نظيفة بدون `.html`، وإزالة طبقة Pages Functions من الموقع الثابت حتى لا تتداخل مع قواعد `_redirects`. أصبحت كل الروابط القديمة ذات الامتداد تحول بتحويل دائم واحد من نوع `301` إلى الرابط الأساسي، بينما تعرض الروابط الأساسية استجابة `200` مباشرة.

هذا مهم لأن Google يتعامل مع التحويلات الدائمة كإشارة إلى أن الوجهة الجديدة هي النسخة الأساسية، مع أن استخدام `301` أو `308` مقبول تقنيًا؛ استُخدم `301` هنا لتقليل الالتباس مع أدوات الفحص القديمة. راجع [توثيق Google للتحويلات](https://developers.google.com/search/docs/crawling-indexing/301-redirects).

## ما تم إصلاحه

| المجال | الإصلاح | النتيجة المتوقعة |
| --- | --- | --- |
| Cloudflare Pages | إزالة `functions/` و`_routes.json` بعد نقل التغييرات المطلوبة إلى HTML الثابت | عدم اعتراض Functions لطلبات `.html`، وترك `_redirects` يعمل كما هو موثق |
| Redirects | تحويل جميع القواعد الدائمة إلى `301`، وإضافة قاعدة لكل ملف HTML قديم | مسار واحد من الرابط القديم إلى canonical بدون حلقات |
| Canonical | إبقاء canonical على `https://decoratalahlam.com/...` بدون `.html` وبدون query أو fragment | نسخة أساسية واحدة لكل صفحة |
| JSON-LD | استبدال المفتاح المشوه `%D9%85%D9%86%20%D9%86%D8%AD%D9%86.html` بالمفتاح الصحيح `publisher` | JSON-LD صالح وقابل للقراءة |
| Robots | إضافة `User-agent: *` وفتح الزحف العام، مع إبقاء حظر روبوتات التدريب الخارجية | عدم وجود مجموعة robots غير مكتملة أو حظر غير مقصود لـ Googlebot |
| Sitemap | الإبقاء على الروابط الأساسية فقط وتحديث `lastmod` إلى تاريخ نشر الإصلاح | خريطة موقع متطابقة مع canonical URLs |
| الروابط الداخلية | إزالة روابط HTML الداخلية القديمة واستبدالها بروابط canonical مباشرة | تقليل اكتشاف Google للروابط التي تحتاج تحويلًا |
| التدقيق المستمر | إضافة `scripts/validate_site.py` | منع عودة أخطاء canonical وschema وsitemap وredirect في أي commit لاحق |

توضح [وثائق Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/redirects/) أن قواعد `_redirects` لا تُطبَّق على الطلبات التي تطابق Pages Functions؛ لذلك أُزيل التعارض من جذره بدل إضافة قواعد أكثر إلى ملف التوجيه.

## النشر التلقائي

يحتوي المستودع على `.github/workflows/cloudflare-pages.yml`. عند فتح Pull Request يتم تشغيل التدقيق فقط. وعند دمج التغييرات إلى `main` يتم تشغيل التدقيق ثم نشر الملفات إلى مشروع Cloudflare Pages باسم `decoratalahlam` باستخدام Wrangler.

يلزم إضافة السرّين التاليين في GitHub تحت **Settings → Secrets and variables → Actions → New repository secret**:

| اسم السر | القيمة |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID من صفحة Cloudflare Overview |
| `CLOUDFLARE_API_TOKEN` | API Token بصلاحية Account → Cloudflare Pages → Edit |

لا تُحفظ هذه القيم داخل المستودع أو داخل ملفات الموقع. بعد إضافتهما، يكفي عمل push إلى `main` ليبدأ النشر تلقائيًا. تعليمات Cloudflare الرسمية موجودة في [دليل النشر المستمر عبر CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).

## ما يجب فعله في Search Console

خريطة الموقع الصحيحة هي:

`https://decoratalahlam.com/sitemap.xml`

بعد اكتمال النشر، يجب إرسال sitemap أو إعادة إرسالها في Search Console، ثم استخدام **اختبار عنوان URL المنشور** على الرابط الأساسي بدون `.html`، مثل:

`https://decoratalahlam.com/gypsum-board-master-east-riyadh`

أما فحص الرابط القديم ذي `.html` فقد يستمر في إظهاره كـ **Redirect**، وهذا سلوك صحيح للرابط القديم وليس دليلًا على فشل الصفحة الأساسية. يجب فحص الرابط النهائي الأساسي. توضح [أداة فحص عنوان URL من Google](https://support.google.com/webmasters/answer/9012289?hl=ar) الفرق بين النسخة المفهرسة والاختبار المباشر.

## التحقق المحلي

شغّل الأمر التالي قبل أي نشر:

```bash
python3 scripts/validate_site.py
```

ويجب أن تظهر رسالة نجاح تتضمن عدد ملفات HTML والـ canonical URLs وقواعد التحويل. كما يمكن اختبار أي رابط قديم يدويًا:

```bash
curl -I https://decoratalahlam.com/gypsum-board-master-east-riyadh.html
curl -I https://decoratalahlam.com/gypsum-board-master-east-riyadh
```

النتيجة الصحيحة بعد النشر هي `301` للرابط القديم و`200` للرابط الأساسي.
