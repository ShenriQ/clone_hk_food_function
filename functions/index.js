const functions = require('firebase-functions');
const admin = require('firebase-admin');
// admin.initializeApp();

var serviceAccount = {
    "type": "service_account",
    "project_id": "app-projects-5e4d7",
    "private_key_id": "799b0db5f3e16041b0154eb8ee0734597d38a8cc",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCX9+dOKfFlSZYU\nQQ/8F0dpf0BuQY6+PvEycih5Ke4cd8cSIfqdcrTupgtR3jF5WVxDGidb7Pn5UBS+\nt4UQWr4owsOKptbbwp9NZVwU9X1tbaMj1E5MSqSHy4gKYmLEHObn1T0N3AZ1OuA7\ndd/KgeOWkgkGTJldiziedLIacuPV7ARuYjfzzNSs9YJN1XOXC/xw4Hy2evOgIN1C\nLw2LIuIRYdVG2v9HZONAbW/yeyGavXGPsF2t5E7fvzStbFYBDk1n0DsoMVzSyfmO\nG+IU091u8rJ6sKTLJukNOQoticGnAKALg1X1cwkx0cFYJ62l9gRekoQui43wmblx\nxiDRAcPBAgMBAAECggEAEeE8QPVM3lCr3HqyNYQMpiQvcbl7YLVZngiR6/2LsyRB\nkwfV63fvQ0PcgZedpQwnP4rgdh+Z4qQyKKVBfeTbSkLuDE5oaadKpGnITXv7s6gK\nYYENbEr89DA1c5lTSwUmgsDTQ+HvDZRthPlvqO0i2JiagLf69GdYtEYBHX0Ggujp\nRG39hcvTt1tjfjog8dODlG81OKMlpIGHzJR/gHAbf+2Ev5gO8tkv8QEnWHGLDx5s\n9X7UvS1lCTSOjz9Pe2es0vRSMgxnFaA5dAggDPxau5lVsSBQdgibZAo5A1XX8/2G\nrDObDPdpsmvhEfrm1Ip1oi8BJozGkLfGXudkk9lvRQKBgQDMRtmTOXuswSAin9cJ\n+zYib4OdaP8F9eV6MUibGS3aGNZ9q9O74pwSjqwech5zw6wOE0dwA9FonKwQwOzn\nvBlVuXQZdSOf7MmENYOzU4PjNp7TOAvSn3GNWa5y/aUqhANyZkih+QzpyJXFgOM6\ntebbpi5xoy/7X/W5S5MSYolZhQKBgQC+cnEhgIMFxLyNmavN4jz5o4MlrRKKf6Nv\nabOOcYncwEb+SvJ2N+J6UTBJklO/gXHRDMfOrgdOMUr5gA2P9esKkVzhyOEx9C0o\n/CU0990jZfv24jrK56dVY2zO3LsOLqa8UyxvZDngs3WnM32gWXgbqNLZ4LXIUREx\nmoQ/ooDYDQKBgANpv6LlF/rn8yiA8S/agaoLoPBVW8V2uVHUVvk4b3qwZY0N/Oir\nvZ3VwmxzzaxzfYFyswPdHHeZ/on9Hzgz/VxgT99JBMJcS3WpCz1IzPBT7k1rJ09q\nmJQbBn4nXMYcFI6pxNbn+V5CmrYFFEbb2TKcUTRW3KtfjBR/fcKV4OOdAoGBAJj9\nSEJYgWiV5b5+r1RCJSeJoiYXBaj65ijvKc4JCW2rjJxlSqeLN0V5iSfhA6P48Zy0\n/qHajYXT9V2+76YxMHKZ2ZqLi9RcShb9j0ogv6XbHHD0xbQQKg1fRJ5dFWtMMKdi\nzXRieFg48g+yPn4cwW6+zTs31/Amp4BIl2qjOYvVAoGABwXlMm5xxf1fHraGUSnr\nxZ5OBAr3AwYUjZaCgdFMq6So6mC63p2GNRHzuH+rSAVvoQ0lC2fStFRjMpJ3gGKr\nAhfbweDDz31fqtq2t4PHrXj+1D63UlrsgpaCUlzZ9v3kZilpos5yMmsbfBe/NdZs\nTFatrLFXHyRwJ2praBvUJHg=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-gf7g7@app-projects-5e4d7.iam.gserviceaccount.com",
    "client_id": "118093032928028012841",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gf7g7%40app-projects-5e4d7.iam.gserviceaccount.com"
  }
  
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

//FILES
const listenOrders = require('./listenOrders.js');
const listenMsgs  = require('./listenMsgs.js');
const createOrder = require('./createOrder.js');
const assignAdmin = require('./adminAssign.js');
const deleteCat = require('./deleteCategory.js');
const sendPush = require('./sendPush.js');

