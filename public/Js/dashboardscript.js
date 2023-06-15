

    $('.otherButton').click(function() {
      $('#addAddress').attr('aria-selected', 'false');
      $('#addAddress').removeClass('active');
    });
  



                                    /*UPDATING THE ADDRESS */
$('.updatebtn').on('click',function(){
	// let $submitValues  = $(this).closest('form').find('.form-control'); 
	// let value = $submitValues.val();
	
	Swal.fire({
		title: 'Are you sure want to update?',
		text: "You won't be able to revert this!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!'
	  }).then((result) => {
		if (result.isConfirmed) {
		  Swal.fire(
			'Deleted!',
			'Your file has been deleted.',
			'success'
		  )
		}
	  })



 	let firstname = $("#firstname").val()
	let lastname = $("#lastname").val()
	let name = $("#displayname").val()
	let email = $("#email").val() 
	
		let addressname = $("#addressname").val()
		let houseNo = $("#house").val()
		let street = $("#street").val()
		let state = $("#state").val()
		let pincode = $("#pincode").val()
		let phone = $("#phone").val()
		let alternatePhone = $("#alternatePhone").val()
		let addressid = $("#addressid").val()
		
	console.log(firstname)
	console.log(lastname)
	console.log(name)
	console.log(email)
	console.log(addressname)
	console.log(houseNo)
	console.log(street)
	console.log(state)
	console.log(pincode)
	console.log(alternatePhone)
	console.log(addressid)
    

	data={
		firstname:firstname,
		lastname:lastname,
		name:name,
		email:email,
		addressname:addressname,
		houseNo:houseNo,
		street:street,
		state:state,
		pincode:pincode,
		phone:phone,
		alternatePhone:alternatePhone,
		addressid:addressid
	}


	$.ajax({
		url:`/dashboard/userupdate`,
		method:"put",
		data:data,
		success:function(data){

			toastr.options = {
				"closeButton": false,
				"debug": false,
				"newestOnTop": true,
				"progressBar": false,
				"positionClass": "toast-top-right",
				"preventDuplicates": false,
				"onclick": null,
				"showDuration": "200",
				"hideDuration": "500",
				"timeOut": "1000",
				"extendedTimeOut": "1000",
				"showEasing": "swing",
				"hideEasing": "linear",
				"showMethod": "fadeIn",
				"hideMethod": "fadeOut"
				}


			if(response.messsage=="user details updated"){
				toastr["success"]("User Details updated Successfullt", "Success")
			location.reload()
		}
		}

	})


})


$('.AddAdressbtn').on('click',function(){
	// let $submitValues  = $(this).closest('form').find('.form-control'); 
	// let value = $submitValues.val();
	
	
	let addressname = $("#addaddressname").val()
	let houseNo = $("#addhouse").val()
	let street = $("#addstreet").val()
	let state = $("#addstate").val()
	let pincode = $("#addpincode").val()
	let phone = $("#addphone").val()
	let alternatePhone = $("#addalternatePhone").val()

	
	
	
	console.log(addressname)
	console.log(houseNo)
	console.log(street)
	console.log(state)
	console.log(pincode)
	console.log(alternatePhone)
    

	data={
		addressname:addressname,
		houseNo:houseNo,
		street:street,
		state:state,
		pincode:pincode,
		phone:phone,
		alternatePhone:alternatePhone
	}


	$.ajax({
		url:`/dashboard/addnewadress`,
		method:"post",
		data:data,
		success:function(response){
		if(response.messsage=="address added"){
			location.reload()
		}

		}

	})


})


