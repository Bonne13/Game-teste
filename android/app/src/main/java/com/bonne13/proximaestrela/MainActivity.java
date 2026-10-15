package com.bonne13.proximaestrela;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import androidx.webkit.WebViewAssetLoader;
import java.io.ByteArrayInputStream;
import java.util.Collections;

/** Offline game packaged as a native Android activity, with a stable local origin. */
public class MainActivity extends Activity {
    private static final String GAME_URL = "https://appassets.androidplatform.net/assets/game/index.html";
    private WebView game;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(16, 26, 25));
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        game = new WebView(this);
        root.addView(game, new FrameLayout.LayoutParams(-1, -1));
        ProgressBar loading = new ProgressBar(this);
        FrameLayout.LayoutParams spinner = new FrameLayout.LayoutParams(96, 96, android.view.Gravity.CENTER);
        root.addView(loading, spinner);
        setContentView(root);
        WebSettings settings = game.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setGeolocationEnabled(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        WebView.setWebContentsDebuggingEnabled(false);
        game.setBackgroundColor(Color.rgb(16, 26, 25));
        WebViewAssetLoader assets = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        game.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isGameUrl(uri)) {
                    WebResourceResponse response = assets.shouldInterceptRequest(uri);
                    if (response != null) return response;
                }
                // Missing or external resources must not fall back to the network.
                return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found",
                    Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isGameUrl(uri)) return false;
                if (request.hasGesture() && ("https".equals(uri.getScheme()) || "http".equals(uri.getScheme()))) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
                    catch (ActivityNotFoundException ignored) { }
                }
                return true;
            }
            @Override public void onPageFinished(WebView view, String url) { loading.setVisibility(View.GONE); }
            @Override public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame() && !isFinishing()) {
                    loading.setVisibility(View.GONE);
                    new AlertDialog.Builder(MainActivity.this).setTitle("Não foi possível abrir o jogo")
                        .setMessage("Os arquivos estão no aplicativo. Tente abrir novamente.")
                        .setPositiveButton("Tentar novamente", (dialog, which) -> game.loadUrl(GAME_URL))
                        .setNegativeButton("Fechar", (dialog, which) -> finish()).show();
                }
            }
            @Override public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                ((FrameLayout) view.getParent()).removeView(view);
                view.destroy(); game = null;
                new AlertDialog.Builder(MainActivity.this).setTitle("Reabrir o jogo")
                    .setMessage("O renderizador foi encerrado. Sua carreira salva será preservada; uma partida em andamento será reiniciada.")
                    .setPositiveButton("Reabrir", (dialog, which) -> recreate())
                    .setNegativeButton("Fechar", (dialog, which) -> finish()).show();
                return true;
            }
        });
        game.loadUrl(GAME_URL);
    }
    private static boolean isGameUrl(Uri uri) {
        return "https".equals(uri.getScheme()) && "appassets.androidplatform.net".equals(uri.getHost())
            && uri.getPort() == -1 && uri.getPath() != null && uri.getPath().startsWith("/assets/game/");
    }
    @Override protected void onPause() { if (game != null) { game.onPause(); game.pauseTimers(); } super.onPause(); }
    @Override protected void onResume() { super.onResume(); if (game != null) { game.onResume(); game.resumeTimers(); } }
    @Override protected void onDestroy() { if (game != null) { game.destroy(); game = null; } super.onDestroy(); }
}
