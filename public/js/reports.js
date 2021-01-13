const imagePreview = document.getElementById('image-preview');

function previewImage(event){
    imagePreview.src = URL.createObjectURL(event.target.files[0]);
    imagePreview.onload = function(){
        URL.revokeObjectURL(imagePreview.src);
    }
}

function openEdit(reportId){
    const reportContent = document.getElementById('d' + reportId);
    const reportForm = document.getElementById('f' + reportId);

    if(reportForm.style.display == 'none'){
        reportContent.style.display = 'none';
        reportForm.style.display = 'block';
    } else {
        reportContent.style.display = 'block';
        reportForm.style.display = 'none';
    }
}

function cancelEdit(reportId){
    const reportContent = document.getElementById('d' + reportId);
    const reportForm = document.getElementById('f' + reportId);

    reportContent.style.display = 'block';
    reportForm.style.display = 'none';
}