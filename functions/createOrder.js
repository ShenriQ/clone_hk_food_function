const admin = require('firebase-admin');
const db = admin.firestore();
const stripeHelper = require('./stripeHelper.js');
const cors = require('cors')({origin: true});

exports.createOrderHandler = ((req, res) => {
    cors(req, res, () => {
        var body = req.body;
        let orderRef = db.collection('Orders').doc();
        let amount = body.amount;
        let token  = body.token;
        let cod = body.cod;
    
        body = replaceDates(body);
        body.id = orderRef.id;
        body.createdAt = admin.firestore.FieldValue.serverTimestamp()
    
        const cartItems = body.products == null ? [] : body.products;
        var getProducts = [];
        cartItems.forEach(item => {
            const req = db.collection('Products').doc(item.product.id).get();
            getProducts.push(req);
        });
    
        let batch = db.batch();
        Promise.all(getProducts)
            .then(snaps => {
                var outOfStock;
                for (let index = 0; index < snaps.length; index++) {
                    const snap = snaps[index];
                    const product = snap.data();
                    
                    if (!product){
                        res.status(404).send({
                            success: false,
                            message: "您购物车中的某些产品不可用。您的购物车现在将刷新",
                            messageEng: "Some of the products from your cart are not available. Your cart will be refreshed now"
                        }); 
                        return;
                    }
    
                    if (isOutOfStock(cartItems, product)) {
                        outOfStock = product
                        break;
                    } else {
                        const cartItem = cartItems.filter(item => {
                            return product.id === item.product.id
                        })[0];
                        let productRef = db.collection('Products').doc(product.id);
                        let pStock = parseInt(product["stock"]);
                        let cartItemQty = parseInt(cartItem["quantity"]);
                        let stockUpdate = { stock: (pStock - cartItemQty).toString() };
                        batch.update(productRef, stockUpdate);
                    }
                }
                
                if (outOfStock) {
                    res.status(500).send({
                        success: false,
                        message:    "訂單失敗," + outOfStock.title + "暫時售罄",
                        messageEng: "Order Failed, " + outOfStock.title + " is out of stock"
                    }); 
                } else {
                    if (cod == true) {
                        batch.set(orderRef, body);
                        return batch.commit();
                    }else{
                        return stripeHelper.createChargeWith(token,amount,body.id);
                    }
                }
            }).then( chargeObj => {
                if (cod == true){
                    console.log('Order created');
                    res.status(200).send({ success: true, orderId: body.id, message: '訂單已確認', messageEng: 'Order created' });
                }else{
                    body.chargeId = chargeObj.id;
                    batch.set(orderRef, body);
                    return batch.commit();        
                }
            }).then(ref => {
                console.log('Order created');
                res.status(200).send({ success: true, orderId: body.id,  message: '訂單已確認', messageEng: 'Order created' });
            })
            .catch(err => {
                console.log('Error', err);
                res.status(404).send({ success: false, message: "Order creating failed",  error : err });
            });
    })
});


function isOutOfStock(cartItems, product) {
    
    const cartItem = cartItems.filter(item => {
        return product.id === item.product.id
    });
    if(cartItem.length < 1) 
    {
        return false
    }
    let pStock = parseInt(product.stock);
    let cartItemQty = parseInt(cartItem[0].quantity);

    if (pStock - cartItemQty < 0) {
        return true
    } else {
        return false
    }
}

function replaceDates(obj) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (property == "createdAt" || property == "updatedAt" || property == "date" || property == "lastSeen") {
                var miliseconds = new Date(obj[property]);
                try {
                    let timeStamp = admin.firestore.Timestamp.fromMillis(miliseconds);
                    obj[property] = timeStamp;
                }
                catch(e) {
                    obj[property] = admin.firestore.Timestamp.fromDate(new Date());
                }
            }
            if (property == "from" || property == "to") {
                var miliseconds = new Date(obj[property]);
                try {
                    let timeStamp = admin.firestore.Timestamp.fromMillis(miliseconds);
                    obj[property] = timeStamp;
                }
                catch(e) {
                    obj[property] = admin.firestore.Timestamp.fromDate(new Date());
                }
            }
            if (property == "customer"){
                obj[property] = replaceDates(obj[property]);
            }
            if (property == "coupon"){
                obj[property] = replaceDates(obj[property]);
            }
            if (property == "products"){
                var cartItems = obj[property];
                for (var i = 0; i < cartItems.length;i++){
                    var p = cartItems[i].product;
                    p = replaceDates(p);
                    cartItems[i].product = p;    

                    var subProducts = cartItems[i].subProducts
                    for (var j = 0; j < subProducts.length; j++){
                        var p1 = subProducts[j];
                        p1 = replaceDates(p1);
                        subProducts[j] = p1;    
                    }
                    cartItems[i].subProducts = subProducts
                }
                obj[property] = cartItems;
            }
        }
    }
    return obj;
}