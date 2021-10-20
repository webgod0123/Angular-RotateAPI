
/*********Add Form Duplicate Script**********/
$(document).ready(function(){

 $('#but_add').click(function(){

  // Create clone of <div class='input-form'>
  var newel = $('.input-form:last').clone();

  // Add after last <div class='input-form'>
  $(newel).insertAfter(".input-form:last");
 });

 $('.txt').focus(function(){
  $(this).css('border-color','red');
 });
 
 $('.txt').focusout(function(){
  $(this).css('border-color','initial');
 });

});







/*********Text Editor Script**********/
ClassicEditor
  .create( document.querySelector( '#editor' ) )
  .catch( error => {
    console.error( error );
  } );