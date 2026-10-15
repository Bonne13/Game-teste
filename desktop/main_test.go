package main
import("net/http/httptest";"testing";"strings")
func TestBundledGame(t *testing.T){for _,path:=range []string{"/","/game.js","/career-economy.js","/leagues.js","/club-database.js","/football-3d.js","/vendor/three.min.js","/data/coverage.json"}{w:=httptest.NewRecorder();handler().ServeHTTP(w,httptest.NewRequest("GET",path,nil));if w.Code!=200{t.Fatalf("%s: %d",path,w.Code)};if w.Body.Len()==0{t.Fatalf("empty %s",path)}}}
func TestHealthAndMissing(t *testing.T){w:=httptest.NewRecorder();handler().ServeHTTP(w,httptest.NewRequest("GET","/health",nil));if strings.TrimSpace(w.Body.String())!=appID{t.Fatal("health")};w=httptest.NewRecorder();handler().ServeHTTP(w,httptest.NewRequest("GET","/not-found",nil));if w.Code!=404{t.Fatal("missing file")}}
