<div dir="rtl">

# شاشة جناح كلية تكنولوجيا المعلومات · جامعة البترا

شاشة عرض لجناح الكلية: فيديوهات الأقسام والتخصصات والإنجازات ومشاريع التخرج، مع موسيقى خلفية بتوقف لحالها لما يشتغل فيديو فيه صوت، وبترجع لما يخلص.

![لقطة من الشاشة](docs/screenshot.jpg)

## الروابط

| | |
|---|---|
| 🌐 **تشغيل مباشر من المتصفح** | https://zaidabualshaar.github.io/petra-it-booth/ |
| ⬇️ **تنزيل نسخة كاملة (zip)** | https://github.com/ZaidAbuAlshaar/petra-it-booth/releases/latest/download/petra_it_booth.zip |
| 📁 **المستودع** | https://github.com/ZaidAbuAlshaar/petra-it-booth |

## التشغيل على أي لابتوب (بدون إنترنت)

1. نزّلوا ملف `petra_it_booth.zip` من الرابط فوق.
2. **فكّوا الضغط أولاً** (كليك يمين ← Extract All). التشغيل من داخل الـ zip مباشرة ما بيشتغل.
3. **Windows:** دبل كليك على `START_BOOTH.bat` ← بيفتح العرض بملء الشاشة والصوت شغال لحاله.
   - `START_BOOTH_KIOSK.bat` = نسخة مقفولة للزوار (الخروج بـ Alt+F4 فقط).
   - للخروج من العادي: F11 أو Alt+F4.
4. **Mac:** دبل كليك على `START_BOOTH_MAC.command`. إذا macOS منعه: System Settings ← Privacy & Security ← Open Anyway.
5. أو افتحوا `index.html` بأي متصفح، واضغطوا مرة على الشاشة لتفعيل الصوت.

الأفضل Google Chrome أو Microsoft Edge (على Safari بتضغطوا مرة لتفعيل الصوت). كل شي محلي (الخط والموسيقى والفيديوهات)، فقط قسم Live Cyber Threat Map وتزامن الساعة بدهم إنترنت.

## كيف بتشتغل الموسيقى

- الموسيقى الخلفية شغالة طول الوقت بصوت منخفض.
- الفيديوهات اللي فيها صوت بالأصل (09، 10، 13، 14، 15، 16، 17) ← الموسيقى بتخفت وبتوقف، وصوت الفيديو بيشتغل.
- لما يخلص الفيديو أو حدا يوقفه ← الموسيقى بترجع من نفس المكان اللي وقفت عنده.
- زر الموسيقى فوق (ON / OFF) وزر 🔊 لكتم كل شي.

## تعديل الفيديوهات

القائمة كلها بأول `script.js`. كل فيديو إله سطر فيه العنوان والقسم و`sound: true` إذا فيه صوت. التفاصيل الكاملة في `README_AR.txt`.

## ملاحظات

- الفيديوهات معاد ترميزها H.264 بنفس دقتها الأصلية (لحد أقصى 1080p) حتى تناسب حد GitHub (أقل من 100MB للملف).
- الموسيقى مقطوعات أصلية مولّدة بـ Google Lyria RealTime لهذا المشروع.
- الخط: Cairo (رخصة SIL Open Font License).
- محتوى الفيديوهات والشعار يعود لجامعة البترا · كلية تكنولوجيا المعلومات.

</div>

---

**English:** Booth display for the Faculty of IT, University of Petra. Open the [live version](https://zaidabualshaar.github.io/petra-it-booth/) or [download the zip](https://github.com/ZaidAbuAlshaar/petra-it-booth/releases/latest/download/petra_it_booth.zip), extract it, and run `START_BOOTH.bat` (Windows) or `START_BOOTH_MAC.command` (macOS). Background music pauses automatically while a video with its own audio plays and resumes afterwards.
