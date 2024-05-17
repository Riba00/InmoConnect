import { Dropzone } from 'dropzone';

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


Dropzone.options.images = {
    dictDefaultMessage: 'Drop your images here',
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFiles: 4,
    parallelUploads: 4,
    uploadMultiple: true,
    maxFilesize: 4,
    dictRemoveFile: 'Delete image',
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictMaxFilesExceeded: 'You can only upload 4 images',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'images',
    init: function() {
        const dropzone = this
        const publishBtn = document.querySelector('#publishButton')

        publishBtn.addEventListener('click', function() {
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function(){
            if (dropzone.getActiveFiles().length == 0) {
                console.log('redirect');
                window.location.href = '/my-properties'
            }
        })
    }
}