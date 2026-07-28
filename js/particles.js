// ==========================
// أدوات مساعدة للكانفاس
// ==========================

// دالة لضبط أبعاد الكانفاس بدقة عالية مع دعم devicePixelRatio
function fitCanvasToSize(canvas) {
  // نحصل على نسبة كثافة البكسلات (لتحسين حدّة الرسم على الشاشات العالية الدقة)
  var dpr = window.devicePixelRatio || 1; // إذا لم تتوفر تكون 1
  // نقرأ العرض/الارتفاع CSSيين
  var cssWidth = canvas.clientWidth; // عرض الكانفاس وفق الـ CSS
  var cssHeight = canvas.clientHeight; // ارتفاع الكانفاس وفق الـ CSS
  // نعين الأبعاد الفعلية للبكسلات (مضروبة في dpr لزيادة الدقة)
  canvas.width = Math.floor(cssWidth * dpr); // العرض الحقيقي بالبكسلات
  canvas.height = Math.floor(cssHeight * dpr); // الارتفاع الحقيقي بالبكسلات
  // نكـبّر/نقلّص سياق الرسم بنفس النسبة حتى تتوافق الإحداثيات مع CSS
  var ctx = canvas.getContext("2d"); // الحصول على سياق الرسم
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // مصفوفة التحويل: تكبير الإحداثيات بـ dpr
  return ctx; // نرجع السياق لاستخدامه مباشرة
}

// مولّد رقم عشوائي في مدى [min, max)
function rand(min, max) {
  return Math.random() * (max - min) + min; // قيمة عشوائية بين الحدين
}

// اختيار عنصر عشوائي من مصفوفة
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]; // عنصر عشوائي
}

// دالة Easing ناعمة على شكل "قبة": 0 -> 1 -> 0 بسلاسة (raised cosine)
function smoothPulse(t) {
  // t يُفترض بين 0 و 1. نستخدم cos لتحويله لمنحنى ناعم
  return 0.5 - 0.5 * Math.cos(2 * Math.PI * t); // يعطي قمة ناعمة في المنتصف
}

// ==========================
// فئة الجسيم Particle
// ==========================
function Particle(canvas, config) {
  // مرجع للكانفاس والسياق
  this.canvas = canvas; // نخزن الكانفاس
  this.ctx = canvas.getContext("2d"); // سياق الرسم
  // ألوان محتملة
  this.colors = config.colors; // مصفوفة ألوان
  // حجم أساسي للجسيم
  this.baseRMin = config.baseRMin; // أقل نصف قطر أساسي
  this.baseRMax = config.baseRMax; // أكبر نصف قطر أساسي
  // سرعة الحركة
  this.speedMin = config.speedMin; // أقل سرعة
  this.speedMax = config.speedMax; // أكبر سرعة
  // المدة الزمنية لدورة الظهور/الاختفاء (ثواني)
  this.lifeMin = config.lifeMin; // أقل مدة
  this.lifeMax = config.lifeMax; // أكبر مدة
  // نوع الشكل: دائرة أو خماسي
  this.shape = config.shape; // "circle" أو "pentagon"
  // نسبة الشفافية الصغرى (حتى لا تختفي تمامًا إن أردنا)
  this.minAlpha = config.minAlpha; // أقل ألفا
  // لتقليل تزامن الجسيمات، نبدأ بأعمار عشوائية
  this.age = rand(0, 1); // عمر نسبي [0..1] كبداية عشوائية
  // التهيئة الأولى للقيم العشوائية الأخرى
  this.reset(true); // true => ضع موضعًا أوليًا عشوائيًا
}

// إعادة ضبط/تجديد خصائص الجسيم (مع الإبقاء عليه في نفس الكانفاس)
Particle.prototype.reset = function (randomizePosition) {
  // تحديد العرض/الارتفاع من الكانفاس (CSSيًا لأننا استخدمنا setTransform)
  var w = this.canvas.clientWidth; // عرض مرئي للكانفاس
  var h = this.canvas.clientHeight; // ارتفاع مرئي للكانفاس

  // الموضع الابتدائي
  if (randomizePosition) {
    this.x = rand(0, w); // إحداثي x عشوائي داخل العرض
    this.y = rand(0, h); // إحداثي y عشوائي داخل الارتفاع
  }

  // نصف القطر الأساسي (قبل التدرّج بالحجم)
  this.baseR = rand(this.baseRMin, this.baseRMax); // قيمة بين الحدّين

  // السرعة (اتجاه عشوائي وسرعة عشوائية)
  var angle = rand(0, Math.PI * 2); // اتجاه الحركة بالراديان
  var speed = rand(this.speedMin, this.speedMax); // مقدار السرعة
  this.vx = Math.cos(angle) * speed; // مركبة X للسرعة
  this.vy = Math.sin(angle) * speed; // مركبة Y للسرعة

  // زمن الدورة (lifespan) بالثواني + عمر حالي عشوائي داخلها
  this.life = rand(this.lifeMin, this.lifeMax); // طول الدورة
  this.t = rand(0, this.life); // وقت حالي داخل الدورة

  // اللون
  this.color = pick(this.colors); // اختيار لون عشوائي
};

