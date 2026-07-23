let photos=[];
let selectedPhotos=new Set();
let currentPhotoIndex=0;
let galleryId=null;
document.addEventListener('DOMContentLoaded',function(){
const urlParams=new URLSearchParams(window.location.search);
galleryId=urlParams.get('gallery');
if(!galleryId){alert('❌ Galleria non trovata!');return;}
loadPhotos();
});
function loadPhotos(){
const db=JSON.parse(localStorage.getItem('gl_studio_unified_db'));
if(!db||!db.albums){alert('❌ Nessuna galleria trovata!');return;}
const gallery=db.albums.find(g=>g.id===galleryId);
if(!gallery){alert('❌ Galleria non trovata!');return;}
photos=gallery.photos||[];
if(photos.length===0){alert('⚠️ Nessuna foto nella galleria!');return;}
document.querySelector('.total-count').textContent=photos.length;
document.querySelector('.total-photos').textContent=photos.length;
renderGallery();
}
function renderGallery(){
const gallery=document.getElementById('photoGallery');
gallery.innerHTML='';
photos.forEach((photo,index)=>{
const card=document.createElement('div');
card.className='photo-card';
if(selectedPhotos.has(index))card.classList.add('selected');
card.innerHTML='<img src="'+photo+'" alt="Foto '+(index+1)+'" onclick="openModal('+index+')"><div class="photo-number">'+(index+1)+'</div>';
gallery.appendChild(card);
});
}
function openModal(index){
currentPhotoIndex=index;
const modal=document.getElementById('photoModal');
const modalImg=document.getElementById('modalImage');
const heartBtn=document.querySelector('.modal-heart');
modalImg.src=photos[index];
modal.classList.add('active');
if(selectedPhotos.has(index))heartBtn.classList.add('active');
else heartBtn.classList.remove('active');
document.body.style.overflow='hidden';
}
function closeModal(){
const modal=document.getElementById('photoModal');
modal.classList.remove('active');
document.body.style.overflow='auto';
}
function changePhoto(direction){
currentPhotoIndex+=direction;
if(currentPhotoIndex<0)currentPhotoIndex=photos.length-1;
else if(currentPhotoIndex>=photos.length)currentPhotoIndex=0;
const modalImg=document.getElementById('modalImage');
modalImg.src=photos[currentPhotoIndex];
const heartBtn=document.querySelector('.modal-heart');
if(selectedPhotos.has(currentPhotoIndex))heartBtn.classList.add('active');
else heartBtn.classList.remove('active');
}
function toggleHeart(){
const heartBtn=document.querySelector('.modal-heart');
if(selectedPhotos.has(currentPhotoIndex)){selectedPhotos.delete(currentPhotoIndex);heartBtn.classList.remove('active');}
else{selectedPhotos.add(currentPhotoIndex);heartBtn.classList.add('active');}
updateCounter();renderGallery();
}
function nextPhoto(){changePhoto(1);}
function prevPhoto(){changePhoto(-1);}
function updateCounter(){document.querySelector('.selected-count').textContent=selectedPhotos.size;}
function inviaSelezione(){
if(selectedPhotos.size===0){alert('⚠️ Seleziona almeno una foto prima di inviare!');return;}
if(!confirm('✅ Hai selezionato '+selectedPhotos.size+' foto su '+photos.length+'.\n\nConfermi l\'invio della selezione?'))return;
const db=JSON.parse(localStorage.getItem('gl_studio_unified_db'));
const gallery=db.albums.find(g=>g.id===galleryId);
if(gallery){
gallery.selection=Array.from(selectedPhotos).map(i=>photos[i]);
gallery.selectionDate=new Date().toISOString();
gallery.selectedNames=Array.from(selectedPhotos).map(i=>'Foto_'+(i+1)+'.jpg');
gallery.downloaded=false;
localStorage.setItem('gl_studio_unified_db',JSON.stringify(db));
}
document.getElementById('successMessage').style.display='flex';
}
document.addEventListener('keydown',function(e){
if(!document.getElementById('photoModal').classList.contains('active'))return;
if(e.key==='Escape')closeModal();
else if(e.key==='ArrowLeft')prevPhoto();
else if(e.key==='ArrowRight')nextPhoto();
else if(e.key===' '||e.key==='Enter')toggleHeart();
});
document.getElementById('photoModal').addEventListener('click',function(e){if(e.target===this)closeModal();});
