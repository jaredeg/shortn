$(function() { 

       $('#source').focus();

       var shorten = function() {
               $.ajax({
                       url: 'shorten',
                       data: { url: $('#source').val() },
                       type: 'GET',
                       success: function(data) { 
                               $('#source').val(data);
                                //$('button').removeClass("hide");
                       }
               })
       }

       $('#source').keypress(function(e) { 
               if (e.which == 13) {
               		$('#short').hide();
                    shorten();
               }
       });
       $('#sub').on('click', function(e){
                   $('#short').hide();
                    shorten();

       });


});