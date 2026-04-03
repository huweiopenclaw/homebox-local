# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# ========================================
# General Android optimizations
# ========================================

# Keep application classes
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Service
-keep public class * extends android.view.View
-keep public class * extends android.app.Fragment
-keep public class * extends androidx.fragment.app.Fragment

# Keep custom views
-keep public class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
    public void set*(...);
}

# Keep Parcelable implementations
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Keep Serializable implementations
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep enum classes
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep R classes
-keep class **.R$* {
    *;
}

# Keep BuildConfig
-keep class com.homebox.local.BuildConfig { *; }

# ========================================
# Kotlin
# ========================================

# Keep Kotlin Metadata
-keep class kotlin.Metadata { *; }

# Keep Kotlin coroutines
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}

# Keep Kotlin extension functions
-keepclassmembers class **$ExtensionsKt {
    public static <methods>;
}

# Keep data classes
-keep class com.homebox.local.data.model.** { *; }

# ========================================
# Retrofit & OkHttp
# ========================================

# Retrofit
-keepattributes Signature
-keepattributes *Annotation*
-keep class retrofit2.** { *; }
-keepclasseswithmembers class * {
    @retrofit2.http.* <methods>;
}

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# Gson
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# Keep Gson POJO classes (data models)
-keep class com.homebox.local.data.model.** { *; }
-keep class com.homebox.local.network.model.** { *; }

# ========================================
# Room Database
# ========================================

-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *
-dontwarn androidx.room.paging.**

# ========================================
# Hilt/Dagger
# ========================================

-keep class dagger.** { *; }
-keep class javax.inject.** { *; }
-keep class * extends dagger.internal.Factory
-keep class * extends dagger.internal.AbstractFactory

# Hilt
-keep class hilt.** { *; }
-keep class dagger.hilt.** { *; }
-keep,allowobfuscation,allowshrinking class com.homebox.local.Hilt_*
-keep class com.homebox.local.di.** { *; }

# ========================================
# Glide
# ========================================

-keep public class * implements com.bumptech.glide.module.GlideModule
-keep class * extends com.bumptech.glide.module.AppGlideModule {
 <init>(...);
}
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}
-keep class com.bumptech.glide.load.data.ParcelFileDescriptorRewinder$InternalRewinder {
  *** rewind();
}

# ========================================
# Lifecycle & ViewModel
# ========================================

-keep class * extends androidx.lifecycle.ViewModel {
    <init>(...);
}
-keep class * extends androidx.lifecycle.AndroidViewModel {
    <init>(...);
}

# ========================================
# WebView (if applicable)
# ========================================

-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}
-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(android.webkit.WebView, java.lang.String);
}

# ========================================
# Remove logging in release builds
# ========================================

-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}

-assumenosideeffects class java.io.PrintStream {
    public *** println(...);
    public *** print(...);
}

-assumenosideeffects class kotlin.io.ConsoleKt {
    public static *** println(...);
    public static *** print(...);
}

# ========================================
# Crashlytics (if used)
# ========================================

-keep class com.crashlytics.** { *; }
-dontwarn com.crashlytics.**
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable

# ========================================
# Project-specific rules
# ========================================

# Keep all public API classes
-keep class com.homebox.local.api.** { *; }

# Keep all UI components (Activities, Fragments, etc.)
-keep class com.homebox.local.ui.** { *; }

# Keep broadcast receivers
-keep class com.homebox.local.receiver.** { *; }

# Keep services
-keep class com.homebox.local.service.** { *; }

# Keep any custom annotations
-keep class com.homebox.local.annotation.** { *; }

# ========================================
# Optimization settings
# ========================================

-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-verbose
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*,!code/allocation/variable

# Allow optimization
-allowaccessmodification

# Remove unused resources warnings
-dontwarn org.conscrypt.**
-dontwarn org.bouncycastle.**
-dontwarn org.openjsse.**
