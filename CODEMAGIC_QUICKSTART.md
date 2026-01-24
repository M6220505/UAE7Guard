# 🚀 Codemagic - البدء السريع

## الخطوات الأساسية (5 دقائق)

### 1️⃣ إنشاء App Store Connect API Key

```
1. اذهب: https://appstoreconnect.apple.com
2. Users and Access → Keys → Generate API Key
3. Name: Codemagic UAE7Guard
4. Access: App Manager
5. Download .p8 file
6. احفظ: Issuer ID + Key ID + محتوى .p8
```

### 2️⃣ إعداد Codemagic

```
1. سجل في: https://codemagic.io/signup
2. Add application → اختر GitHub/GitLab
3. اختر repository: UAE7Guard
4. Teams → Integrations → Add integration
5. App Store Connect:
   - Name: UAE7Guard Production Key
   - Issuer ID: [من Apple]
   - Key ID: [من Apple]
   - API Key: [الصق محتوى .p8]
6. Save
```

### 3️⃣ تشغيل Build

```
1. Applications → UAE7Guard
2. Start new build
3. Workflow: ios-release
4. Branch: main
5. Start new build
```

**✅ انتهى! Codemagic يسوي كل شي تلقائياً:**
- ✅ Build التطبيق
- ✅ Code signing
- ✅ Upload لـ TestFlight
- ✅ إشعار بالنتيجة

---

## 📱 بعد اكتمال Build

### في App Store Connect:

```
1. https://appstoreconnect.apple.com
2. My Apps → Create new app (إذا أول مرة)
3. املأ المعلومات من: APP_STORE_METADATA.md
4. ارفع Screenshots
5. أضف Demo Account:
   Email: applereview@uae7guard.com
   Password: AppleReview2026
6. اختر Build (من TestFlight)
7. Submit to App Review
```

---

## 📚 الدلائل الكاملة

- **تفاصيل كاملة:** `CODEMAGIC_SUBMISSION_GUIDE.md`
- **معلومات App Store:** `APP_STORE_SUBMISSION_GUIDE.md`
- **النصوص الجاهزة:** `APP_STORE_METADATA.md`
- **Screenshots:** `docs/APP_STORE_SCREENSHOTS_GUIDE.md`

---

## ⏱️ الوقت المتوقع

| المرحلة | الوقت |
|---------|-------|
| إعداد Codemagic | 5 دقائق |
| Build في Codemagic | 15-20 دقيقة |
| Processing في App Store | 10-15 دقيقة |
| ملء معلومات App Store | 30-45 دقيقة |
| **الإجمالي** | **~1 ساعة** |

---

## 🔄 التحديثات المستقبلية

```bash
# فقط اعمل push والباقي أوتوماتيكي:
git add .
git commit -m "Update version 1.1"
git push origin main

# Codemagic يبني ويرفع تلقائياً! 🎉
```

---

**بالتوفيق! 🚀**
