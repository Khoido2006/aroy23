const btn = document.querySelectorAll(".product-items button")
//console.log(btn)
btn.forEach(function(button,index){
button.addEventListener("click",function(event){{
    var btnItem = event.target
    var product = btnItem.parentElement
    var productImg = product.querySelector("img").src 
    var productName = product.querySelector("H1").innerText
    var productPrice = product.querySelector("span").innerText
    addcart(productPrice,productImg,productName)




}})
})
function addcart(productPrice,productImg,productName) {
    var addtr = document.createElement("tr")
    var trcontent = '<tr><td><img style="width:70px" src="'+productImg+'" alt=""></td><td><p><span>'+productPrice+'</span><sup>đ</sup></p></td><td><input style ="width: 30px;outline: none;"type="number" value="1" min="0"></td><td style="cursor : pointer;" ><span class="cart-delete">Delete</span></td></tr>'
    addtr.innerHTML = trcontent
    var cartTable = document.querySelector("tbody")
    cartTable.append(addtr)
    cartotal()
}
//-----------total-price--------/
function cartotal() {
    var cartItem = document.querySelectorAll("tbody tr")
    var totalC = 0
    for(var i = 0; i < cartItem.length;i++) {
        var inputValue = cartItem[i].querySelector("input").value
        var productPrice = cartItem[i].querySelector("span").innerText
        totalA = inputValue*productPrice*1000
        // totalB = totalA.toLocaleString("de-DE")
        // console.log(totalB)
        totalC = totalC + totalA
        totalFinal = totalC.toLocaleString("de-DE")
    }
    var cartTotalFinal = document.querySelector(".price-total span")
    cartTotalFinal.innerHTML = totalFinal
    inputchange()
    
}
//----delete-function-----/
function deleteCart() {
    var cartItem = document.querySelectorAll("tbody tr")
    for(var i = 0; i < cartItem.length;i++) {
        var productT = document.querySelector(".cart-delete") 
        productT[i].addEventListener("click",function(event){
            var cartDelete = event.target
            var cartItemR = cartDelete.parentElement.parentElement
            cartItemR.remove()
        })
    }
}
function inputchange() {
    var cartItem = document.querySelectorAll("tbody tr")
    for(var i = 0; i < cartItem.length;i++) {
        var inputValue = document.querySelector("input") 
        inputValue.addEventListener("change",function(){
            cartotal ()
        })
        
    }
}