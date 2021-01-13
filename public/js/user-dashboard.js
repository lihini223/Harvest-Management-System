const chatSection = document.getElementById('chat-section');

function toggleChat(){
    if(chatSection.style.display == 'none'){
        chatSection.style.display = 'block';
    } else {
        chatSection.style.display = 'none';
    }
}