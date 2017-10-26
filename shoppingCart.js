//Check for local storage support
if (typeof(Storage) == "undefined" ) {
  alert("Your browser does not support HTML5 localStorage. Try upgrading.");
} 
else {
  console.log("Both localStorage and sessionStorage support is there.");
}
$(document).ready(function() {
  //Set cart to the stored items or else to an empty cart
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  //Check how many flavors have been selected
  var flavorCount = $('input:checked').length;
  //Check which specific count the user selected
  var singleClicked=false;
  var sixClicked=false;
  var twelveClicked=false;
  //Set the total amount to 0 at the start
  var totalAmount=0;
  //Check if there are items in the cart
  if(cart.length>0){
    //Show the shopping cart count
    $('#cartCount').show();
    //Update the number to the amount of items in the cart
    $('#cartCount').html(cart.length).css('display', 'block'); 
    showCart(cart);
  }
  //Update the total cost of the cart items
  function getTotal(cart, totalAmount){
    for(var i=0; i<cart.length; i++){
      var totalAmount = parseInt(cart[i].subtotal) + totalAmount;
    }
    console.log("total is " + totalAmount);
    return totalAmount;
  }
  //Display the items in the cart
  function showCart(cart){
    for (item in cart) {
      //Store the product details
      var images=cart[item].rollImg;
      var names=cart[item].rollName; 
      var qtys=cart[item].numQty;
      var prices=cart[item].rollPrice;
      var subtotals=cart[item].subtotal;
      //Create a new row in the cart for the item
      var newRow = "<tr><td>" + "<img src='" + images + "'></img>" + "</td><td>" + names + "</td><td>" + "$" + prices + ".00" + "</td><td>" + qtys + "</td><td>" + "$" + subtotals + ".00" + "</td><td>" + "<button class='quantity-option remove-button' data-item='"+names+"'>" + 'Remove' + "</button></tr>";
      $('#cart-table').append(newRow);
      //Update the total cost of items
      var showTotal = parseInt(getTotal(cart,totalAmount));
      $('#view-total').text(showTotal);
    }
  }
  //Defining the Cart Object
  function newCartItem(rollImg, rollName, numQty, rollPrice, subtotal){
    this.rollImg=rollImg;
    this.rollName=rollName;
    this.numQty=numQty;
    this.rollPrice=rollPrice;
    this.subtotal=subtotal;
  }
  //Find out details about the local storage items
  function getCart(){
    return localStorage.getItem("cart");
  }
  function setCart(cart){
    localStorage.setItem("cart", cart);
  }
  //By default, hide the extra flavor options
  $('#extra-flavors').hide();
  $('#single, #six, #twelve').click(function () {
    //Display the details for the specified product count
    if (this.id == 'single') {
      singleClicked=true;
      $('#product-name').text('Pumpkin Spice Roll (1 Count)');
      $('#product-price').text('3');
      $('#roll-image').attr('src', 'img/pumpkinSpice.jpg');
      $('#extra-flavors').hide();
    }
    else if (this.id == 'six') {
      singleClicked=false;
      sixClicked=true;
      $('#roll-image').attr('src', 'img/pumpkinSix.jpg');
      $('#product-name').text('Pumpkin Spice Roll (6 Count)');
      $('#product-price').text('18');
      $('#extra-flavors').show();
    }
    else if (this.id == 'twelve') {
      singleClicked=false;
      twelveClicked=true;
      $('#roll-image').attr('src', 'img/pumpkinTwelve.jpg');
      $('#product-name').text('Pumpkin Spice Roll (12 Count)');
      $('#product-price').text('36');
      $('#extra-flavors').show();
    }
  });
  //Remove the desired item from the shopping cart and local storage
  $('.remove-button').click(function(e) {
    $(this).closest('tr').remove();
  });
  //Specify the desired extra flavors in the shopping cart
  function updateCart(flavors) {
      //Creating a variable to store the flavors selected.
      //If no flavors were selected (in the case of Single count), an empty array is created.
      var extraFlavors = flavors || [];
      var quantity=$('#product-qty').val(); 
      var itemName=$('#product-name').text();
      if(extraFlavors.length) {
        itemName = itemName+" - "+extraFlavors.join(", ");
      }
      var itemFound = false;
      //Iterate through the cart to see if the desired item exists already
      for(var i=0; i<cart.length; i++){
        //If the item already exists, update the quantity and subtotal
        if(cart[i].rollName === itemName){
          var existingQty = parseInt(cart[i].numQty);
          cart[i].numQty = parseInt(quantity) + existingQty;
          cart[i].subtotal = parseInt(cart[i].rollPrice) * parseInt(cart[i].numQty);
          //Update the changes in local storage
          localStorage.setItem("cart", JSON.stringify(cart));
          localStorage.setItem("cartCount", cart.length);
          itemFound = true;
          break;
        }
      }
      //If the item doesn't exist yet, add the item
      if(!itemFound) {
        var itemImage=$('#roll-image').attr('src');
        var price=$('#product-price').text();
        var subtotal=parseInt(price)*parseInt(quantity);
        var bakeryRoll = new newCartItem(itemImage, itemName, quantity, price, subtotal);
        cart.push(bakeryRoll);
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("cartCount", cart.length);
        $('#cartCount').show();
        $('#cartCount').html(cart.length).css('display', 'block');
      }
  }
  $('#addItem').click(function (){
    //Check how many extra flavors have been selected
    var flavorCount = $('input:checked').length;
    if(singleClicked){
      updateCart();  
    }
    else if(sixClicked || twelveClicked){
      if(flavorCount === 2) {
        var flavors = [];
        for(var i=0; i < flavorCount; i++) {
          flavors.push($('input:checked')[i].value);
        }
        updateCart(flavors);
      }
      //User must select two extra flavors with the 6 or 12 count item
      else{
        alert("Please select two extra flavors.")
      }
    }

  })
});
