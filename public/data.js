$(document).ready(function(){
    //alert('application started');

    getdata();

    $('.addbtn').click(function(){
         var PrinterName = $("#PrinterName").val();
       $.ajax({
           url:'/printers/AddPrinter',
           method:'post',
           dataType:'json',
           data:{'PrinterName':PrinterName},
           success:function(response){
               if(response.msg=='success'){
               getdata();
               $('#PrinterName').val('')
               }else{
                   alert('some error occurred try again');
               }
           },
           error:function(response){
               alert('server error occured')
           }
       });
    });
    $(document).on('click','button.del',function(){
        var id = $(this).parent().find('button.del').val();
        // alert('delte',id)
        $.ajax({
            url:'/printers/RemovePrinter',
            method:'delete',
            dataType:'json',
            data:{'id':id},
            success:function(response){
                if(response.msg=='success'){
                    //alert('data deleted');
                    getdata();
                }else{
                    alert('data not get deleted');
                }
            },
            error:function(response){
                     alert('server error')   
            }
        });
    });
    function getdata(){
        $.ajax({
            url:'/printers/GetPrinters',
            method:'get',
            dataType:'json',
            success:function(response){
                 if(response.msg=='success'){
                     $('tr.printerrow').remove()
                     if(response.data==undefined || response.data==null || response.data==''){
                         $('.tblData').hide();
                     }else{
                        $('.tblData').show();
                     $.each(response.data,function(index,data){
                         var url = url+data._id;
                         index+=1;
            $('tbody').append("<tr class='printerrow'><td>"+ index +"</td><td>"+data.Name+"</td><td>"+"<button class='del' value='"+data._id+"'>delete</button>"+"</td></tr>"); 
                     });
                 }
               }
            },
            error:function(response){
                alert('server error');
            }
        });
    }
});