//EXPORTS
exports.newOrderNotification = functions.firestore.document('Orders/{orderId}').onCreate(listenOrders.create);
exports.updOrderNotification = functions.firestore.document('Orders/{orderId}').onUpdate(listenOrders.update);
exports.msgCustomerNotification = functions.firestore.document('Messages/{msgId}').onCreate(listenMsgs.notify);
exports.createOrder = functions.https.onRequest(createOrder.createOrderHandler);
exports.assignAdmin = functions.firestore.document('Channels/{channelId}').onCreate(assignAdmin.assignAdminHandler);
exports.deleteCategory = functions.https.onRequest(deleteCat.deleteOrderHandler);
exports.sendPush = functions.https.onRequest(sendPush.sendPushHandler);
// "use strict";

Date.prototype.Format = function (fmt = "yyyy-MM-dd hh:mm:ss") {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
    return fmt;
};


const axios = require("axios");
const md5 = require("blueimp-md5");
const db = admin.firestore();
// const console = functions.console;

const POSPAL_PRODUCTS = "PosPalProducts";
const POSPAL_ORDERS = "PosPalOrders";
const POSPAL_CATEGORIES = "PosPalCategories";

const BASE_API = "https://area8-win.pospal.cn/pospal-api2/openapi/v1";
const APP_ID = "C1B2DACC9AE974003304FC83BBEF8781";
const APP_KEY = "990620133602136292";

const appId = APP_ID;

const http = axios.create({
    baseURL: BASE_API, // url = base url + request url
    timeout: 20000,
});

