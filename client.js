const loginSection=document.getElementById('loginSection');
const gallerySection=document.getElementById('gallerySection');
const clientLoginForm=document.getElementById('clientLoginForm');
const galleryLink=document.getElementById('galleryLink');
const authError=document.getElementById('authError');
const urlParams=new URLSearchParams(window.location.search);
const clientToken=urlParams.get('token');
if(!clientToken){
authError.textContent='❌ Link non valido! Contatta lo staff per il link corretto.';
loginSection.style.display='none';
}else{
const clientData=decodeClientToken(clientToken);
if(!clientData||!clientData.u||!clientData.p||!clientData.m){
authError.textContent='❌ Link danneggiato o scaduto! Contatta lo staff.';
loginSection.style.display='none';
}else{
window.clientData=clientData;
const infoMsg=document.createElement('div');
infoMsg.className='info-message';
infoMsg.innerHTML='<strong>ℹ️ Credenziali di accesso:</strong><br>Username: <strong>'+clientData.u+'</strong><br>Password: <strong>'+clientData.p+'</strong>';
loginSection.insertBefore(infoMsg,loginSection.firstChild);
}
}
clientLoginForm.addEventListener('submit',handleClientLogin);
function handleClientLogin(e){
e.preventDefault();
const username=document.getElementById('username').value;
const password=document.getElementById('password').value;
if(window.clientData&&window.clientData.u===username&&window.clientData.p===password){
authError.textContent='';
showGallery(window.clientData.m);
}else{
authError.textContent='❌ Credenziali errate! Controlla username e password.';
}
}
function showGallery(megaLink){
loginSection.style.display='none';
gallerySection.style.display='block';
galleryLink.href=megaLink;
galleryLink.target='_blank';
}
function decodeClientToken(token){
try{
const safeToken=token.replace(/-/g,'+').replace(/_/g,'/');
const paddedToken=safeToken+'='.repeat((4-safeToken.length%4)%4);
const json=atob(paddedToken);
const payload=JSON.parse(json);
const oneYear=365*24*60*60*1000;
if(Date.now()-payload.t>oneYear){console.warn('Token scaduto');return null;}
return payload;
}catch(e){
console.error('❌ Errore decodifica token:',e);
return null;
}
}
console.log('Token ricevuto:',clientToken);
if(clientToken)console.log('Decodifica tentativo:',decodeClientToken(clientToken));
