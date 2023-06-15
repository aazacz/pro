

		$(document).ready(function () {
			$('#placeOrder').on('click', function () {
				// e.preventDefault();
				 
				// $(this).prop('disabled', true);

				let cartId = $('#placeOrder').val();
				let address = $('.form-check-input:checked').val();
				let grandPriceText = $('#grandPrice').text();
				let grandPrice = parseFloat(grandPriceText.replace(/[^\d.]/g, ''));
				let paymentmethod = $('.accordion-summary .card-header .card-title a[aria-expanded="true"]').text().trim();

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
                                        console.log(response);
                                            razorpay(response)
                                            
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