// تحديث في كل إطار
Particle.prototype.update = function (dt) {
  // تحديث الوقت داخل الدورة
  this.t += dt; // نتقدم في الزمن
  if (this.t > this.life) {
    // إذا انتهت الدورة
    this.t -= this.life; // نلفّ لبداية الدورة مجددًا (تكرار)
    // نعيد اختيار بعض القيم لمنع الملل
    this.baseR = rand(this.baseRMin, this.baseRMax); // تغيير الحجم الأساسي
    this.life = rand(this.lifeMin, this.lifeMax); // تغيير مدة الدورة
    this.color = pick(this.colors); // ربما لون جديد
  }

  // حساب نسبة التقدّم داخل الدورة [0..1]
  var phase = this.t / this.life; // نسبة التقدّم

  // نحصل على نبضة ناعمة 0→1→0 باستخدام smoothPulse
  var pulse = smoothPulse(phase); // قيمة ناعمة للزيادة/النقصان

  // نحول النبضة إلى حجم وشفافية سلسين
  this.scale = 0.4 + 0.6 * pulse; // مقياس الحجم بين 0.4 و 1.0
  this.alpha = this.minAlpha + (1 - this.minAlpha) * pulse; // الشفافية

  // تحريك الموضع
  this.x += this.vx * dt * 60; // ضرب بـ 60 لجعل السرعة تقريبية لكل إطار (frame-rate independent)
  this.y += this.vy * dt * 60;

  // ارتداد بسيط عن الحدود لإبقاء الجسيمات داخل المنطقة
  var w = this.canvas.clientWidth;
  var h = this.canvas.clientHeight;
  if (this.x < 0 || this.x > w) {
    this.vx *= -1;
  } // عكس الاتجاه أفقيًا
  if (this.y < 0 || this.y > h) {
    this.vy *= -1;
  } // عكس الاتجاه رأسيًا
};

// رسم الجسيم
Particle.prototype.draw = function () {
  var ctx = this.ctx; // مرجع مختصر للسياق
  ctx.save(); // حفظ الحالة الحالية
  ctx.globalAlpha = this.alpha; // تعيين الشفافية المحسوبة
  ctx.fillStyle = this.color; // تعيين اللون

  // محسوب نصف القطر الحالي بعد تطبيق المقياس
  var r = this.baseR * this.scale; // نصف قطر نهائي

  // اختيار طريقة الرسم حسب الشكل
  if (this.shape === "pentagon") {
    // رسم مضلع خماسي
    var sides = 5; // عدد الأضلاع
    var step = (Math.PI * 2) / sides; // الزاوية بين الرؤوس
    var start = -Math.PI / 2; // بداية من الأعلى
    ctx.beginPath(); // بدء مسار جديد
    for (var i = 0; i < sides; i++) {
      // حلقة عبر الرؤوس
      var angle = start + i * step; // زاوية الرأس الحالية
      var px = this.x + Math.cos(angle) * r; // إحداثي x للرأس
      var py = this.y + Math.sin(angle) * r; // إحداثي y للرأس
      if (i === 0) {
        ctx.moveTo(px, py);
      } // الانتقال للرأس الأول
      else {
        ctx.lineTo(px, py);
      } // رسم خط للرأس التالي
    }
    ctx.closePath(); // إغلاق المسار
    ctx.fill(); // تعبئة الخماسي
  } else {
    // رسم دائرة
    ctx.beginPath(); // بدء مسار
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2); // دائرة كاملة
    ctx.fill(); // تعبئة الدائرة
  }

  ctx.restore(); // استعادة الحالة
};