http.interceptors.request.use(
    (config) => {
        config.headers["time-stamp"] = new Date().getTime();
        config.headers["data-signature"] = signature(config.data);
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

// 银豹API的签名
function signature(data = {}) {
    try {
        const json = data;
        const string = JSON.stringify(json).trim();
        const sign = md5(`${APP_KEY}${string}`).toUpperCase();
        return sign;
    } catch (error) {
        console.log("signature error", error);
    }
}

// App创建订单推送到银豹系统
exports.createPosPalOrder = functions.firestore
    .document("/Orders/{orderId}")
    .onCreate(async (snap, context) => {
        try {
            const url = `/orderOpenApi/addOnLineOrder`;
            const snapData = snap.data();
            const customer = snapData.customer;
            const orderId = context.params.orderId;
            const coupon = snapData.coupon || {};
            const items = [];
            for (const item of snapData.products) {
                const result = await findFirstPosPalProduct(item.product.id);
                if (result) {
                    items.push({
                        productUid: result.data().uid,
                        comment: item.product.desc || "",
                        quantity: item.quantity,
                        manualSellPrice:
                            item.product.price *
                            calcDiscountOff(item.product.discount) *
                            calcDiscountOff(coupon.discount),
                    });
                } else {
                    console.error("addOnLineOrder findFirstPosPalProduct item error", item);
                }
            }
            const data = {
                appId,
                items,
                orderSource: "openApi",
                orderDateTime: getFormatDateWithTimeZone(snapData.createdAt["_seconds"]),
                payMethod: snapData.cod ? "Cash" : "Wxpay", // 支付方式 货到付款时当作现金，信用卡支付暂定为微信支付
                payOnLine: snapData.cod ? 0 : 1, // 是否已经完成线上付款。若线上已付款，则设置payOnLine=1。否则，该参数不传
                orderRemark: JSON.stringify(snapData), // 订单备注，暂显示原数据信息
                totalAmount: Number(snapData.subTotal).toFixed(2), // 订单总额
                contactAddress: `${customer.city},${customer.address}`,
                contactName: `${customer.name}`,
                contactTel: `${customer.phone}`,
            };
            console.log("addOnLineOrder ready", orderId, data);
            const res = await http.post(url, data);
            const respone = res.data;
            if (respone.status === "success") {
                const writeResult = await admin
                    .firestore()
                    .collection(POSPAL_ORDERS)
                    .add({ ...respone.data, orderId });
                console.log("createPosPalOrder", `PosPalOrders with ID: ${writeResult.id} added.`);
            } else {
                console.error("addOnLineOrder", `error: ${respone.errorCode}`, respone.messages);
            }
        } catch (error) {
            console.error("createPosPalOrder execption", error);
        }
        return null;
    });

// 商品修改后推送到银豹系统
exports.updatePosPalProducts = functions.firestore
    .document("/Products/{productId}")
    .onWrite(async (change, context) => {
        const newData = change.after.exists ? change.after.data() : null;
        const oldData = change.before.data();
        let item = newData || oldData;
        const productInfo = getProductInfoByProduct(item);
        if (!oldData) {
            await addProductToPosPal(productInfo);
        } else {
            const result = await findFirstPosPalProduct(item.id);
            if (result) {
                if (!newData) {
                    //delete set enable = -1
                    productInfo.enable = -1;
                }
                await updateProductToPosPal({ uid: result.data().uid, ...productInfo }, result.ref);
            } else {
                console.error("updatePosPalProducts", "findFirstPosPalProduct error", item.id);
            }
        }
    });

// 定时01:37分同步商品数据到银豹
exports.syncProductsToPosPal = functions.pubsub
    //.schedule("every 1 minutes")
    .schedule("37 1 * * *")
    .onRun(async (context) => {
        console.log("SyncProductsToPosPal begin");
        const products = await db.collection("Products").get();
        products.forEach(async (product) => {
            const item = product.data();
            const productInfo = getProductInfoByProduct(item);
            const result = await findFirstPosPalProduct(item.id);
            if (result) {
                console.log("updateProductToPosPal", result.data(), item);
                await updateProductToPosPal({ uid: result.data().uid, ...productInfo }, result.ref);
            } else {
                await addProductToPosPal(productInfo);
            }
        });
    });

// 定时01:07分获取银豹分类数据进行同名绑定
exports.syncCategoriesToPosPal = functions.pubsub
    // .schedule("every 1 minutes")
    .schedule("7 1 * * *")
    .onRun(async (context) => {
        console.log("syncCategoriesToPosPal begin");
        const url = "/productOpenApi/queryProductCategoryPages";
        const res = await http.post(url, { appId });
        const { status, data, errorCode, messages } = res.data;
        if (status === "success") {
            const { result } = data;
            const categories = await db.collection("Categories").get();
            categories.forEach(async (category) => {
                const item = category.data();
                // console.log("Matching category", item.title);
                for (let index = 0; index < result.length; index++) {
                    const element = result[index];
                    if (item.title === element.name) {
                        // console.log("Matched category", element);
                        const record = await findFirstPosPalCategories(item.id);
                        const now = new Date().getTime();
                        const doc = {
                            uid: element.uid + "",
                            id: item.id,
                            updatedAt: now,
                        };
                        if (record) {
                            await record.ref.update(doc);
                        } else {
                            await db.collection(POSPAL_CATEGORIES).add({ ...doc, createdAt: now });
                        }
                        break;
                    }
                }
                console.error("No Match", item.title);
            });
        } else {
        }
    });

// App创建商品后推送到银豹系统
async function addProductToPosPal(productInfo) {
    const url = "/productOpenApi/addProductInfo";
    // console.log("addProductInfo ready", productInfo);
    const res = await http.post(url, { productInfo, appId });
    const { status, data, errorCode, messages } = res.data;
    if (status === "success") {
        // console.log("addProductInfo", "success");
        const now = new Date().getTime();
        const doc = { uid: data.uid + "", id: productInfo.barcode, createdAt: now, updatedAt: now };
        await db.collection(POSPAL_PRODUCTS).add(doc);
    } else {
        console.error("addProductInfo", `error: ${errorCode}`, messages);
    }
}

// App修改商品信息后更新到银豹
async function updateProductToPosPal(productInfo, doc) {
    const url = "/productOpenApi/updateProductInfo";
    // console.log("updateProductInfo ready", productInfo);
    const res = await http.post(url, { productInfo, appId });
    const { status, data, errorCode, messages } = res.data;
    if (status === "success") {
        // console.log("updateProductInfo", "success", data);
        doc && (await doc.update({ updatedAt: new Date().getTime() }));
    } else {
        console.error("updateProductInfo", `error: ${errorCode}`, messages);
    }
}

// utils
// 转换为银豹的商品信息
async function getProductInfoByProduct(item) {
    const data = {
        name: item.title,
        barcode: item.id,
        enable: item.enable ? 1 : 0,
        buyPrice: 1,
        sellPrice: item.price,
        customerPrice: item.discounted ? item.price * calcDiscountOff(item.discount) : item.price,
        isCustomerDiscount: item.discounted ? 1 : 0,
        stock: item.stock,
        description: item.desc,
    };
    try {
        if (item.catId) {
            const category = await findFirstPosPalCategories(item.catId);
            if (category) {
                data["categoryUid"] = category.data().uid;
            }
        }
    } catch (error) {
        console.error("getProductInfoByProduct", error);
    }

    return data;
}

// 获取关联银豹商品的id
async function findFirstPosPalProduct(id) {
    const result = await db.collection(POSPAL_PRODUCTS).where("id", "==", id).limit(1).get();
    let record = result.empty ? null : result.docs[0];
    return record;
}

// 获取关联银豹分类的id
async function findFirstPosPalCategories(id) {
    const result = await db.collection(POSPAL_CATEGORIES).where("id", "==", id).limit(1).get();
    let record = result.empty ? null : result.docs[0];
    return record;
}

// 计算折扣
function calcDiscountOff(discount) {
    return (100 - (discount || 0)) / 100;
}

function getFormatDateWithTimeZone(timestamp, fmt = "yyyy-MM-dd hh:mm:ss", timeZone = 8) {
    const timeZoneOffset = new Date().getTimezoneOffset();
    const timeZoneStamp = (timeZone * 60 + timeZoneOffset) * 60;
    return new Date((timestamp + timeZoneStamp) * 1000).Format(fmt);
}
