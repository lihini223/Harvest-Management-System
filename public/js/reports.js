const imagePreview = document.getElementById('image-preview');

function previewImage(event){
    imagePreview.src = URL.createObjectURL(event.target.files[0]);
    imagePreview.onload = function(){
        URL.revokeObjectURL(imagePreview.src);
    }
}

function newReport(){
    
}