$(function() { 

       $('#source').focus();

       var shorten = function() {
               $.ajax({
                       url: 'shorten',
                       data: { url: $('#source').val() },
                       type: 'GET',
                       success: function(data) { 
                               $('#source').val('http://jeg.herokuapp.com/' + data);
                                //$('button').removeClass("hide");
                                $('#sub').hide();
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