

		$(document).ready(function () {
			grandprice()
			
					
			 		
			function grandprice(){
			
				const subTotalText= $('#grandPrice').text();
				const subTotal=parseFloat(subTotalText.replace(/[^\d.]/g, ''));
				console.log(subTotal);

				discount = parseInt($('#discountTab').text(), 10);
				console.log("discount is: ");
				console.log(discount);

				const GrandTotal=subTotal-discount
				console.log(GrandTotal);

				$('.grandTotal').text("₹"+GrandTotal+".00")


				const walletAmount = parseInt($('#pay-from-wallet').data('wallet-amount'), 10);
				console.log("walletAmount is : "+walletAmount);
			
				if (walletAmount > GrandTotal) {
					$('#pay-from-wallet').removeAttr('hidden');
				} else {
					$('#pay-from-wallet').attr('hidden', 'hidden');
				}
				

			}


// Removing the Coupon	
			$('.couponRemove').on('click',function(){
				const couponDiscount=$(this).attr('data-discount')
				console.log(couponDiscount);
				data={
					couponDiscount:couponDiscount
				}

				$.ajax({
					url:"/checkout/removeCoupon",
					type:"POST",
					data:data,
					success:function(response){

						if(response.message=="coupon Removed"){
							grandprice()
							location.reload()
							toastr["info"]("Coupon Removed", " ")
						}
						
					
					}

				})
			
			})



// Applying the Coupon		
			$(".couponApply").on("click",function(){
				const couponDiscount=$(this).attr('data-discount')
				const couponId=$(this).attr('data-value')
				debugger
				console.log(couponDiscount,couponId);
				debugger

				data={
					couponDiscount:couponDiscount,
					couponId:couponId
				}

				$.ajax({
					type:'POST',
					url:"/checkout/applyCoupon",
					data:data,
					success:function(response){

					toastr.options = {
					"closeButton": true,
					"debug": false,
					"newestOnTop": true,
					"progressBar": false,
					"positionClass": "toast-top-right",
					"preventDuplicates": false,
					"onclick": null,
					"showDuration": "500",
					"hideDuration": "800",
					"timeOut": "1000",
					"extendedTimeOut": "1000",
					"showEasing": "swing",
					"hideEasing": "linear",
					"showMethod": "fadeIn",
					"hideMethod": "fadeOut"
					}



						if(response.message=="coupon already applied"){
							grandprice()
							toastr["info"]("Coupon Already used", "Sorry! ")
						}
						else if(response.message=="Coupon Applied"){
							
							discount=response.couponDiscount
							$('#discountTab').text(discount)
							grandprice()
							toastr["success"]("You have saved some bucks", "Hurray! ")
							
						}else{
							grandprice()
							toastr["error"]("Can't Use two Coupons", "oops!!")
						}


					}
			
				})
			})
		
			



// Placing the Order

			$('#placeOrder').on('click', function () {
				// e.preventDefault();
				 
				let cartId = $('#placeOrder').val();
				let address = $('.form-check-input:checked').val();
				let grandPriceText = $('#grandPrice').text();
				let grandPrice = parseFloat(grandPriceText.replace(/[^\d.]/g, ''));
				let paymentmethod = $('.accordion-summary .card-header .card-title a[aria-expanded="true"]').text().trim();
				let walletAmount = parseInt($('#wallet-amount').text().trim());

				const data = {
					cartId: cartId,
					address: address,
					grandPrice: grandPrice,
					paymentmethod: paymentmethod
					
				};

				if (paymentmethod === "Razor Payment") {
							
                            const data = {
                                cartId: cartId,
                                address: address,
                                grandPrice: grandPrice,
                                paymentmethod: paymentmethod };

							   $.ajax({
                                    url: `/order`,
                                    method: 'POST',
                                    data: data,
                                    success:  function (response) {	
                                       
                                            razorpay(response)
                                            
                                    }
                                })
				}

				else if(paymentmethod === "Pay From Wallet"){
					
					const data = {
						cartId: cartId,
						address: address,
						grandPrice: grandPrice,
						paymentmethod: paymentmethod }

					$.ajax({
						url: `/walletCheckout`,
						method: 'POST',
						data: data,
						success: function (response) {
							if (response.message == "ordered successfully") {
								const orderid = response.orderdb_Id
								console.log(orderid)
								const cartid=response.cartid
								console.log(cartid)
								const productIds=response.productIds
								window.location.href = '/success?orderid=' + orderid + '&cartid=' + cartid + '&productIds' + productIds
							} 
						}
					})





				}

				else {
                                const data = {
                                    cartId: cartId,
                                    address: address,
                                    grandPrice: grandPrice,
                                    paymentmethod: paymentmethod }

                                $.ajax({
                                    url: `/checkout`,
                                    method: 'POST',
                                    data: data,
                                    success: function (response) {
                                        if (response.message == "ordered successfully") {
                                            const orderid = response.orderdb_Id
                                            console.log(orderid)
											const cartid=response.cartid
											console.log(cartid)
											const productIds=response.productIds
											window.location.href = '/success?orderid=' + orderid + '&cartid=' + cartid + '&productIds' + productIds
                                        } 
                                    }
                                })
				}


				  //function for Razor pay
				 function razorpay(Response) {

					console.log(Response);
					console.log("Razor function started");
					console.log(Response.order);
					console.log(Response.amount);
					console.log(Response.order.id);
					console.log(Response.order.amount);

					const orderid= Response.orderdb_Id
					console.log(orderid)
					const cartid=Response.cartid
					console.log(cartid)
					const productIds=Response.productIds
					
					var options = {
						"key": "rzp_test_c9kyL8vciS4dlx",
						"amount": "<%=Response.amount%>",
						"currency": "INR",
						"name": "Kenvill",
						"order_id": Response.order.id,
						"handler":function(response){
							
							window.location.href = '/success?orderid=' + orderid + '&cartid=' + cartid + '&productIds' + productIds },
						"theme": { "color": "#3399cc" }
					              };

					 var rzp1 = new Razorpay(options);
					 rzp1.open();

				}

			})
		});