$('.plus').on('click',function(){
		console.log('plus button clicked')

		let $quantityInput = $(this).siblings('.qty');
		
		let value = $quantityInput.val();
		let id = $quantityInput.attr('data-id');
		
		console.log("clicked button id is" +id)
		console.log("value is" +value)
		const incQuantity = 1

		if (value==0) {
			value =  parseInt(value) + 1;
			const incQuantity = 1
			console.log("value after increment: " + value)
		}

		console.log(value);
		
			const data={ 
				incQuantity:incQuantity,
				id:id  }

		$.ajax({
		url:`/cart`,
		method:"PUT",
		data:data,
		success:function(response){
		
		console.log(response)
		if (response.message=="incremented") {
			window.location.reload();
	}
	}
	
	})
	});




	$('.minus').on('click',function(){
		console.log('minus button clicked')
		let $quantityInput = $(this).siblings('.qty');
		let value = $quantityInput.val();
		let id = $quantityInput.attr('data-id');
		console.log(id)
		const decQuantity = 1
		console.log(value);

		const data={
		value:value,
		decQuantity:decQuantity,
		id:id
	}

		$.ajax({
		url:`/cartd`,
		method:"PUT",
		data:data,
		success:function(response){
		console.log(response)
		if (response.message=="decremented") {
			window.location.reload();
		}	
		}
	
		})
		});


		$(".removebtn").on("click",function(){
		console.log('delete button clicked')
		let cartid = $(this).attr('data-cartid');
		let id = $(this).attr('data-id');
		let $quantityInput = $(this).closest('tr').find('.qty'); // Select the specific quantity input field

		let value = $quantityInput.val();
		
		console.log("The product id is: "+id)
		console.log("the cart id is: "+cartid);
		
        data={
			id:id,
			purchased:value
		}


	$.ajax({
		url:`/cartdel`,
		method:"PUT",
		data:{
			id:id,
			cartid:cartid
		},
		success:function(response){
			
			toastr.options = {
	"closeButton": false,
	"debug": false,
	"newestOnTop": true,
	"progressBar": false,
	"positionClass": "toast-top-right",
	"preventDuplicates": false,
	"onclick": null,
	"showDuration": "200",
	"hideDuration": "500",
	"timeOut": "1000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
	}

			if(response.message=="deleted"){
				toastr["info"]("Product Removed Successfully", "Success")
					location.reload();

			}
		}

		})

		})




		//removing from the whishlist
		$(".wishlistRemoveBtn").on("click",function(){
			console.log('delete button clicked')
			let wishlisttid = $(this).attr('data-wishlistid');
			let id = $(this).attr('data-id');
			let $quantityInput = $(this).closest('tr').find('.qty'); // Select the specific quantity input field
	
			let value = $quantityInput.val();
			
			console.log("The product id is: "+id)
			console.log("the cart id is: "+wishlisttid);
			
			data={
				id:id,
				purchased:value
			}
	
			
	
		$.ajax({
			url:`/wishlistdel`,
			method:"PUT",
			data:{
				id:id,
				wishlisttid:wishlisttid
			},
			success:function(response){
				
				toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": true,
		"progressBar": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "200",
		"hideDuration": "500",
		"timeOut": "1000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
		}
	
				if(response.message=="deleted"){
					toastr["info"]("Product Removed Successfully", "Success")
						location.reload();
	
				}
			}
	
			})
	
			})


			

		
		
		$('.myTable').DataTable();




		$(".cancelbtn").on("click",function(){
			console.log('return button clicked')
			let cartid = $(this).attr('data-orderid');
			let id = $(this).attr('data-id');
			// let $quantityInput = $(this).closest('tr').find('.qty'); // Select the specific quantity input field
	
			// let value = $quantityInput.val();
			
			console.log("The order id is: "+cartid)
			console.log("The product id is: "+id)
			// console.log("the cart id is: "+cartid);
			
			Swal.fire({
				title: 'Are you Sure Want to Return The Product?',
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Return Product'
			  }).then((result) => {
				if (result.isConfirmed) {
					data={
						id:id,
						
					}
			
			
				$.ajax({
					url:`/returnorder`,
					method:"PUT",
					data:{
						id:id,
						 },
					success:function(response){
						
				toastr.options = {
				"closeButton": false,
				"debug": false,
				"newestOnTop": true,
				"progressBar": false,
				"positionClass": "toast-top-right",
				"preventDuplicates": false,
				"onclick": null,
				"showDuration": "1000",
				"hideDuration": "500",
				"timeOut": "1000",
				"extendedTimeOut": "1000",
				"showEasing": "swing",
				"hideEasing": "linear",
				"showMethod": "fadeIn",
				"hideMethod": "fadeOut"
				}


					
				
						if(response.message=="returned"){
							
							toastr["info"]("Returning Processing", "Success")
		
								location.reload();
			
						}
					}
			
					})
				}
			  })






		
	
			})
	
	



