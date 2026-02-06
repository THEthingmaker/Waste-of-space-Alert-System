async function decrypt(b64,k){
 let d=atob(b64);
 let n=new Uint8Array(d.length);
 for(let i=0;i<d.length;i++)n[i]=d.charCodeAt(i);
 let nonce=n.slice(0,12),tag=n.slice(12,28),ct=n.slice(28);
 let km=await crypto.subtle.importKey("raw",
  new TextEncoder().encode(k),"PBKDF2",0,["deriveKey"]);
 let key=await crypto.subtle.deriveKey({
  name:"PBKDF2",salt:nonce,iterations:1e5,hash:"SHA-256"},
  km,{name:"AES-GCM",length:256},0,["decrypt"]);
 let dec=await crypto.subtle.decrypt({
  name:"AES-GCM",iv:nonce},key,new Uint8Array([...ct,...tag]));
 let data=JSON.parse(new TextDecoder().decode(dec));
 if(typeof show==='function')show(data);
 else sessionStorage.setItem('data',JSON.stringify(data));
 return data;
}
