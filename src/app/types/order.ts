// export default interface Order{
//     id:string,
//     orderNo:string,
//     productId:string,
//     quantity:number,
//     salePrice:number,
//     discount:number,
//     totalAmount:number
// }

export default interface Order{
    id?:string,
    orderNo:string,
    productId:string,
    quantity:number | null,
    salePrice:number | null,
    discount:number | null,
    totalAmount:number | null
}