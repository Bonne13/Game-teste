package main

import (
 "bufio"
 "context"
 "embed"
 "fmt"
 "io"
 "io/fs"
 "net"
 "net/http"
 "os"
 "os/exec"
 "os/signal"
 "path/filepath"
 "runtime"
 "strings"
 "time"
)

//go:embed assets
var assets embed.FS
const address="127.0.0.1:38479"
const appID="proxima-estrela-local-v1"

func handler() http.Handler {
 files,_:=fs.Sub(assets,"assets")
 static:=http.FileServer(http.FS(files))
 mux:=http.NewServeMux()
 mux.HandleFunc("/health",func(w http.ResponseWriter,r *http.Request){w.Header().Set("Content-Type","text/plain; charset=utf-8");fmt.Fprint(w,appID)})
 mux.HandleFunc("/",func(w http.ResponseWriter,r *http.Request){
  w.Header().Set("Cache-Control","no-cache")
  if r.URL.Path!="/" { info,err:=fs.Stat(files,strings.TrimPrefix(r.URL.Path,"/"));if err!=nil||info.IsDir(){http.NotFound(w,r);return} }
  static.ServeHTTP(w,r)
 })
 return mux
}
func openBrowser(url string) error {
 var cmd *exec.Cmd
 switch runtime.GOOS {case "windows":
  for _,base:=range []string{os.Getenv("ProgramFiles(x86)"),os.Getenv("ProgramFiles"),os.Getenv("LOCALAPPDATA")} {
   if base=="" {continue}
   edge:=filepath.Join(base,"Microsoft","Edge","Application","msedge.exe")
   if info,err:=os.Stat(edge);err==nil&&!info.IsDir(){cmd=exec.Command(edge,"--app="+url,"--window-size=1280,900","--no-first-run");if err=cmd.Start();err==nil{go cmd.Wait();return nil}}
  }
  cmd=exec.Command("rundll32.exe","url.dll,FileProtocolHandler",url);case "darwin":cmd=exec.Command("open",url);default:cmd=exec.Command("xdg-open",url)}
 if err:=cmd.Start();err!=nil{return err};go cmd.Wait();return nil
}
func alreadyRunning() bool {client:=http.Client{Timeout:time.Second};r,err:=client.Get("http://"+address+"/health");if err!=nil{return false};defer r.Body.Close();body,_:=io.ReadAll(io.LimitReader(r.Body,100));return string(body)==appID}
func main(){
 url:="http://"+address+"/"
 fmt.Println("PROXIMA ESTRELA - versao de teste para computador")
 listener,err:=net.Listen("tcp",address)
 if err!=nil {if alreadyRunning(){openBrowser(url);fmt.Println("O jogo ja estava aberto.");return};fmt.Println("Nao foi possivel abrir a porta local do jogo:",err);fmt.Println("Feche outra instancia do jogo e tente novamente. Pressione Enter para sair.");bufio.NewReader(os.Stdin).ReadString('\n');return}
 server:=&http.Server{Handler:handler(),ReadHeaderTimeout:5*time.Second}
 go func(){if err:=server.Serve(listener);err!=nil&&err!=http.ErrServerClosed{fmt.Println("Servidor local:",err)}}()
 fmt.Println("Abrindo a janela do jogo (Microsoft Edge em modo aplicativo)...")
 if err:=openBrowser(url);err!=nil{fmt.Println("Abra este endereco no navegador:",url)}
 fmt.Println("Mantenha esta janela aberta enquanto joga.")
 fmt.Println("Seu progresso fica salvo neste navegador e neste computador.")
 fmt.Println("Para encerrar o jogo, volte aqui e pressione Enter.")
 done:=make(chan struct{},1)
 go func(){bufio.NewReader(os.Stdin).ReadString('\n');done<-struct{}{}}()
 signals:=make(chan os.Signal,1);signal.Notify(signals,os.Interrupt)
 select{case <-done:case <-signals:}
 ctx,cancel:=context.WithTimeout(context.Background(),3*time.Second);defer cancel();server.Shutdown(ctx)
}
