$(document).ready(function () {

            
    console.log('button clicked')
    $(".deleteButton").click(function (e) {
        e.preventDefault();

        let deleteProduct = $(this).siblings('.deleteId');
        let deleteProductId=deleteProduct.val()
        console.log(deleteProductId);

        swal.fire({
            title: 'Are you sure want to delete the product?',
            text: "This process can't be undone",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Proceed',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/admin/deleteproduct",
                    type: "POST",
                    data: {
                        id: deleteProductId
                    },
                    success: function (data) {
                        location.reload();
                    }

                })
            }


        })
    })   





  


    $('#myTable').DataTable();
})