// ==========================
// مُشغّل نظام الجسيمات لكل كانفاس
// ==========================
function runParticles(canvas, options) {
  // الحصول على سياق مضبوط الدقة
  var ctx = fitCanvasToSize(canvas); // يضبط الدقة ويعيد السياق (قد لا نستخدم ctx مباشرة هنا)

  // إنشاء مجموعة جسيمات
  var particles = []; // مصفوفة الجسيمات

  // توليد عدد الجسيمات حسب الخيارات
  var count = options.count; // العدد
  for (var i = 0; i < count; i++) {
    // حلقة توليد
    // اختيار الشكل: في الـ Hero نحتاج خليطًا، في الأقسام الأخرى دوائر فقط
    var shapeValue = options.mixed
      ? Math.random() < 0.6
        ? "pentagon"
        : "circle"
      : "circle";
    var p = new Particle(canvas, {
      // ننشئ جسيمًا جديدًا
      colors: options.colors, // الألوان
      baseRMin: options.baseRMin, // أقل نصف قطر
      baseRMax: options.baseRMax, // أكبر نصف قطر
      speedMin: options.speedMin, // أقل سرعة
      speedMax: options.speedMax, // أكبر سرعة
      lifeMin: options.lifeMin, // أقل مدة دورة
      lifeMax: options.lifeMax, // أكبر مدة دورة
      minAlpha: options.minAlpha, // أقل شفافية
      shape: shapeValue, // نوع الشكل
    });
    particles.push(p); // إضافة المصنوع للمصفوفة
  }

  // متغيرات التوقيت للإطارات
  var lastTime = performance.now(); // وقت الإطار السابق بالمللي ثانية

  // دالة الرسم لكل إطار
  function frame(now) {
    // حساب الفرق الزمني بالثواني (لجعل الحركة مستقلة عن عدد الإطارات)
    var dt = Math.max(0.001, (now - lastTime) / 1000); // زمن الإطار السابق → الحالي
    lastTime = now; // تحديث الوقت السابق

    // مسح الكانفاس بالكامل قبل الرسم
    ctx.clearRect(0, 0, canvas.width, canvas.height); // تنظيف

    // تحديث ثم رسم كل جسيم
    for (var i = 0; i < particles.length; i++) {
      particles[i].update(dt); // تحديث الحالة
      particles[i].draw(); // رسمه
    }

    // طلب إطار جديد
    requestAnimationFrame(frame); // تكرار اللوب
  }

  // بدء الحلقة
  requestAnimationFrame(frame); // أول استدعاء

  // عند تغيير حجم النافذة، نعيد ضبط الكانفاس (للحفاظ على الدقة)
  function onResize() {
    fitCanvasToSize(canvas); // يعيد ضبط القياسات والتحويل
  }
  window.addEventListener("resize", onResize); // استماع لحدث تغيير الحجم

  // إرجاع دالة تنظيف إذا احتجنا لاحقًا (ليس ضروريًا هنا)
  return function cleanup() {
    window.removeEventListener("resize", onResize); // إزالة الحدث
  };
}

// ==========================
// إعداد القيم الافتراضية والألوان
// ==========================
var palette = ["#FE7F2D", "#6C5CE7", "#74B9FF", "#8D493A", "#FFEAA7"]; // ألوان متناسقة

// تشغيل للـ Hero (خليط أشكال وعدد كبير)
var heroCanvas = document.querySelector('canvas[data-role="hero"]'); // الحصول على كانفاس الـ Hero
runParticles(heroCanvas, {
  count: 20, // عدد الجسيمات في الـ Hero
  mixed: true, // خليط: دوائر + خماسيات
  colors: palette, // لوحة الألوان
  baseRMin: 3, // أقل نصف قطر أساسي
  baseRMax: 10, // أكبر نصف قطر أساسي
  speedMin: 0.05, // أقل سرعة (بالبكسل لكل إطار تقريبي)
  speedMax: 0.5, // أكبر سرعة
  lifeMin: 3, // أقل مدة دورة (ثواني)
  lifeMax: 6, // أكبر مدة دورة
  minAlpha: 0.05, // أقل شفافية حتى لا تختفي فجأة
});

// تشغيل للأقسام الأخرى (دائرتان فقط في كل قسم)
var lightCanvases = document.querySelectorAll('canvas[data-role="light"]'); // جميع كانفاسات الأقسام
for (var i = 0; i < lightCanvases.length; i++) {
  runParticles(lightCanvases[i], {
    count: 2, // دائرتان فقط
    mixed: false, // أشكال غير مختلطة (دوائر فقط)
    colors: palette, // نفس لوحة الألوان
    baseRMin: 6, // نصف قطر أكبر قليلًا ليظهر بوضوح
    baseRMax: 12,
    speedMin: 0.04, // سرعات لطيفة
    speedMax: 0.25,
    lifeMin: 4, // دورات أطول قليلًا
    lifeMax: 8,
    minAlpha: 0.08, // لا تختفي تمامًا
  });
}
