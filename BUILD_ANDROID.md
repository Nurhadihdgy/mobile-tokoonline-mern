# Build Android APK - Toko Online Mobile

Panduan build APK Android **tanpa Expo** (React Native CLI).

---

## Prasyarat

1. **Node.js** >= 18
2. **Java Development Kit (JDK)** 17
   - Download: https://adoptium.net/
   - Set `JAVA_HOME` environment variable
3. **Android SDK** (via Android Studio atau command line tools)
   - Install Android Studio: https://developer.android.com/studio
   - Atau download command line tools saja
4. **Environment Variables** yang harus di-set:
   ```
   ANDROID_HOME = C:\Users\<username>\AppData\Local\Android\Sdk
   Path += %ANDROID_HOME%\platform-tools
   Path += %ANDROID_HOME%\tools
   ```

### Cek SDK yang terinstall

Pastikan SDK berikut terinstall via Android Studio > SDK Manager:
- Android SDK Platform 35
- Android SDK Build-Tools 35.0.0
- NDK 27.1.12297006
- CMake

---

## Langkah Build

### 1. Install dependencies

```bash
cd mobile
npm install
```

### 2. Build Debug APK

```bash
cd android
gradlew assembleDebug
```

Hasil APK ada di:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. Build Release APK

```bash
cd android
gradlew assembleRelease
```

Hasil APK ada di:
```
android/app/build/outputs/apk/release/app-release.apk
```

### 4. Jalankan di Emulator/Device (Development)

```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Install ke device/emulator
npm run android
```

---

## NPM Scripts

| Script | Deskripsi |
|--------|-----------|
| `npm start` | Jalankan Metro bundler |
| `npm run android` | Build & install ke device/emulator |
| `npm run android:release` | Build release APK |
| `npm run android:bundle` | Bundle JS untuk release |
| `npm run clean` | Bersihkan build cache |

---

## Signing Release APK (Opsional)

Untuk publish ke Play Store, buat keystore sendiri:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Lalu update `android/app/build.gradle` bagian `signingConfigs.release`:

```gradle
release {
    storeFile file('my-release-key.keystore')
    storePassword 'password-kamu'
    keyAlias 'my-key-alias'
    keyPassword 'password-kamu'
}
```

> **PENTING:** Jangan commit keystore dan password ke git!

---

## Troubleshooting

### Error: SDK location not found
Buat file `android/local.properties`:
```
sdk.dir=C:\\Users\\<username>\\AppData\\Local\\Android\\Sdk
```

### Error: Could not determine the dependencies of task ':app:compileDebugJavaWithJavac'
```bash
cd android
gradlew clean
cd ..
npm start -- --reset-cache
```

### Error: Unable to load script
Pastikan Metro bundler berjalan (`npm start`) sebelum menjalankan `npm run android`.

### Build lambat
Tambahkan di `android/gradle.properties`:
```
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.configureondemand=true
```
